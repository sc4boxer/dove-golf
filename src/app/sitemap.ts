import type { MetadataRoute } from "next";
import { PATTERN_ORDER } from "@/lib/learn/ballFlightPatterns";

const baseUrl = "https://dovegolf.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/diagnostic",
    "/clinic",
    "/clinic/driver-slice",
    "/range-rescue",
    "/play/putting",
    "/clinic/ball-curves-right",
    "/clinic/pull-hook",
    "/tools/ball-flight-decoder",
    "/method",
    "/about",
    "/privacy",
    "/learn",
    "/learn/beginner-driving-range-practice",
    "/learn/driver-practice-for-beginners",
    "/faq",
    "/learn/ball-flight",
    "/learn/start-line-vs-curve",
    "/learn/tempo-vs-flex",
    "/learn/shaft-weight-physics",
    "/learn/launch-spin-window",
    ...PATTERN_ORDER.map((pattern) => `/learn/ball-flight/${pattern}`),
  ];

  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    // Omit lastModified until each page has a maintained content revision date.
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
