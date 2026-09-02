"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics/ga";
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
  embedded?: boolean;
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

// Instagram's recommended portrait feed ratio. Keeping this at the final export
// size avoids an extra resize pass (and soft type) when the image is uploaded.
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
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

  const ink = "#111827";
  const muted = "#667085";
  const line = "#d9dfda";
  const paper = "#f5f5f0";
  const white = "#ffffff";
  const sage = "#315d4b";
  const softSage = "#e8efe9";
  const cardX = 54;
  const cardWidth = CARD_WIDTH - cardX * 2;
  const contentX = 94;
  const contentWidth = CARD_WIDTH - contentX * 2;

  context.fillStyle = paper;
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  context.fillStyle = white;
  context.strokeStyle = line;
  context.lineWidth = 1.5;
  context.beginPath();
  context.roundRect(cardX, 54, cardWidth, CARD_HEIGHT - 108, 38);
  context.fill();
  context.stroke();

  context.textBaseline = "top";
  context.fillStyle = sage;
  context.beginPath();
  context.arc(contentX + 7, 102, 7, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = ink;
  context.font = `700 17px ${fontFamily}`;
  context.fillText("DOVE GOLF", contentX + 28, 91);
  context.fillStyle = muted;
  context.font = `700 13px ${fontFamily}`;
  context.fillText(profileLabel.toUpperCase(), contentX, 130);
  context.textAlign = "right";
  context.fillStyle = muted;
  context.font = `600 14px ${fontFamily}`;
  context.fillText("DOVEGOLF.FIT", CARD_WIDTH - contentX, 94);
  context.textAlign = "left";

  context.fillStyle = ink;
  context.font = `700 56px ${fontFamily}`;
  wrapCanvasText(context, data.miss, contentX, 166, contentWidth, 64, 2);

  const detailStartY = 308;
  const detailGap = 12;
  const detailWidth = (contentWidth - detailGap * 2) / 3;
  const detailHeight = 72;
  context.font = `700 14px ${fontFamily}`;
  details.slice(0, 6).forEach((detail, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = contentX + column * (detailWidth + detailGap);
    const y = detailStartY + row * (detailHeight + detailGap);
    context.fillStyle = paper;
    context.strokeStyle = line;
    context.beginPath();
    context.roundRect(x, y, detailWidth, detailHeight, 16);
    context.fill();
    context.stroke();
    context.fillStyle = muted;
    context.fillText(detail.label.toUpperCase(), x + 16, y + 12);
    context.fillStyle = ink;
    context.font = `600 20px ${fontFamily}`;
    wrapCanvasText(context, detail.value, x + 16, y + 37, detailWidth - 32, 22, 1);
    context.font = `700 14px ${fontFamily}`;
  });

  const detailRows = Math.ceil(Math.min(details.length, 6) / 3);
  const contentY = details.length
    ? detailStartY + detailRows * detailHeight + Math.max(0, detailRows - 1) * detailGap + 24
    : detailStartY;
  const chartX = contentX;
  const chartWidth = contentWidth;
  const chartHeight = flightShape ? (details.length > 3 ? 260 : 294) : 0;

  if (flightShape) {
    const chartY = contentY;
    const geometry = getBallFlightChartPathGeometry({
      shape: flightShape,
      width: chartWidth,
      height: chartHeight,
    });

    context.fillStyle = paper;
    context.strokeStyle = line;
    context.lineWidth = 1.5;
    context.beginPath();
    context.roundRect(chartX, chartY, chartWidth, chartHeight, 24);
    context.fill();
    context.stroke();

    context.fillStyle = muted;
    context.font = `700 14px ${fontFamily}`;
    context.fillText("YOUR BALL FLIGHT", chartX + 20, chartY + 18);

    context.save();
    context.translate(chartX, chartY);
    context.strokeStyle = "#c7d0ca";
    context.lineWidth = 2;
    context.setLineDash([6, 9]);
    context.beginPath();
    context.moveTo(chartWidth * 0.5, chartHeight * 0.06);
    context.lineTo(chartWidth * 0.5, geometry.startY);
    context.stroke();

    context.strokeStyle = sage;
    context.lineWidth = 7;
    context.setLineDash([2, 15]);
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
    context.fillStyle = white;
    context.strokeStyle = sage;
    context.lineWidth = 3;
    context.beginPath();
    context.arc(geometry.endX, geometry.endY, 9, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

  const insightX = contentX;
  const insightWidth = contentWidth;
  const insightY = flightShape ? contentY + chartHeight + 18 : contentY;
  const remainingBeforeFooter = 1120 - insightY;
  const insightHeight = Math.max(190, remainingBeforeFooter);
  context.fillStyle = softSage;
  context.strokeStyle = "#cedbd2";
  context.lineWidth = 1.5;
  context.beginPath();
  context.roundRect(insightX, insightY, insightWidth, insightHeight, 24);
  context.fill();
  context.stroke();

  context.fillStyle = sage;
  context.font = `700 14px ${fontFamily}`;
  context.fillText(insightLabel.toUpperCase(), insightX + 24, insightY + 22);
  context.fillStyle = ink;
  context.font = `500 26px ${fontFamily}`;
  const insightEndY = wrapCanvasText(
    context,
    data.likelyCause,
    insightX + 24,
    insightY + 52,
    insightWidth - 48,
    34,
    recommendation ? 3 : 5,
  );

  if (recommendation) {
    const recommendationY = Math.max(insightEndY + 15, insightY + insightHeight - 82);
    context.fillStyle = white;
    context.beginPath();
    context.roundRect(insightX + 16, recommendationY, insightWidth - 32, 64, 16);
    context.fill();
    context.fillStyle = muted;
    context.font = `700 12px ${fontFamily}`;
    context.fillText(recommendation.label.toUpperCase(), insightX + 32, recommendationY + 10);
    context.fillStyle = ink;
    context.font = `700 19px ${fontFamily}`;
    wrapCanvasText(
      context,
      recommendation.supporting
        ? `${recommendation.value} · ${recommendation.supporting}`
        : recommendation.value,
      insightX + 32,
      recommendationY + 33,
      insightWidth - 64,
      22,
      1,
    );
  }

  context.strokeStyle = line;
  context.beginPath();
  context.moveTo(contentX, 1148);
  context.lineTo(CARD_WIDTH - contentX, 1148);
  context.stroke();
  context.fillStyle = sage;
  context.font = `700 14px ${fontFamily}`;
  context.fillText("NEXT RANGE TEST", contentX, 1174);
  context.fillStyle = ink;
  context.font = `600 21px ${fontFamily}`;
  wrapCanvasText(context, data.rangePlan, contentX, 1205, contentWidth, 28, 2);

  context.fillStyle = muted;
  context.font = `600 15px ${fontFamily}`;
  context.fillText("THE BALL LEFT YOU A MESSAGE.", contentX, 1272);
  context.textAlign = "right";
  context.fillStyle = sage;
  context.fillText("TRY YOURS → DOVEGOLF.FIT", CARD_WIDTH - contentX, 1272);
  context.textAlign = "left";

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
  embedded = false,
  insightLabel = "Leading hypothesis",
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
  const [sharing, setSharing] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const [cardReady, setCardReady] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const analyticsParams = {
    source,
    ...analyticsContext,
  };

  useEffect(() => {
    let cancelled = false;
    setShareFile(null);
    setCardReady(false);

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
      })
      .finally(() => {
        if (!cancelled) setCardReady(true);
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

  useEffect(() => {
    if (!shareFile) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(shareFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [shareFile]);

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
        navigator.canShare?.(fileShareData) === true
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

  async function handleShareLink() {
    setSharing(true);
    setActionStatus({ kind: "idle", message: "" });

    try {
      if (navigator.share) {
        await navigator.share({ title: "My DoveGolf result", text: shareText, url: data.shareUrl });
        setActionStatus({ kind: "success", message: "Result link shared." });
        track("dov_diagnosis_shared", { ...analyticsParams, method: "native_link" });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setActionStatus({ kind: "success", message: "Result and link copied." });
        track("dov_diagnosis_shared", { ...analyticsParams, method: "clipboard" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the result below." });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setActionStatus({ kind: "idle", message: "" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the result below." });
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <section
      aria-labelledby={`share-diagnosis-title-${source}`}
      className={
        embedded
          ? "bg-white"
          : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      }
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Save or share</p>
        <h3 id={`share-diagnosis-title-${source}`} className="mt-3 text-2xl font-semibold tracking-tight">
          Your portable result
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          This is the exact card friends will see. On a phone, one tap opens the native share sheet with the image attached.
        </p>
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing || !cardReady}
          aria-busy={!cardReady || sharing}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
        >
          {sharing
            ? "Preparing…"
            : !cardReady
              ? "Building your share card…"
              : shareFile
                ? "Share my diagnosis to social apps"
                : "Share my result link"}
        </button>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Choose Instagram, TikTok, Facebook, Messages, Mail, or another installed app.
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Share preview</p>
          <p className="text-xs text-slate-400">1080 × 1350 Instagram portrait</p>
        </div>
        <div className="mx-auto mt-3 aspect-[4/5] w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt={`${data.miss} DoveGolf result card with observations, interpretation, recommendation, and next range test`}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              unoptimized
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
              Building your personalized result card…
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={sharing || !cardReady}
          aria-label="Download result image, PNG, 1080 by 1350 pixels"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
        >
          Download result card (backup)
        </button>
        <p className="text-xs leading-5 text-slate-500">
          Download is optional; direct social sharing is the primary path.
        </p>
      </div>

      {actionStatus.message ? (
        <p role={actionStatus.kind === "error" ? "alert" : "status"} className="mt-3 text-sm text-slate-600">
          {actionStatus.message}
        </p>
      ) : null}
      {actionStatus.kind === "fallback" ? (
        <div className="mt-3 space-y-3">
          <button
            type="button"
            onClick={handleShareLink}
            disabled={sharing}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
          >
            Share link instead
          </button>
          <textarea
            readOnly
            value={shareText}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="Result text to copy"
            className="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
          />
        </div>
      ) : null}

      <div className="mt-8 border-t border-slate-200 pt-8">
        <h4 className="text-lg font-semibold">Take the plan to the range</h4>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Send the result through Mail or Messages without giving DoveGolf your email address.
        </p>
        <button
          type="button"
          onClick={handleShareLink}
          disabled={sharing}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-900 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
        >
          Send me my diagnosis and range plan
        </button>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Opens your device share sheet; choose Mail or Messages. No marketing signup.
        </p>
      </div>
    </section>
  );
}
