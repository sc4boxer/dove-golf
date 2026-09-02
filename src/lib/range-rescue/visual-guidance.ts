import type { RangeRescuePlanId } from "./plans";

export type RescueVisualGuidance = {
  observedTitle: string;
  observedBody: string;
  copyTitle: string;
  copyBody: string;
  copyCue: string;
};

export const RANGE_RESCUE_VISUAL_GUIDANCE: Record<RangeRescuePlanId, RescueVisualGuidance> = {
  "ground-first": {
    observedTitle: "The club reached the ground too soon.",
    observedBody: "The heavy sound came before the ball. For this test, move the bottom of the swing a little forward.",
    copyTitle: "Make this picture on your mat.",
    copyBody: "Choose a spot just ahead of the ball. Let the small swing travel through the ball toward that spot.",
    copyCue: "Ball, then grass",
  },
  "thin-or-top": {
    observedTitle: "The club met too much of the ball’s top half.",
    observedBody: "That low, skidding flight is the clue. The next test is simply to give the club more room to brush through.",
    copyTitle: "Make this picture at address.",
    copyBody: "Stand a tiny bit closer, let your arms hang, then finish a three-quarter swing in balance.",
    copyCue: "Brush through, hold the finish",
  },
  "starts-left": {
    observedTitle: "The ball began left of your target.",
    observedBody: "Only the first part of the flight matters here. Check the picture on the ground before changing your swing.",
    copyTitle: "Build two quiet, parallel lines.",
    copyBody: "Aim the club at the target. Set your feet on a separate line running alongside it—not at the target.",
    copyCue: "Club at target, feet parallel",
  },
  "starts-right": {
    observedTitle: "The ball began right of your target.",
    observedBody: "Only the starting direction matters for this test. Give your eyes a nearer, easier line to aim at.",
    copyTitle: "Use one mark a few feet ahead.",
    copyBody: "Pick a leaf or mark on the target line. Aim the club there first, then settle your feet.",
    copyCue: "Near mark first",
  },
  "curves-left": {
    observedTitle: "The flight kept bending left.",
    observedBody: "You do not need to erase the curve. Your next test is to make the same shape smaller and easier to predict.",
    copyTitle: "Turn the volume down to 70%.",
    copyBody: "Use a three-quarter swing, soft hands, and a balanced finish. Smaller is the whole assignment.",
    copyCue: "Three-quarter swing, same rhythm",
  },
  "curves-right": {
    observedTitle: "The flight kept bending right.",
    observedBody: "You do not need to erase the curve. Your next test is to make the same shape smaller and easier to predict.",
    copyTitle: "Turn the volume down to 70%.",
    copyBody: "Use a three-quarter swing, soft hands, and a balanced finish. Smaller is the whole assignment.",
    copyCue: "Three-quarter swing, same rhythm",
  },
  "no-pattern": {
    observedTitle: "The balls are telling several stories at once.",
    observedBody: "When the pattern disappears, more swing thoughts usually add noise. Make the task smaller instead.",
    copyTitle: "Give yourself one wide window.",
    copyBody: "Choose your easiest short iron, a generous target, and a waist-high swing at half speed.",
    copyCue: "One club, one window, half speed",
  },
};

export function getRangeRescueVisualGuidance(id: RangeRescuePlanId) {
  return RANGE_RESCUE_VISUAL_GUIDANCE[id];
}
