import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Range Rescue | Calm your next five balls",
  description:
    "Simple, immediate guidance for recovering during a rough golf range session. One choice, one five-ball plan, no account.",
  alternates: { canonical: "/range-rescue" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Range Rescue | Calm your next five balls",
    description: "One calm reset and a simple five-ball plan for a rough range session.",
    url: "https://dovegolf.fit/range-rescue",
    images: [
      {
        url: "/range-rescue-og.png",
        width: 1200,
        height: 630,
        alt: "Range Rescue — Calm your next five balls.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Range Rescue | Calm your next five balls",
    description: "One calm reset and a simple five-ball plan for a rough range session.",
    images: ["/range-rescue-og.png"],
  },
};

export default function RangeRescueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
