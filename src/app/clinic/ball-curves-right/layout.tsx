import type { Metadata } from "next";

const title = "Golf Ball Curves Right: Causes and Range Tests";
const description =
  "Identify why your golf ball curves right, compare face, path, and strike clues, and run focused range tests before changing your swing or equipment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/clinic/ball-curves-right" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://dovegolf.fit/clinic/ball-curves-right",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function BallCurvesRightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
