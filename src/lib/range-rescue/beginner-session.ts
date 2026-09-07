export type ShotOutcome = "air" | "contact" | "miss" | "unsure";

export function summarizeShots(shots: readonly ShotOutcome[]) {
  return {
    contact: shots.filter((shot) => shot === "air" || shot === "contact").length,
    airborne: shots.filter((shot) => shot === "air").length,
  };
}

export function getSessionFeedback(before: readonly ShotOutcome[], after: readonly ShotOutcome[]) {
  if (before.length !== 5 || after.length !== 5) throw new Error("Record five shots in each set.");
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
