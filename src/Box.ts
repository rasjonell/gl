import * as Three from 'three';
import { SceneObject } from './SceneObject';

export class Box extends SceneObject {
  private dirty: boolean;
  private mesh: Three.Mesh;

  constructor(x = 0, y = 0, z = 0) {
    super();
    const geometry = new Three.BoxGeometry(1, 1, 1);
    const material = new Three.MeshBasicMaterial({
      color: 0xff0000,
    });
    this.mesh = new Three.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);

    this.dirty = true;
  }

  pauseAnimation() {
    this.dirty = false;
  }

  resumeAnimation() {
    this.dirty = true;
  }

  private animate(deltaTime: number): void {
    const factor = 0.001 * deltaTime;
    this.mesh.rotation.x += factor;
    this.mesh.rotation.y += factor;
    this.mesh.rotation.z += factor;
  }

  get id(): number {
    return this.mesh.id;
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  asObject3D(): Three.Object3D {
    return this.mesh;
  }

  render(deltaTime: number): void {
    this.animate(deltaTime);
  }
}
