'use client'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Editor3D, Morph3D } from '@type/index';

import MorphControl from '../MorphControl';

class MorphAction implements Morph3D {
    _editor: Editor3D | null;
    _mesh: THREE.Object3D | THREE.Mesh | null;
    _originMeshGeometry: THREE.BufferGeometry | null;
    _brushMesh: THREE.Object3D | THREE.Mesh | null;
    morphControl: MorphControl | null;
    enabled: boolean;
    constructor() {
        this._editor = null;
        this._mesh = null;
        this._originMeshGeometry = null;
        this._brushMesh = null;
        this.enabled = true;
        this.morphControl = null;
    }

    get model() { return this._mesh }

    setEnvironment = (editor: Editor3D) => {
        this._editor = editor;
    }

    load = (path: string, callback?: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>) => {
        if (!this._editor) return;
        const loader = new GLTFLoader();
        loader.load(path, async (gltf) => {

            const { scene } = gltf;
            this._mesh = scene.children[0];

            await this._addScene();

            if (callback) callback(this._mesh);
        }, undefined, function (e) {
            console.error(e);
        });
    }

    private _addScene = () => {
        if (!this._editor || !this._mesh) return;
        const { scene, camera, container } = this._editor;
        const textureLoader = new THREE.TextureLoader();

        const map = textureLoader.load('/assets/gltf/Map-COL.jpg');
        map.colorSpace = THREE.SRGBColorSpace;
        const specularMap = textureLoader.load('/assets/gltf/Map-SPEC.jpg');
        const normalMap = textureLoader.load('/assets/gltf/Infinite-Level_02_Tangent_SmoothUV.jpg');

        (this._mesh as THREE.Mesh).material = new THREE.MeshPhongMaterial({
            specular: 0x111111,
            map: map,
            specularMap: specularMap,
            normalMap: normalMap,
            shininess: 25,
        });

        scene.add(this._mesh);
        this._originMeshGeometry = (this._mesh as THREE.Mesh).geometry.clone();

        if(!camera) return;
        if(!container) return;

        this.morphControl = new MorphControl(this._mesh as THREE.Mesh, scene, camera, container);
    }

    sizeChanged = (index: number) => {
        if (this.morphControl) {
            this.morphControl.sizeChanged(index - 1);
        }
    }

    intensityChanged = (index: number) => {
        if (this.morphControl)
            this.morphControl.intensityChanged(index - 1);
    }

    resetChanged = () => {
        if (!this._mesh) return;
        if (!this._originMeshGeometry) return;
        (this._mesh as THREE.Mesh).geometry.dispose();
        (this._mesh as THREE.Mesh).geometry = this._originMeshGeometry.clone();
    }
}

export default MorphAction;