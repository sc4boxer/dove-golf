import { STRIKE_FACE_SEMANTICS, type StrikeLocation } from "@/lib/visual/strikeFaceSemantics";

export type FaceStrikeName = StrikeLocation;

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
    horizontalPositionOnFace: STRIKE_FACE_SEMANTICS.heel.normalizedX,
    label: STRIKE_FACE_SEMANTICS.heel.label,
    renderingAnchor: "right",
    rightHandedVisualOrientationNotes: "Heel is nearest the hosel/shaft side in this right-handed face orientation.",
  },
  center: {
    name: "center",
    horizontalPositionOnFace: STRIKE_FACE_SEMANTICS.center.normalizedX,
    label: STRIKE_FACE_SEMANTICS.center.label,
    renderingAnchor: "center",
    rightHandedVisualOrientationNotes: "Center is the geometric middle of the clubface.",
  },
  toe: {
    name: "toe",
    horizontalPositionOnFace: STRIKE_FACE_SEMANTICS.toe.normalizedX,
    label: STRIKE_FACE_SEMANTICS.toe.label,
    renderingAnchor: "left",
    rightHandedVisualOrientationNotes: "Toe is farthest from the hosel/shaft side in this right-handed face orientation.",
  },
};
