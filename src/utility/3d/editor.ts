"use client";
import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Editor3D } from '@type/index';
import Camera from './cameras/camera';
import Light from './lights/light';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
//import ArcballControls from './controls/ArcballControls';

enum ArcballControlsMouseActionOperations {
    PAN = 'PAN',
    ROTATE = 'ROTATE',
    ZOOM = 'ZOOM',
    FOV = 'FOV',
}

class Editor implements Editor3D {
    id: string;
    scene: THREE.Scene;
    container: HTMLElement | null;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
    private sceneLights: THREE.Object3D | null;
    private cameraLights: THREE.Object3D | null;
    renderer: THREE.WebGLRenderer;
    width: number;
    height: number;
    control: ArcballControls | null;
    cameraDistance: number;
    private fov: number;
    constructor(id: string) {
        this.id = id;
        this.scene = new THREE.Scene();
        this.camera = null;
        this.sceneLights = null;
        this.cameraLights = null;
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.container = null;
        this.control = null;
        this.cameraDistance = 200;
        this.fov = 25;
    };

    get light(): { scene: THREE.Object3D | null, camera: THREE.Object3D | null } {
        return {
            scene: this.sceneLights,
            camera: this.cameraLights
        }
    }

    initialize = (ref: HTMLElement | null): void => {
        if (!ref) console.log(' initialize failed. ');

        this.container = ref;

        this._setSize();
        this._setCamera();
        if (!this.camera) return;

        this.scene.add(this.camera);
        //this.scene.add(new THREE.AxesHelper(5));

        this._setRenderer();

        if (this.container)
            this.container.appendChild(this.renderer.domElement);

        this._setLight();

        if (this.cameraLights)
            this.camera.add(this.cameraLights);
        if (this.sceneLights)
            this.scene.add(this.sceneLights);

        this._setControl();

        window.addEventListener('resize', this._windowResize);
    }

    _animate = (): void => {
        if (!this.container) return;
        if (!this.camera) return;

        if (this.control)
            this.control.update();

        if (TWEEN)
            TWEEN.update();

        this.renderer.render(this.scene, this.camera);
    }

    _setCamera = (): void => {
        this.camera = Camera({
            width: this.width,
            height: this.height,
            fov: this.fov,
            cameraDistance: this.cameraDistance
        }).makePerspectiveCamera();
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.up.set(0, 1, 0);
        this.camera.zoom = 10;
    }

    _setRenderer = (): void => {
        this.renderer.autoClear = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setAnimationLoop(this._animate);
    }

    _setControl = (): void => {
        if (!this.container) return;
        if (!this.camera) return;

        let control = new ArcballControls(this.camera, this.container, this.scene);

        control.enableAnimations = false;
        control.radiusFactor = 0.1;
        control.maxDistance = 2000;

        control.enablePan = true;
        //control.cursorZoom = true;
        control.target.set(0, 0, 0);
        control.setGizmosVisible(false);
        control.unsetMouseAction(0);

        control.setMouseAction(ArcballControlsMouseActionOperations.PAN, 1);
        control.setMouseAction(ArcballControlsMouseActionOperations.ZOOM, 'WHEEL');
        control.setMouseAction(ArcballControlsMouseActionOperations.ROTATE, 2);
        this.control = control;
    }

    _setLight = (): void => {
        this.sceneLights = Light().makeSceneLight();
        this.cameraLights = Light().makeCameraLight();
    };

    _setSize = (): void => {
        if (!this.container) return;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
    };

    _windowResize = (): void => {
        if (!this.camera) return;
        this._setSize();
        if (this.camera.type == 'OrthographicCamera') {
            const halfFovV = THREE.MathUtils.DEG2RAD * this.fov * 0.5;
            const halfFovH = Math.atan((this.width / this.height) * Math.tan(halfFovV));
            const halfW = this.cameraDistance * Math.tan(halfFovH);
            const halfH = this.cameraDistance * Math.tan(halfFovV);
            this.camera = this.camera as THREE.OrthographicCamera;
            this.camera.left = - halfW;
            this.camera.right = halfW;
            this.camera.top = halfH;
            this.camera.bottom = - halfH;
        } else if (this.camera.type == 'PerspectiveCamera') {
            this.camera = this.camera as THREE.PerspectiveCamera;
            this.camera.aspect = this.width / this.height;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.renderer.render(this.scene, this.camera);
    }

    remove = (): void => {
        this.renderer.forceContextLoss();
        if (this.container) this.container.removeChild(this.renderer.domElement);
    }

    zoomExtents = (center: THREE.Vector3, max: THREE.Vector3) => {
        if (!this.camera) return;
        if (!this.control) return;
        let maxRadiusSq = center.distanceToSquared(max);
        let scale = 1.2;
        const maxDiameter = 2 * Math.sqrt(maxRadiusSq);
        const factor = Math.min(this.width, this.height) / maxDiameter;
        this.camera.zoom = factor * scale;
        this.control.target.copy(center);
        this.control.update();
    }
}

export default Editor;