import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';

type points = THREE.Vector3[] | { x: number, y: number, z: number }[];

export const drawPoints = (points: points, color: number = 0x000000, radius: number = 0.1) => {
    const object = new THREE.Object3D();
    let i = 0;
    while (i < points.length) {
        let point = points[i];
        const geometry = new THREE.SphereGeometry(radius, 32, 16);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, point.z);
        object.add(sphere);
        ++i;
    }
    return object;
}

export const drawLines = (points: points, size: number = 3, color: number = 0x000000) => {
    let geometry = new LineGeometry();
    let positions: number[] = [];
    for (let i = 0; i < points.length; ++i) {
        positions.push(points[i].x, points[i].y, points[i].z);
    }
    geometry.setPositions(positions);
    let material = new LineMaterial({
        linewidth: size, // in pixels
        resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
        color: color,
        opacity: 0.6,
        transparent: true,
        //depthTest: false
    });
    let line = new Line2(geometry, material);
    return line;
}

export const drawDashLine = (points: THREE.Vector3[]) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineDashedMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.15,
        linewidth: 0.5,
        dashSize: 0.4,
        gapSize: 0.1,
    });
    const line = new THREE.Line(geometry, material);
    line.computeLineDistances();
    return line;
}

export const drawBrush = (size: number = 0.5, color: number = 0x7700ff) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: color,
        opacity: 0.4,
        transparent: true,
        depthTest: false
    });
    const sphereMesh = new THREE.Mesh(geometry, material);
    sphereMesh.renderOrder = 2;
    sphereMesh.name = 'Brush';
    return sphereMesh;
};