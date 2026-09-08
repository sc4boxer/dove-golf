"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import { autoTrackBallInVideo, type TrackResult } from "@/lib/range-rescue/local-ball-tracking";
import styles from "./ShotReplay.module.css";

type Sample = "air" | "contact" | "miss" | "unsure";
type Props = { sample: Sample; club?: "iron" | "driver"; allowSamples?: boolean; onSourceChange?: (source: "sample" | "local") => void };

const descriptions: Record<Sample, string> = {
  air: "Sample: the ball lifts above the ground. The line illustrates its visible flight.",
  contact: "Sample: the ball moves forward along the ground.",
  miss: "Missed-ball example: the club passes the ball, which stays in place.",
  unsure: "Sample: the ball is lost from view. There is no reliable trace or outcome to show.",
};

export default function ShotReplay({ sample, club = "iron", allowSamples = true, onSourceChange }: Props) {
  const id = useId();
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [local, setLocal] = useState<{ url: string; name: string } | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const objectUrl = useRef<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const progressRef = useRef(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureInput = useRef<HTMLInputElement>(null);
  const trackingRef = useRef<AbortController | null>(null);
  const autoStarted = useRef<string | null>(null);
  const retryButtonRef = useRef<HTMLButtonElement>(null);
  const [busy, setBusy] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const [trackMessage, setTrackMessage] = useState("");

  // All samples start paused, including when reduced motion is requested.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous: number | null = null;
    const tick = (time: number) => {
      const delta = previous === null ? 0 : time - previous;
      previous = time;
      const next = Math.min(100, progressRef.current + delta / 45);
      progressRef.current = next;
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => () => {
    trackingRef.current?.abort();
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  useEffect(() => {
    if (!local || ready) return;
    const timer = window.setTimeout(() => {
      if (objectUrl.current !== local.url) return;
      URL.revokeObjectURL(local.url);
      objectUrl.current = null;
      setLocal(null);
      setError("This video took too long to open. Try a shorter MP4 clip, or record your outcome without video.");
      if (fileInput.current) fileInput.current.value = "";
    }, 15000);
    return () => window.clearTimeout(timer);
  }, [local, ready]);

  function clearLocal() {
    trackingRef.current?.abort();
    trackingRef.current = null;
    autoStarted.current = null;
    setBusy(false);
    setTrackResult(null);
    setTrackMessage("");
    setTrackProgress(0);
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setLocal(null);
    setReady(false);
    setError("");
    if (fileInput.current) fileInput.current.value = "";
    if (captureInput.current) captureInput.current.value = "";
    onSourceChange?.("sample");
  }

  async function trackClip(loadedVideo?: HTMLVideoElement) {
    const video = loadedVideo ?? videoRef.current;
    if (!video || trackingRef.current || (!loadedVideo && !ready)) return;
    const controller = new AbortController();
    trackingRef.current = controller;


    setBusy(true);
    setTrackProgress(0);
    setTrackResult(null);
    setTrackMessage("");
    try {
      const options = { signal: controller.signal, onProgress: (value: number) => {
        if (trackingRef.current === controller && !controller.signal.aborted) setTrackProgress(value);
      } };
      const result = await autoTrackBallInVideo(video, options);
      if (trackingRef.current === controller && !controller.signal.aborted) {
        setTrackResult(result.track);
        setTrackMessage(result.track ? "" : "We couldn’t find a clear shot moment. Replay the clip and choose what you saw, or try another video.");
      }
    } catch {
      if (trackingRef.current === controller && !controller.signal.aborted) setTrackMessage("We couldn’t check this clip. You can still replay it and choose what you saw, or try another video.");
    } finally {
      if (trackingRef.current === controller) { trackingRef.current = null; setBusy(false); }
    }
  }

  function failLocal(message: string) {
    clearLocal();
    setError(message);
  }

  function chooseVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    clearLocal();
    if (file.size > 50 * 1024 * 1024) {
      setError("This video is too large. Choose a clip under 50 MB.");
      return;
    }
    if (file.type && !file.type.startsWith("video/")) {
      setError("Choose a video file, such as an MP4 or MOV, and try again.");
      return;
    }
    setPlaying(false);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setLocal({ url, name: file.name });
    onSourceChange?.("local");
  }

  // The club reaches the ball at 38%; every visible launch uses that same moment.
  const flight = Math.max(0, Math.min(1, (progress - 38) / 57));
  const launchY = club === "driver" ? 300 : 308;
  const poses = [
    { at: 0, hands: [267, 253], elbow: [243, 247], tip: [316, launchY] },
    { at: 22, hands: [267, 179], elbow: [248, 190], tip: [207, 137] },
    { at: 38, hands: [267, 253], elbow: [243, 247], tip: [316, sample === "miss" ? launchY - 12 : launchY] },
    { at: 62, hands: [238, 169], elbow: [197, 202], tip: [172, 139] },
    { at: 100, hands: [238, 169], elbow: [197, 202], tip: [172, 139] },
  ];
  const nextPose = poses.findIndex((pose) => pose.at > progress);
  const poseIndex = nextPose === -1 ? poses.length - 1 : nextPose;
  const fromPose = poses[Math.max(0, poseIndex - 1)];
  const toPose = poses[poseIndex];
  const poseAmount = (progress - fromPose.at) / (toPose.at - fromPose.at);
  const interpolate = (from: number[], to: number[]) => from.map((value, index) => value + (to[index] - value) * poseAmount);
  const hands = interpolate(fromPose.hands, toPose.hands);
  const elbow = interpolate(fromPose.elbow, toPose.elbow);
  const tip = interpolate(fromPose.tip, toPose.tip);
  const hasTrace = sample === "air" || sample === "contact";
  const ballX = sample === "air" ? 322 + 76 * flight : 322 + 24 * flight;
  const ballY = sample === "air"
    ? (1 - flight) ** 2 * launchY + 2 * (1 - flight) * flight * -55 + flight ** 2 * 157
    : 308 - 98 * flight - (308 - launchY) * Math.max(0, 1 - flight * 12);
  const tracePoints = Array.from({ length: 61 }, (_, index) => {
    const t = flight * index / 60;
    return sample === "air"
      ? `${322 + 76 * t},${(1 - t) ** 2 * launchY + 2 * (1 - t) * t * -55 + t ** 2 * 157}`
      : `${322 + 24 * t},${308 - 98 * t - (308 - launchY) * Math.max(0, 1 - t * 12)}`;
  }).join(" ");

  return (
    <section className={styles.replay} aria-label="Shot replay">
      <div className={styles.sourceBar}>
        <span className={styles.sourceDot} aria-hidden="true" />
        <span>{!allowSamples ? busy ? "Checking your clip on this device…" : "Automatic video check · no upload" : "Illustrated sample · not measured flight"}</span>
      </div>
      {local ? (
        <div className={styles.localPlayer}>
          <div className={styles.videoStage}>
          <video
            ref={videoRef}
            key={local.url}
            src={local.url}
            controls={!busy}
            playsInline
            preload="auto"
            aria-label={`Local shot replay: ${local.name}`}
            onLoadedMetadata={(event) => {
              if (objectUrl.current !== local.url) return;
              const duration = event.currentTarget.duration;
              if (!Number.isFinite(duration) || duration <= 0 || duration > 30) {
                failLocal("Choose a video up to 30 seconds long. Trim your clip and try again.");
              }
            }}
            onLoadedData={(event) => {
              if (objectUrl.current !== local.url || autoStarted.current === local.url) return;
              setReady(true);
              autoStarted.current = local.url;
              const video = event.currentTarget;
              // Let the decoded first frame reach the player before reading its pixels.
              requestAnimationFrame(() => {
                if (objectUrl.current === local.url && video.isConnected) void trackClip(video);
              });
            }}
            onError={() => {
              if (objectUrl.current === local.url) failLocal("This browser could not play that video. Try an MP4 clip, or record what you saw without a video.");
            }}
          />
          </div>
          {!ready && <p role="status">Checking your video…</p>}
        </div>
      ) : !allowSamples ? (
        <div className={styles.empty}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" aria-hidden="true"><rect x="5" y="9" width="32" height="24" rx="5" stroke="currentColor" strokeWidth="1.5" /><path d="m18 16 8 5-8 5z" fill="currentColor" /></svg>
          <strong>Replay your shot here</strong>
          <p>Record or choose a short clip to review your shot.</p>
        </div>
      ) : (
        <>
          <svg viewBox="0 0 640 360" className={styles.scene} role="img" aria-labelledby={`${id}-title ${id}-desc`}>
            <title id={`${id}-title`}>Illustrated shot from behind the golfer</title>
            <desc id={`${id}-desc`}>{descriptions[sample]} Use the replay controls to move through this example.</desc>
            <defs>
              <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#eaf0f2" /><stop offset="1" stopColor="#f7f9f6" /></linearGradient>
              <linearGradient id={`${id}-grass`} x2="0" y2="1"><stop stopColor="#c6d5bd" /><stop offset="1" stopColor="#a8bea3" /></linearGradient>
            </defs>
            <path fill={`url(#${id}-sky)`} d="M0 0h640v155H0z" />
            <path fill="#d3dfd0" d="M0 140q70-23 135-8t110-5 115 4 135-5 145 11v38H0z" />
            <path fill={`url(#${id}-grass)`} d="M0 155h640v205H0z" />
            <path fill="#b7cbae" d="m288 155-130 205h122l28-205zM370 155l89 205h119L390 155z" opacity=".7" />
            <path d="m-20 335 660-13M40 246l527-5M155 191l338-2" stroke="#e4ebde" strokeWidth="2" opacity=".65" />
            <ellipse cx="425" cy="188" rx="38" ry="7" fill="#96af98" />
            <path d="M428 186v-34l16 5-16 5" fill="#f6f5ec" stroke="#617565" strokeWidth="2" />
            <path d="M0 333 640 332v28H0z" fill="#d6d8d0" />
            <path d="m126 296 213-4 57 68H90z" fill="#627d69" />
            <path d="m137 303 196-4 36 52H111z" fill="#728e78" stroke="#a8bcaa" />
            <ellipse cx="234" cy="330" rx="57" ry="10" fill="#405649" opacity=".25" />
            {club === "driver" && <path d="M322 305v8m-3-8h6" stroke="#e6d1aa" strokeWidth="2" fill="none" />}
            {/* Interpolated poses keep the club movement and ball launch synchronized. */}
            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="m217 267-13 57m33-57 18 55" stroke="#354551" strokeWidth="17" />
              <path d="m201 329 17 1m33-2 16 1" stroke="#f7f8f3" strokeWidth="10" />
              <path d="m218 206-5 59h34l-8-59" fill="#e7ede5" stroke="#d9e2d8" strokeWidth="8" />
              <circle cx="226" cy="188" r="16" fill="#bda28b" />
              <path d="M211 181q5-20 28-7l4 12h-33" fill="#344c43" stroke="#344c43" strokeWidth="3" />
              <path d={`M215 214L${elbow.join(" ")}L${hands.join(" ")}M239 214L${hands.join(" ")}`} stroke="#bda28b" strokeWidth="9" />
              <path d={`M${hands.join(" ")}L${tip.join(" ")}l8 0`} stroke="#66757c" strokeWidth="3" />
              {club === "driver" && <ellipse cx={tip[0] + 4} cy={tip[1]} rx="6" ry="3.5" fill="#354551" />}
            </g>
            {hasTrace && flight > 0 && <>
              <polyline points={tracePoints} stroke="#f8fbeb" strokeWidth="6" fill="none" strokeLinecap="round" />
              <polyline points={tracePoints} stroke="#4a735c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>}
            {(sample !== "unsure" || flight < .1) && <circle cx={hasTrace ? ballX : sample === "unsure" ? 322 + 76 * flight : 322} cy={hasTrace ? ballY : sample === "unsure" ? launchY - 250 * flight : launchY} r="4.5" fill="white" stroke="#48604d" strokeWidth="1.5" />}
            <rect x="18" y="18" width="126" height="28" rx="14" fill="#ffffff" fillOpacity=".9" />
            <text x="31" y="37" fill="#41564c" fontSize="12" fontFamily="system-ui, sans-serif">BEHIND THE GOLFER</text>
          </svg>
          <div className={styles.controls}>
            <button type="button" className={styles.play} onClick={() => {
              if (progress >= 100) { progressRef.current = 0; setProgress(0); }
              setPlaying(!playing);
            }}>{playing ? "Pause" : progress >= 100 ? "Replay" : "Play"}</button>
            <label className={styles.timeline}>
              <span className={styles.srOnly}>Sample replay position</span>
              <input type="range" min="0" max="100" step="1" value={Math.round(progress)} aria-valuetext={`${Math.round(progress)} percent through the illustrated sample`} onChange={(event) => {
                setPlaying(false);
                const value = Number(event.target.value);
                progressRef.current = value;
                setProgress(value);
              }} />
            </label>
            <span className={styles.percentage} aria-hidden="true">{Math.round(progress)}%</span>
          </div>
          <p className={styles.caption}>{descriptions[sample]}</p>
        </>
      )}
      {!allowSamples && <div className={styles.upload}>
        {local && ready && <div className={styles.tracking}>
          <h3>{busy ? "Finding the shot moment…" : trackResult ? "Ready to review" : "Review your shot"}</h3>
          {busy && <div role="status"><p>Checking on your device… {Math.round(trackProgress)}%</p><progress max="100" value={trackProgress} aria-label="Video check progress" /></div>}
          {!busy && trackResult && <div role="status">
            <p>A possible shot moment was found. Watch the replay, then confirm the result below.</p>
            <button type="button" className={styles.trackButton} onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.currentTime = Math.max(0, trackResult.points[0].time - .1);
              void video.play().catch(() => setTrackMessage("Use the video’s play control to review your shot."));
            }}>Replay shot moment</button>
          </div>}
          {trackMessage && <p role="status">{trackMessage}</p>}
          <div className={styles.trackActions}>
            {busy ? <button type="button" className={styles.remove} onClick={() => {
              trackingRef.current?.abort(); setTrackMessage("Check canceled. Replay your video or choose the result below.");
              requestAnimationFrame(() => retryButtonRef.current?.focus());
            }}>Cancel check</button> : <button ref={retryButtonRef} type="button" className={styles.remove} onClick={() => void trackClip()}>Check again</button>}
          </div>
        </div>}
        {error && <p className={styles.error} role="alert">{error}</p>}
        <details className={styles.fileOptions} open={!local}>
          <summary>{local ? "Change video" : "Choose or record a video"}</summary>
          <label htmlFor={`${id}-video`} className={styles.fileLabel}>{local ? "Choose a different video" : "Choose a video from this device"}</label>
          <input ref={fileInput} className={styles.fileInput} id={`${id}-video`} type="file" accept="video/*" onChange={chooseVideo} aria-describedby={`${id}-privacy`} />
          <label htmlFor={`${id}-capture`} className={styles.fileLabel}>Or record a new shot</label>
          <input ref={captureInput} className={styles.fileInput} id={`${id}-capture`} type="file" accept="video/*" capture="environment" onChange={chooseVideo} aria-describedby={`${id}-camera ${id}-privacy`} />
          <p id={`${id}-camera`} className={styles.privacy}>Supported phones open the camera. Other devices may open a file picker.</p>
        </details>
        {local && <button type="button" className={styles.remove} onClick={() => { clearLocal(); requestAnimationFrame(() => fileInput.current?.focus()); }}>Remove video</button>}
        <p id={`${id}-privacy`} className={styles.privacy}>Up to 30 seconds · 50 MB. Video stays on this device and clears when you confirm or leave this shot.</p>
      </div>}
    </section>
  );
}
