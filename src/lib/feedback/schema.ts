import { RANGE_RESCUE_PLAN_IDS, type RangeRescuePlanId } from "../range-rescue/plans.ts";

export const FEEDBACK_EXPERIENCE_OPTIONS = [
  "prefer-not-to-say",
  "just-starting",
  "under-one-year",
  "one-to-three-years",
  "more-than-three-years",
] as const;

export const FEEDBACK_NEXT_HELP_OPTIONS = [
  "better-contact",
  "start-direction",
  "curve-control",
  "distance",
  "equipment",
  "practice-plan",
] as const;

export type FeedbackExperience = (typeof FEEDBACK_EXPERIENCE_OPTIONS)[number];
export type FeedbackNextHelp = (typeof FEEDBACK_NEXT_HELP_OPTIONS)[number];

export type ProductFeedbackInput = {
  module: "range-rescue";
  planId: RangeRescuePlanId;
  helpful: boolean;
  experience?: FeedbackExperience;
  nextHelp?: FeedbackNextHelp;
  comment?: string;
  website?: string;
};

type ValidationResult =
  | { ok: true; value: ProductFeedbackInput }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function optionalEnum<T extends readonly string[]>(value: unknown, options: T) {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "string" && options.includes(value) ? value as T[number] : null;
}

export function validateProductFeedback(value: unknown): ValidationResult {
  if (!isRecord(value)) return { ok: false, error: "Invalid feedback." };

  if (value.module !== "range-rescue") {
    return { ok: false, error: "Invalid feedback module." };
  }

  if (typeof value.planId !== "string" || !RANGE_RESCUE_PLAN_IDS.includes(value.planId as RangeRescuePlanId)) {
    return { ok: false, error: "Invalid rescue plan." };
  }

  if (typeof value.helpful !== "boolean") {
    return { ok: false, error: "Choose whether the guidance helped." };
  }

  const experience = optionalEnum(value.experience, FEEDBACK_EXPERIENCE_OPTIONS);
  const nextHelp = optionalEnum(value.nextHelp, FEEDBACK_NEXT_HELP_OPTIONS);
  if (experience === null || nextHelp === null) {
    return { ok: false, error: "Invalid optional feedback value." };
  }

  const comment = typeof value.comment === "string" ? value.comment.trim() : "";
  if (comment.length > 500) {
    return { ok: false, error: "Keep feedback under 500 characters." };
  }

  const website = typeof value.website === "string" ? value.website.trim().slice(0, 200) : "";

  return {
    ok: true,
    value: {
      module: "range-rescue",
      planId: value.planId as RangeRescuePlanId,
      helpful: value.helpful,
      ...(experience ? { experience } : {}),
      ...(nextHelp ? { nextHelp } : {}),
      ...(comment ? { comment } : {}),
      ...(website ? { website } : {}),
    },
  };
}
