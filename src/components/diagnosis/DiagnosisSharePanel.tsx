"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics/ga";
import { BallFlightChart } from "@/components/visuals/BallFlightChart";
import {
  getBallFlightChartPathGeometry,
  type BallFlightChartShape,
} from "@/lib/visual/ballFlightChartPaths";
import type { DiagnosisEmailInput, DiagnosisInsightLabel } from "@/lib/share/diagnosisEmail";
import {
  buildDiagnosisShareText,
  normalizeDiagnosisShareData,
  normalizeShareText,
  type DiagnosisShareData,
} from "@/lib/share/diagnosisShare";

export type DiagnosisShareDetail = {
  label: string;
  value: string;
};

export type DiagnosisShareRecommendation = {
  label: string;
  value: string;
  supporting?: string;
};

type DiagnosisSharePanelProps = DiagnosisShareData & {
  source: string;
  insightLabel?: DiagnosisInsightLabel;
  emailDiagnosis: DiagnosisEmailInput;
  details?: DiagnosisShareDetail[];
  flightShape?: BallFlightChartShape | null;
  profileLabel?: string;
  recommendation?: DiagnosisShareRecommendation | null;
  analyticsContext?: {
    pattern?: string;
    strike?: string;
    category?: string;
  };
};

type ActionStatus =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | { kind: "fallback"; message: string };

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const DEFAULT_PROFILE_LABEL = "MY SHOT PROFILE";

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const fitToken = (token: string, width: number) => {
    if (context.measureText(token).width <= width) return token;
    let fitted = "";
    for (const character of Array.from(token)) {
      if (context.measureText(`${fitted}${character}…`).width > width) break;
      fitted += character;
    }
    return `${fitted}…`;
  };

  const words = text.split(/\s+/).map((word) => fitToken(word, maxWidth));
  const lines: string[] = [];
  let line = "";
  let truncated = false;

  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);
    if (lines.length === maxLines) {
      truncated = true;
      break;
    }
    line = word;
    if (index === words.length - 1) continue;
    if (lines.length === maxLines - 1) {
      truncated = true;
      break;
    }
  }

  if (line && lines.length < maxLines) lines.push(line);
  if (truncated && lines.length) {
    lines[lines.length - 1] = fitToken(
      `${lines[lines.length - 1].replace(/…?$/, "")}…`,
      maxWidth,
    );
  }

  lines.forEach((entry, index) => context.fillText(entry, x, startY + index * lineHeight));
  return startY + lines.length * lineHeight;
}

async function createDiagnosisCard(
  data: DiagnosisShareData,
  insightLabel: DiagnosisInsightLabel,
  details: DiagnosisShareDetail[],
  flightShape: BallFlightChartShape | null,
  profileLabel: string,
  recommendation: DiagnosisShareRecommendation | null,
) {
  try {
    await document.fonts?.ready;
  } catch {
    // Continue with the browser's resolved fallback font.
  }

  const fontFamily = getComputedStyle(document.body).fontFamily || "Arial, sans-serif";
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the result card.");

  context.fillStyle = "#eef2f7";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#dbe3ec";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(38, 38, CARD_WIDTH - 76, CARD_HEIGHT - 76, 34);
  context.fill();
  context.stroke();

  context.textBaseline = "top";
  context.fillStyle = "#64748b";
  context.font = `700 16px ${fontFamily}`;
  context.fillText(`DOVE GOLF · ${profileLabel.toUpperCase()}`, 78, 70);
  context.textAlign = "right";
  context.fillText("TRY YOURS → DOVEGOLF.FIT", 1122, 70);
  context.textAlign = "left";

  context.fillStyle = "#0f172a";
  context.font = `700 43px ${fontFamily}`;
  wrapCanvasText(context, data.miss, 78, 108, 1044, 48, 2);

  const detailStartY = 206;
  const detailGap = 10;
  const detailWidth = (1044 - detailGap * 2) / 3;
  const detailHeight = 48;
  context.font = `700 11px ${fontFamily}`;
  details.slice(0, 6).forEach((detail, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = 78 + column * (detailWidth + detailGap);
    const y = detailStartY + row * (detailHeight + detailGap);
    context.fillStyle = "#f8fafc";
    context.strokeStyle = "#e2e8f0";
    context.beginPath();
    context.roundRect(x, y, detailWidth, detailHeight, 14);
    context.fill();
    context.stroke();
    context.fillStyle = "#64748b";
    context.fillText(detail.label.toUpperCase(), x + 14, y + 8);
    context.fillStyle = "#1e293b";
    context.font = `600 14px ${fontFamily}`;
    wrapCanvasText(context, detail.value, x + 14, y + 24, detailWidth - 28, 17, 1);
    context.font = `700 11px ${fontFamily}`;
  });

  const contentY = details.length > 3 ? 328 : details.length ? 270 : 206;
  const contentHeight = details.length > 3 ? 176 : details.length ? 234 : 298;
  const chartX = 70;
  const chartWidth = flightShape ? 596 : 0;

  if (flightShape) {
    const chartY = contentY;
    const chartHeight = contentHeight;
    const geometry = getBallFlightChartPathGeometry({
      shape: flightShape,
      width: chartWidth,
      height: chartHeight,
    });

    context.fillStyle = "#f8fafc";
    context.strokeStyle = "#e2e8f0";
    context.lineWidth = 2;
    context.beginPath();
    context.roundRect(chartX, chartY, chartWidth, chartHeight, 22);
    context.fill();
    context.stroke();

    context.save();
    context.translate(chartX, chartY);
    context.strokeStyle = "#cbd5e1";
    context.lineWidth = 2;
    context.setLineDash([5, 7]);
    context.beginPath();
    context.moveTo(chartWidth * 0.5, chartHeight * 0.06);
    context.lineTo(chartWidth * 0.5, geometry.startY);
    context.stroke();

    context.strokeStyle = "#0f172a";
    context.lineWidth = 5;
    context.setLineDash([2, 12]);
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(geometry.startX, geometry.startY);
    context.bezierCurveTo(
      geometry.cp1X,
      geometry.cp1Y,
      geometry.cp2X,
      geometry.cp2Y,
      geometry.endX,
      geometry.endY,
    );
    context.stroke();

    context.setLineDash([]);
    context.fillStyle = "#ffffff";
    context.strokeStyle = "#0f172a";
    context.lineWidth = 3;
    context.beginPath();
    context.arc(geometry.endX, geometry.endY, 9, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

  const insightX = flightShape ? 686 : 78;
  const insightWidth = flightShape ? 436 : 1044;
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#e2e8f0";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(insightX, contentY, insightWidth, contentHeight, 22);
  context.fill();
  context.stroke();

  context.fillStyle = "#64748b";
  context.font = `700 12px ${fontFamily}`;
  context.fillText(insightLabel.toUpperCase(), insightX + 22, contentY + 18);
  context.fillStyle = "#1e293b";
  context.font = `500 18px ${fontFamily}`;
  const insightEndY = wrapCanvasText(
    context,
    data.likelyCause,
    insightX + 22,
    contentY + 42,
    insightWidth - 44,
    25,
    recommendation ? 3 : 5,
  );

  if (recommendation) {
    const recommendationY = Math.max(insightEndY + 9, contentY + contentHeight - 62);
    context.fillStyle = "#f1f5f9";
    context.beginPath();
    context.roundRect(insightX + 16, recommendationY, insightWidth - 32, 48, 14);
    context.fill();
    context.fillStyle = "#64748b";
    context.font = `700 10px ${fontFamily}`;
    context.fillText(recommendation.label.toUpperCase(), insightX + 30, recommendationY + 7);
    context.fillStyle = "#0f172a";
    context.font = `700 15px ${fontFamily}`;
    wrapCanvasText(
      context,
      recommendation.supporting
        ? `${recommendation.value} · ${recommendation.supporting}`
        : recommendation.value,
      insightX + 30,
      recommendationY + 23,
      insightWidth - 60,
      18,
      1,
    );
  }

  context.strokeStyle = "#e2e8f0";
  context.beginPath();
  context.moveTo(78, 526);
  context.lineTo(1122, 526);
  context.stroke();
  context.fillStyle = "#64748b";
  context.font = `700 11px ${fontFamily}`;
  context.fillText("NEXT RANGE TEST", 78, 544);
  context.fillStyle = "#334155";
  context.font = `500 15px ${fontFamily}`;
  wrapCanvasText(context, data.rangePlan, 78, 562, 1044, 18, 1);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Unable to create the result card."))),
      "image/png",
      0.94,
    );
  });
}

function filenameFor(miss: string) {
  const slug = miss
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `dovegolf-${slug || "diagnosis"}.png`;
}

export function DiagnosisSharePanel({
  miss,
  likelyCause,
  rangePlan,
  shareUrl,
  source,
  insightLabel = "Leading hypothesis",
  emailDiagnosis,
  details = [],
  flightShape = null,
  profileLabel = DEFAULT_PROFILE_LABEL,
  recommendation = null,
  analyticsContext = {},
}: DiagnosisSharePanelProps) {
  const data = useMemo(
    () => normalizeDiagnosisShareData({ miss, likelyCause, rangePlan, shareUrl }),
    [likelyCause, miss, rangePlan, shareUrl],
  );
  const normalizedDetails = useMemo(
    () =>
      details.slice(0, 6).map((detail) => ({
        label: normalizeShareText(detail.label, "Observation").slice(0, 28),
        value: normalizeShareText(detail.value, "Not measured").slice(0, 72),
      })),
    [details],
  );
  const normalizedRecommendation = useMemo(
    () =>
      recommendation
        ? {
            label: normalizeShareText(recommendation.label, "Recommendation").slice(0, 36),
            value: normalizeShareText(recommendation.value, "Compare options").slice(0, 100),
            supporting: recommendation.supporting
              ? normalizeShareText(recommendation.supporting, "").slice(0, 120)
              : undefined,
          }
        : null,
    [recommendation],
  );
  const normalizedProfileLabel = normalizeShareText(profileLabel, "My shot profile").slice(0, 40);
  const shareText = useMemo(() => {
    const base = buildDiagnosisShareText(data, insightLabel);
    if (!normalizedDetails.length) return base;
    const observations = normalizedDetails
      .map((detail) => `${detail.label}: ${detail.value}`)
      .join(" · ");
    const recommendationText = normalizedRecommendation
      ? `\n\n${normalizedRecommendation.label}: ${normalizedRecommendation.value}`
      : "";
    return `${base}\n\nProfile inputs: ${observations}${recommendationText}`;
  }, [data, insightLabel, normalizedDetails, normalizedRecommendation]);
  const [actionStatus, setActionStatus] = useState<ActionStatus>({ kind: "idle", message: "" });
  const [emailStatus, setEmailStatus] = useState<ActionStatus>({ kind: "idle", message: "" });
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const analyticsParams = {
    source,
    ...analyticsContext,
  };

  useEffect(() => {
    let cancelled = false;
    setShareFile(null);

    createDiagnosisCard(
      data,
      insightLabel,
      normalizedDetails,
      flightShape,
      normalizedProfileLabel,
      normalizedRecommendation,
    )
      .then((blob) => {
        if (!cancelled) {
          setShareFile(new File([blob], filenameFor(data.miss), { type: "image/png" }));
        }
      })
      .catch(() => {
        // Native text sharing and download remain available if pre-generation fails.
      });

    return () => {
      cancelled = true;
    };
  }, [
    data,
    flightShape,
    insightLabel,
    normalizedDetails,
    normalizedProfileLabel,
    normalizedRecommendation,
  ]);

  async function handleShare() {
    setSharing(true);
    setActionStatus({ kind: "idle", message: "" });
    track("dov_diagnosis_share_opened", analyticsParams);

    try {
      const fileShareData = shareFile
        ? {
            title: "My DoveGolf diagnosis",
            text: shareText,
            files: [shareFile],
          }
        : null;

      if (
        navigator.share &&
        fileShareData &&
        (!navigator.canShare || navigator.canShare(fileShareData))
      ) {
        await navigator.share(fileShareData);
        setActionStatus({ kind: "success", message: "Diagnosis card shared." });
        track("dov_diagnosis_shared", { ...analyticsParams, method: "native_card" });
      } else if (navigator.share) {
        await navigator.share({ title: "My DoveGolf diagnosis", text: shareText, url: data.shareUrl });
        setActionStatus({ kind: "success", message: "Diagnosis shared." });
        track("dov_diagnosis_shared", { ...analyticsParams, method: "native_link" });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setActionStatus({ kind: "success", message: "Diagnosis and link copied." });
        track("dov_diagnosis_shared", { ...analyticsParams, method: "clipboard" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the diagnosis below." });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setActionStatus({ kind: "idle", message: "" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the diagnosis below." });
        track("dov_diagnosis_share_failed", { ...analyticsParams, reason_code: "share_unavailable" });
      }
    } finally {
      setSharing(false);
    }
  }

  async function handleDownload() {
    setSharing(true);
    setActionStatus({ kind: "idle", message: "" });

    try {
      const blob = await createDiagnosisCard(
      data,
      insightLabel,
      normalizedDetails,
      flightShape,
      normalizedProfileLabel,
      normalizedRecommendation,
    );
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filenameFor(data.miss);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setActionStatus({ kind: "success", message: "Diagnosis image downloaded." });
      track("dov_diagnosis_card_downloaded", analyticsParams);
    } catch {
      setActionStatus({ kind: "error", message: "The image could not be created. Please try again." });
    } finally {
      setSharing(false);
    }
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setEmailStatus({ kind: "idle", message: "" });
    track("dov_diagnosis_email_requested", analyticsParams);

    try {
      const response = await fetch("/api/email-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaVersion: 1,
          email,
          website: "",
          diagnosis: emailDiagnosis,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to send this email.");
      }

      setEmailStatus({ kind: "success", message: "Your diagnosis and range plan are on the way." });
      track("dov_diagnosis_email_sent", analyticsParams);
    } catch {
      setEmailStatus({
        kind: "error",
        message: "We could not send the email right now. Please try again in a few minutes.",
      });
      track("dov_diagnosis_email_failed", { ...analyticsParams, reason_code: "request_failed" });
    } finally {
      setSending(false);
    }
  }

  const displayUrl = data.shareUrl.replace(/^https:\/\//, "");

  return (
    <section
      aria-labelledby={`share-diagnosis-title-${source}`}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Save or share</p>
        <h3 id={`share-diagnosis-title-${source}`} className="mt-3 text-2xl font-semibold tracking-tight">
          Your portable result
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Your personalized post is ready. On a phone, one tap opens the native share sheet with the image attached.
        </p>
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing}
          aria-busy={sharing}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
        >
          {sharing ? "Preparing…" : "Share my diagnosis to social apps"}
        </button>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Choose Instagram, TikTok, Facebook, Messages, or any installed app from your device share sheet.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
        <div className="grid min-w-0">
          {flightShape ? (
            <div className="min-h-72 border-b border-slate-200 bg-white p-5 sm:min-h-[25rem] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Your shot shape
                </p>
                <p className="text-xs font-medium text-slate-400">Right-handed view</p>
              </div>
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute right-2 top-1 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400"
                >
                  <span className="size-1.5 rounded-full bg-slate-500 motion-safe:animate-pulse" />
                  Flight replay
                </span>
                <BallFlightChart shape={flightShape} className="mx-auto mt-5 w-full max-w-2xl" />
              </div>
            </div>
          ) : null}

          <div className="min-w-0 p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Observed pattern
            </p>
            <p className="mt-3 break-words text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              {data.miss}
            </p>

            {normalizedDetails.length ? (
              <dl className="mt-5 grid gap-2 sm:grid-cols-2">
                {normalizedDetails.map((detail) => (
                  <div
                    key={`${detail.label}-${detail.value}`}
                    className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {detail.label}
                    </dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {normalizedRecommendation ? (
              <div className="mt-5 rounded-2xl bg-slate-900 p-4 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {normalizedRecommendation.label}
                </p>
                <p className="mt-2 text-lg font-semibold leading-7">{normalizedRecommendation.value}</p>
                {normalizedRecommendation.supporting ? (
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {normalizedRecommendation.supporting}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                {insightLabel}
              </p>
              <p className="mt-2 break-words text-base leading-7 text-slate-700 sm:text-lg">
                {data.likelyCause}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                Your next range test
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{data.rangePlan}</p>
            </div>

            <a
              href={data.shareUrl}
              className="mt-6 block max-w-full break-all text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4"
            >
              {displayUrl}
            </a>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={sharing}
          aria-label="Download diagnosis image, PNG, 1200 by 630 pixels"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
        >
          Download result card (backup)
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Download is optional; social sharing works directly from the button above.
        </p>
      </div>

      {actionStatus.message ? (
        <p
          role={actionStatus.kind === "error" ? "alert" : "status"}
          className="mt-3 text-sm text-slate-600"
        >
          {actionStatus.message}
        </p>
      ) : null}
      {actionStatus.kind === "fallback" ? (
        <textarea
          readOnly
          value={shareText}
          onFocus={(event) => event.currentTarget.select()}
          aria-label="Diagnosis text to copy"
          className="mt-3 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
        />
      ) : null}

      <form onSubmit={handleEmail} className="mt-8 border-t border-slate-200 pt-8">
        <h4 className="text-lg font-semibold">Take the plan to the range</h4>
        <p id={`diagnosis-email-help-${source}`} className="mt-2 text-sm leading-6 text-slate-600">
          We’ll send this diagnosis and its range test in one transactional email. This does not subscribe you to
          marketing.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <label htmlFor={`diagnosis-email-${source}`} className="text-sm font-medium text-slate-900">
              Email address
            </label>
            <input
              id={`diagnosis-email-${source}`}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-describedby={`diagnosis-email-help-${source}`}
              className="mt-2 min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            aria-busy={sending}
            className="inline-flex min-h-12 w-full items-center justify-center self-end rounded-2xl border border-slate-900 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
          >
            {sending ? "Sending…" : "Send me my diagnosis and range plan"}
          </button>
        </div>
        {emailStatus.message ? (
          <p
            role={emailStatus.kind === "error" ? "alert" : "status"}
            className="mt-3 text-sm text-slate-600"
          >
            {emailStatus.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
