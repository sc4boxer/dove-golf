import { getSessionFeedback, summarizeShots, type ShotOutcome } from "./beginner-session.ts";

export type ShotPractice = {
  id: "clarify" | "contact" | "height" | "repeat";
  title: string;
  observation: string;
  instruction: string;
  measure: string;
};

export const SAMPLE_START: readonly ShotOutcome[] = Object.freeze(["miss", "contact", "air", "contact", "air"]);
export const SAMPLE_AFTER: readonly ShotOutcome[] = Object.freeze(["contact", "air", "air", "air", "air"]);

const SAME_SETUP = "Keep the same iron, ball position, and grass, mat, or tee setup for both sets.";

export function getShotPracticeFeedback(before: readonly ShotOutcome[], after: readonly ShotOutcome[]) {
  const feedback = getSessionFeedback(before, after);
  const practice = getShotPractice(before);
  if (practice.id !== "repeat" || after.includes("unsure") || summarizeShots(after).contact === 0) return feedback;
  return {
    title: feedback.title,
    next: `Next session, repeat five balls with the same swing at an easy pace. ${SAME_SETUP} Look for contact and a little height before adding distance. These short sets do not establish a lasting swing change. If contact stays difficult, ask a range instructor to watch a few shots.`,
  };
}

// Practice suggestions use the golfer's confirmed outcomes, not video diagnoses.
export function getShotPractice(shots: readonly ShotOutcome[]): ShotPractice {
  if (shots.length !== 5) throw new Error("Record exactly five shots before choosing a practice task.");
  if (Array.from(shots).some((shot) => !["air", "contact", "miss", "unsure"].includes(shot))) {
    throw new Error("Each shot must be air, contact, miss, or unsure.");
  }

  if (shots.includes("unsure")) return {
    id: "clarify",
    title: "Get a clearer starting point",
    observation: "At least one result is unclear, so this set cannot support a confident practice choice.",
    instruction: `Ask a friend to watch from a safe place outside your swing area. Record a fresh five-shot starting set and mark anything unclear without guessing. ${SAME_SETUP}`,
    measure: "Confirm whether each attempt missed, made contact and rolled, or became airborne before choosing an exercise.",
  };

  const { contact, airborne } = summarizeShots(shots);
  const observation = `You recorded contact on ${contact} of 5 attempts. ${airborne} of 5 became airborne.`;

  if (contact === 0) return {
    id: "contact",
    title: "Start with making contact",
    observation,
    instruction: `Rehearse two gentle swings without a ball, with your hands only reaching waist height. Then try five balls with that small swing. ${SAME_SETUP} If contact stays difficult, pause and ask a range instructor for help.`,
    measure: "Count contact, including balls that only roll. Compare the next five attempts with this starting set.",
  };

  if (airborne < 3) return {
    id: "height",
    title: "Try the small-swing brush exercise",
    observation,
    instruction: `Rehearse two gentle swings without a ball, with your hands only reaching waist height. Let the club brush the grass or mat where the ball sits, and finish comfortably in balance. Then try five balls with the same small swing. ${SAME_SETUP}`,
    measure: "Count contact and balls that leave the ground, even briefly. Compare the next five attempts with this starting set.",
  };

  return {
    id: "repeat",
    title: "Repeat your easy swing",
    observation,
    instruction: `Try five more balls with the same swing at an easy pace. ${SAME_SETUP} Keep your attention on contact and a little height before adding distance.`,
    measure: "Record contact and airborne results again. These two short sets describe your attempts; they do not establish a lasting swing change.",
  };
}
