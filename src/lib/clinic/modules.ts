export type ClinicModuleStatus = "active" | "comingSoon";

export type ClinicModuleDefinition = {
  id: string;
  problemKey: string;
  title: string;
  route: string;
  status: ClinicModuleStatus;
  cardDescription: string;
  heroGraphic: "driverSlice" | "pullHook" | "ballCurvesRight";
  heroCta: string;
};

export const CLINIC_MODULES: ClinicModuleDefinition[] = [
  {
    id: "ball-curves-right",
    problemKey: "ballCurvesRight",
    title: "Ball Curves Right",
    route: "/clinic/ball-curves-right",
    status: "active",
    cardDescription: "Symptom-first diagnosis for shots that curve right.",
    heroGraphic: "ballCurvesRight",
    heroCta: "Start: Ball Curves Right",
  },
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
