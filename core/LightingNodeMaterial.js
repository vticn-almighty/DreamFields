



import { FrontSide, ShaderMaterial, } from 'three'
import { LayerTypeEnum } from './Enum'

import LayerStack from './normal/LayerStack'
import ShaderBase from './normal/ShaderBase'
import { Raw } from './nodeType/ShaderUnit'


import { Position } from './nodeType/Unit'
import { nColor } from './nodeType/ReadonlyUnit'


export default class LightingNodeMaterial extends ShaderMaterial {
    constructor(e, t, r) {
        super(r);
        this.isNodeMaterial = !0;
        this.type = "NodeMaterial";
        this.wireframeLinecap = "";
        this.wireframeLinejoin = "";
        this.uniformsBackup = {};
        this.userData = {
            type: "",
            category: "",
            nodeType: ""
        };
        this.fog = !0, this.vertex = e != null ? e : new Raw(new Position(Position.PROJECTION));
        this.fragment = t != null ? t : new Raw(new nColor(5855577));
        this.updaters = [], this.isDetached = !0, this.dithering = !0;
        this.onBeforeCompile = this._onBeforeCompile
    }
    getDefines() {
        return this.defines
    }
    getUniforms() {
        return this.uniforms
    }
    getVertexShader() {
        return this.vertexShader
    }
    getFragmentShader() {
        return this.fragmentShader
    }
    _onBeforeCompile(e, t) {
        this.build({
            renderer: t
        }), e.defines = this.defines, e.uniforms = this.uniforms,
            e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader,
            e.extensionDerivatives = this.extensions.derivatives === !0,
            e.extensionFragDepth = this.extensions.fragDepth === !0,
            e.extensionDrawBuffers = this.extensions.drawBuffers === !0,
            e.extensionShaderTextureLOD = this.extensions.shaderTextureLOD === !0
    }
    _getLayerStack(e) {
        let t = new LayerStack(this);
        return e && (async () => {
            for (; e.image === void 0;) await new Promise(r => requestAnimationFrame(r));
            t.addLayerAt(1, {
                type: LayerTypeEnum.TEXTURE,
                texture: e
            }), this.dispose()
        })(), t
    }
    clampUniformsForPreview(e, t) {
        let r = (n, s, o) => Math.min(Math.max(n, s), o);
        if (this.userData.layers) {
            for (let n of this.userData.layers.getLayers())
                if (n.type == LayerTypeEnum.DISPLACE) {
                    this.uniformsBackup[`f${n.id}_intensity`] = n.uniforms[`f${n.id}_intensity`].value;
                    let s = r(n.uniforms[`f${n.id}_intensity`].value, e, t);
                    n.uniforms[`f${n.id}_intensity`].value = s
                }
        }
    }
    restoreClampedUniforms() {
        if (this.userData.layers)
            for (let e of this.userData.layers.getLayers()) e.type == LayerTypeEnum.DISPLACE && (e.uniforms[`f${e.id}_intensity`].value = this.uniformsBackup[`f${e.id}_intensity`])
    }
    customProgramCacheKey() {
        return this.getHash()
    }
    updateFrame(e) {
        for (let t = 0; t < this.updaters.length; ++t) e.updateNode(this.updaters[t])
    }
    build(e) {
        var r;
        e = e != null ? e : {};
        let t = (r = e.builder) != null ? r : new ShaderBase;
        return t.setMaterial(this, e.renderer), t.build(this.vertex, this.fragment),
            this.vertexShader = t.getCode("vertex"), this.fragmentShader = t.getCode("fragment"),
            this.defines = t.defines, this.uniforms = t.uniforms, this.extensions = t.extensions,
            this.updaters = t.updaters, this.fog = t.requires.fog, this.lights = t.requires.lights,
            this.transparent = t.requires.transparent || this.blending > _s, this
    }
    getHash() {
        let e = "{";
        return e += '"vertex":' + this.vertex.getHash() + ",", e += '"fragment":' + this.fragment.getHash(), e += "}", e
    }
    copy(e) {
        let t = this.uuid;
        for (let r in e) this[r] = e[r];
        return this.uuid = t, e.userData !== void 0 && (this.userData = JSON.parse(JSON.stringify(e.userData))), this
    }
    toJSON(e) {
        let t = this.userData.layers;
        this.userData.layers = void 0;
        let r = super.toJSON(e);
        return r.type = "ShaderMaterial", r.userData = {
            type: this.userData.type,
            category: this.userData.category,
            nodeType: this.type,
            layers: t.toJSON(e)
        }, r.vertex = this.vertex.toJSON(e).uuid, r.fragment = this.fragment.toJSON(e).uuid, delete r.vertexShader, delete r.fragmentShader, delete r.color, delete r.shininess, delete r.specular, delete r.roughness, delete r.metalness, delete r.uniforms, e && !e.materials[this.uuid] && (e.materials[this.uuid] = r), this.userData.layers = t, r
    }
    fromJSON(e, t) {
        var r;
        this.defines = (r = e.defines) != null ? r : {}, this.depthFunc = e.depthFunc, this.depthWrite = e.depthWrite, this.side = e.side !== void 0 ? e.side : FrontSide, this.transparent = e.transparent, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.wireframe = e.wireframe, this.userData.layers.fromJSON(e.userData.layers, t, this)
    }
};