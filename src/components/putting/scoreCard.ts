export type ShareEntry = {
  id: string;
  initials: string;
  score: number;
  rank: number | null;
  achievedAt: string;
  courseVersion: string;
};

export type CardFormat = "story" | "portrait";

export function scoreDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
  }).format(new Date(value));
}

/** All artwork is local: exporting never depends on an external image or font. */
export function drawScoreCard(canvas: HTMLCanvasElement, entry: ShareEntry, format: CardFormat) {
  const width = 1080;
  const height = format === "story" ? 1920 : 1350;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable in this browser.");
  const green = "#17362d";
  const muted = "#526960";
  const cream = "#f5f6f0";
  const story = format === "story";
  const top = story ? 190 : 80;
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#d3dbcb";
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, width - 76, height - 76);

  function text(value: string, x: number, y: number, size: number, weight = 400, color = green) {
    ctx!.fillStyle = color;
    ctx!.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    ctx!.fillText(value, x, y);
  }
  function rounded(x: number, y: number, w: number, h: number, r: number, color: string) {
    ctx!.fillStyle = color;
    ctx!.beginPath();
    ctx!.roundRect(x, y, w, h, r);
    ctx!.fill();
  }

  ctx.beginPath(); ctx.arc(116, top + 2, 28, 0, Math.PI * 2);
  ctx.fillStyle = "#245f4d"; ctx.fill();
  text("D", 105, top + 12, 28, 600, cream);
  text("Dove Golf", 161, top + 13, 35, 600);
  text("THE FIVE-HOLE CHALLENGE", 88, top + 105, 25, 600, muted);

  const badge = entry.rank === 1 ? "WEEKLY #1" : entry.rank ? `WEEKLY #${entry.rank}` : "ROUND COMPLETE";
  const badgeWidth = Math.max(220, badge.length * 18 + 48);
  rounded(88, top + 143, badgeWidth, 56, 28, "#dce6b1");
  text(badge, 112, top + 180, 26, 700);

  text(entry.initials.toUpperCase(), 82, top + 337, 138, 700);
  text(entry.score.toLocaleString("en-US"), 77, top + 513, 176, 700);
  // Leave room for the large score's comma descender before the smaller label.
  text("POINTS / 2,500", 91, top + 599, 27, 600, muted);

  // A miniature bank-shot green echoes the site's dotted ball-flight motif.
  const greenTop = top + 660;
  const greenHeight = story ? 448 : 250;
  rounded(88, greenTop, 904, greenHeight, 52, "#e4eade");
  ctx.save();
  ctx.translate(88, greenTop);
  ctx.scale(1, greenHeight / 360);
  ctx.strokeStyle = "#bacab5";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(22, 22, 860, 316, 35); ctx.stroke();
  rounded(385, 108, 28, 194, 12, "#849c7f");
  ctx.strokeStyle = green;
  ctx.lineWidth = 5;
  ctx.setLineDash([8, 14]);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(118, 256); ctx.lineTo(500, 36); ctx.lineTo(746, 208); ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.ellipse(746, 215, 23, 15, 0, 0, Math.PI * 2);
  ctx.fillStyle = green; ctx.fill();
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(746, 209); ctx.lineTo(746, 93); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(749, 94); ctx.lineTo(819, 112); ctx.lineTo(749, 132);
  ctx.fillStyle = green; ctx.fill();
  ctx.beginPath(); ctx.ellipse(118, 256, 16, 16 * 360 / greenHeight, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff"; ctx.fill();
  ctx.strokeStyle = green; ctx.lineWidth = 3; ctx.stroke();
  ctx.restore();

  const footer = greenTop + greenHeight + 60;
  text("A little touch. A few good bounces.", 88, footer, 32, 600);
  text("Think you can beat my score?", 88, footer + 45, 30, 400, muted);
  ctx.strokeStyle = "#cbd5c5";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(88, footer + 82); ctx.lineTo(992, footer + 82); ctx.stroke();
  text("dovegolf.fit", 88, footer + 132, 34, 700);
  text(scoreDate(entry.achievedAt) + " · UTC", 88, footer + 173, 23, 400, muted);
  if (entry.rank) text("Rank at submission · weekly leaderboard", 88, footer + 207, 20, 400, muted);
}
