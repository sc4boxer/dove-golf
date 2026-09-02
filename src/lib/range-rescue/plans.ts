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
    title: "Find the ball first again",
    summary: "Make the next swing smaller. Clean contact matters more than distance right now.",
    reset: "Step away, take one slow breath, then choose a spot on the ground just ahead of the ball.",
    change: "Use one more club than usual and make a waist-high swing toward that spot.",
    test: ["2 easy practice swings", "3 waist-high shots", "Keep the same small finish"],
    better: "At least 3 of 5 shots contact the ball before the ground.",
    fallback: "Tee the ball very low and hit three more small shots. End on the first calm, solid strike.",
  },
  {
    id: "thin-or-top",
    optionLabel: "I hit it thin or top it",
    title: "Stay with the shot",
    summary: "Forget distance for five balls. Your only job is a balanced finish and a full brush through the ball.",
    reset: "Step away, loosen your hands, and let your arms hang before you set up again.",
    change: "Stand a tiny bit closer and make a three-quarter swing that finishes in balance.",
    test: ["2 slow practice swings", "3 three-quarter shots", "Hold each finish for a count of two"],
    better: "At least 3 of 5 shots launch without a top.",
    fallback: "Switch to a short iron and tee the ball very low. Make three waist-high swings.",
  },
  {
    id: "starts-left",
    optionLabel: "It starts left",
    title: "Check the picture first",
    summary: "A rushed setup can quietly point you left. Reset the target before changing your swing.",
    reset: "Walk behind the ball and pick one small target, not the whole range.",
    change: "Lay a club along your toe line, then set your feet parallel to the target line.",
    test: ["1 careful setup", "4 smooth shots", "Recheck your feet before every ball"],
    better: "At least 3 of 5 shots begin closer to the target line.",
    fallback: "Keep the same setup and make three half-swings. Do not add another swing thought.",
  },
  {
    id: "starts-right",
    optionLabel: "It starts right",
    title: "Rebuild your aim",
    summary: "Give your eyes and feet a clean target before you ask the swing to change.",
    reset: "Walk behind the ball and choose a small target you can clearly see.",
    change: "Pick a mark a few feet ahead on the same line, aim the club there, then set your feet.",
    test: ["1 careful setup", "4 smooth shots", "Use the near mark every time"],
    better: "At least 3 of 5 shots begin closer to the target line.",
    fallback: "Move to a shorter club and hit three half-shots using the same near mark.",
  },
  {
    id: "curves-left",
    optionLabel: "It curves left",
    title: "Shrink the swing, shrink the curve",
    summary: "You do not need to fix the curve today. First make it smaller and predictable.",
    reset: "Take one breath and soften your grip until your forearms feel loose.",
    change: "Make a three-quarter swing at 70% effort and finish in balance.",
    test: ["2 three-quarter shots", "3 more at the same speed", "Do not chase extra distance"],
    better: "At least 3 of 5 shots curve less, even if they are not straight.",
    fallback: "Use a shorter club and hit three waist-high shots. Keep the first playable shape you see.",
  },
  {
    id: "curves-right",
    optionLabel: "It curves right",
    title: "Make the shape manageable",
    summary: "Straight is not required. A smaller, repeatable curve is a win for this session.",
    reset: "Take one breath and soften your grip until your forearms feel loose.",
    change: "Make a three-quarter swing at 70% effort and finish in balance.",
    test: ["2 three-quarter shots", "3 more at the same speed", "Do not chase extra distance"],
    better: "At least 3 of 5 shots curve less, even if they are not straight.",
    fallback: "Use a shorter club and hit three waist-high shots. Keep the first playable shape you see.",
  },
  {
    id: "no-pattern",
    optionLabel: "Nothing has a pattern",
    title: "Make the session smaller",
    summary: "When everything feels random, stop searching for a fix. Rebuild one calm strike at a time.",
    reset: "Put the club down, take two slow breaths, and choose a wide, safe target.",
    change: "Use your easiest short iron and make waist-high swings at half speed.",
    test: ["2 practice swings", "3 balls at half speed", "Hold every finish"],
    better: "At least 3 of 5 shots feel balanced and finish near the wide target.",
    fallback: "Hit one comfortable chip or pitch, notice the strike, and call the session complete.",
  },
] as const;

export function getRangeRescuePlan(id: RangeRescuePlanId) {
  return RANGE_RESCUE_PLANS.find((plan) => plan.id === id);
}

