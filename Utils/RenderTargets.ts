import EventEmitter from './EventEmitter.js'
import * as THREE from 'three'
export default class Time extends EventEmitter
{
    offscreenOrigin: THREE.WebGLRenderTarget;
    /**
     * Constructor
     */
    constructor()
    {
        super()

        
        this.offscreenOrigin = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
            stencilBuffer: false,
            // depthBuffer: false,
            type: THREE.FloatType,
        });
    }

}
