import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Golf Equipment Diagnostic",
  description:
    "Run a free golf fitting diagnostic to get personalized recommendations for driver, iron, and wedge setup.",
  alternates: {
    canonical: "/diagnostic",
  },
};

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
