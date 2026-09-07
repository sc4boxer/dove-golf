export const RANGE_RESCUE_PLAN_IDS = [
  "ground-first",
  "thin-or-top",
  "starts-left",
  "starts-right",
  "curves-left",
  "curves-right",
  "no-pattern",
] as const;

export type RangeRescuePlanId = (typeof RANGE_RESCUE_PLAN_IDS)[number];

export type RangeRescuePlan = {
  id: RangeRescuePlanId;
  optionLabel: string;
  title: string;
  summary: string;
  reset: string;
  change: string;
  test: readonly [string, string, string];
  better: string;
  fallback: string;
};

export const RANGE_RESCUE_PLANS: readonly RangeRescuePlan[] = [
  {
    id: "ground-first",
    optionLabel: "I hit the ground first",
    title: "Practice reaching the ball before the ground",
    summary: "Try a smaller swing and notice when the club touches the ground. Distance can wait.",
    reset: "Choose a club marked 7, 8, 9, or P. If you are unsure, ask range staff for a beginner practice iron.",
    change: "Pick a spot just beyond the ball toward your target. Swing gently with your hands only reaching waist height, through the ball toward that spot.",
    test: ["Try 2 gentle swings without a ball", "Hit 5 balls with the same small swing", "After each ball, notice whether you hit the ground first"],
    better: "Count how many of 5 shots reach the ball without hitting the ground first. Compare with your starting shots; one extra counts as progress.",
    fallback: "If it is hard to tell, do not guess. Place the ball on a low tee, just above the grass or mat, and try 3 smaller swings. Ask range staff for help with the tee if needed.",
  },
  {
    id: "thin-or-top",
    optionLabel: "The ball stays low or rolls along the ground",
    title: "Practice getting the ball into the air",
    summary: "Try a small swing that brushes the grass or mat. You are looking for a little lift, not a long shot.",
    reset: "Choose a club marked 7, 8, 9, or P. If you are unsure, ask range staff for a beginner practice iron.",
    change: "Swing gently with your hands only reaching waist height. Let the club brush the grass or mat where the ball sits, and finish comfortably in balance.",
    test: ["Try 2 gentle swings without a ball", "Hit 5 balls with the same small swing", "Notice which balls leave the ground, even briefly"],
    better: "Count how many of 5 balls get into the air. Compare with your starting shots; one extra counts as progress.",
    fallback: "Place the ball on a low tee, just above the grass or mat, and try 3 smaller swings. A little lift is enough. If you keep missing, a coach can help check your starting position.",
  },
  {
    id: "starts-left",
    optionLabel: "It starts left",
    title: "Check where you are aiming",
    summary: "Starting left does not tell us why it happened. Checking your aim is a simple first experiment.",
    reset: "From inside your own practice bay, look from behind the ball toward one range target.",
    change: "Aim the flat hitting surface of the club toward the target. Imagine railway tracks: the ball and target are on one track, and your feet stand along the other.",
    test: ["Check your aim before you swing", "Hit 5 balls with an easy swing", "Notice where each ball first travels, before it bends"],
    better: "Count how many of 5 balls start toward your chosen target. Compare with your starting shots; they do not need to land exactly on it.",
    fallback: "Keep the same target and try 3 gentle swings with your hands only reaching waist height. If they still start left, save that observation for a coach instead of adding more changes.",
  },
  {
    id: "starts-right",
    optionLabel: "It starts right",
    title: "Use a nearby mark to aim",
    summary: "Starting right does not tell us why it happened. A nearby mark can make your aim easier to check.",
    reset: "From inside your own practice bay, look from behind the ball toward one range target.",
    change: "Find an existing mark just ahead of the ball, between it and the target. Aim the flat hitting surface of the club at that mark, then place your feet as shown.",
    test: ["Check the nearby mark before you swing", "Hit 5 balls with an easy swing", "Notice where each ball first travels, before it bends"],
    better: "Count how many of 5 balls start toward your chosen target. Compare with your starting shots; they do not need to land exactly on it.",
    fallback: "Keep the same target and try 3 gentle swings with your hands only reaching waist height. If they still start right, save that observation for a coach instead of adding more changes.",
  },
  {
    id: "curves-left",
    optionLabel: "It curves left",
    title: "See what a smaller swing changes",
    summary: "Try a shorter shot and watch the bend. This experiment does not tell us what causes the curve.",
    reset: "Keep the same club and choose a wide, safe area in the range to aim toward.",
    change: "Swing gently with your hands only reaching waist height. Finish comfortably in balance instead of trying for distance.",
    test: ["Try 2 gentle swings without a ball", "Hit 5 balls with the same small swing", "Notice whether the ball bends left less than before"],
    better: "Count how many of 5 shots bend less than your starting shots. Shorter shots may bend less simply because they travel less; this is practice feedback, not proof of a fixed swing.",
    fallback: "If the bend is hard to judge, try 3 small swings and just notice whether you make contact. If the curve persists, a coach can help find the cause.",
  },
  {
    id: "curves-right",
    optionLabel: "It curves right",
    title: "See what a smaller swing changes",
    summary: "Try a shorter shot and watch the bend. This experiment does not tell us what causes the curve.",
    reset: "Keep the same club and choose a wide, safe area in the range to aim toward.",
    change: "Swing gently with your hands only reaching waist height. Finish comfortably in balance instead of trying for distance.",
    test: ["Try 2 gentle swings without a ball", "Hit 5 balls with the same small swing", "Notice whether the ball bends right less than before"],
    better: "Count how many of 5 shots bend less than your starting shots. Shorter shots may bend less simply because they travel less; this is practice feedback, not proof of a fixed swing.",
    fallback: "If the bend is hard to judge, try 3 small swings and just notice whether you make contact. If the curve persists, a coach can help find the cause.",
  },
  {
    id: "no-pattern",
    optionLabel: "I am not sure, or I keep missing the ball",
    title: "Start with making contact",
    summary: "You do not need to name a swing problem. Start by noticing whether the club reaches the ball.",
    reset: "Choose a club marked 7, 8, 9, or P. If you are unsure, ask range staff for a beginner practice iron.",
    change: "Swing gently with your hands only reaching waist height. Your only goal is to make contact with the ball.",
    test: ["Try 2 gentle swings without a ball", "Hit 5 balls with the same small swing", "Count contact even when the ball only rolls"],
    better: "Count how many of 5 swings make contact. Compare with your starting shots; one extra counts as progress, even if it rolls.",
    fallback: "Try 3 even smaller swings, with your hands below waist height. If you still miss, pause and ask a coach to help with your starting position. You can finish the session without hitting a perfect shot.",
  },
] as const;

export function getRangeRescuePlan(id: RangeRescuePlanId) {
  return RANGE_RESCUE_PLANS.find((plan) => plan.id === id);
}

