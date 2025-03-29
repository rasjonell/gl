import * as Three from 'three';
import { SceneObject } from './SceneObject';
import { Room } from './Room';
import { Camera } from './Camera';

class MainScene {
  private scene: Three.Scene;
  private canvas: HTMLElement;
  private renderer: Three.WebGLRenderer;
  private camera: Three.PerspectiveCamera;
  private objects: Map<number, SceneObject> = new Map();

  private lastTick = 0;

  constructor() {
    this.scene = this.setupScene();
    this.camera = this.setupCamera();
    this.canvas = document.getElementById('webgl')!;

    this.renderer = new Three.WebGLRenderer({ canvas: this.canvas });
    this.setupResize();
    this.render = this.render.bind(this);
  }

  resize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addObjectsToScene(...objects: SceneObject[]): void {
    for (const obj of objects) {
      if (this.objects.has(obj.id)) {
        continue;
      }

      this.objects.set(obj.id, obj);
      this.scene.add(obj.asObject3D());
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

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }

  private setupScene(): Three.Scene {
    const scene = new Three.Scene();
    scene.background = new Three.Color(0x1a1a2e);
    return scene;
  }

  private setupCamera(): Three.PerspectiveCamera {
    const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.addObjectsToScene(camera);
    return camera.asObject3D() as Three.PerspectiveCamera;
  }

  private setupResize(): void {
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }
}

const scene = new MainScene();
scene.addObjectsToScene(new Room());
scene.render();
