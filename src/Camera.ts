import * as Three from 'three';
import { SceneObject } from './SceneObject';

export class Camera extends SceneObject {
  private dirty = true;
  private threeCamera: Three.PerspectiveCamera;

  private startPosition = new Three.Vector3(-15, 10, 8);
  private endPosition = new Three.Vector3(0, 0, 12);

  private lerpFactor = 0.02;
  private isMovingToEnd = true;

  constructor(fov: number, aspect: number, near: number, far: number) {
    super();
    this.threeCamera = new Three.PerspectiveCamera(fov, aspect, near, far);
    this.threeCamera.position.set(...this.startPosition.toArray());
    this.threeCamera.name = Camera.name;
  }

  updateAspectRatio(aspect: number) {
    this.threeCamera.aspect = aspect;
    this.threeCamera.updateProjectionMatrix();
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  get id(): number {
    return this.threeCamera.id;
  }

  asObject3D(): Three.Object3D {
    return this.threeCamera;
  }

  render(): void {
    const target = this.isMovingToEnd ? this.endPosition : this.startPosition;

    this.threeCamera.position.lerp(target, this.lerpFactor);
    this.threeCamera.lookAt(0, 0, 0);

    if (this.threeCamera.position.distanceTo(target) < 0.1) {
      this.isMovingToEnd = !this.isMovingToEnd;
    }
  }
}
