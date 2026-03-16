export type ClinicModuleStatus = "active" | "comingSoon";

export type ClinicModuleDefinition = {
  id: string;
  problemKey: "driverSlice" | "pullHook";
  title: string;
  route: string;
  status: ClinicModuleStatus;
  cardDescription: string;
  heroGraphic: "driverSlice" | "pullHook";
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
];
