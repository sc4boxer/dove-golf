import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "High Spin Balloon Debugger",
  description: "Use DoveClinic™ High Spin Balloon Debugger to identify dynamic loft, strike, and setup causes of high weak flight.",
  alternates: { canonical: "/clinic/high-spin-balloon" },
};

export default function HighSpinBalloonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
