export type DiagnosisShareData = {
  miss: string;
  likelyCause: string;
  rangePlan: string;
  shareUrl: string;
};

const MAX_FIELD_LENGTH = 320;
const DOVEGOLF_ORIGINS = new Set(["dovegolf.fit", "www.dovegolf.fit"]);

export function normalizeShareText(value: unknown, fallback: string) {
  const normalized = String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, MAX_FIELD_LENGTH);

  return normalized || fallback;
}

export function normalizeDoveGolfUrl(value: unknown) {
  try {
    const url = new URL(String(value ?? ""));
    if (url.protocol !== "https:" || !DOVEGOLF_ORIGINS.has(url.hostname.toLowerCase())) {
      return "https://dovegolf.fit";
    }

    url.hostname = "dovegolf.fit";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "https://dovegolf.fit";
  }
}

export function normalizeDiagnosisShareData(input: Partial<DiagnosisShareData>): DiagnosisShareData {
  return {
    miss: normalizeShareText(input.miss, "Golf shot pattern"),
    likelyCause: normalizeShareText(
      input.likelyCause,
      "More repeatable shots are needed to isolate the main factor.",
    ),
    rangePlan: normalizeShareText(
      input.rangePlan,
      "Hit ten shots with one variable changed, then compare start line, curve, and strike.",
    ),
    shareUrl: normalizeDoveGolfUrl(input.shareUrl),
  };
}

export function buildDiagnosisShareText(input: Partial<DiagnosisShareData>) {
  const data = normalizeDiagnosisShareData(input);

  return [
    "My DoveGolf diagnosis",
    "",
    `Miss: ${data.miss}`,
    `Likely cause: ${data.likelyCause}`,
    "",
    `See the diagnostic: ${data.shareUrl}`,
  ].join("\n");
}
