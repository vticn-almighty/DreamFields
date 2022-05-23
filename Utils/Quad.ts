import * as THREE from 'three'
import { Uniforms, UniformsLib } from './Uniforms';
import normalVertexShader from '../Shader/vertexShader/normal'



export declare interface uniformsParam {
    fragmentShader: string,
    uniforms: Uniforms
}


export default class Quad {

    geometry: THREE.BufferGeometry;
    material: THREE.RawShaderMaterial;
    resolution: THREE.Vector2;
    triangle: THREE.Mesh<THREE.BufferGeometry, THREE.RawShaderMaterial>;
    uniforms: Uniforms;
    fragmentShader: string;


    constructor(param: uniformsParam) {
        this.uniforms = param.uniforms;
        this.fragmentShader = param.fragmentShader;
        this.resolution = new THREE.Vector2(innerWidth, innerHeight);
        this.geometry = new THREE.BufferGeometry();

        const vertices = new Float32Array([
            -1.0, -1.0,
            3.0, -1.0,
            -1.0, 3.0
        ]);


        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 2));
        this.material = new THREE.ShaderMaterial({
            fragmentShader: this.fragmentShader,
            vertexShader: normalVertexShader,
            uniforms: UniformsLib.mergeUniforms(this.uniforms, {})
        });
        this.triangle = new THREE.Mesh(this.geometry, this.material);
        // Our triangle will be always on screen, so avoid frustum culling checking
        this.triangle.frustumCulled = false;
    }
}