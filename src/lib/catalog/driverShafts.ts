// src/lib/catalog/driverShafts.ts
// v1 curated driver shaft catalog (small + high quality, unbiased)
// Notes:
// - MSRP is rough/indicative; keep as ranges to avoid "price accuracy" issues.
// - No buy links for now (trust-first). Add later when monetization starts.

export type LaunchBand = "low" | "mid" | "mid_high" | "high";
export type SpinBand = "low" | "mid_low" | "mid" | "mid_high" | "high";
export type StabilityBand = "neutral" | "stable" | "very_stable";
export type FeelBand = "smooth" | "balanced" | "firm";
export type TorqueBand = "low" | "mid" | "mid_high";

export type WeightClass = "50" | "60" | "70";

export type DriverShaftModel = {
  id: string;
  brand: string;
  model: string;

  // General design bias (not "facts", just fitting-relevant descriptors)
  launch: LaunchBand;
  spin: SpinBand;
  stability: StabilityBand;
  feel: FeelBand;
  torque: TorqueBand;

  // Available weight classes in typical “6”/“7” family. (v1 coarse)
  weightClasses: WeightClass[];

  // Typical flex availability (coarse)
  flexes: Array<"R" | "S" | "X">;

  // Rough MSRP
  msrpUSD: string;

  // Optional: later add affiliate / retailer link (leave blank for now)
  buyLink?: string;
};

export const DRIVER_SHAFT_CATALOG: DriverShaftModel[] = [
  {
    id: "ventus-blue",
    brand: "Fujikura",
    model: "Ventus Blue (Velocore)",
    launch: "mid",
    spin: "mid",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["50", "60", "70"],
    flexes: ["R", "S", "X"],
    msrpUSD: "$350–$450",
  },
  {
    id: "ventus-black",
    brand: "Fujikura",
    model: "Ventus Black (Velocore)",
    launch: "low",
    spin: "low",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$350–$450",
  },
  {
    id: "speeder-nx-blue",
    brand: "Fujikura",
    model: "Speeder NX Blue",
    launch: "mid_high",
    spin: "mid",
    stability: "stable",
    feel: "smooth",
    torque: "mid",
    weightClasses: ["50", "60"],
    flexes: ["R", "S", "X"],
    msrpUSD: "$300–$400",
  },
  {
    id: "tensei-raw-white",
    brand: "Mitsubishi",
    model: "Tensei AV Raw White",
    launch: "low",
    spin: "low",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$300–$400",
  },
  {
    id: "tensei-raw-blue",
    brand: "Mitsubishi",
    model: "Tensei AV Raw Blue",
    launch: "mid",
    spin: "mid",
    stability: "stable",
    feel: "balanced",
    torque: "mid",
    weightClasses: ["50", "60", "70"],
    flexes: ["R", "S", "X"],
    msrpUSD: "$300–$400",
  },
  {
    id: "kai-li-white",
    brand: "Mitsubishi",
    model: "Kai'li White",
    launch: "low",
    spin: "low",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$300–$400",
  },
  {
    id: "hzrdus-smoke-black-rdx",
    brand: "Project X",
    model: "HZRDUS Smoke Black RDX",
    launch: "low",
    spin: "low",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$250–$350",
  },
  {
    id: "tour-ad-di",
    brand: "Graphite Design",
    model: "Tour AD DI",
    launch: "mid_high",
    spin: "mid",
    stability: "stable",
    feel: "smooth",
    torque: "mid",
    weightClasses: ["50", "60", "70"],
    flexes: ["R", "S", "X"],
    msrpUSD: "$350–$450",
  },
  {
    id: "tour-ad-iz",
    brand: "Graphite Design",
    model: "Tour AD IZ",
    launch: "mid",
    spin: "mid",
    stability: "stable",
    feel: "balanced",
    torque: "mid",
    weightClasses: ["50", "60", "70"],
    flexes: ["R", "S", "X"],
    msrpUSD: "$350–$450",
  },
  {
    id: "tour-ad-vf",
    brand: "Graphite Design",
    model: "Tour AD VF",
    launch: "low",
    spin: "low",
    stability: "very_stable",
    feel: "firm",
    torque: "low",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$350–$450",
  },
  {
    id: "evenflow-riptide",
    brand: "Project X",
    model: "EvenFlow Riptide",
    launch: "mid",
    spin: "mid",
    stability: "neutral",
    feel: "smooth",
    torque: "mid_high",
    weightClasses: ["50", "60"],
    flexes: ["R", "S"],
    msrpUSD: "$200–$300",
  },
  {
    id: "kbs-tdi",
    brand: "KBS",
    model: "KBS TD (Tour Driver)",
    launch: "mid",
    spin: "mid_low",
    stability: "stable",
    feel: "balanced",
    torque: "mid",
    weightClasses: ["60", "70"],
    flexes: ["S", "X"],
    msrpUSD: "$250–$350",
  },
];
