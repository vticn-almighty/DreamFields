


import * as THREE from 'three'

export default new class Renderer extends THREE.WebGLRenderer {
    constructor(param?: THREE.WebGLRendererParameters) {
        super(param);
    }
}