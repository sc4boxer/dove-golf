import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thin Irons Debugger",
  description: "Use DoveClinic™ Thin Irons Debugger to isolate low-point, setup, and strike causes of bladed contact.",
  alternates: { canonical: "/clinic/thin-irons" },
};

export default function ThinIronsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
