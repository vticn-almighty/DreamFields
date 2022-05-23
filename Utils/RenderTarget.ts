




import * as THREE from 'three'
export default class RenderTarget extends THREE.WebGLRenderTarget {
    constructor(width: number, height: number, args: THREE.WebGLRenderTargetOptions) {
        super(width, height, args);
    }
}