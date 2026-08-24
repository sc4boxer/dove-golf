"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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
    const recommendationY = Math.max(insightEndY + 9, contentY + contentHeight - 74);
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
  context.moveTo(78, 516);
  context.lineTo(1122, 516);
  context.stroke();
  context.fillStyle = "#64748b";
  context.font = `700 11px ${fontFamily}`;
  context.fillText("NEXT RANGE TEST", 78, 532);
  context.fillStyle = "#334155";
  context.font = `500 15px ${fontFamily}`;
  wrapCanvasText(context, data.rangePlan, 78, 550, 1044, 17, 2);

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
          <p className="text-xs text-slate-400">1200 × 630 social card</p>
        </div>
        <div className="mt-3 aspect-[1200/630] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
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
          aria-label="Download result image, PNG, 1200 by 630 pixels"
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
