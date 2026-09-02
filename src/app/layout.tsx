import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConsentManager } from "@/components/privacy/ConsentManager";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "Dove Golf";
const SOCIAL_TITLE = "The ball left you a message.";
const DEFAULT_TITLE = `${SOCIAL_TITLE} | ${SITE_NAME}`;
const DEFAULT_DESCRIPTION =
  "Simple, visual golf tools for better range sessions, clearer ball flight, and smarter equipment choices.";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "golf club fitting",
    "online golf fitting",
    "golf shaft fitting",
    "driver fitting",
    "iron fitting",
    "golf equipment diagnostic",
    "Dove Golf",
  ],

  applicationName: SITE_NAME,
  authors: [{ name: "Dove Golf" }],
  creator: "Dove Golf",
  publisher: "Dove Golf",
  metadataBase: new URL("https://dovegolf.fit"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SOCIAL_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "https://dovegolf.fit",
  },
  twitter: {
    card: "summary_large_image",
    title: SOCIAL_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConsentManager measurementId={GA_ID} />
        {children}
      </body>
    </html>
  );
}
