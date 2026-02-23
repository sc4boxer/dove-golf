import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DoveClinic™ Golf Miss Debugger",
  description:
    "Diagnose recurring golf misses with deterministic cause ranking, confidence-weighted explanations, and testable range plans.",
  alternates: {
    canonical: "/clinic",
  },
  openGraph: {
    title: "DoveClinic™ Golf Miss Debugger",
    description:
      "Diagnose recurring golf misses with deterministic cause ranking, confidence-weighted explanations, and testable range plans.",
    url: "https://dovegolf.fit/clinic",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoveClinic™ Golf Miss Debugger",
    description:
      "Diagnose recurring golf misses with deterministic cause ranking, confidence-weighted explanations, and testable range plans.",
  },
};

export default function ClinicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
