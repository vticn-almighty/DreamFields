
import EventEmitter from './Utils/EventEmitter'
import * as THREE from 'three'



export class Cameras extends EventEmitter {
    perspective: THREE.PerspectiveCamera;
    orthographic: THREE.OrthographicCamera;
    constructor() {
        super();
		// this.camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );

        this.perspective = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        this.orthographic = new THREE.OrthographicCamera(- 1.0, 1.0, 1.0, - 1.0, -5000, 5000);
        // this.orthographic = new THREE.OrthographicCamera(- 1.0, 1.0, 1.0, - 1.0, -5000, 5000);
        // this.orthographic.position.set(0, 0, 1)
        // this.orthographic = new THREE.OrthographicCamera(- 1.0, 1.0, 1.0, - 1.0, -Infinity, Infinity);
        this.perspective.lookAt(new THREE.Vector3())
    }

    setInitPosition(camera, posi: THREE.Vector3 = new THREE.Vector3(0, 0, 5)) {
        camera.position.copy(posi);
    }
}
