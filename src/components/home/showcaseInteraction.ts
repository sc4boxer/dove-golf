/** A deliberate horizontal swipe changes one preview; vertical scrolling does not. */
export function swipeStep(dx: number, dy: number): -1 | 0 | 1 {
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return 0;
  if (Math.abs(dx) <= 48 || Math.abs(dx) <= Math.abs(dy) * 1.3) return 0;
  return dx < 0 ? 1 : -1;
}

export function nextToolIndex(index: number, count: number): number {
  return ((index % count) + count) % count;
}
