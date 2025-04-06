import * as Three from "three";

import { SceneObject, SceneObjectFactory } from "./SceneObject";
import { FocusableObject } from "./FocusableObject";

export class Desk extends FocusableObject {
  constructor(adder: (...obj: SceneObject[]) => void) {
    super(
      "desk",
      adder,
      {
        scale: new Three.Vector3(3, 2.3, 3),
        position: new Three.Vector3(3.3, 0.1, -4.3),
        rotation: new Three.Vector3(0, (3 * Math.PI) / 2, 0),
      },
      Desk.buildLights,
    );
  }

  private static buildLights(target: Three.Object3D): SceneObject[] {
    const light1 = new Three.DirectionalLight(0xf8f1cd, 2);
    light1.position.set(1, 5, -4.5);
    light1.target = target;
    const helper1 = new Three.DirectionalLightHelper(light1);

    const light2 = light1.clone();
    light2.position.set(5, 5, 0);
    const helper2 = new Three.DirectionalLightHelper(light2);
    return [
      SceneObjectFactory.createFromObject3D(light1),
      SceneObjectFactory.createFromObject3D(helper1),
      SceneObjectFactory.createFromObject3D(light2),
      SceneObjectFactory.createFromObject3D(helper2),
    ];
  }
}
