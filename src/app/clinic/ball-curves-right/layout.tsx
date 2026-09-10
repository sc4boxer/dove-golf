import type { Metadata } from "next";

const title = "Why Your Golf Ball Curves Right";
const description =
  "Compare right-curving golf shots by start direction, explore likely impact conditions, and test one change at a time with DoveClinic.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/clinic/ball-curves-right" },
  openGraph: {
    title,
    description,
    url: "https://dovegolf.fit/clinic/ball-curves-right",
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function BallCurvesRightLayout({ children }: { children: React.ReactNode }) {
  return children;
}
