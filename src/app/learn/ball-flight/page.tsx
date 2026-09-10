import { BallFlightLibraryExplorer } from "@/components/learn/BallFlightLibraryExplorer";
import { pageMetadata } from "@/lib/seo/pageMetadata";

export const metadata = pageMetadata({
  title: "Ball Flight Library",
  description: "Interactive ball flight diagnostic reference with pattern physics and confidence scoring.",
  path: "/learn/ball-flight",
});

export default function BallFlightPage() {
  return <BallFlightLibraryExplorer />;
}
