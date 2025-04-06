import * as Three from "three";
import { SceneObject } from "./SceneObject";

export class Room extends SceneObject {
  private walls: Three.Mesh[] = [];
  private wallTexture: Three.Texture;
  private floorTexture: Three.Texture;
  private textureLoader: Three.TextureLoader;

  constructor() {
    super();

    this.textureLoader = new Three.TextureLoader();
    this.wallTexture = this.buildWallTexture();
    this.floorTexture = this.buildFloorTexture();

    this.buildWalls();
  }

  private buildWallTexture(): Three.Texture {
    const floorTexture = this.textureLoader.load("../wall.jpg");
    floorTexture.wrapS = Three.MirroredRepeatWrapping;
    floorTexture.wrapT = Three.MirroredRepeatWrapping;
    floorTexture.repeat.set(3, 1);
    return floorTexture;
  }

  private buildFloorTexture(): Three.Texture {
    const wallTexture = this.textureLoader.load("../floor.jpg");
    wallTexture.wrapS = Three.MirroredRepeatWrapping;
    wallTexture.wrapT = Three.MirroredRepeatWrapping;
    wallTexture.repeat.set(3, 3);
    return wallTexture;
  }

  buildWalls(): void {
    const w = 12;
    const h = 5;
    const d = 12;
    const wd = 0.2;

    const floor = this.createWall(w, d - wd, this.floorTexture);
    floor.position.set(0, 0, wd / 2);
    floor.rotation.x = Math.PI / 2;

    const right = this.createWall(d, h - wd, this.wallTexture);
    right.rotation.y = Math.PI / 2;
    right.position.set((w + wd) / 2, (h - 2 * wd) / 2, 0);

    const back = this.createWall(w, h - wd, this.wallTexture);
    back.position.set(0, (h - 2 * wd) / 2, -(d - wd) / 2);

    this.walls = [floor, right, back];
  }

  createWall(w: number, h: number, texture: Three.Texture): Three.Mesh {
    const geom = new Three.BoxGeometry(w, h, 0.2);
    const material = new Three.MeshLambertMaterial({
      map: texture,
    });
    const mesh = new Three.Mesh(geom, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
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
