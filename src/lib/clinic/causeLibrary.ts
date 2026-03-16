import { CurveSeverity, StartDirection } from "@/lib/clinic/ballFlightPatterns";

export type ConfidenceLabel = "very-likely" | "likely" | "possible";

export type CauseTest = {
  id: string;
  title: string;
  instruction: string;
  watchFor: string;
  cueType: "grip" | "face" | "path" | "strike";
};

export type CauseDefinition = {
  id: string;
  title: string;
  summary: string;
  explanation: string;
  relatedShotPatterns: string[];
  confidenceRules: Partial<
    Record<`${StartDirection}-${CurveSeverity}` | `${StartDirection}-any`, number>
  >;
  testSuggestions: CauseTest[];
  visualType?: "open-face" | "across-path" | "weak-grip" | "glancing-strike";
};

export const CAUSE_LIBRARY: Record<string, CauseDefinition> = {
  openClubface: {
    id: "openClubface",
    title: "Clubface too open at impact",
    summary: "The face points right of where your swing is traveling.",
    explanation:
      "When the face is open relative to path, the ball starts and curves more to the right.",
    relatedShotPatterns: ["fade", "slice", "pull-fade", "push"],
    confidenceRules: {
      "right-large": 32,
      "right-medium": 24,
      "center-large": 22,
      "center-medium": 16,
      "left-any": 10,
    },
    visualType: "open-face",
    testSuggestions: [
      {
        id: "face-control-test",
        title: "Face control test",
        instruction: "Feel your lead hand close the face a little earlier through impact.",
        watchFor: "The ball starts straighter or peels less to the right.",
        cueType: "face",
      },
    ],
  },
  acrossPath: {
    id: "acrossPath",
    title: "Swing path cuts across the ball",
    summary: "The club is moving left of target through impact.",
    explanation:
      "A leftward path can add right spin, especially when the face is only slightly open to target.",
    relatedShotPatterns: ["pull-fade", "fade", "slice"],
    confidenceRules: {
      "left-medium": 28,
      "left-large": 30,
      "center-medium": 18,
      "center-large": 14,
      "right-any": 8,
    },
    visualType: "across-path",
    testSuggestions: [
      {
        id: "path-test",
        title: "Path test",
        instruction: "Feel the club swing more toward right field instead of cutting across.",
        watchFor: "The ball may start a touch more right but curve less.",
        cueType: "path",
      },
    ],
  },
  weakGrip: {
    id: "weakGrip",
    title: "Grip makes the face hard to square",
    summary: "A weaker hand position can leave the face open too often.",
    explanation:
      "If your hands are too weak on the handle, squaring the face can require perfect timing.",
    relatedShotPatterns: ["fade", "slice", "push"],
    confidenceRules: {
      "right-any": 20,
      "center-medium": 12,
      "center-large": 16,
      "left-any": 4,
    },
    visualType: "weak-grip",
    testSuggestions: [
      {
        id: "grip-test",
        title: "Grip test",
        instruction: "Rotate both hands slightly stronger on the handle.",
        watchFor: "The ball curves less right or starts less right.",
        cueType: "grip",
      },
    ],
  },
  glancingStrike: {
    id: "glancingStrike",
    title: "Glancing strike adds extra curve",
    summary: "Off-center contact can exaggerate side spin and weak flight.",
    explanation:
      "When contact is glancing rather than centered, the ball can curve more and lose speed.",
    relatedShotPatterns: ["slice", "pull-fade", "fade"],
    confidenceRules: {
      "center-large": 16,
      "right-large": 14,
      "left-large": 14,
      "center-any": 10,
    },
    visualType: "glancing-strike",
    testSuggestions: [
      {
        id: "strike-test",
        title: "Strike quality test",
        instruction: "Make a smoother swing and focus on centered contact.",
        watchFor: "Flight becomes less glancing and more solid.",
        cueType: "strike",
      },
    ],
  },
};
