import { SceneObject } from "./SceneObject";
import { FocusableObject } from "./FocusableObject";
import { Vector3 } from "three";

export class Monitor extends FocusableObject {
  constructor(adder: (...obj: SceneObject[]) => void) {
    super("monitor", adder, {
      scale: new Vector3(0.35, 0.35, 0.35),
      rotation: new Vector3(0, (3 * Math.PI) / 2, 0),
      position: new Vector3(2.7, 1.8, -5.3),
    });
  }
}
