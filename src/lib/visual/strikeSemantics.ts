export type FaceStrikeName = "heel" | "center" | "toe";

export type StrikeSemantics = {
  name: FaceStrikeName;
  horizontalPositionOnFace: number;
  label: string;
  renderingAnchor: "left" | "center" | "right";
  rightHandedVisualOrientationNotes: string;
};

export const STRIKE_SEMANTICS: Record<FaceStrikeName, StrikeSemantics> = {
  heel: {
    name: "heel",
    horizontalPositionOnFace: -1,
    label: "Heel",
    renderingAnchor: "left",
    rightHandedVisualOrientationNotes:
      "For right-handed visuals with the hosel drawn on the right edge, heel contact sits nearest the hosel/golfer on the right side of the face graphic.",
  },
  center: {
    name: "center",
    horizontalPositionOnFace: 0,
    label: "Center",
    renderingAnchor: "center",
    rightHandedVisualOrientationNotes: "Centered strike is drawn at the geometric middle of the face graphic.",
  },
  toe: {
    name: "toe",
    horizontalPositionOnFace: 1,
    label: "Toe",
    renderingAnchor: "right",
    rightHandedVisualOrientationNotes:
      "For right-handed visuals with the hosel drawn on the right edge, toe contact sits farthest from the hosel/golfer on the left side of the face graphic.",
  },
};
