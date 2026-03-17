type CauseMiniVizProps = {
  type?: "open-face" | "across-path" | "weak-grip" | "glancing-strike";
};

export function CauseMiniViz({ type }: CauseMiniVizProps) {
  if (type === "open-face") {
    return (
      <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
        <circle cx="24" cy="36" r="7" fill="#0f172a" />
        <rect x="50" y="24" width="36" height="24" rx="4" fill="#cbd5e1" transform="rotate(18 68 36)" />
        <path d="M 90 36 h 18" stroke="#0f172a" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (type === "across-path") {
    return (
      <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
        <circle cx="24" cy="36" r="7" fill="#0f172a" />
        <path d="M 92 22 L 50 50" stroke="#0f172a" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M 92 50 L 92 22 L 64 22" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
      </svg>
    );
  }

  if (type === "weak-grip") {
    return (
      <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
        <rect x="16" y="32" width="86" height="8" rx="4" fill="#cbd5e1" />
        <path d="M 38 26 q 10 -10 20 0" stroke="#0f172a" strokeWidth="2" fill="none" />
        <path d="M 66 24 q 10 -8 20 2" stroke="#0f172a" strokeWidth="2" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 120 72" className="h-16 w-full" aria-hidden>
      <circle cx="28" cy="36" r="9" fill="#0f172a" />
      <circle cx="28" cy="36" r="3" fill="#fff" />
      <rect x="64" y="24" width="28" height="24" rx="4" fill="#cbd5e1" />
      <path d="M 80 12 v 48" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 3" />
    </svg>
  );
}
