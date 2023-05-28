import * as THREE from 'three';

const Light = () => {
    const makeCameraLight = () => {
        const cameraGroup = new THREE.Object3D();
        const pointLight1 = new THREE.PointLight(0xffffff, 0.4, 0);
        const pointLight2 = new THREE.PointLight(0xffffff, 0.04, 0);

        pointLight1.position.set(0, 50, -5);
        pointLight2.position.set(0, 50, 5);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.08);
        cameraGroup.add(pointLight1);
        cameraGroup.add(pointLight2);
        cameraGroup.add(hemisphereLight);
        cameraGroup.name = "cameraLight";
        return cameraGroup;
    }
    const makeSceneLight = () => {
        const sceneGroup = new THREE.Object3D();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight1 = new THREE.PointLight(0xffffff, 0.08);
        const directionalLight2 = new THREE.PointLight(0xffffff, 0.07);
        const directionalLight3 = new THREE.PointLight(0xffffff, 0.07);

        directionalLight1.position.set(0, 80, 8);
        directionalLight2.position.set(80, 9, 0);
        directionalLight3.position.set(-80, 9, 0);

        sceneGroup.add(ambientLight);
        sceneGroup.add(directionalLight1);
        sceneGroup.add(directionalLight2);
        sceneGroup.add(directionalLight3);
        sceneGroup.name = "sceneLight";
        return sceneGroup;
    }
    return {
        makeCameraLight,
        makeSceneLight
    }
}

export default Light;