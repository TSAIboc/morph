import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import MorphControl from '@utility/MorphControl';

export interface Editor3D {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
    control: ArcballControls | null;
    renderer: THREE.WebGLRenderer | null;
    container: HTMLElement | null;
    cameraDistance: number,
    initialize: (ref: HTMLElement | null) => void;
    remove: () => void;
    light: { scene: THREE.Object3D | null, camera: THREE.Object3D | null }
}

export interface Morph3D {
    morphControl: MorphControl | null;
    enabled: boolean;
    setEnvironment: (editor: Editor3D) => void;
    load: (path: string, callback?: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>) => void;
    sizeChanged: (index: number) => void
    intensityChanged: (index: number) => void
    resetChanged: () => void;
}