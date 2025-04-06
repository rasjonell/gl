import { Vector3 } from "three";
import { FocusableObject } from "./FocusableObject";
import { SceneObject } from "./SceneObject";

export class Shelf extends FocusableObject {
  constructor(adder: (...obj: SceneObject[]) => void) {
    super("shelf", adder, {
      scale: new Vector3(1.5, 1.5, 1.5),
      position: new Vector3(7, 0.1, 1),
      rotation: new Vector3(0, (3 * Math.PI) / 2, 0),
    });
  }
}
