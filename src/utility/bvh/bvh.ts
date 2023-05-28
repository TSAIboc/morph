import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, CONTAINED, INTERSECTED, NOT_INTERSECTED } from 'three-mesh-bvh';
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;

export const getIntersectsTriangleIndices = (targetMesh: THREE.Mesh, brushMesh: THREE.Mesh, rchanged: number = 1) => {

    const geometry = targetMesh.geometry;

    if (!geometry.boundsTree)
        geometry.computeBoundsTree()

    const bvh = geometry.boundsTree;

    const inverseMatrix = new THREE.Matrix4();
    inverseMatrix.copy(targetMesh.matrixWorld).invert();

    const sphere = new THREE.Sphere();
    sphere.center.copy(brushMesh.position).applyMatrix4(inverseMatrix);
    sphere.radius = (brushMesh.geometry as THREE.SphereGeometry).parameters.radius * rchanged;

    const indices: number[] = [];

    bvh?.shapecast({
        intersectsBounds: box => {
            return intersecsBounds(sphere, box);
        },
        intersectsTriangle: (tri, i, contained) => {
            if (contained || tri.intersectsSphere(sphere)) {
                const i3 = 3 * i;
                indices.push(i3, i3 + 1, i3 + 2);
            }
            return false;
        }
    });
    return indices;
}

const intersecsBounds = (sphere: THREE.Sphere, box: THREE.Box3) => {
    const tempVec = new THREE.Vector3();
    const intersects = sphere.intersectsBox(box);
    const { min, max } = box;
    if (intersects) {
        for (let x = 0; x <= 1; x++) {
            for (let y = 0; y <= 1; y++) {
                for (let z = 0; z <= 1; z++) {
                    tempVec.set(
                        x === 0 ? min.x : max.x,
                        y === 0 ? min.y : max.y,
                        z === 0 ? min.z : max.z
                    );
                    if (!sphere.containsPoint(tempVec)) {
                        return INTERSECTED;
                    }
                }
            }
        }
        return CONTAINED;
    }
    return intersects ? INTERSECTED : NOT_INTERSECTED;
}

export const getIntersectionPoints = (geometry: THREE.BufferGeometry, indices: number[], rchanged: number = 1) => {
    const indexAttr = geometry.index;
    let position = geometry.getAttribute('position');
    if (!indexAttr) return [];
    let points: THREE.Vector3[] = [];
    for (let i = 0, l = indices.length; i < l; i += rchanged) {
        const a = indexAttr.getX(indices[i]);
        const b = indexAttr.getY(indices[i]);
        const c = indexAttr.getZ(indices[i]);
        points.push(new THREE.Vector3(position.getX(a), position.getY(a), position.getZ(a)))
        points.push(new THREE.Vector3(position.getX(b), position.getY(b), position.getZ(b)))
        points.push(new THREE.Vector3(position.getX(c), position.getY(c), position.getZ(c)))
    }
    return points;
}
