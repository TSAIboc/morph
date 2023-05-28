import * as THREE from 'three';

type CameraParameters = {
    width?: number,
    height?: number,
    fov?: number,
    cameraDistance?: number,
}

const Camera = ({
    width = window.innerWidth,
    height = window.innerHeight,
    fov = 25,
    cameraDistance = 195
}: CameraParameters) => {
    const makePerspectiveCamera = () => {
        const aspect = width / height;
        const near = 1;
        const far = 2000;
        const newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        return newCamera;
    }
    const makeOrthographicCamera = () => {
        const halfFovV = THREE.MathUtils.DEG2RAD * fov * 0.5;
        const halfFovH = Math.atan((width / height) * Math.tan(halfFovV));
        const halfW = cameraDistance * Math.tan(halfFovH);
        const halfH = cameraDistance * Math.tan(halfFovV);
        const near = 1;
        const far = 2000;
        const newCamera = new THREE.OrthographicCamera(- halfW, halfW, halfH, - halfH, near, far);
        return newCamera;
    }
    return {
        makePerspectiveCamera,
        makeOrthographicCamera
    }
}
export default Camera;