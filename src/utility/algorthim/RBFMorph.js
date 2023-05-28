import { lsolve } from 'mathjs'

const distanceTo = (a, b) => {
    return Math.sqrt(
        (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z)
    );
}

const getRBFvalue = (r, parameter) => {
    let episo = parameter;
    if (parameter < 1e-3) {
        episo = 3.0;
    }
    let value = Math.exp(-Math.pow((r / episo), 2.0));
    return value;
}

const computeWeights = (sourcePoints, x, parameter) => {
    let n = x.length;
    let M = new Array(n);
    for (let i = 0; i < n; i++) {
        M[i] = new Array(n);
    }
    // First compute the point to point distance matrix
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let norm = distanceTo(sourcePoints[i], sourcePoints[j]);
            // update the matrix to reflect the requested distance function
            M[i][j] = getRBFvalue(norm, parameter);
        }
    }
    let b = new Array(3);
    for (let i = 0; i < 3; i++) {
        b[i] = new Array(n);
    }
    for (let i = 0; i < n; i++) {
        b[0][i] = x[i].x;
        b[1][i] = x[i].y;
        b[2][i] = x[i].z;
    }
    // Compute basis functions weights by solving
    // the linear system of equations for each target component
    const solve0 = lsolve(M, b[0]);
    const solve1 = lsolve(M, b[1]);
    const solve2 = lsolve(M, b[2]);

    let weights = [];
    for (let i = 0; i < n; i++) {
        weights.push({ x: 0, y: 0, z: 0 });
        weights[i].x = solve0[i][0];
        weights[i].y = solve1[i][0];
        weights[i].z = solve2[i][0];
    }
    return weights;
}

const InterpolateRBF = (posAttr, source, weights, parameter) => {
    let n = weights.length;
    let i = 0;
    let displacment = [];
    while (i < posAttr.count) {
        displacment.push({ x: 0, y: 0, z: 0 });
        let target = {
            x: posAttr.getX(i),
            y: posAttr.getY(i),
            z: posAttr.getZ(i),
        }
        let dis = { x: 0, y: 0, z: 0 };
        for (let j = 0; j < n; j++) {
            let d = distanceTo(target, source[j]);
            d = getRBFvalue(d, parameter);
            dis.x += weights[j].x * d;
            dis.y += weights[j].y * d;
            dis.z += weights[j].z * d;
        }
        displacment[i] = dis;
        ++i;
    }
    return displacment;
}

/**
 * 
 * @param {*THREE.Buffergeometry} geometry  target geometry
 * @param {*THREE.Vector3[]} source         origin Control Points
 * @param {*THREE.Vector3[]} destination    offset Control Points
 * @param {*number} parameter               effect range
 * @param {*number} iter                    if offset value is large at one time, it need to do iterator
 * @returns 
 */
const RBFMorph = (geometry, source, destination, parameter, iter = 1) => {
    if (source.length != destination.length) {
        console.log("RBFMorphing error, the numbers between source points are inconsistent.");
        return;
    }
    const posAttr = geometry.attributes.position;
    let it = 0;
    for (it = 0; it < iter; it++) {
        let x = [];
        for (let i = 0; i < source.length; i++) {
            x.push({
                x: destination[i].x - source[i].x,
                y: destination[i].y - source[i].y,
                z: destination[i].z - source[i].z
            });
        }
        let weights = computeWeights(destination, x, parameter);
        let displacment = InterpolateRBF(posAttr, destination, weights, parameter);
        let i = 0;
        while (i < posAttr.count) {
            let [x, y, z] = [
                posAttr.getX(i),
                posAttr.getY(i),
                posAttr.getZ(i)
            ]
            let newPosition = {
                x: x + displacment[i].x,
                y: y + displacment[i].y,
                z: z + displacment[i].z
            }
            posAttr.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
            posAttr.needsUpdate = true;
            i++;
        }
    }
}

export { RBFMorph };