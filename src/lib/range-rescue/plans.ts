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
export type RangeRescueClub = "iron" | "driver";

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

const DRIVER_SETUP = "Use your driver with the ball on a tee. Ask range staff for a suitable tee if needed. Start with the ball near the inside of your lead foot (the foot nearer the target), and keep that position and tee height consistent for the set.";

// Driver guidance keeps setup and strike observations separate from diagnoses.
// Sources: PGA, Find the Fairway More Off the Tee; Titleist Learning Lab, Gear Effect.
export const DRIVER_RANGE_RESCUE_PLANS: readonly RangeRescuePlan[] = [
  {
    id: "ground-first",
    optionLabel: "I hit the ground before the teed ball",
    title: "Practice reaching the teed ball",
    summary: "The driver ball sits above the ground. Work on reaching it without trying to strike the turf.",
    reset: DRIVER_SETUP,
    change: "Try a shorter, easy swing and finish in balance. Let the club reach the teed ball; do not try to take a divot or lift the ball with your hands.",
    test: ["Rehearse 2 easy swings in your own bay", "Hit 5 balls with the same tee height", "Notice whether the club reaches the ball before the ground"],
    better: "Count how many of 5 shots reach the ball without hitting the ground first. Compare with your starting shots; one extra is a useful observation.",
    fallback: "If the club keeps hitting the ground first, pause and ask a range instructor to check your driver setup. If you change the setup, record a new starting set before comparing results.",
  },
  {
    id: "thin-or-top",
    optionLabel: "My drive stays low or rolls",
    title: "Start with contact on the tee",
    summary: "A low drive alone cannot tell us the cause. Keep the tee setup consistent and look for contact and a little height.",
    reset: DRIVER_SETUP,
    change: "Use a shorter, easy swing toward a wide range target. Finish in balance and let the driver meet the teed ball without trying to scoop it into the air.",
    test: ["Rehearse 2 easy swings in your own bay", "Hit 5 balls with the same tee height", "Notice which balls become airborne, even briefly"],
    better: "Count how many of 5 balls get into the air. Compare with your starting shots; height is an observation, not a diagnosis of your swing.",
    fallback: "Ask range staff or a coach to check that the tee suits your driver. If the tee height or ball position changes, begin a new starting set. Do not add speed to force the ball up.",
  },
  {
    id: "starts-left",
    optionLabel: "My drive starts left",
    title: "Give your driver a clear target",
    summary: "Starting left is an observation, not a swing diagnosis. Begin with an aim check.",
    reset: DRIVER_SETUP,
    change: "From inside your bay, choose a target in a wide, safe range area. Aim the center of the driver face toward it, then settle your feet alongside the ball-to-target line. Make an easy swing.",
    test: ["Check your target before each swing", "Hit 5 balls with the same tee height", "Watch the initial direction before the ball curves"],
    better: "Count how many of 5 drives start toward your target. Compare with your starting shots; the landing point is a separate observation.",
    fallback: "Keep the target and tee setup, and try 3 shorter, easy swings. If the start stays left, take that observation to a coach instead of assuming a grip or swing-path fault.",
  },
  {
    id: "starts-right",
    optionLabel: "My drive starts right",
    title: "Use a nearby mark for driver aim",
    summary: "Starting right is an observation, not a swing diagnosis. A nearby mark can make your aim easier to repeat.",
    reset: DRIVER_SETUP,
    change: "From inside your bay, find an existing mark ahead of the ball on the line to a wide range target. Aim the center of the driver face toward it, then settle your feet alongside that line. Make an easy swing.",
    test: ["Check the nearby mark before each swing", "Hit 5 balls with the same tee height", "Watch the initial direction before the ball curves"],
    better: "Count how many of 5 drives start toward your target. Compare with your starting shots; the landing point is a separate observation.",
    fallback: "Keep the target and tee setup, and try 3 shorter, easy swings. If the start stays right, take that observation to a coach instead of assuming a grip or swing-path fault.",
  },
  ...(["left", "right"] as const).map((direction): RangeRescuePlan => ({
    id: `curves-${direction}`,
    optionLabel: `My drive curves ${direction}`,
    title: "Watch the curve with an easier swing",
    summary: "Driver curvature can also be influenced by where the ball meets the face. The bend alone does not identify a swing fault.",
    reset: DRIVER_SETUP,
    change: "Choose a wide, safe range target. Try a shorter, easy driver swing and finish in balance. Keep the same tee setup while you watch the flight.",
    test: ["Rehearse 2 easy swings in your own bay", "Hit 5 balls with the same tee height", `Notice whether the ball bends ${direction} less than before`],
    better: "Count how many of 5 shots bend less than your starting shots. Shorter shots may bend less because they travel less; this does not prove the curve is fixed.",
    fallback: "If the bend is hard to judge, try 3 easy swings and record contact only. A coach can check strike location and delivery together before suggesting a correction.",
  })),
  {
    id: "no-pattern",
    optionLabel: "I am not sure, or I keep missing with driver",
    title: "Make driver contact your first goal",
    summary: "You do not need to name a fault or hit far. Start by noticing whether the driver reaches the ball.",
    reset: DRIVER_SETUP,
    change: "Make a shorter, easy swing and finish comfortably in balance. Keep your only goal as contact with the teed ball.",
    test: ["Rehearse 2 easy swings in your own bay", "Hit 5 balls with the same tee height", "Count contact even when the ball only rolls"],
    better: "Count how many of 5 swings make contact. Compare with your starting shots; one extra counts as progress, even if it rolls.",
    fallback: "Try 3 even shorter, easy swings with the same tee setup. If you still miss, pause and ask a coach to help with driver setup. Any setup change needs a new starting set.",
  },
];

export function getRangeRescuePlans(club: RangeRescueClub = "iron"): readonly RangeRescuePlan[] {
  return club === "driver" ? DRIVER_RANGE_RESCUE_PLANS : RANGE_RESCUE_PLANS;
}

export function getRangeRescuePlan(id: RangeRescuePlanId, club: RangeRescueClub = "iron") {
  return getRangeRescuePlans(club).find((plan) => plan.id === id);
}

