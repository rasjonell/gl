import type { Vector3 } from "three";

export type ObjectFocusOpts = {
  center: Vector3;
  duration: number;
  startTime: number;
  endPosition: Vector3;
  startPosition: Vector3;
};
