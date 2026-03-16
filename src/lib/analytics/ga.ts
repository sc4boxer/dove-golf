const GA_DEBUG = process.env.NODE_ENV !== "production";

type EventParams = Record<string, unknown>;

type GtagFunction = (command: "event", eventName: string, params?: EventParams) => void;

function getGtag(): GtagFunction | null {
  if (typeof window === "undefined") {
    return null;
  }

  const gtag = (window as Window & { gtag?: GtagFunction }).gtag;
  return typeof gtag === "function" ? gtag : null;
}

export function track(eventName: string, params: EventParams = {}) {
  const gtag = getGtag();
  if (!gtag) {
    if (GA_DEBUG) {
      console.debug("[ga.track:no-op]", eventName, params);
    }
    return;
  }

  gtag("event", eventName, params);

  if (GA_DEBUG) {
    console.debug("[ga.track]", eventName, params);
  }
}
