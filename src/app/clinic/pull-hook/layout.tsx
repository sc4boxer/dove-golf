import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pull Hook Debugger",
  description:
    "Use DoveClinic™ Pull Hook Debugger to separate face-to-path, strike, setup, and equipment levers with structured range validation.",
  alternates: {
    canonical: "/clinic/pull-hook",
  },
  openGraph: {
    title: "Pull Hook Debugger",
    description:
      "Use DoveClinic™ Pull Hook Debugger to separate face-to-path, strike, setup, and equipment levers with structured range validation.",
    url: "https://dovegolf.fit/clinic/pull-hook",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pull Hook Debugger",
    description:
      "Use DoveClinic™ Pull Hook Debugger to separate face-to-path, strike, setup, and equipment levers with structured range validation.",
  },
};

export default function PullHookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
