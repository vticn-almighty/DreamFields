import { DepthTexture, ClampToEdgeWrapping, LinearFilter, LinearMipMapLinearFilter, WebGLRenderTarget } from 'three'

import { createMaterialByLayers } from '../Tool'
import ColorWrap from '../ColorWrap';
export default class SharedAssets {
    constructor(e) {
        this.materials = {};
        this.images = {};
        this.colors = {};
        this.transmissionRenderTarget = new WebGLRenderTarget(2048, 2048, {
            generateMipmaps: !0,
            minFilter: LinearMipMapLinearFilter,
            magFilter: LinearFilter,
            wrapS: ClampToEdgeWrapping,
            wrapT: ClampToEdgeWrapping
        }), this.transmissionRenderTarget.depthTexture = new DepthTexture(2048, 2048), this.reset(e)
    }
    reset(e) {
        for (let [t, r] of Object.entries(e.images)) this.addImage(t, r.data);
        for (let [t, r] of Object.entries(e.colors)) this.addColor(t, r);
        for (let [t, r] of Object.entries(e.materials)) this.addMaterial(t, createMaterialByLayers(r, this))
    }
    get transmissionSamplerMap() {
        return this.transmissionRenderTarget.texture
    }
    get transmissionDepthMap() {
        return this.transmissionRenderTarget.depthTexture
    }
    addMaterial(e, t) {
        t.uuid = e, this.materials[e] = t
    }
    deleteMaterial(e) {
        this.materials[e] && (this.materials[e].dispose(), delete this.materials[e])
    }
    isSharedMaterial(e) {
        return e.uuid in this.materials || e === g_
    }
    getMaterial(e) {
        let t = this.materials[e];
        return t
    }
    getMaterialOrDeletedPlaceholder(e) {
        var t;
        return (t = this.materials[e]) != null ? t : g_
    }
    getMaterials() {
        return this.materials
    }
    addImage(e, t) {
        if (this.images[e]) return this.images[e].onload = () => {
            this.onImageLoad && this.onImageLoad(e)
        }, this.images[e].src = t, !0; {
            let r = new Image;
            return r.src = t, r.onload = () => {
                this.onImageLoad && this.onImageLoad(e)
            }, this.images[e] = r, !1
        }
    }
    deleteImage(e) {
        this.images[e] && delete this.images[e]
    }
    getDefaultImage() {
        return this.images.image_0
    }
    getImage(e) {
        return this.images[e]
    }
    getImages() {
        return this.images
    }
    addColor(e, t) {
        return this.colors[e] ? ("a" in t ? this.colors[e].setRGBA(t.r, t.g, t.b, t.a) : this.colors[e].setRGBA(t.r, t.g, t.b, 1), !0) : ("a" in t ? this.colors[e] = new ColorWrap(t.r, t.g, t.b, t.a) : this.colors[e] = new ColorWrap(t.r, t.g, t.b, 1), !1)
    }
    updateColor(e, t) {
        var r, n, s, o;
        if (this.colors[e]) {
            let a = this.colors[e];
            return this.colors[e].r = (r = t.r) != null ? r : a.r, this.colors[e].g = (n = t.g) != null ? n : a.g, this.colors[e].b = (s = t.b) != null ? s : a.b, this.colors[e].a = (o = t.a) != null ? o : a.a, !0
        }
        return !1
    }
    deleteColor(e) {
        this.colors[e] && delete this.colors[e]
    }
    getColor(e) {
        return this.colors[e]
    }
    dispose() {
        Object.keys(this.materials).forEach(t => this.deleteMaterial(t)), this.transmissionRenderTarget.depthTexture.dispose(), this.transmissionRenderTarget.dispose(), this.onImageLoad = void 0
    }
};

