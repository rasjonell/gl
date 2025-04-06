import * as Three from "three";
import { SceneObject } from "./SceneObject";
import { Room } from "./Room";
import { Camera } from "./Camera";
import { Desk } from "./Desk";
import { Monitor } from "./Monitor";
import { Keyboard } from "./Keyboard";
import { IntersectedObject } from "./types";
// import { Shelf } from "./Shelf";

class MainScene {
  private camera: Camera;
  private scene: Three.Scene;
  private canvas: HTMLElement;
  private renderer: Three.WebGLRenderer;
  private focusableObjects: Three.Object3D[] = [];
  private objects: Map<number, SceneObject> = new Map();

  private lastTick = 0;

  constructor() {
    this.scene = this.setupScene();
    this.canvas = document.getElementById("webgl")!;

    this.renderer = new Three.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.camera = this.setupCamera();

    this.setupResize();
    this.render = this.render.bind(this);

    this.registerIntersectionEvents();
  }

  get threeCamera(): Three.PerspectiveCamera {
    return this.camera.asObject3D() as Three.PerspectiveCamera;
  }

  resize(): void {
    this.threeCamera.aspect = window.innerWidth / window.innerHeight;
    this.threeCamera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addObjectsToScene(...objects: SceneObject[]): void {
    for (const obj of objects) {
      if (this.objects.has(obj.id)) {
        continue;
      }

      const objs = this.get3DObjects(obj.asObject3D());
      if (obj.isFocusable) {
        this.focusableObjects.push(...objs);
      }
      this.objects.set(obj.id, obj);
      this.scene.add(...objs);
    }
  }

  render(): void {
    const now = performance.now();
    const deltaTime = now - this.lastTick;
    this.lastTick = now;

    for (const obj of this.objects.values()) {
      if (obj.isDirty) {
        obj.render(deltaTime);
      }
    }

    this.renderer.render(this.scene, this.threeCamera);

    window.requestAnimationFrame(this.render.bind(this));
  }

  private setupScene(): Three.Scene {
    const scene = new Three.Scene();
    const ambLight = new Three.AmbientLight(0xf0f0f0, 1);
    scene.add(ambLight);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return scene;
    }
    canvas.width = 1;
    canvas.height = 256;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "#4567b7");
    gradient.addColorStop(1, "#6495ed");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);
    const texture = new Three.CanvasTexture(canvas);
    texture.minFilter = Three.LinearFilter;
    scene.background = texture;

    return scene;
  }

  private setupCamera(): Camera {
    const camera = new Camera(
      this.renderer,
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.addObjectsToScene(camera);
    return camera;
  }

  private setupResize(): void {
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
  }

  private registerIntersectionEvents(): void {
    let intersectedObject: IntersectedObject = null;

    this.canvas.addEventListener("mousemove", (e) => {
      intersectedObject = this.getIntersectedObject(e);

      if (
        intersectedObject &&
        !this.camera.isZoomed(intersectedObject.object3D.id)
      ) {
        document.body.setAttribute("style", "cursor: pointer");
        intersectedObject.object.luminate();
      } else {
        document.body.setAttribute("style", "cursor: inherit");
      }

      for (const fo of this.focusableObjects) {
        if (intersectedObject && fo.id === intersectedObject.object3D.id) {
          continue;
        }
        this.objects.get(fo.id)?.deluminate();
      }
    });

    this.canvas.addEventListener("click", (e) => {
      if (e.detail !== 2) return;

      if (intersectedObject) {
        this.camera.setFocusObject(intersectedObject.object3D, 1.5);
      }
    });
  }

  private getIntersectedObject(e: MouseEvent): IntersectedObject {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new Three.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1,
    );

    const raycaster = new Three.Raycaster();
    raycaster.setFromCamera(mouse, this.threeCamera);
    const intersects = raycaster.intersectObjects(this.focusableObjects, true);
    if (!intersects.length) {
      return null;
    }

    let currentObject = intersects[0].object;
    let obj: SceneObject | undefined;

    while (currentObject && !obj) {
      obj = this.objects.get(currentObject.id);
      currentObject = currentObject.parent as Three.Object3D;
    }

    if (!obj) {
      return null;
    }

    return {
      object: obj,
      object3D: this.get3DObject(obj.asObject3D()),
    };
  }

  private get3DObjects(
    objs: Three.Object3D | Three.Object3D[],
  ): Three.Object3D[] {
    if (Array.isArray(objs)) return objs;
    return [objs];
  }

  private get3DObject(objs: Three.Object3D | Three.Object3D[]): Three.Object3D {
    if (Array.isArray(objs)) return objs[0];
    return objs;
  }
}

const scene = new MainScene();

scene.addObjectsToScene(new Room());

new Desk(scene.addObjectsToScene.bind(scene));
new Monitor(scene.addObjectsToScene.bind(scene));
new Keyboard(scene.addObjectsToScene.bind(scene));

scene.render();
