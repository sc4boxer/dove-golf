import { ShotShapeMiniPath } from "@/components/clinic/visuals/ShotShapeMiniPath";

export function DriverSliceMiniChart() {
  return <ShotShapeMiniPath startX={96} endX={156} startLabel="start left" label="slice" />;
}

export function PullHookMiniChart() {
  return <ShotShapeMiniPath startX={126} endX={66} startLabel="start right" label="hook" />;
}
