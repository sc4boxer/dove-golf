export type Obstacle = { x: number; y: number; width: number; height: number };
export type Course = { width: number; height: number; ballRadius: number; cup: { x: number; y: number; radius: number }; start: { x: number; y: number }; name: string; bankRequired: boolean; obstacles: readonly Obstacle[] };
/** Course coordinates are independent of the canvas's displayed size. */
export const COURSE: Course = {
  width: 360, height: 480, ballRadius: 7,
  cup: { x: 250, y: 105, radius: 12 }, start: { x: 110, y: 385 },
  name: "Warm-up", bankRequired: false, obstacles: [],
};
export const COURSE_VERSION = "five-hole-v1";
export const MAX_STROKES = 5;
export const HOLES: readonly Course[] = [
  COURSE,
  { ...COURSE, name: "Around the corner", bankRequired: true, start: { x: 100, y: 375 }, cup: { x: 100, y: 145, radius: 12 }, obstacles: [{ x: 20, y: 235, width: 165, height: 22 }] },
  { ...COURSE, name: "The gate", bankRequired: true, start: { x: 260, y: 390 }, cup: { x: 95, y: 100, radius: 12 }, obstacles: [{ x: 20, y: 255, width: 120, height: 22 }, { x: 218, y: 255, width: 122, height: 22 }] },
  { ...COURSE, name: "Zigzag", bankRequired: true, start: { x: 85, y: 400 }, cup: { x: 275, y: 90, radius: 12 }, obstacles: [{ x: 20, y: 290, width: 175, height: 20 }, { x: 165, y: 175, width: 175, height: 20 }] },
  { ...COURSE, name: "The finale", bankRequired: true, start: { x: 270, y: 405 }, cup: { x: 260, y: 85, radius: 12 }, obstacles: [{ x: 145, y: 305, width: 195, height: 20 }, { x: 20, y: 195, width: 175, height: 20 }, { x: 215, y: 135, width: 125, height: 20 }] },
];
export type Ball = { x: number; y: number; vx: number; vy: number; sunk: boolean; banked: boolean };
export type Shot = { angle: number; power: number };
const FRICTION = 90;
const MAX_SPEED = 300;
const RESTITUTION = 0.65;
const CAPTURE_SPEED = 90;
const CAPTURE_RADIUS = 10;
const MAX_STEP = 1 / 240;
export function createBall(course: Course = COURSE): Ball {
  return { ...course.start, vx: 0, vy: 0, sunk: false, banked: false };
}
export function isMoving(ball: Ball): boolean {
  return !ball.sunk && Math.hypot(ball.vx, ball.vy) > 0;
}
/** Zero degrees points up the course; positive angles turn clockwise. */
export function strike(ball: Ball, angleDegrees: number, power: number): Ball {
  if (ball.sunk || isMoving(ball) || !Number.isFinite(angleDegrees) || !Number.isFinite(power)) return { ...ball };
  const speed = MAX_SPEED * Math.max(0, Math.min(100, power)) / 100;
  const angle = (angleDegrees % 360) * Math.PI / 180;
  return { ...ball, vx: Math.sin(angle) * speed, vy: -Math.cos(angle) * speed };
}
type Hit = { t: number; nx: number; ny: number };
/** Swept point versus a rectangle expanded by the ball radius; corners are square. */
function obstacleHit(ball: Ball, dx: number, dy: number, obstacle: Obstacle, radius: number): Hit | null {
  const nearX = dx === 0 ? -Infinity : ((dx > 0 ? obstacle.x - radius : obstacle.x + obstacle.width + radius) - ball.x) / dx;
  const farX = dx === 0 ? Infinity : ((dx > 0 ? obstacle.x + obstacle.width + radius : obstacle.x - radius) - ball.x) / dx;
  const nearY = dy === 0 ? -Infinity : ((dy > 0 ? obstacle.y - radius : obstacle.y + obstacle.height + radius) - ball.y) / dy;
  const farY = dy === 0 ? Infinity : ((dy > 0 ? obstacle.y + obstacle.height + radius : obstacle.y - radius) - ball.y) / dy;
  if (dx === 0 && (ball.x < obstacle.x - radius || ball.x > obstacle.x + obstacle.width + radius)) return null;
  if (dy === 0 && (ball.y < obstacle.y - radius || ball.y > obstacle.y + obstacle.height + radius)) return null;
  const enter = Math.max(nearX, nearY);
  if (enter < -1e-9 || enter > 1 || enter > Math.min(farX, farY)) return null;
  return { t: Math.max(0, enter), nx: nearX >= nearY ? -Math.sign(dx) : 0, ny: nearY >= nearX ? -Math.sign(dy) : 0 };
}
/** Fixed small swept segments prevent jumping through barriers or the cup. */
export function step(ball: Ball, dt: number, course: Course = COURSE): Ball {
  let next = { ...ball };
  if (!Number.isFinite(dt) || dt <= 0 || next.sunk) return next;
  let remaining = Math.min(dt, 10);
  while (remaining > 1e-10) {
    const speed = Math.hypot(next.vx, next.vy);
    if (speed === 0) break;
    const elapsed = Math.min(remaining, MAX_STEP, speed / FRICTION);
    const newSpeed = Math.max(0, speed - FRICTION * elapsed);
    const distance = (speed + newSpeed) * elapsed / 2;
    const dx = next.vx / speed * distance;
    const dy = next.vy / speed * distance;
    const min = 20 + course.ballRadius;
    const maxX = course.width - min;
    const maxY = course.height - min;
    let hit: Hit | null = null;
    const consider = (candidate: Hit | null) => { if (candidate && candidate.t >= 0 && candidate.t <= 1 && (!hit || candidate.t < hit.t)) hit = candidate; };
    if (next.x + dx < min) consider({ t: (min - next.x) / dx, nx: 1, ny: 0 });
    if (next.x + dx > maxX) consider({ t: (maxX - next.x) / dx, nx: -1, ny: 0 });
    if (next.y + dy < min) consider({ t: (min - next.y) / dy, nx: 0, ny: 1 });
    if (next.y + dy > maxY) consider({ t: (maxY - next.y) / dy, nx: 0, ny: -1 });
    for (const obstacle of course.obstacles) consider(obstacleHit(next, dx, dy, obstacle, course.ballRadius));
    const collision = hit as Hit | null;
    const travel = collision?.t ?? 1;
    const fraction = distance > 0 ? Math.max(0, Math.min(travel, ((course.cup.x - next.x) * dx + (course.cup.y - next.y) * dy) / (distance * distance))) : 0;
    const cupDistance = Math.hypot(next.x + dx * fraction - course.cup.x, next.y + dy * fraction - course.cup.y);
    const speedAtCup = Math.sqrt(Math.max(0, speed * speed - 2 * FRICTION * distance * fraction));
    if ((!course.bankRequired || next.banked) && cupDistance < CAPTURE_RADIUS && speedAtCup < CAPTURE_SPEED) return { ...next, x: course.cup.x, y: course.cup.y, vx: 0, vy: 0, sunk: true };
    next = { ...next, x: next.x + dx * travel, y: next.y + dy * travel, vx: next.vx / speed * newSpeed, vy: next.vy / speed * newSpeed };
    if (collision) {
      next.banked = true;
      if (collision.nx) next.vx = -next.vx * RESTITUTION;
      if (collision.ny) next.vy = -next.vy * RESTITUTION;
      next.x += collision.nx * 1e-7;
      next.y += collision.ny * 1e-7;
    }
    remaining -= elapsed;
  }
  return next;
}
export type HoleResult = { strokes: number; sunk: boolean; points: number };
export type RoundResult = { score: number; holes: HoleResult[] };
/** Same fixed clock as the client. Scores and completion are derived, never trusted. */
export function replayRound(shots: Shot[][]): RoundResult {
  if (!Array.isArray(shots) || shots.length !== HOLES.length) throw new Error("Complete all five holes first.");
  const holes = HOLES.map((course, index) => {
    const attempts = shots[index];
    if (!Array.isArray(attempts) || attempts.length < 1 || attempts.length > MAX_STROKES) throw new Error("Invalid shot count.");
    let ball = createBall(course);
    for (const shot of attempts) {
      if (!shot || typeof shot !== "object" || !Number.isFinite(shot.angle) || Math.abs(shot.angle) > 360 || !Number.isFinite(shot.power) || shot.power <= 0 || shot.power > 100 || ball.sunk) throw new Error("Invalid shot.");
      ball = strike(ball, shot.angle, shot.power);
      for (let tick = 0; tick < 1200 && isMoving(ball); tick++) ball = step(ball, 1 / 120, course);
      if (isMoving(ball)) throw new Error("Shot did not settle.");
    }
    if (!ball.sunk && attempts.length !== MAX_STROKES) throw new Error("Finish each hole before submitting.");
    return { strokes: attempts.length, sunk: ball.sunk, points: ball.sunk ? (MAX_STROKES + 1 - attempts.length) * 100 : 0 };
  });
  return { score: holes.reduce((total, hole) => total + hole.points, 0), holes };
}
