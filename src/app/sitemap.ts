import type { MetadataRoute } from "next";

const baseUrl = "https://dovegolf.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/diagnostic", "/method", "/about", "/learn", "/faq", "/learn/start-line-vs-curve", "/learn/tempo-vs-flex", "/learn/shaft-weight-physics", "/learn/launch-spin-window"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
