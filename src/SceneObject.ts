import type { Object3D } from 'three';

export abstract class SceneObject {
  abstract get isDirty(): boolean;
  abstract get id(): number;

  abstract asObject3D(): Object3D;
  abstract render(deltaTime: number): void;
}
