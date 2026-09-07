import test from "node:test";
import assert from "node:assert/strict";
import { COURSE, HOLES, createBall, strike, step, isMoving } from "./physics.ts";

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
  const ball = { x: 100, y: 350, vx: 90, vy: 0, sunk: false };
  const stopped = step(ball, 5);
  assert.ok(Math.abs(stopped.x - 145) < 1e-8);
  assert.equal(stopped.y, 350);
  assert.equal(isMoving(stopped), false);
  assert.equal(ball.x, 100);
});

test("each wall reflects and loses energy without allowing an escaped ball", () => {
  const cases = [
    { x: 28, y: 300, vx: -200, vy: 0 },
    { x: 332, y: 300, vx: 200, vy: 0 },
    { x: 100, y: 28, vx: 0, vy: -200 },
    { x: 100, y: 452, vx: 0, vy: 200 },
  ];
  for (const initial of cases) {
    const ball = step({ ...initial, sunk: false }, 0.05);
    assert.ok(ball.x >= 27 && ball.x <= 333 && ball.y >= 27 && ball.y <= 453);
    assert.ok(ball.vx * initial.vx + ball.vy * initial.vy < 0);
    assert.ok(Math.hypot(ball.vx, ball.vy) < 130);
  }
});

test("a slow approach sinks, a fast crossing skips, and a near miss stays out", () => {
  const approach = { x: 220, y: 105, vx: 80, vy: 0, sunk: false };
  const sunk = step(approach, 1);
  assert.equal(sunk.sunk, true);
  assert.equal(sunk.x, COURSE.cup.x);
  assert.equal(sunk.y, COURSE.cup.y);
  assert.equal(isMoving(sunk), false);
  assert.deepEqual(strike(sunk, 0, 100), sunk);
  assert.deepEqual(step(sunk, 1), sunk);
  assert.equal(step({ ...approach, vx: 300 }, 0.2).sunk, false);
  assert.equal(step({ ...approach, y: 116 }, 1).sunk, false);
});

test("integration agrees across common frame rates and large frame gaps", () => {
  const initial = strike(createBall(), -40, 80);
  const results = [30, 60, 120].map((fps) => {
    let ball = initial;
    for (let index = 0; index < fps * 4; index++) ball = step(ball, 1 / fps);
    return ball;
  });
  const reference = step(initial, 4);
  for (const ball of results) {
    assert.ok(Math.hypot(ball.x - reference.x, ball.y - reference.y) < 0.1);
    assert.equal(isMoving(ball), false);
  }
});

test("the opening hole is achievable with a forgiving useful power range", () => {
  const aim = Math.atan2(COURSE.cup.x - COURSE.start.x, COURSE.start.y - COURSE.cup.y) * 180 / Math.PI;
  for (const power of [79, 80, 81, 82, 83, 84]) {
    assert.equal(step(strike(createBall(), aim, power), 5).sunk, true, `power ${power}`);
  }
});

test("every hole starts fresh and can be completed with a direct putt", () => {
  for (const course of HOLES) {
    const ball = createBall(course);
    assert.deepEqual(ball, { ...course.start, vx: 0, vy: 0, sunk: false });
    const dx = course.cup.x - ball.x;
    const dy = course.cup.y - ball.y;
    const angle = Math.atan2(dx, -dy) * 180 / Math.PI;
    const power = Math.sqrt(2 * 90 * Math.hypot(dx, dy)) / 3;
    const result = step(strike(ball, angle, power), 10, course);
    assert.equal(result.sunk, true);
    assert.equal(result.x, course.cup.x);
    assert.equal(result.y, course.cup.y);
  }
});

test("later holes capture at their own cup, not the first hole's cup", () => {
  const course = HOLES[1];
  const approach = { x: course.cup.x - 20, y: course.cup.y, vx: 60, vy: 0, sunk: false };
  assert.equal(step(approach, 1, course).sunk, true);
  const oldCup = { x: COURSE.cup.x - 20, y: COURSE.cup.y, vx: 60, vy: 0, sunk: false };
  assert.equal(step(oldCup, 1, course).sunk, false);
  assert.notDeepEqual(HOLES[1].cup, HOLES[0].cup);
  assert.notDeepEqual(HOLES[2].cup, HOLES[1].cup);
});
