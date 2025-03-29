import * as Three from "three";
import { SceneObject } from "./SceneObject";

export class Box extends SceneObject {
  private dirty = false;
  private mesh: Three.Mesh;
  private material: Three.MeshLambertMaterial;

  private preLumColor: number;
  private isLuminated = false;

  constructor(x = 0, y = 0, z = 0) {
    super();
    this.preLumColor = Math.random() * 0xffffff;
    const geometry = new Three.BoxGeometry(1, 1, 3);
    this.material = new Three.MeshLambertMaterial({
      color: this.preLumColor,
    });
    this.mesh = new Three.Mesh(geometry, this.material);
    this.mesh.position.set(x, y, z);

    this.dirty = true;
  }

  get id(): number {
    return this.mesh.id;
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  get isFocusable(): boolean {
    return true;
  }

  asObject3D(): Three.Object3D {
    return this.mesh;
  }

  luminate(): void {
    if (this.isLuminated) return;
    this.preLumColor = this.material.emissive.getHex();
    this.material.emissive.setHex(0x555555);
    this.isLuminated = true;
  }

  deluminate(): void {
    if (!this.isLuminated) return;
    this.material.emissive.setHex(this.preLumColor);
    this.isLuminated = false;
  }

  render(): void {}
}
