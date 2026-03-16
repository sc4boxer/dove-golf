export type StartLine = "left" | "center" | "right";
export type Curve = "draw" | "straight" | "fade";

export type PatternSlug =
  | "pull-draw"
  | "pull-straight"
  | "pull-fade"
  | "straight-draw"
  | "straight-straight"
  | "straight-fade"
  | "push-draw"
  | "push-straight"
  | "push-fade";

export type Tempo = "smooth" | "neutral" | "quick" | "unsure";
export type Strike = "heel" | "center" | "toe" | "unsure";
export type TypicalMiss =
  | "high_right"
  | "right"
  | "low_right"
  | "high_left"
  | "left"
  | "low_left"
  | "both_sides"
  | "thin"
  | "fat"
  | "unsure";

export const DIAGNOSTIC_ROUTE = "/diagnostic";

export const PATTERN_ORDER: PatternSlug[] = [
  "pull-draw",
  "pull-straight",
  "pull-fade",
  "straight-draw",
  "straight-straight",
  "straight-fade",
  "push-draw",
  "push-straight",
  "push-fade",
];

export const BALL_FLIGHT_PATTERNS: Record<
  PatternSlug,
  {
    title: string;
    startLine: StartLine;
    curve: Curve;
    definition: string;
    physicsConstraints: string[];
    mechanisms: {
      mechanics: string[];
      equipment: string[];
      strike: string[];
    };
    whatToTestFirst: string[];
    confidenceNote: string;
    runDoveFitHref: string;
  }
> = {
  "pull-draw": {
    title: "Push Draw",
    startLine: "left",
    curve: "draw",
    definition: "Starts left of target and curves further left. Face is left of target, but path is right of face.",
    physicsConstraints: [
      "Face angle is left of target at impact.",
      "Swing path is right of face angle.",
      "Face-to-path relationship is closed (negative).",
    ],
    mechanisms: {
      mechanics: [
        "Excessive inside-out path with a rapidly closing face.",
        "Strong lead-hand grip increasing closure rate.",
        "Over-rotation of forearms through impact.",
      ],
      equipment: [
        "Draw-biased head amplifying face closure.",
        "Shaft too soft or too light for transition speed.",
        "Lie angle too upright (especially in irons).",
      ],
      strike: ["Toe strike increasing gear-effect draw.", "High toe contact increasing left curvature."],
    },
    whatToTestFirst: [
      "1) Neutralize head bias (move weight to neutral or fade).",
      "2) Increase shaft weight or stiffness slightly.",
      "3) Test slightly flatter lie angle (irons).",
    ],
    confidenceNote: "Confidence increases if tempo is quick and typical miss is left under pressure.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "pull-straight": {
    title: "Push Straight",
    startLine: "left",
    curve: "straight",
    definition: "Starts left and flies straight. Face and path are both left of target and closely aligned.",
    physicsConstraints: [
      "Face is left of target.",
      "Path is nearly equal to face angle.",
      "Minimal face-to-path difference.",
    ],
    mechanisms: {
      mechanics: [
        "Out-to-in path with square face relative to path.",
        "Early shoulder rotation dominating downswing.",
        "Upper-body initiated transition.",
      ],
      equipment: [
        "Shaft too light causing timing to shift path left.",
        "Club length too long increasing path inconsistency.",
      ],
      strike: ["Centered strike (minimal gear effect)."],
    },
    whatToTestFirst: [
      "1) Test slightly heavier shaft to stabilize transition.",
      "2) Shorten driver by 0.25–0.5 inches if contact is inconsistent.",
      "3) Focus on delaying shoulder rotation (mechanics check).",
    ],
    confidenceNote: "Pattern often appears in players who aim left to compensate for fades.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "pull-fade": {
    title: "Push Fade",
    startLine: "left",
    curve: "fade",
    definition: "Starts left and curves right. Face is left of target but path is even further left.",
    physicsConstraints: [
      "Face is left of target.",
      "Path is more left than face.",
      "Face-to-path relationship is open (positive).",
    ],
    mechanisms: {
      mechanics: [
        "Out-to-in path with partially open face.",
        "Early shoulder firing in transition.",
        "Lead wrist extension (cupping) at impact.",
      ],
      equipment: [
        "Shaft too light for tempo causing delayed closure.",
        "Neutral/open-faced driver head.",
        "Low MOI head increasing curvature variability.",
      ],
      strike: ["Heel strike increasing fade gear effect."],
    },
    whatToTestFirst: [
      "1) Increase shaft weight 5–10g.",
      "2) Test slightly stronger grip position.",
      "3) Adjust head to draw bias or close face slightly.",
    ],
    confidenceNote: "Confidence increases when tempo is quick and miss is high-right under pressure.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "straight-draw": {
    title: "Straight Draw",
    startLine: "center",
    curve: "draw",
    definition: "Starts near target line and curves left. Face is near target; path is right of face.",
    physicsConstraints: [
      "Face angle is near target.",
      "Path is right of face.",
      "Closed face-to-path relationship.",
    ],
    mechanisms: {
      mechanics: ["Inside-out path with stable face control.", "Strong release pattern through impact."],
      equipment: [
        "Draw-biased head amplifying curvature.",
        "Shaft slightly soft increasing closure rate.",
      ],
      strike: ["Toe strike increasing draw curvature."],
    },
    whatToTestFirst: [
      "1) Neutralize head weighting if draw is excessive.",
      "2) Increase shaft stiffness slightly if dispersion left increases.",
    ],
    confidenceNote: "Often desirable unless curvature becomes inconsistent or over-drawn.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "straight-straight": {
    title: "Straight",
    startLine: "center",
    curve: "straight",
    definition: "Starts near target and flies with minimal curvature. Face and path are closely aligned.",
    physicsConstraints: [
      "Face near target line.",
      "Path closely matches face angle.",
      "Minimal face-to-path differential.",
    ],
    mechanisms: {
      mechanics: ["Neutral path and stable release timing.", "Consistent wrist conditions at impact."],
      equipment: ["Appropriate shaft weight and flex for tempo.", "Neutral head bias."],
      strike: ["Centered contact minimizing gear effect."],
    },
    whatToTestFirst: [
      "1) Maintain current equipment setup.",
      "2) Optimize launch/spin if distance is lacking.",
    ],
    confidenceNote: "Use full DoveFit™ if distance or dispersion goals are not met despite neutral flight.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "straight-fade": {
    title: "Straight Fade",
    startLine: "center",
    curve: "fade",
    definition: "Starts near target and curves right. Face is near target; path is left of face.",
    physicsConstraints: [
      "Face near target line.",
      "Path left of face.",
      "Open face-to-path relationship.",
    ],
    mechanisms: {
      mechanics: ["Out-to-in path with square face to target.", "Reduced forearm rotation through impact."],
      equipment: ["Shaft too soft causing face lag.", "Neutral head lacking draw bias."],
      strike: ["Heel contact increasing fade curvature."],
    },
    whatToTestFirst: [
      "1) Increase shaft weight or stiffness slightly.",
      "2) Test draw-biased head setting.",
      "3) Shorten club if heel strikes are common.",
    ],
    confidenceNote: "Common among players who prioritize control over distance.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "push-draw": {
    title: "Pull Draw",
    startLine: "right",
    curve: "draw",
    definition: "Starts right and curves left toward target. Face is right of target; path is further right.",
    physicsConstraints: [
      "Face right of target.",
      "Path further right than face.",
      "Closed face-to-path relationship.",
    ],
    mechanisms: {
      mechanics: ["Strong inside-out path.", "Delayed face closure timing."],
      equipment: [
        "Shaft slightly too heavy slowing closure rate.",
        "Neutral head with no face closure assistance.",
      ],
      strike: ["Toe strike enhancing draw effect."],
    },
    whatToTestFirst: [
      "1) Slightly soften shaft or reduce weight if closure feels delayed.",
      "2) Check alignment to ensure target line accuracy.",
    ],
    confidenceNote: "Often playable if curvature returns ball to target consistently.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "push-straight": {
    title: "Pull Straight",
    startLine: "right",
    curve: "straight",
    definition: "Starts right and flies straight. Face and path are both right of target.",
    physicsConstraints: [
      "Face right of target.",
      "Path closely matches face angle.",
      "Minimal face-to-path difference.",
    ],
    mechanisms: {
      mechanics: ["Inside-out path with square face relative to path.", "Late shoulder rotation keeping path right."],
      equipment: ["Shaft too stiff delaying closure.", "Head set open."],
      strike: ["Centered strike."],
    },
    whatToTestFirst: [
      "1) Adjust face angle slightly closed at address.",
      "2) Test slightly softer shaft if closure feels delayed.",
    ],
    confidenceNote: "Pattern often appears when player aims left to compensate.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
  "push-fade": {
    title: "Pull Fade",
    startLine: "right",
    curve: "fade",
    definition: "Starts right and curves further right. Face is right of target; path is left of face.",
    physicsConstraints: [
      "Face right of target.",
      "Path left of face.",
      "Open face-to-path relationship.",
    ],
    mechanisms: {
      mechanics: [
        "Out-to-in path combined with open face.",
        "Weak lead-hand grip reducing closure rate.",
        "Late release pattern.",
      ],
      equipment: ["Shaft too stiff or too light for transition.", "Open-faced or fade-biased head."],
      strike: ["Heel strike increasing fade gear effect."],
    },
    whatToTestFirst: [
      "1) Increase shaft weight slightly.",
      "2) Move head weighting toward draw bias.",
      "3) Strengthen grip slightly.",
    ],
    confidenceNote: "High confidence pattern when miss is high-right and tempo is quick.",
    runDoveFitHref: DIAGNOSTIC_ROUTE,
  },
};
