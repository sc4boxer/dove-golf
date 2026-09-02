"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();

  if (!measurementId || pathname.startsWith("/range-rescue")) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}

