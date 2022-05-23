import * as THREE from 'three'

class Trangle extends THREE.BufferGeometry {
    constructor() {
        super();

        const vertices = new Float32Array([
            -1.0, -1.0,
            3.0, -1.0,
            -1.0, 3.0
        ]);


        this.setAttribute('position', new THREE.BufferAttribute(vertices, 2));
    }
}

export default Trangle;