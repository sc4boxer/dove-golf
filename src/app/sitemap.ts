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
    "/faq",
    "/learn/ball-flight",
    "/learn/start-line-vs-curve",
    "/learn/tempo-vs-flex",
    "/learn/shaft-weight-physics",
    "/learn/launch-spin-window",
    ...PATTERN_ORDER.map((pattern) => `/learn/ball-flight/${pattern}`),
  ];

  return routes.map((route) => {
    const isPrimary = route === "/" || route === "/clinic" || route === "/diagnostic";
    const isSupport = route === "/about" || route === "/privacy" || route === "/play/putting";

    return {
      url: new URL(route, baseUrl).toString(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: route === "/" ? 1 : isPrimary ? 0.9 : isSupport ? 0.4 : 0.8,
    };
  });
}
