import type { EquipmentCurve, EquipmentStartLine } from "@/lib/visual/equipmentBallFlightShape";

export type EquipmentFaceControlBias = "neutral" | "reduceLeft" | "reduceRight" | "stability";

export type EquipmentFaceControlClassification = {
  label: string;
  bias: EquipmentFaceControlBias;
};

const BIAS_BY_PATTERN: Record<
  Exclude<EquipmentStartLine, "unsure">,
  Record<Exclude<EquipmentCurve, "unsure">, EquipmentFaceControlBias>
> = {
  left: {
    draw: "reduceLeft",
    straight: "reduceLeft",
    fade: "neutral",
  },
  center: {
    draw: "stability",
    straight: "neutral",
    fade: "stability",
  },
  right: {
    draw: "neutral",
    straight: "reduceRight",
    fade: "reduceRight",
  },
};

export function classifyEquipmentFaceControl(
  start: EquipmentStartLine,
  curve: EquipmentCurve,
): EquipmentFaceControlClassification {
  if (start === "unsure" || curve === "unsure") {
    return { label: "unknown", bias: "neutral" };
  }

  const startLabel = start === "left" ? "starts left" : start === "right" ? "starts right" : "starts on target";
  const curveLabel = curve === "draw" ? "curves left" : curve === "fade" ? "curves right" : "stays mostly straight";

  return {
    label: `${startLabel} and ${curveLabel}`,
    bias: BIAS_BY_PATTERN[start][curve],
  };
}
