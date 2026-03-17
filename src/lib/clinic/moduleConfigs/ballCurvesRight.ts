import { BALL_CURVES_RIGHT_VARIANTS } from "@/lib/clinic/causeMapping";

export const BALL_CURVES_RIGHT_MODULE = {
  id: "ball-curves-right",
  route: "/clinic/ball-curves-right",
  symptomTitle: "Ball Curves Right",
  intro:
    "Several things can cause this pattern. Match the flight you see most often, then test one likely cause at a time.",
  variants: BALL_CURVES_RIGHT_VARIANTS,
  interpretationRules: [
    {
      cue: "If a stronger grip reduced the curve",
      meaning: "Face control was likely a major factor.",
    },
    {
      cue: "If right-field path feel changed start line and reduced curve",
      meaning: "Path and face relationship was likely involved.",
    },
    {
      cue: "If centered contact changed everything",
      meaning: "Strike quality may be driving more of your miss than expected.",
    },
  ],
  rangePlan: [
    "5 balls: grip test",
    "5 balls: face control test",
    "5 balls: path test",
    "5 balls: combine the best feel",
    "Compare start line and curve before/after",
  ],
};
