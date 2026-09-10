import { pageMetadata } from "@/lib/seo/pageMetadata";

export const metadata = pageMetadata({
  title: "Free Golf Equipment Diagnostic",
  description:
    "Run a free golf fitting diagnostic to get personalized recommendations for driver, iron, and wedge setup.",
  path: "/diagnostic",
});

export default function DiagnosticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
