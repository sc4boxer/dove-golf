/** Course coordinates are independent of the canvas's displayed size. */
export const COURSE = {
  width: 360,
  height: 480,
  ballRadius: 7,
  cup: { x: 250, y: 105, radius: 12 },
  start: { x: 110, y: 385 },
} as const;

export type Ball = { x: number; y: number; vx: number; vy: number; sunk: boolean };

const FRICTION = 90;
const MAX_SPEED = 300;
const RESTITUTION = 0.65;
const CAPTURE_SPEED = 90;
const CAPTURE_RADIUS = 10;
const MAX_STEP = 1 / 240;

export function createBall(): Ball {
  return { ...COURSE.start, vx: 0, vy: 0, sunk: false };
}

export function isMoving(ball: Ball): boolean {
  return !ball.sunk && Math.hypot(ball.vx, ball.vy) > 0;
}

/** Zero degrees points up the course; positive angles turn clockwise. */
export function strike(ball: Ball, angleDegrees: number, power: number): Ball {
  if (ball.sunk || isMoving(ball) || !Number.isFinite(angleDegrees) || !Number.isFinite(power)) {
    return { ...ball };
  }
  const speed = MAX_SPEED * Math.max(0, Math.min(100, power)) / 100;
  const angle = (angleDegrees % 360) * Math.PI / 180;
  return { ...ball, vx: Math.sin(angle) * speed, vy: -Math.cos(angle) * speed };
}

/**
 * Integrates constant rolling friction in small, swept segments so a frame
 * cannot jump over the cup. The UI should advance this with a fixed timestep.
 * Ten seconds is ample to settle any valid strike and bounds suspended-tab work.
 */
export function step(ball: Ball, dt: number): Ball {
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

    // Closest point on the swept segment, with speed at that actual position.
    const fraction = distance > 0
      ? Math.max(0, Math.min(1, ((COURSE.cup.x - next.x) * dx + (COURSE.cup.y - next.y) * dy) / (distance * distance)))
      : 0;
    const cupDistance = Math.hypot(next.x + dx * fraction - COURSE.cup.x, next.y + dy * fraction - COURSE.cup.y);
    const speedAtCup = Math.sqrt(Math.max(0, speed * speed - 2 * FRICTION * distance * fraction));
    if (cupDistance < CAPTURE_RADIUS && speedAtCup < CAPTURE_SPEED) {
      return { x: COURSE.cup.x, y: COURSE.cup.y, vx: 0, vy: 0, sunk: true };
    }

    next = { ...next, x: next.x + dx, y: next.y + dy, vx: next.vx / speed * newSpeed, vy: next.vy / speed * newSpeed };
    const min = 20 + COURSE.ballRadius;
    const maxX = COURSE.width - min;
    const maxY = COURSE.height - min;
    // Reflect the small overshoot as well as velocity to avoid sticking at walls.
    if (next.x < min) {
      next.x = min + (min - next.x) * RESTITUTION;
      next.vx = Math.abs(next.vx) * RESTITUTION;
    } else if (next.x > maxX) {
      next.x = maxX - (next.x - maxX) * RESTITUTION;
      next.vx = -Math.abs(next.vx) * RESTITUTION;
    }
    if (next.y < min) {
      next.y = min + (min - next.y) * RESTITUTION;
      next.vy = Math.abs(next.vy) * RESTITUTION;
    } else if (next.y > maxY) {
      next.y = maxY - (next.y - maxY) * RESTITUTION;
      next.vy = -Math.abs(next.vy) * RESTITUTION;
    }
    remaining -= elapsed;
  }
  return next;
}
