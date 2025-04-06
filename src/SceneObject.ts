import { Mesh, MeshBasicMaterial, type Object3D } from "three";

export abstract class SceneObject {
  abstract get id(): number;
  abstract get isDirty(): boolean;
  abstract get isFocusable(): boolean;

  abstract render(deltaTime: number): void;
  abstract asObject3D(): Object3D | Object3D[];

  abstract luminate(): void;
  abstract deluminate(): void;
}

export class SceneObjectFactory {
  static createFromObject3D(
    object: Object3D,
    opts: {
      dirty?: boolean;
      focusable?: boolean;
    } = {},
  ): SceneObject {
    const { focusable = false, dirty = false } = opts;

    return new (class extends SceneObject {
      private _dirty = dirty;
      private _object = object;

      get id(): number {
        return this._object.id;
      }

      get isDirty(): boolean {
        return this._dirty;
      }

      get isFocusable(): boolean {
        return focusable;
      }

      asObject3D(): Object3D {
        return this._object;
      }

      luminate(): void {}
      deluminate(): void {}
      render(): void {}
    })();
  }

  static createOutlineMesh(
    originalObject: Object3D,
    color = 0xfdefb2,
    scale = 1,
  ): Object3D {
    const outlineMesh = originalObject.clone();
    outlineMesh.scale.multiplyScalar(scale);
    const outlineMaterial = new MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.3,
    });

    outlineMesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = outlineMaterial;
      }
    });

    outlineMesh.visible = false;

    return outlineMesh;
  }
}
