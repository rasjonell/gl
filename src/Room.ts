import * as Three from "three";
import { SceneObject } from "./SceneObject";

export class Room extends SceneObject {
  private walls: Three.Mesh[] = [];

  constructor() {
    super();
    this.buildWalls();
  }

  buildWalls(): void {
    const w = 10;
    const h = 5;
    const d = 7;
    const wd = 0.2;

    const floor = this.createWall(w, d, 0x888888);
    floor.position.y = 0;
    floor.rotation.x = Math.PI / 2;

    const ceil = this.createWall(w, d, 0xaaaaaa);
    ceil.position.y = h - wd;
    ceil.rotation.x = Math.PI / 2;

    const left = this.createWall(d, h, 0x555555);
    left.position.set(-(w + wd) / 2, (h - wd) / 2, 0);
    left.rotation.y = Math.PI / 2;

    const right = left.clone();
    right.position.set((w + wd) / 2, (h - wd) / 2, 0);

    const back = this.createWall(w, h - 2 * wd, 0x666666);
    back.position.set(0, (h - wd) / 2, -(d - wd) / 2);

    this.walls = [floor, ceil, left, right, back];
  }

  createWall(w: number, h: number, color: number): Three.Mesh {
    const geom = new Three.BoxGeometry(w, h, 0.2);
    const material = new Three.MeshBasicMaterial({
      color,
    });
    return new Three.Mesh(geom, material);
  }

  get id(): number {
    return this.walls[0].id;
  }

  get isDirty(): boolean {
    return false;
  }

  get isFocusable(): boolean {
    return false;
  }

  asObject3D(): Three.Object3D | Three.Object3D[] {
    return this.walls;
  }

  luminate(): void {}
  deluminate(): void {}

  render(): void {}
}
