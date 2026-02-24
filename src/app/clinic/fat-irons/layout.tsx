import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fat Irons Debugger",
  description: "Use DoveClinic™ Fat Irons Debugger to separate low-point, pressure, setup, and turf factors behind heavy strikes.",
  alternates: { canonical: "/clinic/fat-irons" },
};

export default function FatIronsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
