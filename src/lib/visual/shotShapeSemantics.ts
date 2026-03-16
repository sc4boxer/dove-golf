import {
  BALL_FLIGHT_SEMANTICS,
  curveDirectionSign,
  getBallFlightPathGeometry,
  sideToNormalizedX,
  type CurveDirection,
  type FlightSide,
  type Handedness,
  type ShotShape,
} from "@/lib/visual/ballFlightSemantics";

export type VisualHandedness = Handedness;
export type ShotShapeName = ShotShape;
export type StartSide = FlightSide;

export type ShotShapeSemantics = {
  name: ShotShapeName;
  startSide: StartSide;
  curveDirection: CurveDirection;
  curvatureStrength: number;
  endSide: StartSide;
  handednessAssumption: VisualHandedness;
};

export const SHOT_SHAPE_SEMANTICS: Record<ShotShapeName, ShotShapeSemantics> = {
  straight: {
    name: "straight",
    startSide: BALL_FLIGHT_SEMANTICS.straight.startSide,
    curveDirection: BALL_FLIGHT_SEMANTICS.straight.curveDirection,
    curvatureStrength: BALL_FLIGHT_SEMANTICS.straight.curveAmount,
    endSide: BALL_FLIGHT_SEMANTICS.straight.endBias,
    handednessAssumption: "right-handed",
  },
  draw: {
    name: "draw",
    startSide: BALL_FLIGHT_SEMANTICS.draw.startSide,
    curveDirection: BALL_FLIGHT_SEMANTICS.draw.curveDirection,
    curvatureStrength: BALL_FLIGHT_SEMANTICS.draw.curveAmount,
    endSide: BALL_FLIGHT_SEMANTICS.draw.endBias,
    handednessAssumption: "right-handed",
  },
  fade: {
    name: "fade",
    startSide: BALL_FLIGHT_SEMANTICS.fade.startSide,
    curveDirection: BALL_FLIGHT_SEMANTICS.fade.curveDirection,
    curvatureStrength: BALL_FLIGHT_SEMANTICS.fade.curveAmount,
    endSide: BALL_FLIGHT_SEMANTICS.fade.endBias,
    handednessAssumption: "right-handed",
  },
  hook: {
    name: "hook",
    startSide: BALL_FLIGHT_SEMANTICS.hook.startSide,
    curveDirection: BALL_FLIGHT_SEMANTICS.hook.curveDirection,
    curvatureStrength: BALL_FLIGHT_SEMANTICS.hook.curveAmount,
    endSide: BALL_FLIGHT_SEMANTICS.hook.endBias,
    handednessAssumption: "right-handed",
  },
  slice: {
    name: "slice",
    startSide: BALL_FLIGHT_SEMANTICS.slice.startSide,
    curveDirection: BALL_FLIGHT_SEMANTICS.slice.curveDirection,
    curvatureStrength: BALL_FLIGHT_SEMANTICS.slice.curveAmount,
    endSide: BALL_FLIGHT_SEMANTICS.slice.endBias,
    handednessAssumption: "right-handed",
  },
};

export { curveDirectionSign };

export function xFromSide(side: StartSide, centerX: number, laneOffset: number): number {
  return centerX + sideToNormalizedX(side) * laneOffset;
}

export const getShotPathGeometry = getBallFlightPathGeometry;
