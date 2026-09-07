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
    observedTitle: "You felt the club hit the ground before the ball.",
    observedBody: "This side view shows that contact order. It does not tell us why it happened. Try a smaller swing before changing how you stand.",
    copyTitle: "Brush the ground just after the ball.",
    copyBody: "Choose a spot just ahead of the ball, toward your target. Swing gently with your hands only reaching waist height on each side. Let the club brush the mat or grass beyond the ball; do not force it down.",
    copyCue: "Ball first, then brush the ground",
  },
  "thin-or-top": {
    observedTitle: "The ball stayed low or rolled along the ground.",
    observedBody: "The club may have caught the upper part of the ball, as this side view shows. A low shot alone cannot tell us the cause.",
    copyTitle: "Practice a gentle brush through the ball.",
    copyBody: "First make a slow practice swing beside the ball and lightly brush the mat or grass. Then try with a ball, letting your hands reach only waist height on each side. Let the club lift the ball; you do not need to scoop it up.",
    copyCue: "Small swing, gentle brush",
  },
  "starts-left": {
    observedTitle: "The ball began left of your target.",
    observedBody: "This view looks down the range. Watch where the ball first travels, before any bend. Checking your aim is a useful first test, even though aim may not be the cause.",
    copyTitle: "Point the club toward a nearby mark.",
    copyBody: "Stand behind the ball and pick a mark on the ground a few feet toward your target. Point the flat hitting surface of the club at it. Set your feet along a separate line beside that direction, like two railway tracks.",
    copyCue: "Club toward the mark, feet beside the line",
  },
  "starts-right": {
    observedTitle: "The ball began right of your target.",
    observedBody: "This view looks down the range. Watch where the ball first travels, before any bend. Checking your aim is a useful first test, even though aim may not be the cause.",
    copyTitle: "Point the club toward a nearby mark.",
    copyBody: "Stand behind the ball and pick a mark on the ground a few feet toward your target. Point the flat hitting surface of the club at it. Set your feet along a separate line beside that direction, like two railway tracks.",
    copyCue: "Club toward the mark, feet beside the line",
  },
  "curves-left": {
    observedTitle: "The ball bent left while it was in the air.",
    observedBody: "This view looks down the range. The bend is different from starting left. It tells us what the ball did, but does not identify a particular swing fault.",
    copyTitle: "Try a smaller, easy swing.",
    copyBody: "Let your hands reach only waist height on each side. Swing at an easy pace and finish comfortably in balance. The smaller curve shown is something to look for, not a promised result.",
    copyCue: "Hands to waist height, easy pace",
  },
  "curves-right": {
    observedTitle: "The ball bent right while it was in the air.",
    observedBody: "This view looks down the range. The bend is different from starting right. It tells us what the ball did, but does not identify a particular swing fault.",
    copyTitle: "Try a smaller, easy swing.",
    copyBody: "Let your hands reach only waist height on each side. Swing at an easy pace and finish comfortably in balance. The smaller curve shown is something to look for, not a promised result.",
    copyCue: "Hands to waist height, easy pace",
  },
  "no-pattern": {
    observedTitle: "Your shots went in different directions.",
    observedBody: "That is common when you are learning. Start with making contact more often; you do not need to send every ball straight.",
    copyTitle: "Make a small swing toward a wide target.",
    copyBody: "Choose a club marked 7, 8, 9, or P. If you are unsure, ask range staff for a beginner practice iron. Pick a wide area down the range and swing gently with your hands only reaching waist height on each side.",
    copyCue: "Same club, small swing, easy pace",
  },
};

export function getRangeRescueVisualGuidance(id: RangeRescuePlanId) {
  return RANGE_RESCUE_VISUAL_GUIDANCE[id];
}
