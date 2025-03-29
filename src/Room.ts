import * as Three from 'three';
import { SceneObject } from './SceneObject';

export class Room extends SceneObject {
  private walls: Three.Mesh[] = [];
  private roomGroup: Three.Group;

  constructor() {
    super();
    this.roomGroup = new Three.Group();
    this.buildWalls();
  }

  buildWalls(): void {
    const w = 10;
    const h = 5;
    const d = 7;
    const wd = 0.2;

    const floor = this.createWall(w, d, 0x888888);
    floor.position.y = -(h - wd) / 2;
    floor.rotation.x = Math.PI / 2;

    const ceil = this.createWall(w, d, 0xaaaaaa);
    ceil.position.y = (h - wd) / 2;
    ceil.rotation.x = Math.PI / 2;

    const left = this.createWall(d, h, 0x555555);
    left.position.set(-(w + wd) / 2, 0, 0);
    left.rotation.y = Math.PI / 2;

    const right = left.clone();
    right.position.set((w + wd) / 2, 0, 0);

    const back = this.createWall(w, h, 0x666666);
    back.position.set(0, 0, -d / 2);

    this.roomGroup.add(floor, ceil, left, right, back);
  }

  createWall(w: number, h: number, color: number): Three.Mesh {
    const geom = new Three.BoxGeometry(w, h, 0.2);
    const material = new Three.MeshBasicMaterial({ color });
    return new Three.Mesh(geom, material);
  }

  get isDirty(): boolean {
    return false;
  }

  get id(): number {
    return this.roomGroup.id;
  }

  asObject3D(): Three.Object3D {
    return this.roomGroup;
  }

  render(): void {}
}
