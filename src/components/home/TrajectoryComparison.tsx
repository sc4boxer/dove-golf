import styles from "./TrajectoryComparison.module.css";

export function TrajectoryComparison() {
  const highShort = "M 48 166 C 145 20, 260 20, 365 164";
  const lowMid = "M 48 166 C 190 105, 345 105, 535 164";
  const balanced = "M 48 166 C 205 72, 410 72, 650 164";

  return (
    <figure className={styles.figure}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>See the evidence</p>
        <p className={styles.title}>Different flights point to different tests.</p>
      </div>

      <svg
        className={styles.chart}
        viewBox="0 0 700 210"
        role="img"
        aria-labelledby="trajectory-title trajectory-description"
      >
        <title id="trajectory-title">Three animated golf ball trajectories</title>
        <desc id="trajectory-description">
          A high short flight and a low medium flight appear as dotted comparisons before a balanced solid flight.
        </desc>

        <defs>
          <mask id="reveal-high-short">
            <path className={`${styles.reveal} ${styles.revealHigh}`} pathLength="1" d={highShort} />
          </mask>
          <mask id="reveal-low-mid">
            <path className={`${styles.reveal} ${styles.revealLow}`} pathLength="1" d={lowMid} />
          </mask>
        </defs>

        <g className={styles.grid} aria-hidden="true">
          <path d="M 48 48 H 664 M 48 87 H 664 M 48 126 H 664" />
          <path d="M 172 28 V 166 M 296 28 V 166 M 420 28 V 166 M 544 28 V 166" />
        </g>

        <g className={styles.axes} aria-hidden="true">
          <path className={`${styles.axis} ${styles.yAxis}`} pathLength="1" d="M 48 166 V 28" />
          <path className={`${styles.axis} ${styles.xAxis}`} pathLength="1" d="M 48 166 H 664" />
          <text className={styles.yLabel} x="56" y="42">Height</text>
          <text className={styles.xLabel} x="606" y="195">Distance</text>
        </g>

        <path className={styles.comparison} d={highShort} mask="url(#reveal-high-short)" />
        <path className={styles.comparison} d={lowMid} mask="url(#reveal-low-mid)" />
        <path className={styles.balanced} pathLength="1" d={balanced} />
      </svg>

      <figcaption className={styles.caption}>
        Compare the shape first. Change one variable second.
      </figcaption>
    </figure>
  );
}

