import * as THREE from 'three';
import { acceleratedRaycast } from "three-mesh-bvh";
THREE.Mesh.prototype.raycast = acceleratedRaycast;
import { getIntersectsTriangleIndices, getIntersectionPoints } from './bvh/bvh';
import { RBFMorph } from '@utility/algorthim/RBFMorph';

import { drawBrush } from './draw/draw';

interface BrushObject {
    add(point: THREE.Vector3): void,
    remove(): void,
    nonvisible(): void
}

type Param = {
    size: number
    intensity: number
}

const SizeValue = [0.2, 0.4, 0.5, 0.6];
const IntensityValue = [5, 20, 40, 60];

export const getmouse2D = (e: MouseEvent, container: HTMLElement) => {
    let rect = container.getBoundingClientRect();
    let mouse = new THREE.Vector2();
    mouse.x = ((e.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
    mouse.y = - ((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    return mouse;
}

class MorphControl extends THREE.EventDispatcher {
    _mesh: THREE.Mesh;
    _camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
    _scene: THREE.Scene;
    _container: HTMLElement;
    _raycaster: THREE.Raycaster;
    _selected: boolean;
    _currentVector3: THREE.Vector3;
    _brushMesh: THREE.Mesh | null;
    _intersecTriangleIndics: number[];
    _intersecPoints: THREE.Vector3[];
    enabled: boolean;
    param: Param;
    constructor(
        mesh: THREE.Mesh,
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null,
        container: HTMLElement
    ) {
        super();
        this._mesh = mesh;
        this._scene = scene;
        this._camera = camera;
        this._container = container;
        this._raycaster = new THREE.Raycaster();
        this.enabled = true;
        this._selected = false;
        this._currentVector3 = new THREE.Vector3();

        this._brushMesh = null;

        this._addEvent();

        this._intersecTriangleIndics = [];
        this._intersecPoints = [];

        this.param = {
            size: SizeValue[2],
            intensity: IntensityValue[2]
        }
    }

    _addEvent = () => {
        if (!this._container) return;
        this._container.addEventListener('mousemove', this._onMouseMove);
        this._container.addEventListener('mousedown', this._onMouseDown);
        this._container.addEventListener('mouseup', this._onMouseUp);
    }

    _onMouseDown = (e: MouseEvent) => {
        if (!this.enabled) return;
        if (!this._container) return;
        if (!this._camera) return;
        if (!this._mesh) return;
        if (e.button != 0) return;
        let mouse = getmouse2D(e, this._container);
        const raycaster = this._raycaster;
        raycaster.firstHitOnly = false;
        raycaster.setFromCamera(mouse, this._camera);
        const res = raycaster.intersectObjects([this._mesh]);
        if (res.length > 0) {
            this._selected = true;
            this._currentVector3 = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(this._camera);
        }
    }

    _onMouseMove = (e: MouseEvent) => {
        if (!this.enabled) return;

        if (!this._camera) return;
        if (!this._container) return;

        let mouse = getmouse2D(e, this._container);
        const raycaster = this._raycaster;
        raycaster.firstHitOnly = false;
        raycaster.setFromCamera(mouse, this._camera);

        const newVector3 = new THREE.Vector3(mouse.x, mouse.y, 0).unproject(this._camera);
        let offset = newVector3.clone().sub(this._currentVector3);
        const res = raycaster.intersectObjects([this._mesh]);

        const brush = this._generateBrush();
        if (res.length > 0)
            brush.add(res[0].point);
        else
            brush.nonvisible();

        if (this._selected)
            this.excuteMorph(offset);

        this._currentVector3 = newVector3;
    }

    _onMouseUp = () => {
        this._selected = false;
        this._intersecPoints.length = 0
        this._intersecTriangleIndics.length = 0
    }

    excuteMorph = (offset: THREE.Vector3) => {
        if (!this._mesh) return;
        const geometry = (this._mesh as THREE.Mesh).geometry;
        let morphSampleSphereRadius = this.param.size;
        let triangleIndics = this._intersecTriangleIndics;

        if (triangleIndics.length == 0) {
            triangleIndics = getIntersectsTriangleIndices(this._mesh, this._brushMesh as THREE.Mesh, morphSampleSphereRadius);
            this._intersecTriangleIndics = triangleIndics;
        }
        if (triangleIndics.length == 0) return;

        let sampleMorphPointsLength = triangleIndics.length * 0.5;
        let points = this._intersecPoints;

        if (points.length == 0) {
            points = getIntersectionPoints(geometry, triangleIndics, sampleMorphPointsLength);
            this._intersecPoints = points;
        }

        let destination = new Array(points.length);
        for (let i = 0; i < points.length; i++) {
            destination[i] = new THREE.Vector3().addVectors(points[i], offset.multiplyScalar(1.1));
        }
        RBFMorph(geometry, points, destination, this.param.size, this.param.intensity);
        geometry.computeBoundsTree();
    }

    _generateBrush = (): BrushObject => {
        let brushMesh = this._brushMesh;
        const add = (point: THREE.Vector3) => {
            if (!this._scene) return;
            if (brushMesh) {
                brushMesh.visible = true;
                brushMesh.position.copy(point);
            }
            else {
                const mesh = drawBrush(this.param.size);
                mesh.position.copy(point);
                this._scene.add(mesh)
                this._brushMesh = mesh;
            }
        }
        const remove = () => {
            if (!this._scene) return;
            if (brushMesh) {
                (brushMesh as THREE.Mesh).geometry.dispose();
                this._scene.remove(brushMesh);
                this._brushMesh = null;
            }
        }
        const nonvisible = () => {
            if (this._brushMesh)
                this._brushMesh.visible = false;
        }
        return {
            add, remove, nonvisible
        }
    }

    sizeChanged = (index: number) => {
        if (this._brushMesh) {
            let radius = SizeValue[index];
            this._brushMesh.geometry.dispose();
            this._brushMesh.geometry = new THREE.SphereGeometry(radius, 32, 32);
            this.param.size = radius;
        }
    }

    intensityChanged = (index: number) => {
        this.param.intensity = IntensityValue[index];
    }
}
export default MorphControl;