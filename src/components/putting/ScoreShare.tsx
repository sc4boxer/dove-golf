"use client";

import { useEffect, useRef, useState } from "react";
import { drawScoreCard, scoreDate, type CardFormat, type ShareEntry } from "./scoreCard";
import styles from "./ScoreShare.module.css";

export default function ScoreShare({ entry }: { entry: ShareEntry }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<CardFormat>("story");
  const [asset, setAsset] = useState<{ url: string; file: File; format: CardFormat } | null>(null);
  const [message, setMessage] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let disposed = false;
    let objectUrl: string | undefined;
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      drawScoreCard(canvas, entry, format);
      canvas.toBlob((blob) => {
        if (disposed) return;
        if (!blob) { setMessage("We couldn’t create your image. Please try another format."); return; }
        objectUrl = URL.createObjectURL(blob);
        const file = new File([blob], `dove-golf-${entry.initials}-${entry.score}-${format}.png`, { type: "image/png" });
        setAsset({ url: objectUrl, file, format });
        setCanShare(typeof navigator.share === "function" && Boolean(navigator.canShare?.({ files: [file] })));
      }, "image/png");
    } catch {
      setMessage("Image creation isn’t available in this browser. Try another browser to save your scorecard.");
    }
    return () => { disposed = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [entry, format]);

  async function share() {
    if (!asset || asset.format !== format || sharing) return;
    setSharing(true);
    setMessage("");
    try {
      await navigator.share({ files: [asset.file] });
      setMessage("Your scorecard was handed to your share app.");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessage("Sharing wasn’t available. Download your image below and add it to your post or Story.");
      }
    } finally { setSharing(false); }
  }

  const ready = asset?.format === format;
  return (
    <section className={styles.share} aria-label="Share your verified score">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Worth a little bragging</p>
        <h3>Your score. Your calling card.</h3>
        <p>Save your scorecard for Instagram or share it with a friend. Invite them to beat your five-hole score.</p>
        <fieldset className={styles.formats}>
          <legend>Choose image format</legend>
          <label><input type="radio" name={`score-format-${entry.id}`} value="story" checked={format === "story"} onChange={() => { setFormat("story"); setMessage(""); }} /> Story <span>9:16</span></label>
          <label><input type="radio" name={`score-format-${entry.id}`} value="portrait" checked={format === "portrait"} onChange={() => { setFormat("portrait"); setMessage(""); }} /> Feed <span>4:5</span></label>
        </fieldset>
        <div className={styles.actions}>
          {ready ? <a className={styles.primary} href={asset.url} download={asset.file.name}>Download image</a> : <span className={styles.preparing}>Preparing image…</span>}
          {canShare && ready && <button type="button" className={styles.secondary} onClick={share} disabled={sharing}>{sharing ? "Opening share menu…" : "Share scorecard"}</button>}
        </div>
        <p className={styles.help}>For Instagram, download the image and add it to a Story or post. Add a link sticker to dovegolf.fit in your Story so friends can play.</p>
        {entry.rank !== null && <p className={styles.help}>Weekly rank #{entry.rank} as of {scoreDate(entry.achievedAt)} (UTC). Rankings can change after submission.</p>}
        <p className={styles.status} role="status">{message}</p>
      </div>
      <div className={styles.preview}>
        <canvas ref={canvasRef} className={styles.card} role="img" aria-label={`${entry.initials}, ${entry.score.toLocaleString("en-US")} points in the Dove Golf five-hole challenge${entry.rank ? `, weekly rank ${entry.rank} at submission` : ""}. ${scoreDate(entry.achievedAt)}.`} />
      </div>
    </section>
  );
}
