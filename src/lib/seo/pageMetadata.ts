import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, type = "website" }: PageMetadataInput): Metadata {
  const url = new URL(path, "https://dovegolf.fit").toString();

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, title, description, url },
    twitter: { card: "summary_large_image", title, description },
  };
}
