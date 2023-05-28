import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';

enum cameraViews {
    front = 'front',
    right = 'right'
}
type Camera = THREE.PerspectiveCamera | THREE.OrthographicCamera | null;

type TCallback = () => void;

export const setViewangle = (
    key: string,
    control: ArcballControls | null,
    camera: Camera,
    cameraDistance: number,
    callback?: TCallback) => {

    if (!control) return;
    if (!camera) return;

    let current = new THREE.Vector3().copy(camera.position);
    let target = control.target;
    let transfer = new THREE.Vector3().copy(current);
    let transferTarget = control.target; // if taget is not as same as origin , it will change the new one.

    control.reset();

    switch (key) {
        case cameraViews.front:
            transfer.set(0, 0, cameraDistance);
            break;
        case cameraViews.right:
            transfer.set(-cameraDistance, 0, 0);
            break;
    }

    cameraTweens(current, transfer, target, transferTarget, camera, control, callback);
}

const cameraTweens = (
    current: THREE.Vector3,
    transfer: THREE.Vector3,
    target: THREE.Vector3,
    transferTarget: THREE.Vector3,
    camera: Camera,
    control: ArcballControls | null,
    callback?: TCallback) => {

    if (!control) return;
    if (!camera) return;
    
    let currentView = {
        x: current.x,
        y: current.y,
        z: current.z,
        targetx: target.x,
        targety: target.y,
        targetz: target.z
    };
    let transferView = {
        x: transfer.x,
        y: transfer.y,
        z: transfer.z,
        targetx: transferTarget.x,
        targety: transferTarget.y,
        targetz: transferTarget.z
    };

    let tweens = new TWEEN.Tween(currentView)
        .to(transferView, 250)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .start();

    tweens.onUpdate((() => {
        control.enabled = false;
        camera.position.set(currentView.x, currentView.y, currentView.z);
        control.target.set(currentView.targetx, currentView.targety, currentView.targetz);
        control.update();
        camera.updateProjectionMatrix();
        if (callback) callback();
    }).bind(this));

    tweens.onComplete((() => {
        control.enabled = true;
        camera.updateProjectionMatrix();
        if (callback) callback();
    }).bind(this));

    tweens.start();
}
