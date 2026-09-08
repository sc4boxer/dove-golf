import type { RangeRescueClub } from "./plans";

export type ShotOutcome = "air" | "contact" | "miss" | "unsure";

export function summarizeShots(shots: readonly ShotOutcome[]) {
  return {
    contact: shots.filter((shot) => shot === "air" || shot === "contact").length,
    airborne: shots.filter((shot) => shot === "air").length,
  };
}

export function getSessionFeedback(before: readonly ShotOutcome[], after: readonly ShotOutcome[], club: RangeRescueClub = "iron") {
  if (before.length !== 5 || after.length !== 5) throw new Error("Record five shots in each set.");
  if (club === "driver") return getDriverSessionFeedback(before, after);
  if ([...before, ...after].includes("unsure")) return {
    title: "Let’s get a clearer starting point",
    next: "Some results were unclear, so we cannot compare these sets fairly. Next time, ask someone to watch from a safe place outside your swing area. Keep the same club and small swing, and record what you can see without guessing.",
  };
  const initial = summarizeShots(before);
  const final = summarizeShots(after);
  if (final.contact === 0) return {
    title: "Make the next task smaller",
    next: "Next time, ask a range instructor to help you set up and make contact. For now, you can rehearse a small swing without a ball, or finish here. Missing is useful information, not a reason to swing harder.",
  };
  if (final.airborne > initial.airborne || (final.airborne === initial.airborne && final.contact > initial.contact)) return {
    title: "You found a useful starting point",
    next: "Next session, repeat this small swing with the same club for five balls. Look for contact and a little height again before trying to hit farther. One short set is encouraging, but does not prove a lasting swing change.",
  };
  if (final.airborne >= 3 && final.contact >= initial.contact) return {
    title: "You have a starting point to repeat",
    next: "Keep the same small swing for your next session. Getting the ball airborne three times is a useful practice target, not a pass or fail grade. Repeat it before adding distance.",
  };
  return {
    title: "Keep the next practice simple",
    next: "Next time, try the same small swing with the ball on a low tee, just above the grass or mat, if your range allows it. Treat that as a new starting set because the setup has changed. If contact stays difficult, ask a range instructor to watch a few shots.",
  };
}

function getDriverSessionFeedback(before: readonly ShotOutcome[], after: readonly ShotOutcome[]) {
  if ([...before, ...after].includes("unsure")) return {
    title: "Let’s get a clearer starting point",
    next: "Some results were unclear, so we cannot compare these sets fairly. Next time, keep the same driver, tee height, ball position, and easy swing. Ask someone to watch from a safe place outside your swing area, and record what you can see without guessing.",
  };
  const initial = summarizeShots(before);
  const final = summarizeShots(after);
  if (final.contact === 0) return {
    title: "Make the next task smaller",
    next: "Ask a range instructor to help you set up with the driver and make contact. You can finish here or rehearse an easy swing in your bay. If you change tee height or ball position, record a new starting set. Missing is not a reason to swing harder.",
  };
  if (final.airborne > initial.airborne || (final.airborne === initial.airborne && final.contact > initial.contact)) return {
    title: "You found a useful starting point",
    next: "Next session, repeat five balls with the same driver, tee height, ball position, and shorter, easy swing. Look for contact and a little height before adding distance. This set does not prove a lasting swing change or a corrected curve.",
  };
  if (final.airborne >= 3 && final.contact >= initial.contact) return {
    title: "You have a starting point to repeat",
    next: "Repeat the same easy driver swing and tee setup next session. Three airborne balls is a useful practice target, not a pass or fail grade. These results describe contact and height, not accuracy or a corrected curve.",
  };
  return {
    title: "Keep the next practice simple",
    next: "Keep the driver, tee height, and ball position consistent, and try a shorter, easy swing next time. If contact stays difficult, ask a range instructor to check your setup. Any setup change needs a new starting set before comparing results.",
  };
}
