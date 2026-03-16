export type StrikeLocation = "heel" | "center" | "toe";

export type StrikeFaceSemantic = {
  key: StrikeLocation;
  label: string;
  normalizedX: number;
  relationToHosel: "nearest" | "middle" | "farthest";
};

export const STRIKE_FACE_SEMANTICS: Record<StrikeLocation, StrikeFaceSemantic> = {
  heel: {
    key: "heel",
    label: "Heel",
    normalizedX: 0.2,
    relationToHosel: "nearest",
  },
  center: {
    key: "center",
    label: "Center",
    normalizedX: 0.5,
    relationToHosel: "middle",
  },
  toe: {
    key: "toe",
    label: "Toe",
    normalizedX: 0.8,
    relationToHosel: "farthest",
  },
};
