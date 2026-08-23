import type { CurveInput, StartInput, StrikeInput } from "./model.ts";

export type ShotEvidence = {
  faceAngle: number;
  pathAngle: number;
  faceToTarget: string;
  faceToPath: string;
  strikePosition: number;
  strikeLabel: string;
  strikeNote: string;
};

const FACE_ANGLE: Record<StartInput, number> = {
  left: -8,
  straight: 0,
  right: 8,
};

const PATH_OFFSET: Record<CurveInput, number> = {
  left: 12,
  straight: 0,
  right: -12,
};

const FACE_TO_TARGET: Record<StartInput, string> = {
  left: "Face direction left of the target line",
  straight: "Face direction near the target line",
  right: "Face direction right of the target line",
};

const FACE_TO_PATH: Record<CurveInput, string> = {
  left: "Face closed relative to the path",
  straight: "Face and path closely matched",
  right: "Face open relative to the path",
};

const STRIKE: Record<
  StrikeInput,
  Pick<ShotEvidence, "strikePosition" | "strikeLabel" | "strikeNote">
> = {
  heel: {
    strikePosition: 24,
    strikeLabel: "Heel",
    strikeNote:
      "Heel contact can add rightward gear-effect curve on a driver or fairway wood.",
  },
  center: {
    strikePosition: 50,
    strikeLabel: "Center",
    strikeNote:
      "Centered contact makes horizontal gear effect less likely to dominate the pattern.",
  },
  toe: {
    strikePosition: 76,
    strikeLabel: "Toe",
    strikeNote:
      "Toe contact can add leftward gear-effect curve on a driver or fairway wood.",
  },
  unknown: {
    strikePosition: 50,
    strikeLabel: "Not recorded",
    strikeNote:
      "Measure face contact before separating delivery from horizontal gear effect.",
  },
};

export function deriveShotEvidence({
  start,
  curve,
  strike,
}: {
  start: StartInput;
  curve: CurveInput;
  strike: StrikeInput;
}): ShotEvidence {
  const faceAngle = FACE_ANGLE[start];

  return {
    faceAngle,
    pathAngle: faceAngle + PATH_OFFSET[curve],
    faceToTarget: FACE_TO_TARGET[start],
    faceToPath: FACE_TO_PATH[curve],
    ...STRIKE[strike],
  };
}
