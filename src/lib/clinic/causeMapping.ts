import { CurveSeverity, StartDirection } from "@/lib/clinic/ballFlightPatterns";

export type SymptomVariant = {
  id: string;
  title: string;
  plainLabel: string;
  startDirection: StartDirection;
  curveDirection: "right" | "left";
  curveSeverity: CurveSeverity;
  internalPatternHints: string[];
  candidateCauseIds: string[];
};

export const BALL_CURVES_RIGHT_VARIANTS: SymptomVariant[] = [
  {
    id: "curves-right-center",
    title: "Starts fairly straight, then curves right",
    plainLabel: "Ball curves right after a mostly straight start",
    startDirection: "center",
    curveDirection: "right",
    curveSeverity: "medium",
    internalPatternHints: ["fade", "slice"],
    candidateCauseIds: ["openClubface", "acrossPath", "weakGrip", "glancingStrike"],
  },
  {
    id: "curves-right-from-left",
    title: "Starts left, then curves right",
    plainLabel: "Ball starts left and peels back right",
    startDirection: "left",
    curveDirection: "right",
    curveSeverity: "medium",
    internalPatternHints: ["pull-fade", "pull-slice"],
    candidateCauseIds: ["acrossPath", "openClubface", "glancingStrike", "weakGrip"],
  },
  {
    id: "curves-right-from-right",
    title: "Starts right, then curves further right",
    plainLabel: "Ball starts right and moves farther right",
    startDirection: "right",
    curveDirection: "right",
    curveSeverity: "large",
    internalPatternHints: ["push", "push-slice"],
    candidateCauseIds: ["openClubface", "weakGrip", "glancingStrike", "acrossPath"],
  },
];
