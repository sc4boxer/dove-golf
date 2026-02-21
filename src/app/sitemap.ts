import type { MetadataRoute } from "next";
import { PATTERN_ORDER } from "@/lib/learn/ballFlightPatterns";

const baseUrl = "https://dovegolf.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/diagnostic",
    "/method",
    "/about",
    "/learn",
    "/faq",
    "/learn/ball-flight",
    "/learn/start-line-vs-curve",
    "/learn/tempo-vs-flex",
    "/learn/shaft-weight-physics",
    "/learn/launch-spin-window",
    ...PATTERN_ORDER.map((pattern) => `/learn/ball-flight/${pattern}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
