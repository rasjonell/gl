import type { Vector3, Object3D } from "three";
import type { SceneObject } from "./SceneObject";

export type ObjectFocusOpts = {
  center: Vector3;
  duration: number;
  startTime: number;
  endPosition: Vector3;
  startPosition: Vector3;
};

export type ObjectOptions = {
  scale?: Vector3;
  rotation?: Vector3;
  position?: Vector3;
};

export type IntersectedObject = {
  object: SceneObject;
  object3D: Object3D;
} | null;
