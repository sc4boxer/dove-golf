"use client";

import { type FormEvent, useMemo, useState } from "react";
import { track } from "@/lib/analytics/ga";
import {
  buildDiagnosisShareText,
  normalizeDiagnosisShareData,
  type DiagnosisShareData,
} from "@/lib/share/diagnosisShare";

type DiagnosisSharePanelProps = DiagnosisShareData & {
  source: string;
};

type ActionStatus =
  | { kind: "idle"; message: "" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | { kind: "fallback"; message: string };

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }

    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines - 1) break;
  }

  if (line && lines.length < maxLines) lines.push(line);
  const consumedWords = lines.join(" ").split(/\s+/).length;
  if (consumedWords < words.length) {
    const finalIndex = lines.length - 1;
    lines[finalIndex] = `${lines[finalIndex].replace(/[.,;:]?$/, "")}…`;
  }

  lines.forEach((entry, index) => context.fillText(entry, x, startY + index * lineHeight));
  return startY + lines.length * lineHeight;
}

async function createDiagnosisCard(data: DiagnosisShareData) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the result card.");

  context.fillStyle = "#f8fafc";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  context.fillStyle = "#ffffff";
  context.strokeStyle = "#e2e8f0";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(48, 48, CARD_WIDTH - 96, CARD_HEIGHT - 96, 32);
  context.fill();
  context.stroke();

  context.textBaseline = "top";
  context.fillStyle = "#64748b";
  context.font = "600 20px Arial, sans-serif";
  context.fillText("DOVE GOLF · YOUR DIAGNOSIS", 96, 92);

  context.fillStyle = "#64748b";
  context.font = "700 16px Arial, sans-serif";
  context.fillText("MISS", 96, 156);
  context.fillStyle = "#0f172a";
  context.font = "700 48px Arial, sans-serif";
  const causeLabelY = wrapCanvasText(context, data.miss, 96, 188, 1008, 58, 2) + 28;

  context.fillStyle = "#64748b";
  context.font = "700 16px Arial, sans-serif";
  context.fillText("LIKELY CAUSE", 96, causeLabelY);
  context.fillStyle = "#334155";
  context.font = "400 28px Arial, sans-serif";
  wrapCanvasText(context, data.likelyCause, 96, causeLabelY + 34, 1008, 40, 3);

  context.strokeStyle = "#e2e8f0";
  context.beginPath();
  context.moveTo(96, 500);
  context.lineTo(1104, 500);
  context.stroke();

  context.fillStyle = "#0f172a";
  context.font = "700 22px Arial, sans-serif";
  context.fillText("dovegolf.fit", 96, 528);
  context.fillStyle = "#64748b";
  context.font = "400 18px Arial, sans-serif";
  context.textAlign = "right";
  context.fillText("Observe · test · improve", 1104, 531);
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
}: DiagnosisSharePanelProps) {
  const data = useMemo(
    () => normalizeDiagnosisShareData({ miss, likelyCause, rangePlan, shareUrl }),
    [likelyCause, miss, rangePlan, shareUrl],
  );
  const shareText = useMemo(() => buildDiagnosisShareText(data), [data]);
  const [actionStatus, setActionStatus] = useState<ActionStatus>({ kind: "idle", message: "" });
  const [emailStatus, setEmailStatus] = useState<ActionStatus>({ kind: "idle", message: "" });
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleShare() {
    setSharing(true);
    setActionStatus({ kind: "idle", message: "" });
    track("dov_diagnosis_share_opened", { source });

    try {
      const blob = await createDiagnosisCard(data);
      const file = new File([blob], filenameFor(data.miss), { type: "image/png" });
      const shareData = { title: "My DoveGolf diagnosis", text: shareText, url: data.shareUrl, files: [file] };

      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
        setActionStatus({ kind: "success", message: "Diagnosis shared." });
        track("dov_diagnosis_shared", { source, method: "native_card" });
      } else if (navigator.share) {
        await navigator.share({ title: "My DoveGolf diagnosis", text: shareText, url: data.shareUrl });
        setActionStatus({ kind: "success", message: "Diagnosis shared." });
        track("dov_diagnosis_shared", { source, method: "native_link" });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setActionStatus({ kind: "success", message: "Diagnosis and link copied." });
        track("dov_diagnosis_shared", { source, method: "clipboard" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the diagnosis below." });
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setActionStatus({ kind: "idle", message: "" });
      } else {
        setActionStatus({ kind: "fallback", message: "Copy the diagnosis below." });
        track("dov_diagnosis_share_failed", { source, reason_code: "share_unavailable" });
      }
    } finally {
      setSharing(false);
    }
  }

  async function handleDownload() {
    setSharing(true);
    setActionStatus({ kind: "idle", message: "" });

    try {
      const blob = await createDiagnosisCard(data);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filenameFor(data.miss);
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setActionStatus({ kind: "success", message: "Diagnosis image downloaded." });
      track("dov_diagnosis_card_downloaded", { source });
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
    track("dov_diagnosis_email_requested", { source });

    try {
      const response = await fetch("/api/email-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaVersion: 1,
          email,
          source,
          website: "",
          diagnosis: data,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Unable to send this email.");
      }

      setEmailStatus({ kind: "success", message: "Your diagnosis and range plan are on the way." });
      track("dov_diagnosis_email_sent", { source });
    } catch {
      setEmailStatus({
        kind: "error",
        message: "We could not send the email right now. Please try again in a few minutes.",
      });
      track("dov_diagnosis_email_failed", { source, reason_code: "request_failed" });
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
          Take your diagnosis with you
        </h3>
      </div>

      <div className="mt-5 min-h-56 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:aspect-[40/21] sm:min-h-0 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Your diagnosis</p>
        <div className="mt-6 grid min-w-0 gap-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Miss</p>
            <p className="mt-2 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {data.miss}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Likely cause</p>
            <p className="mt-2 break-words leading-7 text-slate-700">{data.likelyCause}</p>
          </div>
        </div>
        <a
          href={data.shareUrl}
          className="mt-7 inline-flex text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4"
        >
          {displayUrl}
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleShare}
          disabled={sharing}
          aria-busy={sharing}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50 sm:w-auto"
        >
          {sharing ? "Preparing…" : "Share my diagnosis"}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          disabled={sharing}
          aria-label="Download diagnosis image, PNG, 1200 by 630 pixels"
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 disabled:opacity-50 sm:w-auto"
        >
          Download result card
        </button>
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
