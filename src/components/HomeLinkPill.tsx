import Link from "next/link";

export function HomeLinkPill() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:text-slate-900"
    >
      <span aria-hidden="true">←</span>
      <span>Home</span>
    </Link>
  );
}
