export const SOCIAL_PREVIEW_ALT =
  "Dove Golf — The ball left you a message. A dotted ball flight crosses a quiet green background.";

export const SOCIAL_PREVIEW_SIZE = {
  width: 1200,
  height: 630,
};

export function SocialPreviewImage() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#f5f6f0",
        color: "#17362d",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ position: "absolute", left: 62, top: 54, display: "flex", alignItems: "center", gap: 13, fontSize: 24, fontWeight: 700 }}>
        <div
          style={{
            width: 39,
            height: 39,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50% 50% 50% 12px",
            background: "#245f4d",
            color: "#ffffff",
            fontSize: 17,
            transform: "rotate(-8deg)",
          }}
        >
          D
        </div>
        <span>Dove Golf</span>
      </div>

      <svg
        width="520"
        height="360"
        viewBox="0 0 590 360"
        style={{ position: "absolute", right: 18, top: 124 }}
        aria-hidden="true"
      >
        <path
          d="M18 315 C96 306 125 97 251 96 C369 95 380 250 535 214"
          fill="none"
          stroke="#245f4d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="9 18"
        />
        <circle cx="535" cy="214" r="13" fill="#ddec8e" stroke="#245f4d" strokeWidth="4" />
      </svg>

      <div style={{ position: "absolute", left: 62, top: 205, display: "flex", flexDirection: "column", width: 650 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 68, fontWeight: 700, letterSpacing: "-4px", lineHeight: 1.02 }}>
          <div style={{ display: "flex" }}>The ball left you</div>
          <div style={{ display: "flex" }}>a message.</div>
        </div>
        <div style={{ display: "flex", width: 610, marginTop: 24, color: "#526960", fontSize: 24, lineHeight: 1.4 }}>
          Simple, visual golf tools for better range sessions, clearer ball flight, and smarter equipment choices.
        </div>
      </div>
    </div>
  );
}
