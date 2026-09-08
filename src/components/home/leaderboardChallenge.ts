export type ScoreChallenge =
  | { status: "ready"; initials: string; score: number }
  | { status: "empty" }
  | { status: "unavailable" };

/** Only advertise the current course's all-time leader, never another edition. */
export function readScoreChallenge(payload: unknown): ScoreChallenge {
  if (!payload || typeof payload !== "object") return { status: "unavailable" };
  const board = payload as Record<string, unknown>;
  if (board.ok !== true || board.edition !== "current" || board.period !== "alltime" || !Array.isArray(board.entries)) return { status: "unavailable" };
  if (board.entries.length === 0) return { status: "empty" };
  const leader = board.entries[0];
  if (!leader || typeof leader !== "object" || leader.rank !== 1 || typeof leader.initials !== "string" || !/^[A-Z0-9]{3}$/.test(leader.initials) || !Number.isSafeInteger(leader.score) || leader.score < 0) return { status: "unavailable" };
  return { status: "ready", initials: leader.initials, score: leader.score };
}
