import type { MetadataRoute } from "next";

const baseUrl = "https://dovegolf.fit";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/diagnostic", "/method", "/about"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
