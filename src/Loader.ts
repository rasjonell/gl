import { type Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

export class Loader {
  private loader: GLTFLoader;
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.loader = new GLTFLoader();
  }

  load(onComplete: (obj: Object3D) => void) {
    this.loader.load(this.filePath, (data) => {
      const scene = data.scene;
      scene.traverse((child) => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      onComplete(scene);
    });
  }
}
