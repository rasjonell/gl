import type { Object3D } from "three";

export abstract class SceneObject {
  abstract get id(): number;
  abstract get isDirty(): boolean;
  abstract get isFocusable(): boolean;

  abstract render(deltaTime: number): void;
  abstract asObject3D(): Object3D | Object3D[];

  abstract luminate(): void;
  abstract deluminate(): void;
}
