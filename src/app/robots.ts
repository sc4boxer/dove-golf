import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://dovegolf.fit/sitemap.xml",
    host: "https://dovegolf.fit",
  };
}
