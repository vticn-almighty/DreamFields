import EventEmitter from './Utils/EventEmitter'
import * as THREE from 'three'
import Time from './Utils/Time'
import { Space } from './Space'
import { Cameras } from './Cameras'
import FBOHelper from './core/tool/FBOHelper'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import RenderTarget from './Utils/RenderTarget'
import { CombinedCamera } from './core/ObjectType/VirtualObject'
import { CameraInstanceDefault } from './core/origin'


export declare interface AspectSetting {
	mainAspect: number;
	portraitAspect: number;
	wideAspect: number;
}


export declare interface ControllerParam extends THREE.WebGLRendererParameters {
	compatible?: boolean,
	canvas?: HTMLCanvasElement;
	aspectSetting?: AspectSetting;
	wrapperElement?: HTMLElement;
	alpha?: boolean,
	wrapperElementRect?: DOMRect;
	pixelRatio?: number,
	control?: boolean,
	debugFBO?: boolean,
	useCombinedCamera?: boolean,
}

export declare interface ControllerSize {
	canvasAspectRatio: number;
	windowSize: THREE.Vector2;
	windowAspectRatio: number;
	canvasSize: THREE.Vector2;
	canvasPixelSize: THREE.Vector2;
	pixelRatio: number
	portraitWeight: number;
	wideWeight: number;
}

export declare interface ControllerInfo extends ControllerParam {
	size: ControllerSize;
	aspectSetting: AspectSetting;
}


export class Controller extends EventEmitter {
	spaces: { [key: string]: Space };

	public info: ControllerInfo;
	renderer: THREE.WebGLRenderer;
	allowRender: Set<string>;
	universe: THREE.Scene;
	cameras: Cameras;
	work: boolean;
	time: Time;
	controls: OrbitControls
	helper: FBOHelper
	postProcessingPipeline: Function
	branchRenderingMergeTarget: RenderTarget
	private _oldClearColor: THREE.Color
	resolution: THREE.Vector2
	combinedCamera: CombinedCamera

	constructor(rendererInfo: ControllerParam) {
		super()
		this.spaces = {}
		this.allowRender = new Set()
		this.universe = new THREE.Scene();
		this.resolution = new THREE.Vector2();
		// this.universe.background = new THREE.Color(0xff0000)
		// this.universe.background = new THREE.Color(0xeeeeee)
		this.cameras = new Cameras();
		if (rendererInfo.useCombinedCamera) {
			this.combinedCamera = this.createCombinedCamera();
		}

		this.time = new Time();
		this.work = false;
		this.postProcessingPipeline = null;


		this.info = {
			aspectSetting: {
				mainAspect: 16 / 9,
				wideAspect: 10 / 1,
				portraitAspect: 1 / 2,
			},
			size: {
				windowSize: new THREE.Vector2(),
				windowAspectRatio: 1.0,
				canvasSize: new THREE.Vector2(),
				canvasPixelSize: new THREE.Vector2(),
				canvasAspectRatio: 1.0,
				pixelRatio: window.devicePixelRatio,
				portraitWeight: 0.0,
				wideWeight: 0.0
			}
		};

		this.info.canvas = rendererInfo.canvas || null;
		this.info.wrapperElement = rendererInfo.wrapperElement;
		this.info.wrapperElementRect = rendererInfo.wrapperElement && rendererInfo.wrapperElement.getBoundingClientRect();
		this.info.aspectSetting = rendererInfo.aspectSetting || this.info.aspectSetting;
		this.info.alpha = rendererInfo.alpha;
		this.info.size.pixelRatio = rendererInfo.pixelRatio || this.info.size.pixelRatio;

		this.renderer = new (rendererInfo.compatible ? THREE.WebGL1Renderer : THREE.WebGLRenderer)({ ...this.info, antialias: false });
		this.renderer.setPixelRatio(this.info.size.pixelRatio);
		this.renderer.debug.checkShaderErrors = true;


		this.branchRenderingMergeTarget = new RenderTarget(0, 0, {
			stencilBuffer: true,
			generateMipmaps: false,
			depthBuffer: true,
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter
		});





		if (rendererInfo.debugFBO) {
			this.helper = new FBOHelper(this.renderer);
		}


		if (rendererInfo.control) {
			this.setControl(rendererInfo.useCombinedCamera ? this.combinedCamera : this.cameras.perspective)
		}

		let orientationchange = this.onOrientationDevice.bind(this);
		let windowResize = this.onWindowResize.bind(this);
		window.addEventListener('orientationchange', orientationchange);
		window.addEventListener('resize', windowResize);
		this.on('dispose', () => {

			window.removeEventListener('orientationchange', orientationchange);
			window.removeEventListener('resize', windowResize);

		});
		this._oldClearColor = new THREE.Color()
		this.onWindowResize();

		this.time.on("tick", () => {
			// this.controls.update();
			if (this.work && this.allowRender.size) {
				let oldRT = this.renderer.getRenderTarget();
				for (const spaceName of Array.from(this.allowRender)) {
					let space = this.spaces[spaceName];
					if (space) {
						space.tick(this.time.delta);
						this.renderer.setRenderTarget(space.output)

						this.renderer.getClearColor(this._oldClearColor)
						this.renderer.setClearColor(space.specialColor)
						space.renderSpace();
						this.renderer.setClearColor(this._oldClearColor)

					}
				}
				// this.renderer.setRenderTarget(this.branchRenderingMergeTarget)
				// this.renderer.setRenderTarget(null)
				// this.renderer.render(this.universe, this.cameras.orthographic)
				this.finalRender();
				this.renderer.setRenderTarget(oldRT)
				this.controls.update()

				this.helper && this.helper.update()//! update前必须清空RT占用
			}

		})
	}

	public createCombinedCamera() {
		let e = CombinedCamera.createFromState(THREE.MathUtils.generateUUID, {
			...CameraInstanceDefault.defaultData,
			name: "Main CombinedCamera"
		});
		return e.enableHelper = !1, e.objectHelper.visible = !1, delete e.isEntity, e
	}

	public initTransmission(space) {
		if (space.scene.needsTransmission(void 0)) {
			space.transmissionRenderTarget = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y, {
				generateMipmaps: !0,
				minFilter: THREE.LinearMipMapLinearFilter,
				magFilter: THREE.LinearFilter,
				wrapS: THREE.ClampToEdgeWrapping,
				wrapT: THREE.ClampToEdgeWrapping
			})
			space.transmissionRenderTarget.depthTexture = new THREE.DepthTexture(this.resolution.x, this.resolution.y)
			space.scene.needsTransmission(space.transmissionRenderTarget)
		}

	}

	setSpaceCameraAsMainCamera(space) {
		this.combinedCamera = space.scene.activeCamera;
		this.setControl(this.combinedCamera);
	}

	finalRender() {
		this.renderer.setRenderTarget(null)
		let PPipeline = this.postProcessingPipeline;
		if (PPipeline) {
			this.renderer.setRenderTarget(this.branchRenderingMergeTarget)
			this.renderer.render(this.universe, this.cameras.orthographic)
			PPipeline();
		}
		else {
			this.renderer.render(this.universe, this.cameras.orthographic)
		}
	}


	setControl(camera) {
		if (this.controls) {
			this.controls.object = camera
		} else {
			this.controls = new OrbitControls(camera, this.renderer.domElement);
			if (!this.combinedCamera) {
				this.cameras.setInitPosition(camera)
			}
		}
	}

	onWindowResize() {


		if (this.renderer == null) return;

		const newWindowSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
		const newCanvasSize = new THREE.Vector2();

		if (this.info.wrapperElement) {

			newCanvasSize.set(this.info.wrapperElement.clientWidth, this.info.wrapperElement.clientHeight);

		} else {

			newCanvasSize.copy(newWindowSize);

		}

		let portraitWeight = 1.0 - ((newCanvasSize.x / newCanvasSize.y) - this.info.aspectSetting.portraitAspect) / (this.info.aspectSetting.mainAspect - this.info.aspectSetting.portraitAspect);
		portraitWeight = Math.min(1.0, Math.max(0.0, portraitWeight));

		let wideWeight = 1.0 - ((newCanvasSize.x / newCanvasSize.y) - this.info.aspectSetting.wideAspect) / (this.info.aspectSetting.mainAspect - this.info.aspectSetting.wideAspect);
		wideWeight = Math.min(1.0, Math.max(0.0, wideWeight));

		this.info.size.windowSize.copy(newWindowSize);
		this.info.size.windowAspectRatio = newWindowSize.x / newWindowSize.y;
		this.info.size.canvasSize.copy(newCanvasSize);
		this.info.size.canvasPixelSize.copy(newCanvasSize.clone().multiplyScalar(this.renderer.getPixelRatio()));
		this.info.size.canvasAspectRatio = newCanvasSize.x / newCanvasSize.y;
		this.info.size.portraitWeight = portraitWeight;
		this.info.size.wideWeight = wideWeight;

		this.renderer.setPixelRatio(this.info.size.pixelRatio);

		let cw = this.info.size.canvasSize.x;
		let ch = this.info.size.canvasSize.y;
		this.renderer.setSize(cw, ch);

		this.renderer.getDrawingBufferSize(this.resolution);
		this.branchRenderingMergeTarget.setSize(this.resolution.x, this.resolution.y);

		if (this.helper) {
			for (let fboWrap of this.helper.fbos) {

				setTimeout(() => {
					this.helper.refreshFBO(fboWrap.fbo)
				}, 10);
			}
		}
		this.helper && this.helper.setSize(cw, ch);

		this.cameras.perspective.aspect = this.info.size.canvasAspectRatio;
		this.cameras.perspective.updateProjectionMatrix();
		this.combinedCamera && this.resizeCombineCamera(this.combinedCamera);



		for (const spaceName of Array.from(this.allowRender)) {
			let space = this.spaces[spaceName];
			if (space) {
				if (space.transmissionRenderTarget) {
					space.transmissionRenderTarget.setSize(this.resolution.x, this.resolution.y);
					space.transmissionRenderTarget.depthTexture = new THREE.DepthTexture(this.resolution.x, this.resolution.y)
				}
				space.setOutputSize(this.resolution);
				this.resizeCombineCamera(space.scene.activeCamera);
			}
		}

		if (this.info.wrapperElement) {

			this.info.wrapperElementRect = this.info.wrapperElement.getBoundingClientRect();

		}
		setTimeout(() => {
			this.trigger('windowResize', [this.info.size.canvasSize])
		}, 0);

	}

	resizeCombineCamera(camera) {
		camera.aspect = this.info.size.canvasAspectRatio;
		camera.updateProjectionMatrix();
	}

	get canvasSize() {
		return this.info.size.canvasSize;
	}

	onOrientationDevice() {

		this.trigger('orientationDevice')

	}

	addSpace(space: Space) {
		if (this.getSpace(space.name)) {
			throw Error("space already exists")
		}
		this.spaces[space.name] = space;
		space.setOutputSize(this.resolution);
		this.universe.add(space.meta);
		space.onAdd();
	}

	removeSpace(name) {
		let tarSpace = this.getSpace(name);
		if (tarSpace) {
			tarSpace.onRemove();
			delete this.spaces[name]
		} else {
			console.warn('space does not exist');
		}
	}

	getSpace(name) {
		return this.spaces[name];
	}

	// !设置前必须保证RT的size被初始化
	setFBODebug(fbo: THREE.WebGLRenderTarget, name: string) {
		this.helper && this.helper.attach(fbo, name);
	}

	dispose() {
		this.spaces = null;
		this.trigger('dispose')
	}
}
