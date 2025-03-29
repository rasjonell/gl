import * as Three from "three";
import { SceneObject } from "./SceneObject";
import { Room } from "./Room";
import { Camera } from "./Camera";
import { Box } from "./Box";

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
    scene.background = new Three.Color(0xf0f0f0);
    const light = new Three.HemisphereLight(0xffffff, 0x888888, 3);
    light.position.set(0, 2, 0);
    scene.add(light);
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
    this.canvas.addEventListener("click", (e) => {
      if (e.detail !== 2) return;

      const intersectedObject = this.getIntersectedObject(e);

      if (intersectedObject) {
        this.camera.setFocusObject(intersectedObject.object3D, 1.5);
      }
    });

    this.canvas.addEventListener("mousemove", (e) => {
      const intersectedObject = this.getIntersectedObject(e);

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
  }

  private getIntersectedObject(
    e: MouseEvent,
  ): { object: SceneObject; object3D: Three.Object3D } | null {
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

    const obj = this.objects.get(intersects[0].object.id);
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

scene.addObjectsToScene(
  new Room(),
  new Box(4.5, 0.6, 0),
  new Box(-4.5, 0.6, 0),
);

scene.render();
