import * as Three from "three";

import { Loader } from "./Loader";
import { SceneObject, SceneObjectFactory } from "./SceneObject";
import { ObjectOptions } from "./types";

export class FocusableObject extends SceneObject {
  private dirty = false;
  private loader: Loader;
  private object: Three.Object3D;

  private isLuminated = false;
  private outlineMesh?: Three.Object3D;
  private outlineObject: SceneObject = this;

  constructor(
    glb: string,
    adder: (...obj: SceneObject[]) => void,
    objOpts?: ObjectOptions,
    objBuilder: (target: Three.Object3D) => SceneObject[] = () => [],
  ) {
    super();
    this.loader = new Loader(glb + ".glb");
    this.object = new Three.Object3D();
    this.loader.load((obj) => {
      this.object = this.createObject(obj, objOpts);
      this.outlineObject = this.createOutlineMesh();
      adder(this, this.outlineObject, ...objBuilder(this.object));
    });
  }

  get id(): number {
    return this.object.id;
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  get isFocusable(): boolean {
    return true;
  }

  get outline(): SceneObject {
    return this.outlineObject;
  }

  asObject3D(): Three.Object3D {
    return this.object;
  }

  luminate(): void {
    if (this.isLuminated || !this.outlineMesh) return;
    this.outlineMesh.visible = true;
    this.isLuminated = true;
    this.dirty = true;
  }

  deluminate(): void {
    if (!this.isLuminated || !this.outlineMesh) return;
    this.outlineMesh.visible = false;
    this.isLuminated = false;
    this.dirty = true;
  }

  render() {}

  private createObject(
    obj: Three.Object3D,
    objOpts: ObjectOptions = {
      scale: new Three.Vector3(1, 1, 1),
      position: new Three.Vector3(0, 0, 0),
    },
  ): Three.Object3D {
    const {
      scale = { x: 1, y: 1, z: 1 },
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
    } = objOpts;

    obj.scale.set(scale.x, scale.y, scale.z);
    obj.rotation.set(rotation.x, rotation.y, rotation.z);
    obj.position.set(position.x, position.y, position.z);
    return obj;
  }

  private createOutlineMesh(): SceneObject {
    this.outlineMesh = SceneObjectFactory.createOutlineMesh(this.object);
    return SceneObjectFactory.createFromObject3D(this.outlineMesh);
  }
}
