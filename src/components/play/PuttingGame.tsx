"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { COURSE, createBall, strike, step, isMoving, type Ball, HOLES, type Course } from "@/lib/putting/physics";
import styles from "./PuttingGame.module.css";

type Phase = "ready" | "rolling" | "won" | "over";
type Round = { strokes: number; phase: Phase };
const aimAtCup = (ball: Ball, course: Course = COURSE) => Math.atan2(course.cup.x - ball.x, ball.y - course.cup.y) * 180 / Math.PI;

function draw(canvas: HTMLCanvasElement, ball: Ball, angle: number, power: number, phase: Phase, course: Course, hole: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const { width, height, cup } = course;
  ctx.setTransform(2, 0, 0, 2, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#e9f0e8"; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#acc9ae"; ctx.beginPath(); ctx.roundRect(15, 15, width - 30, height - 30, 16); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(20, 20, width - 40, height - 40); ctx.clip();
  ctx.fillStyle = "#b5cfb5"; ctx.fillRect(20, 20, width - 40, height - 40);
  for (let y = 20; y < height - 20; y += 64) { ctx.fillStyle = "#bfd6bd"; ctx.fillRect(20, y, width - 40, 32); }
  ctx.restore();
  ctx.strokeStyle = "#77977d"; ctx.lineWidth = 2; ctx.strokeRect(20, 20, width - 40, height - 40);
  ctx.fillStyle = "#243c32"; ctx.beginPath(); ctx.arc(cup.x, cup.y, cup.radius, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#edf3e9"; ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = "#324b3b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cup.x, cup.y - 7); ctx.lineTo(cup.x, cup.y - 49); ctx.stroke();
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(cup.x + 1, cup.y - 49); ctx.lineTo(cup.x + 27, cup.y - 40); ctx.lineTo(cup.x + 1, cup.y - 31); ctx.fill();
  ctx.fillStyle = "#365540"; ctx.font = "600 10px Arial"; ctx.textAlign = "center"; ctx.fillText(String(hole + 1), cup.x + 10, cup.y - 38);
  if (!ball.sunk) {
    if (phase === "ready") {
      const rad = angle * Math.PI / 180;
      const length = 28 + power * .9;
      const dx = Math.sin(rad), dy = -Math.cos(rad);
      ctx.save(); ctx.beginPath(); ctx.rect(20, 20, width - 40, height - 40); ctx.clip();
      ctx.strokeStyle = "#365540"; ctx.lineWidth = 2; ctx.setLineDash([3, 6]);
      ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(ball.x + dx * length, ball.y + dy * length); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#365540"; ctx.beginPath(); ctx.arc(ball.x + dx * length, ball.y + dy * length, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "rgba(24, 48, 34, .18)"; ctx.beginPath(); ctx.ellipse(ball.x + 2, ball.y + 4, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#526a59"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ball.x, ball.y, COURSE.ballRadius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#dfe7dc"; ctx.beginPath(); ctx.arc(ball.x - 2, ball.y - 2, 1.5, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cup.x, cup.y + 2, 4, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = "#365540"; ctx.font = "11px Arial"; ctx.textAlign = "left"; ctx.fillText("THE SHORT BREAK", 34, height - 36);
}

export function PuttingGame() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ball = useRef(createBall());
  const [hole, setHole] = useState(0);
  const activeHole = useRef(0);
  const course = HOLES[hole];
  const liveRound = useRef<Round>({ strokes: 0, phase: "ready" });
  const [round, setRound] = useState<Round>({ strokes: 0, phase: "ready" });
  const [angle, setAngle] = useState(27);
  const [power, setPower] = useState(60);
  const aim = useRef({ angle: 27, power: 60 });
  const drag = useRef<{ id: number; x: number; y: number; angle: number; power: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);

  function changeAim(nextAngle: number, nextPower: number) {
    aim.current = { angle: nextAngle, power: nextPower };
    setAngle(nextAngle); setPower(nextPower);
  }

  function putt() {
    if (liveRound.current.phase !== "ready" || aim.current.power < 1) return;
    drag.current = null;
    setDragging(false);
    ball.current = strike(ball.current, aim.current.angle, aim.current.power);
    liveRound.current = { strokes: liveRound.current.strokes + 1, phase: "rolling" };
    setRound(liveRound.current);
  }

  function reset(nextHole = 0) {
    activeHole.current = nextHole;
    setHole(nextHole);
    drag.current = null;
    setDragging(false);
    ball.current = createBall(HOLES[nextHole]);
    liveRound.current = { strokes: 0, phase: "ready" };
    setRound(liveRound.current);
    changeAim(aimAtCup(ball.current, HOLES[nextHole]), 60);
    canvas.current?.scrollIntoView({ block: "center", behavior: "instant" });
    canvas.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (round.phase === "won" || round.phase === "over") {
      resultHeading.current?.focus({ preventScroll: true });
      resultHeading.current?.parentElement?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [round.phase]);

  useEffect(() => {
    let frame = 0;
    let previous = 0;
    let accumulated = 0;
    const render = (time: number) => {
      if (!canvas.current) return;
      if (!document.hidden && liveRound.current.phase === "rolling") {
        accumulated += previous ? Math.min((time - previous) / 1000, .05) : 0;
        while (accumulated >= 1 / 120) {
          ball.current = step(ball.current, 1 / 120, HOLES[activeHole.current]);
          accumulated -= 1 / 120;
        }
        if (!isMoving(ball.current)) {
          const next: Round = { strokes: liveRound.current.strokes, phase: ball.current.sunk ? "won" : liveRound.current.strokes >= 3 ? "over" : "ready" };
          liveRound.current = next; setRound(next);
          if (ball.current.sunk) setBest((value) => value === null ? next.strokes : Math.min(value, next.strokes));
          else {
            const nextAngle = aimAtCup(ball.current, HOLES[activeHole.current]);
            aim.current = { angle: nextAngle, power: 40 };
            setAngle(nextAngle); setPower(40);
            if (next.phase === "ready") canvas.current?.focus({ preventScroll: true });
          }
        }
      }
      previous = document.hidden ? 0 : time;
      draw(canvas.current, ball.current, aim.current.angle, aim.current.power, liveRound.current.phase, HOLES[activeHole.current], activeHole.current);
      if (liveRound.current.phase === "rolling") frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [round, angle, power, hole]);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * COURSE.width / rect.width, y: (event.clientY - rect.top) * COURSE.height / rect.height };
  }
  function cancelDrag() {
    if (drag.current) changeAim(drag.current.angle, drag.current.power);
    drag.current = null;
    setDragging(false);
  }
  function pointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (liveRound.current.phase !== "ready" || !event.isPrimary || event.button !== 0) return;
    const p = point(event);
    if (Math.hypot(p.x - ball.current.x, p.y - ball.current.y) > 32) return;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, ...p, ...aim.current, moved: false };
    setDragging(true);
  }
  function pointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drag.current || event.pointerId !== drag.current.id) return;
    const p = point(event), dx = drag.current.x - p.x, dy = drag.current.y - p.y;
    const distance = Math.hypot(dx, dy);
    drag.current.moved = distance >= 6;
    if (distance >= 6) changeAim(Math.atan2(dx, -dy) * 180 / Math.PI, Math.min(100, Math.round(distance / 1.2)));
  }
  const finished = round.phase === "won" || round.phase === "over";
  return <section className={styles.game} aria-label="Three-hole putting game">
    <div className={styles.board}>
      <div className={styles.score}><span>Hole <strong>{hole + 1} of {HOLES.length}</strong></span><span role="status"><strong>{finished ? (hole === HOLES.length - 1 ? "Round complete" : "Hole complete") : round.phase === "rolling" ? "Ball rolling…" : round.strokes === 2 ? "Last putt" : `${3 - round.strokes} putts left`}</strong></span></div>
      <p className={styles.boardHint}>Drag back from the ball and release. Longer pull, more power.</p>
      <div className={styles.powerHud}>
        <label htmlFor="putting-power-meter">Power <strong>{power}%</strong></label>
        <meter id="putting-power-meter" min="0" max="100" value={power} aria-label="Shot power" />
        <span>{dragging ? "Release to putt" : "Pull back to set power"}</span>
      </div>
      <div className={styles.course}>
      <canvas ref={canvas} width={COURSE.width * 2} height={COURSE.height * 2} className={styles.canvas} tabIndex={finished ? -1 : 0} aria-disabled={finished} aria-label="Putting green. Drag back from the ball and release to putt, or use the aim and power controls below." aria-describedby="putting-keyboard" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onPointerUp={(event) => {
        if (!drag.current || drag.current.id !== event.pointerId) return;
        const previous = drag.current;
        const moved = previous.moved; drag.current = null; setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        if (moved) putt();
        else changeAim(previous.angle, previous.power);
      }} onKeyDown={(event) => {
        if (event.key === "Escape") { cancelDrag(); return; }
        if (liveRound.current.phase !== "ready") return;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Enter"].includes(event.key)) event.preventDefault();
        if (event.key === "ArrowLeft") changeAim(Math.max(-180, angle - 3), power);
        if (event.key === "ArrowRight") changeAim(Math.min(180, angle + 3), power);
        if (event.key === "ArrowUp") changeAim(angle, Math.min(100, power + 3));
        if (event.key === "ArrowDown") changeAim(angle, Math.max(1, power - 3));
        if ((event.key === " " || event.key === "Enter") && !event.repeat) putt();
      }}>Use the aim and power controls to play. The cup begins above and to the {course.cup.x > course.start.x ? "right" : "left"} of the ball.</canvas>
      {finished && <div className={styles.overlay}>
        <section className={styles.resultCard} aria-labelledby="putting-result">
          <p className={styles.eyebrow}>Hole {hole + 1} complete · {round.strokes} {round.strokes === 1 ? "putt" : "putts"} used</p>
          <h2 id="putting-result" ref={resultHeading} tabIndex={-1}>{round.phase === "won" ? (round.strokes === 1 ? "One and done!" : "Nicely putted.") : "Give it another go."}</h2>
          <p>{round.phase === "won" ? `${(4 - round.strokes) * 100} points. In the cup!` : (hole < HOLES.length - 1 ? "Three putts used. A new hole is ready." : "Three putts used. You finished the last hole.")}</p>
          <button className={styles.primary} onClick={() => reset(hole < HOLES.length - 1 ? hole + 1 : 0)}>{hole < HOLES.length - 1 ? `Next hole (${hole + 2}) →` : "Play again →"}</button>
          <p className={styles.replayNote}>{hole < HOLES.length - 1 ? "Three fresh putts on the next green." : "All three holes complete. Play again from hole 1."}</p>
        </section>
      </div>}
      </div>
    </div>
    <div className={styles.panel}>
      <p className={styles.eyebrow}>Hole {hole + 1} of {HOLES.length} · The short break</p>
      <h2>A little touch goes a long way.</h2>
      <p className={styles.description}>Pull back from the ball, then release. A longer pull adds power. The dotted line shows your aim, not where the ball will stop.</p>
      <details className={styles.alternative}>
        <summary>Alternative controls</summary>
        <p className={styles.help}>Use these sliders and the Putt button instead of dragging.</p>
        <fieldset disabled={round.phase !== "ready"} className={styles.controls}>
          <legend className="sr-only">Aim and power — no dragging required</legend>
          <label><span className={styles.labelRow}><span>Aim</span><span aria-hidden="true">{Math.round(angle)}°</span></span><input aria-label="Aim" type="range" min="-180" max="180" value={angle} onChange={(e) => changeAim(Number(e.target.value), power)} aria-valuetext={`${Math.round(angle)} degrees; zero points up the green`} /></label>
          <label><span className={styles.labelRow}><span>Power</span><span aria-hidden="true">{power}%</span></span><input aria-label="Power" type="range" min="1" max="100" value={power} onChange={(e) => changeAim(angle, Number(e.target.value))} /></label>
        </fieldset>
        <button className={styles.primary} disabled={round.phase !== "ready"} onClick={putt}>{finished ? (hole === HOLES.length - 1 ? "Round complete" : "Hole complete") : round.phase === "rolling" ? "Rolling…" : "Putt →"}</button>
      {!finished && <button className={styles.secondary} onClick={() => reset()}>Start a fresh round</button>}
      </details>
      {best !== null && <p className={styles.help}>Best hole this visit: {best} {best === 1 ? "putt" : "putts"}. Resets when you leave or refresh.</p>}
      <details className={styles.help}><summary>Controls &amp; a small hint</summary><p id="putting-keyboard">On the green, use ← / → to aim and ↑ / ↓ for power. Press Enter or Space to putt. Escape cancels a drag. You can also tap the sliders and Putt button.</p><p>0° points up; positive angles turn right. Walls bounce. The cup catches a slow ball; a fast one can roll straight over it. This is a flat game green, not a real-world putting lesson.</p></details>
    </div>
  </section>;
}
