import { Vector3 } from "three";
import { FocusableObject } from "./FocusableObject";
import { SceneObject } from "./SceneObject";

export class Keyboard extends FocusableObject {
  constructor(adder: (...obj: SceneObject[]) => void) {
    super("keyboard", adder, {
      scale: new Vector3(0.05, 0.05, 0.05),
      position: new Vector3(2.68, 1.825, -5),
    });
  }
}
