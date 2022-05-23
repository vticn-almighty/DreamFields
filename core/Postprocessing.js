import { RepeatWrapping, Clock, LoadingManager, Vector4, WebGLRenderTarget, Scene, Vector2, EventDispatcher } from 'three'
import { CombinedCamera } from './ObjectType/VirtualObject'
import {
    BloomEffect,
    ChromaticAberrationEffect,
    VignetteEffect,
    NoiseEffect,
    ColorAverageEffect,
    HueSaturationEffect,
    BrightnessContrastEffect,
    DepthOfFieldEffect,
    PixelationEffect
} from './PostEffect'
import { createEffectList } from './Tool'
import { EffectPass, PredicationMode, EdgeDetectionMode, SMAAPreset, SMAAEffect, EffectComposer, CopyPass, RenderPass } from 'postprocessing'



export default class Postprocessing extends EventDispatcher {
    constructor() {
        super();
        this._scene = new Scene;
        this._camera = new CombinedCamera;
        this.effects = new Map;
        this.loadingManager = new LoadingManager;
        this.renderPass = new RenderPass;
        this._renderToScreen = !0;
        this._hasSmaa = !1;
        this.clock = new Clock, this.enabled = !1, this.debug = !1,
            this.effects.set("bloom", new BloomEffect),
            this.effects.set("chromaticAberration", new ChromaticAberrationEffect),
            this.effects.set("vignette", new VignetteEffect),
            this.effects.set("noise", new NoiseEffect),
            this.effects.set("colorAverage", new ColorAverageEffect),
            this.effects.set("hueSaturation", new HueSaturationEffect),
            this.effects.set("brightnessContrast", new BrightnessContrastEffect),
            this.effects.set("depthOfField", new DepthOfFieldEffect),
            this.effects.set("pixelation", new PixelationEffect)
    }
    get scene() {
        return this._scene
    }
    set scene(e) {
        this._scene = e
    }
    get camera() {
        return this._camera
    }
    set camera(e) {
        this._camera = e
    }
    _initSmaa() {
        if (!this.effectComposer) return;
        let e = this.effectComposer.passes.length,
            t = new SMAAEffect({
                preset: SMAAPreset.ULTRA,
                edgeDetectionMode: EdgeDetectionMode.COLOR
            }),
            r = () => {
                t.removeEventListener("load", r), this.dispatchEvent({
                    type: "smaaloaded"
                })
            };
        t.addEventListener("load", r), t.edgeDetectionMaterial.setPredicationMode(PredicationMode.DEPTH), t.edgeDetectionMaterial.setEdgeDetectionThreshold(.05), t.edgeDetectionMaterial.setPredicationThreshold(.002), t.edgeDetectionMaterial.setPredicationScale(1), this.effectComposer.addPass(new EffectPass(this.camera, t), e), this._hasSmaa = !0
    }
    _initPasses() {
        if (!this.effectComposer || !this.renderer) return;
        let e;
        if (this.effectComposer.removeAllPasses(), this._hasSmaa = !1, this.renderPass = new RenderPass(this.scene, this.camera), this.enabled) {
            this.effectComposer.addPass(this.renderPass), this._initSmaa();
            let t = [this.effects.get("chromaticAberration"), this.effects.get("bloom"),
            this.effects.get("colorAverage"), this.effects.get("hueSaturation"),
            this.effects.get("brightnessContrast"), this.effects.get("vignette"),
            this.effects.get("noise")].reduce(createEffectList, []),
                r = [this.effects.get("pixelation")].reduce(createEffectList, []);
            r.length > 0 && this.effectComposer.addPass(new EffectPass(this.camera, ...r)), this.effectComposer.addPass(new EffectPass(this.camera, ...t))
        } else this.effectComposer.addPass(this.renderPass);
        if (e) return e
    }
    reinit() {
        if (!this.renderer) return Promise.all([]);
        this.effectComposer = new EffectComposer(this.renderer), this._initPasses()
    }
    init({
        renderer: e,
        camera: t,
        scene: r
    }) {
        this.renderer = e, this.scene = r, this.camera = t, this._initCopyPass(), this.reinit()
    }
    _initCopyPass() {
        if (this._savePass) return;
        let e = new Vector2;
        this.renderer.getDrawingBufferSize(e), this._rt = new WebGLRenderTarget(e.x, e.y, {
            depthBuffer: !1,
            stencilBuffer: !1,
            wrapS: RepeatWrapping,
            wrapT: RepeatWrapping
        }), this._rt.samples = this.renderer.capabilities.isWebGL2 ? 4 : 0, this._savePass = new CopyPass(this._rt, !1), this._savePass.renderToScreen = !1
    }
    get renderToScreen() {
        return this._renderToScreen
    }
    set renderToScreen(e) {
        var r, n;
        let t = this.effectComposer;
        !t || (e === !0 ? (((r = this.renderer) == null ? void 0 : r.capabilities.isWebGL2) && (t.multisampling = 0), t.removePass(this._savePass), t.passes[t.passes.length - 1].renderToScreen = !0, t.autoRenderToScreen = !0) : (((n = this.renderer) == null ? void 0 : n.capabilities.isWebGL2) && !this._hasSmaa && (t.multisampling = 4), t.autoRenderToScreen = !1, t.passes[t.passes.length - 1].renderToScreen = !1, this._savePass.renderToScreen = !1, t.addPass(this._savePass)), this._renderToScreen = e)
    }
    get texture() {
        return this._rt && this._rt.texture
    }
    get renderTarget() {
        return this._rt
    }
    fromJSON(e) {
        e && (Object.keys(e).forEach(t => {
            let r = e[t],
                n = this.effects.get(t);
            Object.keys(r).forEach(s => {
                n[s] = r[s]
            })
        }), this.enabled = e.enabled)
    }
    toJSON() {
        let e = {};
        return this.effects.forEach((t, r) => {
            e[r] = t.toJSON()
        }, e), {
            enabled: this.enabled,
            ...e
        }
    }
    render() {
        var e;
        (e = this.effectComposer) == null || e.render(this.clock.getDelta())
    }
    setScissor(e, t, r, n) {
        if (!this.effectComposer || !this.renderer) return;
        e instanceof Vector4 ? (this.effectComposer.inputBuffer.scissor.set(e.x, e.y, e.z, e.w), this.effectComposer.outputBuffer.scissor.set(e.x, e.y, e.z, e.w)) : (this.effectComposer.inputBuffer.scissor.set(e, t, r, n), this.effectComposer.outputBuffer.scissor.set(e, t, r, n));
        let s = this.renderer.getPixelRatio();
        this.effectComposer.inputBuffer.scissor.multiplyScalar(s), this.effectComposer.outputBuffer.scissor.multiplyScalar(s), this.renderer.setScissor(e, t, r, n)
    }
    setScissorTest(e) {
        !this.effectComposer || !this.renderer || (this.effectComposer.inputBuffer.scissorTest = e, this.effectComposer.outputBuffer.scissorTest = e, this.renderer.setScissorTest(e))
    }
    setViewport(e, t, r, n) {
        !this.effectComposer || (e instanceof Vector4 ? (this.effectComposer.inputBuffer.viewport.copy(e), this.effectComposer.outputBuffer.viewport.copy(e)) : (this.effectComposer.inputBuffer.viewport.set(e, t, r, n), this.effectComposer.outputBuffer.viewport.set(e, t, r, n)))
    }
    resize(e, t) {
        var r, n;
        if ((r = this.effectComposer) == null || r.setSize(e, t), this._rt) {
            let s = ((n = this.renderer) == null ? void 0 : n.getPixelRatio()) || window.devicePixelRatio;
            this._rt.setSize(e * s, t * s)
        }
    }
    dispose() {
        var e;
        this._listeners = void 0, (e = this.effectComposer) == null || e.dispose()
    }
};