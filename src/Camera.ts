import * as Three from "three";
import { SceneObject } from "./SceneObject";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ObjectFocusOpts } from "./types";

export class Camera extends SceneObject {
  private dirty = true;
  private controls: OrbitControls;
  private threeCamera: Three.PerspectiveCamera;

  private startPosition = new Three.Vector3(-20, 15, 20);
  private endPosition = new Three.Vector3(-2, 2, 10);
  private shouldFadeIn = true;

  private zoomedId: number | null = null;
  private zoomAnimation?: ObjectFocusOpts;

  constructor(
    renderer: Three.WebGLRenderer,
    fov: number,
    aspect: number,
    near: number,
    far: number,
  ) {
    super();
    this.threeCamera = new Three.PerspectiveCamera(fov, aspect, near, far);
    this.threeCamera.position.set(...this.startPosition.toArray());
    this.threeCamera.name = Camera.name;

    this.controls = this.setupControls(renderer);
  }

  updateAspectRatio(aspect: number) {
    this.threeCamera.aspect = aspect;
    this.threeCamera.updateProjectionMatrix();
  }

  setFocusObject(object: Three.Object3D, duration = 1.0): void {
    if (this.shouldFadeIn) return;

    const bbox = new Three.Box3().setFromObject(object);
    const center = bbox.getCenter(new Three.Vector3());

    this.threeCamera.updateProjectionMatrix();
    this.controls.update();

    this.zoomAnimation = {
      center,
      duration,
      startTime: performance.now(),
      startPosition: this.threeCamera.position.clone(),
      endPosition: center
        .clone()
        .add(new Three.Vector3(center.x < 0 ? 2.5 : -2.5, 3, 0)),
    };
    this.zoomedId = object.id;
  }

  get id(): number {
    return this.threeCamera.id;
  }

  get isDirty(): boolean {
    return this.dirty;
  }

  get isFocusable(): boolean {
    return false;
  }

  luminate(): void {}
  deluminate(): void {}

  asObject3D(): Three.Object3D {
    return this.threeCamera;
  }

  isZoomed(id: number): boolean {
    return this.zoomedId === id;
  }

  render(): void {
    this.fadeIn();
    this.zoomToObject();
    this.updateControls();
  }

  private fadeIn(): void {
    if (!this.shouldFadeIn) return;
    this.threeCamera.position.lerp(this.endPosition, 0.015);
    if (this.threeCamera.position.distanceTo(this.endPosition) < 0.2) {
      this.shouldFadeIn = false;
      this.controls.enabled = true;
    }
  }

  private zoomToObject(): void {
    if (!this.zoomAnimation) return;
    const { center, startPosition, endPosition, startTime, duration } =
      this.zoomAnimation;

    const elapsed = (performance.now() - startTime) / 1000;
    const progress = Math.min(elapsed / duration, 1);
    this.threeCamera.position.lerpVectors(startPosition, endPosition, progress);

    this.controls.target.lerpVectors(this.controls.target, center, 0.01);

    if (progress >= 1) {
      this.zoomAnimation = undefined;
    }
  }

  private updateControls(): void {
    this.controls.update();
  }

  private setupControls(renderer: Three.WebGLRenderer): OrbitControls {
    const controls = new OrbitControls(this.threeCamera, renderer.domElement);
    controls.listenToKeyEvents(window);

    controls.target.set(0, 2.5, 0);
    controls.enabled = false;
    controls.enableDamping = true;
    controls.autoRotate = false;
    controls.dampingFactor = 0.025;
    controls.rotateSpeed = 0.5;
    controls.keyRotateSpeed = 10;
    controls.maxZoom = 4;
    controls.keyRotateSpeed = 10;

    return controls;
  }
}
