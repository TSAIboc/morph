import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { Editor3D } from '@type/index';
import SceneSlider from '@utility/SceneSlider';
import MorphAction from '@utility/morph/Morph';
class Scenes {
    private _editor: Editor3D | null;
    private _sceneSlider: SceneSlider | null;
    private _morph: MorphAction | null;
    private _scenes: THREE.Scene | null;

    constructor(editor: Editor3D, slider: Element, morph: MorphAction) {
        this._editor = editor;
        this._morph = morph;
        this._sceneSlider = new SceneSlider(editor, slider, morph);
        this._scenes = null;
        this._initialize();
    }

    private _initialize = () => {
        let scenes = new THREE.Scene();
        scenes.background = new THREE.Color(0xE0E0E0);
        if (!this._editor) return;

        const { renderer, light, camera, control } = this._editor;

        if (!camera) return;
        scenes.add(camera.clone());

        if (light.scene)
            scenes.add(light.scene.clone());

        if (this._morph && this._morph.model) {
            let material = ((this._morph.model as THREE.Mesh).material as THREE.Material).clone();
            let mesh = new THREE.Mesh((this._morph.model as THREE.Mesh).geometry.clone(), material);
            scenes.add(mesh);
        }

        this._scenes = scenes;

        if (!renderer) return;
        renderer.setScissorTest(true);
        renderer.setAnimationLoop(this._animate);

        if (control)
            control.addEventListener('change', this.controlChanged);
    }

    //let the camera lights actived according to camera position in another scenes can be able to work
    controlChanged = () => {
        if (!this._editor) return;
        if (!this._scenes) return;
        const { camera, control } = this._editor;
        if (!camera) return;
        let scenesCamera = this._scenes.children.find((el) => el.type == camera.type);
        if (scenesCamera)
            scenesCamera.position.copy(camera.position);
        if (control) control.update();
    }

    private _animate = () => {
        if (!this._editor) return;
        if (!this._sceneSlider) return;
        const { control, renderer, scene, camera } = this._editor;

        if (control)
            control.update();

        if (TWEEN)
            TWEEN.update();

        if (!renderer) return;
        if (!camera) return;

        if (this._scenes) {
            renderer.setScissor(0, 0, this._sceneSlider.position, window.innerHeight);
            renderer.render(this._scenes, camera);
        }
        renderer.setScissor(this._sceneSlider.position, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }
}

export default Scenes;