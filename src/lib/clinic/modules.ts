export type ClinicModuleStatus = "active" | "comingSoon";

export type ClinicModuleDefinition = {
  id: string;
  problemKey: "driverSlice" | "pullHook" | "thinIrons" | "fatIrons" | "highSpinBalloon";
  title: string;
  route: string;
  status: ClinicModuleStatus;
  cardDescription: string;
  heroGraphic: "driverSlice" | "pullHook" | "thinIrons" | "fatIrons" | "highSpinBalloon";
  heroCta: string;
};

export const CLINIC_MODULES: ClinicModuleDefinition[] = [
  {
    id: "driver-slice",
    problemKey: "driverSlice",
    title: "Driver Slice",
    route: "/clinic/driver-slice",
    status: "active",
    cardDescription: "Right-curving drives that lose distance and control.",
    heroGraphic: "driverSlice",
    heroCta: "Start: Driver Slice",
  },
  {
    id: "pull-hook",
    problemKey: "pullHook",
    title: "Pull Hook",
    route: "/clinic/pull-hook",
    status: "active",
    cardDescription: "Left-start shots that over-curve left.",
    heroGraphic: "pullHook",
    heroCta: "Start: Pull Hook",
  },
  {
    id: "thin-irons",
    problemKey: "thinIrons",
    title: "Thin Irons",
    route: "/clinic/thin-irons",
    status: "active",
    cardDescription: "Low-face strike and bladed contact.",
    heroGraphic: "thinIrons",
    heroCta: "Start: Thin Irons",
  },
  {
    id: "fat-irons",
    problemKey: "fatIrons",
    title: "Fat Irons",
    route: "/clinic/fat-irons",
    status: "active",
    cardDescription: "Ground-before-ball contact and heavy shots.",
    heroGraphic: "fatIrons",
    heroCta: "Start: Fat Irons",
  },
  {
    id: "high-spin-balloon",
    problemKey: "highSpinBalloon",
    title: "High Spin Balloon",
    route: "/clinic/high-spin-balloon",
    status: "active",
    cardDescription: "High, weak flight that floats and loses distance.",
    heroGraphic: "highSpinBalloon",
    heroCta: "Start: High Spin Balloon",
  },
];
