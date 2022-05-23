import EventEmitter from './Utils/EventEmitter'
import * as THREE from 'three'
import { Uniforms } from './utils/Uniforms';
import specialValueElimination from './Shader/fragmentShader/specialValueElimination'
import Quad from './Utils/Quad';
import SceneObject from './core/ObjectType/SceneObject'

export declare interface SpaceParam {
	name?: string;
	deep?: number;
	specialColor?: THREE.Color
}


export class Space extends EventEmitter {
	deep: number
	name: string;
	scene: SceneObject;
	public commonUniforms: Uniforms;
	meta: THREE.Mesh;
	output: THREE.WebGLRenderTarget;
	specialColor: THREE.Color;
	materialDepth: THREE.MeshDepthMaterial;
	renderTargetDepth: THREE.WebGLRenderTarget;
	time: number;
	resolution: THREE.Vector2;
	sharedAssets: any;
	transmissionRenderTarget: THREE.WebGLRenderTarget;


	constructor(spaceParam?: SpaceParam) {
		super()

		this.name = spaceParam.name || (console.warn(`created unnamed space`), THREE.MathUtils.generateUUID())
		this.deep = spaceParam.deep || 0;
		this.specialColor = spaceParam.specialColor || new THREE.Color(0.131242, 0.51613, 0.12314);

		this.time = 0;


		this.resolution = new THREE.Vector2()


		this.output = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y, {
			// minFilter: THREE.LinearFilter,
			// magFilter: THREE.LinearFilter,
			// type: THREE.FloatType,
			depthBuffer: true,
			stencilBuffer: true,
			format: THREE.RGBAFormat,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter
		});

		this.renderTargetDepth = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter
		});


		this.meta = new Quad({
			fragmentShader: specialValueElimination,
			uniforms: {
				uColor: {
					value: this.specialColor
				},
				uResolution: { value: this.resolution },
				utexture: {
					value: this.output.texture
				},
			}
		}).triangle

		this.meta.position.set(0, 0, this.deep + 1);
		this.commonUniforms = {
			time: {
				value: 0
			}
		};

		this.scene = new SceneObject({
			useProto: true
		}, {});


		this.materialDepth = new THREE.MeshDepthMaterial();
		this.materialDepth.depthPacking = THREE.RGBADepthPacking;
		this.materialDepth.blending = THREE.NoBlending;

		// this.scene.overrideMaterial = this.materialDepth;



	}




	public tick(deltaTime: number) {

		this.time += deltaTime;
		this.commonUniforms.time.value = this.time;
		this.animate(deltaTime);

	}

	public renderSpace(args?) {

	}

	public animate(deltaTime: number) { }


	public onAdd(args?) { }


	public onRemove(args?) {

		this.removeChildrens(this.scene);

	}


	removeChildrens(object) {

		const length = object.children.length;

		for (let i = length - 1; i >= 0; i--) {

			this.removeChildrens(object.children[i]);

			let geo: THREE.BufferGeometry | undefined = undefined;
			let mat: THREE.Material | undefined = undefined;

			if ((object.children[i] as THREE.Mesh).isMesh) {

				geo = (object.children[i] as THREE.Mesh).geometry;
				mat = ((object.children[i] as THREE.Mesh).material as THREE.Material);

			}

			object.remove((object.children[i]));

			if (geo) {

				geo.dispose();

			}

			if (mat) {

				mat.dispose();

			}

		}

	}


	setOutputSize(resolution: THREE.Vector2) {
		this.output.setSize(resolution.x, resolution.y);
		this.resolution.copy(resolution)
	}
}
