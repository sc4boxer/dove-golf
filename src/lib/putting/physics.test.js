import test from "node:test";
import assert from "node:assert/strict";
import { COURSE, HOLES, MAX_STROKES, createBall, strike, step, isMoving, replayRound } from "./physics.ts";
const settle = (initial, course = COURSE) => {
  let ball = initial;
  for (let tick = 0; tick < 1200 && isMoving(ball); tick++) ball = step(ball, 1 / 120, course);
  assert.equal(isMoving(ball), false);
  return ball;
};
const solutions = [
  [{ angle: 27, power: 81 }],
  [{ angle: 63, power: 95 }, { angle: -117, power: 95 }],
  [{ angle: 66, power: 95 }, { angle: -24, power: 70 }],
  [{ angle: 51, power: 65 }, { angle: 48, power: 85 }, { angle: -132, power: 65 }, { angle: 30, power: 85 }],
  [{ angle: -117, power: 95 }, { angle: -36, power: 80 }, { angle: 87, power: 55 }, { angle: -21, power: 60 }, { angle: 15, power: 100 }],
];
test("strikes use clockwise aim, clamp power, and leave input unchanged", () => {
  const ball = createBall();
  const up = strike(ball, 0, 50);
  assert.equal(up.vx, 0);
  assert.equal(up.vy, -150);
  assert.equal(strike(ball, 90, 150).vx, 300);
  assert.equal(isMoving(strike(ball, 10, -1)), false);
  assert.deepEqual(ball, createBall());
  assert.deepEqual(strike(up, 180, 100), up);
  for (const invalid of [NaN, Infinity, -Infinity]) {
    assert.deepEqual(strike(ball, invalid, 50), ball);
    assert.deepEqual(strike(ball, 0, invalid), ball);
    assert.deepEqual(step(up, invalid), up);
  }
  assert.deepEqual(step(up, -1), up);
});
test("friction settles a ball at the analytical stopping distance", () => {
  const ball = { ...createBall(), x: 100, y: 350, vx: 90 };
  const stopped = step(ball, 5);
  assert.ok(Math.abs(stopped.x - 145) < 1e-8);
  assert.equal(stopped.y, 350);
  assert.equal(isMoving(stopped), false);
  assert.equal(ball.x, 100);
});
test("each wall reflects, records a bank, and loses energy", () => {
  for (const initial of [
    { x: 28, y: 300, vx: -200, vy: 0 }, { x: 332, y: 300, vx: 200, vy: 0 },
    { x: 100, y: 28, vx: 0, vy: -200 }, { x: 100, y: 452, vx: 0, vy: 200 },
  ]) {
    const ball = step({ ...createBall(), ...initial }, 0.05);
    assert.ok(ball.x >= 27 && ball.x <= 333 && ball.y >= 27 && ball.y <= 453);
    assert.ok(ball.vx * initial.vx + ball.vy * initial.vy < 0);
    assert.ok(Math.hypot(ball.vx, ball.vy) < 130);
    assert.equal(ball.banked, true);
  }
});
test("slow cup approaches sink while fast crossings and near misses stay out", () => {
  const approach = { ...createBall(), x: 220, y: 105, vx: 80 };
  const sunk = step(approach, 1);
  assert.equal(sunk.sunk, true);
  assert.equal(sunk.x, COURSE.cup.x);
  assert.equal(sunk.y, COURSE.cup.y);
  assert.deepEqual(strike(sunk, 0, 100), sunk);
  assert.deepEqual(step(sunk, 1), sunk);
  assert.equal(step({ ...approach, vx: 300 }, 0.2).sunk, false);
  assert.equal(step({ ...approach, y: 116 }, 1).sunk, false);
});
test("integration agrees across frame rates and large frame gaps", () => {
  const initial = strike(createBall(), -40, 80);
  const reference = step(initial, 4);
  for (const fps of [30, 60, 120]) {
    let ball = initial;
    for (let index = 0; index < fps * 4; index++) ball = step(ball, 1 / fps);
    assert.ok(Math.hypot(ball.x - reference.x, ball.y - reference.y) < 0.1);
    assert.equal(isMoving(ball), false);
  }
});
test("the opening hole has a forgiving useful power range", () => {
  const aim = Math.atan2(COURSE.cup.x - COURSE.start.x, COURSE.start.y - COURSE.cup.y) * 180 / Math.PI;
  for (const power of [79, 80, 81, 82, 83, 84]) assert.equal(settle(strike(createBall(), aim, power)).sunk, true);
});
test("all five holes have reproducible complete routes within the shot allowance", () => {
  assert.equal(HOLES.length, 5);
  for (const [index, course] of HOLES.entries()) {
    let ball = createBall(course);
    assert.equal(ball.banked, false);
    for (const shot of solutions[index]) ball = settle(strike(ball, shot.angle, shot.power), course);
    assert.equal(ball.sunk, true, course.name);
    assert.equal(ball.banked, course.bankRequired);
    assert.equal(ball.x, course.cup.x);
    assert.equal(ball.y, course.cup.y);
  }
  assert.deepEqual(replayRound(solutions), { score: 1600, holes: [
    { strokes: 1, sunk: true, points: 500 }, { strokes: 2, sunk: true, points: 400 },
    { strokes: 2, sunk: true, points: 400 }, { strokes: 4, sunk: true, points: 200 },
    { strokes: 5, sunk: true, points: 100 },
  ] });
});
test("every challenge blocks the straight start-to-cup putt", () => {
  for (const course of HOLES.slice(1)) {
    const ball = createBall(course);
    const angle = Math.atan2(course.cup.x - ball.x, ball.y - course.cup.y) * 180 / Math.PI;
    for (let power = 1; power <= 100; power++) assert.equal(settle(strike(ball, angle, power), course).sunk, false, `${course.name} ${power}`);
  }
});
test("later cups require a bank, preserve it between shots, and reset next hole", () => {
  const course = HOLES[1];
  const approach = { ...createBall(course), x: course.cup.x - 20, y: course.cup.y, vx: 60 };
  assert.equal(step(approach, 1, course).sunk, false);
  assert.equal(step({ ...approach, banked: true }, 1, course).sunk, true);
  assert.equal(strike({ ...createBall(course), banked: true }, 0, 20).banked, true);
  assert.equal(createBall(HOLES[2]).banked, false);
});
test("obstacle faces and square corners reflect without tunneling", () => {
  const course = { ...COURSE, obstacles: [{ x: 150, y: 200, width: 50, height: 20 }] };
  const cases = [
    { x: 140, y: 210, vx: 300, vy: 0 }, { x: 210, y: 210, vx: -300, vy: 0 },
    { x: 175, y: 190, vx: 0, vy: 300 }, { x: 175, y: 230, vx: 0, vy: -300 },
    { x: 140, y: 190, vx: 200, vy: 200 },
  ];
  for (const initial of cases) {
    const ball = step({ ...createBall(), ...initial }, 0.04, course);
    assert.equal(ball.banked, true);
    assert.ok(ball.vx * initial.vx + ball.vy * initial.vy < 0);
    assert.ok(!(ball.x > 143 && ball.x < 207 && ball.y > 193 && ball.y < 227));
  }
  const gap = step({ ...createBall(), x: 100, y: 240, vx: 0, vy: -300 }, 0.3, course);
  assert.equal(gap.banked, false);
  assert.ok(gap.y < 193);
});
test("a barrier prevents capture of a cup on its far side", () => {
  const course = { ...COURSE, cup: { x: 175, y: 211, radius: 12 }, obstacles: [{ x: 150, y: 200, width: 50, height: 20 }] };
  const ball = step({ ...createBall(), x: 175, y: 190, vx: 0, vy: 80 }, 2, course);
  assert.equal(ball.sunk, false);
  assert.equal(ball.banked, true);
});
test("failed holes advance at five shots and score zero", () => {
  const misses = HOLES.map(() => Array.from({ length: MAX_STROKES }, () => ({ angle: 180, power: 1 })));
  assert.deepEqual(replayRound(misses), { score: 0, holes: HOLES.map(() => ({ strokes: 5, sunk: false, points: 0 })) });
});
test("replay rejects incomplete, oversized, malformed, and post-sink logs", () => {
  for (const invalid of [null, {}, [], solutions.slice(0, 4), [...solutions, []]]) assert.throws(() => replayRound(invalid));
  for (const invalid of [null, {}, [], Array(6).fill({ angle: 0, power: 1 }), [{ angle: 0, power: 1 }], [...solutions[0], { angle: 0, power: 1 }]]) {
    assert.throws(() => replayRound([invalid, ...solutions.slice(1)]));
  }
  for (const shot of [null, {}, { angle: NaN, power: 80 }, { angle: Infinity, power: 80 }, { angle: 100000, power: 80 }, { angle: 27, power: "81" }, { angle: 27, power: 101 }, { angle: 27, power: 0 }, { angle: 27, power: -1 }]) {
    assert.throws(() => replayRound([[shot], ...solutions.slice(1)]));
  }
});
test("maximum-power trajectories remain inside all course boundaries and barriers", () => {
  for (const course of HOLES) {
    for (let angle = -180; angle < 180; angle += 6) {
      let ball = strike(createBall(course), angle, 100);
      for (let tick = 0; tick < 600 && isMoving(ball); tick++) {
        ball = step(ball, 1 / 120, course);
        assert.ok(ball.x >= 27 - 1e-6 && ball.x <= 333 + 1e-6 && ball.y >= 27 - 1e-6 && ball.y <= 453 + 1e-6);
        for (const obstacle of course.obstacles) {
          const inside = ball.x > obstacle.x - 7 + 1e-6 && ball.x < obstacle.x + obstacle.width + 7 - 1e-6 && ball.y > obstacle.y - 7 + 1e-6 && ball.y < obstacle.y + obstacle.height + 7 - 1e-6;
          assert.equal(inside, false, `${course.name}, angle ${angle}`);
        }
      }
      assert.equal(isMoving(ball), false);
    }
  }
});
