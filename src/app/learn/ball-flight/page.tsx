import type { Metadata } from "next";
import { BallFlightLibraryExplorer } from "@/components/learn/BallFlightLibraryExplorer";

export const metadata: Metadata = {
  title: "Ball Flight Library",
  description: "Interactive ball flight diagnostic reference with pattern physics and confidence scoring.",
  alternates: { canonical: "/learn/ball-flight" },
};

export default function BallFlightPage() {
  return <BallFlightLibraryExplorer />;
}
