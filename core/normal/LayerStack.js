import { Vector4, MathUtils, Vector2, Vector3 } from 'three'
import TextureWrap from '../TextureWrap';
import Layer from './Layer'
import Expression from '../nodeType/Expression'
import { MathUtils } from 'three'
import { LayerTypeEnum, LayerNodesEnum } from '../Enum'
import { CustomTexture, Rainbow, CustomNormal, Matcap } from '../nodeType/Unit'
import { Blend, Noise, Fresnel, Transmission, Gradient, VertexDisplacement, Depth } from '../nodeType/Unit'
import {
    nVector2,
    nVector3,
    nVector4,
    nTexture,
    nFloat,
    nColor,
    nInt,
    nBool,
    nVector4Array,
    nFloatArray,
} from '../nodeType/ReadonlyUnit'

export default class LayerStack {
    constructor(e) {
        this.id = 2, this.layerCount = 2, this.uuid = MathUtils.generateUUID(), this.needsUpdate = !1, this._material = e, this._layerNodes = [];
        let t = this._createLayer({
            id: 0,
            type: LayerTypeEnum.COLOR
        });
        this._material.color = t.color, this._material.alpha === void 0 && (this._material.alpha = new nFloat(1));
        let r = new nFloat(1),
            n = new nInt(0);
        "shadingAlpha" in this._material && "shadingBlend" in this._material && (this._material.shadingAlpha = r, this._material.shadingBlend = n), this._layerNodes.push({
            id: 0,
            type: LayerNodesEnum.COLOR,
            color: t.color,
            alpha: t.alpha,
            mode: t.mode
        }), this._layerNodes.push({
            id: 1,
            type: LayerNodesEnum.LIGHTING,
            alpha: r,
            mode: n
        }), this.head = t.layer, this.head.next = new Layer(1, void 0, {
            type: LayerTypeEnum.LIGHTING,
            alpha: r,
            mode: n
        }), this.attachLightNodes(this.getLightLayer())
    }
    get material() {
        return this._material
    }
    set material(e) {
        var s;
        this._material = e;
        let t, r, n = this.head;
        for (; n !== void 0;) {
            if (n.type === LayerTypeEnum.LIGHTING) {
                t = n.uniforms[`f${n.id}_alpha`], r = n.uniforms[`f${n.id}_mode`];
                break
            }
            n = n.next
        }
        "shadingAlpha" in this._material && "shadingBlend" in this._material && (this._material.shadingAlpha = t, this._material.shadingBlend = r), this.attachLightNodes((s = e.userData.layers) == null ? void 0 : s.getLightLayer()), this.blendColors(), this.blendAfterColors(), this.blendPositions()
    }
    getLayersOfType(e) {
        let t = [],
            r = this.head;
        for (; r;) r.type === e && t.push(r), r = r.next;
        return t
    }
    addLayer(e) {
        var n;
        if (e.id = (n = e.id) != null ? n : ++this.id, this.layerCount++, e.type === LayerTypeEnum.LIGHTING) {
            let s = this.createLightLayer(e);
            return this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors(), this.blendPositions(), s
        }
        let t = this._createLayer(e),
            r = t.layer;
        if (this.head === void 0) this.head = r;
        else {
            let s = this.head;
            for (; s.next != null;) s = s.next;
            s.next = r
        }
        return t.color && this._layerNodes.push({
            id: r.id,
            type: LayerNodesEnum.COLOR,
            color: t.color,
            alpha: t.alpha,
            mode: t.mode
        }), t.position && this._layerNodes.push({
            id: r.id,
            type: LayerNodesEnum.POSITION,
            position: t.position
        }), this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors(), this.blendPositions(), r
    }
    addLayerBeforeAt(e, t) {
        var a;
        let r = this.head;
        e.id = (a = e.id) != null ? a : ++this.id, this.layerCount++;
        let n = this._createLayer(e),
            s = n.layer;
        s.next = t;
        let o = 0;
        if (r === t) this.head = s, n.color && this._layerNodes.splice(0, 0, {
            id: s.id,
            type: LayerNodesEnum.COLOR,
            color: n.color,
            alpha: n.alpha,
            mode: n.mode
        }), n.position && this._layerNodes.splice(0, 0, {
            id: s.id,
            type: LayerNodesEnum.POSITION,
            position: n.position
        });
        else {
            for (o = 1;
                (r == null ? void 0 : r.next) !== t;) r = r == null ? void 0 : r.next, o++;
            r.next = s, n.color && this._layerNodes.splice(o, 0, {
                id: s.id,
                type: LayerNodesEnum.COLOR,
                color: n.color,
                alpha: n.alpha,
                mode: n.mode
            }), n.position && this._layerNodes.splice(o, 0, {
                id: s.id,
                type: LayerNodesEnum.POSITION,
                position: n.position
            })
        }
        return this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors(), this.blendPositions(), s
    }
    addLayerAt(e, t) {
        var s;
        t.id = (s = t.id) != null ? s : ++this.id, this.layerCount++;
        let r = this._createLayer(t),
            n = r.layer;
        if (r.color && this._layerNodes.splice(e, 0, {
            id: n.id,
            type: LayerNodesEnum.COLOR,
            color: r.color,
            alpha: r.alpha,
            mode: r.mode
        }), r.position && this._layerNodes.splice(e, 0, {
            id: n.id,
            type: LayerNodesEnum.POSITION,
            position: r.position
        }), e == 0) n.next = this.head, this.head = n;
        else {
            let o = this.head,
                a = this.head.next;
            for (let l = 0; l < e - 1; l++) o = a, a = a.next;
            n.next = a, o.next = n
        }
        return this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors(), this.blendPositions(), n
    }
    removeLayer(e) {
        let t = this.head,
            r, n = 0;
        if ((t == null ? void 0 : t.id) == e) this.head = t.next;
        else
            for (n = 1, r = t, t = t == null ? void 0 : t.next; t != null;) {
                if (t.id == e) {
                    r.next = t.next;
                    break
                }
                n++, r = t, t = t.next
            }
        return this.cleanupChangedLayer(t), this.blendColors(), this.blendAfterColors(), this.blendPositions(), this.uuid = MathUtils.generateUUID(), this.layerCount--, n
    }
    changeLayer(e, t) {
        let r, n = this.head,
            s;
        if ((n == null ? void 0 : n.id) == e) {
            let o = this._createLayer({
                id: e,
                uuid: n.uuid,
                ...t
            });
            s = o.layer, s.next = n.next, this.head = s, o.color && (this._layerNodes[0] = {
                id: s.id,
                type: LayerNodesEnum.COLOR,
                color: o.color,
                alpha: o.alpha,
                mode: o.mode
            }), o.position && (this._layerNodes[0] = {
                id: s.id,
                type: LayerNodesEnum.POSITION,
                position: o.position
            }), s.uniforms[`f${e}_mode`].value = n.uniforms[`f${e}_mode`].value, s.uniforms[`f${e}_alpha`].value = n.uniforms[`f${e}_alpha`].value
        } else {
            r = n, n = n.next;
            let o = 1;
            for (; n != null;) {
                if (n.id == e) {
                    let a = this._createLayer({
                        id: e,
                        uuid: n.uuid,
                        ...t
                    });
                    s = a.layer, r.next = s, s.next = n.next, a.color && (this._layerNodes[o] = {
                        id: e,
                        type: LayerNodesEnum.COLOR,
                        color: a.color,
                        alpha: a.alpha,
                        mode: a.mode
                    }), a.position && (this._layerNodes[o] = {
                        id: e,
                        type: LayerNodesEnum.POSITION,
                        position: a.position
                    }), s.uniforms[`f${e}_mode`].value = n.uniforms[`f${e}_mode`].value, s.uniforms[`f${e}_alpha`].value = n.uniforms[`f${e}_alpha`].value;
                    break
                }
                r = n, n = n.next, o++
            }
        }
        return this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors(), this.blendPositions(), s
    }
    getLayer(e) {
        let t = this.head;
        for (; t != null && t.id != e;) t = t.next;
        return t
    }
    getLayerByUuid(e) {
        let t = this.head;
        for (; t !== void 0;) {
            if (t.uuid === e) return t;
            t = t.next
        }
    }
    getLayers() {
        let e = [],
            t = this.head;
        for (; t != null;) e.push(t), t = t.next;
        return e
    }
    getLayerPosition(e) {
        let t = this.head,
            r = 0;
        for (; t !== void 0 && t.id != e;) r++, t = t.next;
        return r
    }
    getDefines() { }
    getBeforeProgram() { }
    getLightingProgram() { }
    getAfterProgram() { }
    getVarPrograms() { }
    getUniforms() { }
    moveLayer(e, t) {
        let r, n = this.head,
            s;
        if (e == 0) r = this.head, this.head = r.next;
        else {
            for (let a = 0; a < e; a++) s = n, n = n.next;
            s.next = n.next, r = n
        }
        if (n = this.head, s = void 0, t == 0) r.next = this.head, this.head = r;
        else {
            for (let a = 0; a < t - 1; a++) n = n.next;
            r.next = n == null ? void 0 : n.next, n.next = r
        }
        let o = this._layerNodes.splice(e, 1)[0];
        this._layerNodes.splice(t, 0, o), this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors()
    }
    updateLayerUniform() {
        this.uuid = MathUtils.generateUUID(), this.blendColors(), this.blendAfterColors()
    }
    copy(e) {
        this.needsUpdate = !1, this.layerCount = e.layerCount, this._layerNodes = [], this.layerCount = 0, this.head = void 0, this.rebuildLayerNodes(this.head, e.head);
        let t = e.head,
            r = this.head;
        for (; t.next != null;) this.rebuildLayerNodes(r, t.next), r = r.next, t = t.next;
        return this.id = e.id, this.uuid = e.uuid, this.blendColors(), this.blendAfterColors(), this.blendPositions(), this
    }
    createLightLayer(e) {
        let t = new nFloat(e.alpha),
            r = new nInt(e.mode);
        this._material.shadingAlpha = t, this._material.shadingBlend = r, this._layerNodes.push({
            id: e.id,
            type: LayerNodesEnum.LIGHTING,
            alpha: t,
            mode: r
        });
        let n = new Layer(e.id, void 0, {
            type: LayerTypeEnum.LIGHTING,
            alpha: t,
            mode: r
        });
        if (this.head === void 0) this.head = n;
        else {
            let s = this.head;
            for (; s.next != null;) s = s.next;
            s.next = n
        }
        return this.attachLightNodes(this.getLightLayer()), n
    }
    rebuildLayerNodes(e, t, r = !1) {
        if (t.type === LayerTypeEnum.LIGHTING) {
            let n = r ? t.uniforms[`f${t.id}_alpha`] : new nFloat(t.uniforms[`f${t.id}_alpha`].value),
                s = r ? t.uniforms[`f${t.id}_mode`] : new nInt(t.uniforms[`f${t.id}_mode`].value);
            this._material.shadingAlpha = n, this._material.shadingBlend = s, this._layerNodes.push({
                id: t.id,
                type: LayerNodesEnum.LIGHTING,
                alpha: n,
                mode: s
            }), this.head === void 0 ? this.head = new Layer(t.id, t.uuid, {
                type: LayerTypeEnum.LIGHTING,
                alpha: n,
                mode: s
            }) : e && (e.next = new Layer(t.id, t.uuid, {
                type: LayerTypeEnum.LIGHTING,
                alpha: n,
                mode: s
            })), this.attachLightNodes(t)
        } else {
            let n = {
                type: t.type,
                id: t.id
            };
            for (let s in t.uniforms) {
                let o = t.getName(s);
                if (!o) continue;
                let a = `f${t.id}_${o}`;
                if (Array.isArray(t.uniforms[a].value)) n[o] = t.uniforms[a].value.map(l => l.clone && !r ? l.clone() : l);
                else {
                    let l = t.uniforms[a].value;
                    if (o === "transmissionDepthMap") {
                        n[o] = l;
                        continue
                    }
                    l != null && (n[o] = l.clone && !r && !l.isRenderTargetTexture ? l.clone() : l)
                }
            }
            this.addLayer(n)
        }
    }
    attachLightNodes(e) {
        var n, s, o, a, l, c, u, h, d, f, p;
        let t = {},
            r = this.getLightLayer();
        switch (this._material.userData.category) {
            case "Lambert":
                t.emissive = new nColor((s = (n = e == null ? void 0 : e.getValue("emissive")) == null ? void 0 : n.clone()) != null ? s : 0);
                break;
            case "Phong":
                t.shininess = new nFloat((o = e == null ? void 0 : e.getValue("shininess")) != null ? o : 30), t.specular = new nColor((l = (a = e == null ? void 0 : e.getValue("specular")) == null ? void 0 : a.clone()) != null ? l : 1118481);
                break;
            case "Toon":
                t.shininess = new nFloat((c = e == null ? void 0 : e.getValue("shininess")) != null ? c : 30), t.specular = new nColor((h = (u = e == null ? void 0 : e.getValue("specular")) == null ? void 0 : u.clone()) != null ? h : 1118481);
                break;
            case "Physical":
                t.roughness = new nFloat((d = e == null ? void 0 : e.getValue("roughness")) != null ? d : .3), t.metalness = new nFloat((f = e == null ? void 0 : e.getValue("metalness")) != null ? f : 0), t.reflectivity = new nFloat((p = e == null ? void 0 : e.getValue("reflectivity")) != null ? p : .5);
                break;
            default:
                break
        }
        Object.keys(t).forEach(g => {
            this._material[g] = t[g], r.uniforms[`f${r.id}_${g}`] = t[g]
        })
    }
    clone(e) {
        return new LayerStack(e).copy(this)
    }
    toJSON(e) {
        return {
            id: this.id,
            uuid: this.uuid,
            head: this.head.toJSON(e)
        }
    }
    fromJSON(e, t, r) {
        let n = new Layer(e.head.id, void 0, {
            type: e.head.type
        }).fromJSON(e.head, t),
            s = e.head.next,
            o = n;
        for (; s != null;) o.next = new Layer(s.id, void 0, {
            type: s.type
        }).fromJSON(s, t), s = s.next, o = o.next;
        this._layerNodes = [], this.head = void 0, this.rebuildLayerNodes(this.head, n, !0);
        let a = n;
        for (o = this.head; a.next != null;) this.rebuildLayerNodes(o, a.next, !0), o = o.next, a = a.next;
        return this._material = r, this.id = e.id, this.uuid = e.uuid, this.blendColors(), this.blendAfterColors(), this.blendPositions(), this
    }
    getLightLayer() {
        var t;
        let e = this.head;
        for (; e !== void 0 && e.type !== "light";) e = (t = e.next) != null ? t : e;
        return e
    }
    dispose() {
        let e = this.head;
        for (this._layerNodes = [], this.layerCount = 0; e !== void 0;) e.hasOwnProperty("dispose") === !0 && e.dispose(), e = e.next;
        this.head = void 0
    }
    _createLayer(e) {
        var r, n, s, o, a, l, c, u, h, d, f, p, g, x, y, m, v, w, b, T, _, S, N, C, M, E, D, O, F, k, W, j, Z, U, G, R, J, re, se, V, he, ce, Y, ee, ue, q, z, Q, oe, le, xe, fe, ye, Oe, P, L, ae, pe, ve, Ce, Fe, de, He, Qe, Ue, Ee, H, Le, Pe, it, Ie, we, et, mt, Ut, St, Gt, Ur, $o;
        let t = e.type;
        switch (t) {
            case LayerTypeEnum.COLOR: {
                let je = new nColor((r = e.color) != null ? r : 5855577),
                    ft = new nFloat((n = e.alpha) != null ? n : 1),
                    lt = new Expression("alpha / clamp(alpha + accumAlpha, 0.00001, 1.0 )", "f");
                lt.keywords.alpha = ft;
                let ut = new nInt((s = e.mode) != null ? s : 0);
                return je.alpha = ft, {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        color: je,
                        alpha: ft,
                        calpha: lt,
                        mode: ut
                    }),
                    color: je,
                    alpha: lt,
                    mode: ut
                }
            }
            case LayerTypeEnum.TEXTURE: {
                let je = (o = e.texture) != null ? o : new TextureWrap,
                    ft = je.matrix;
                e.mat && ft.copy(e.mat), je.needsUpdate = !0;
                let lt = new nFloat((a = e.crop) != null ? a : 0),
                    ut = new nInt((l = e.projection) != null ? l : 0),
                    wt = new nInt((c = e.axis) != null ? c : 0),
                    It = new nVector2(e.size ? new Vector2(e.size[0], e.size[1]) : new Vector2(100, 100)),
                    zt = new nFloat((u = e.alpha) != null ? u : 1),
                    I = new nInt((h = e.mode) != null ? h : 0),
                    X = new nTexture(je),
                    te = new nVector3((d = e.textureSize) != null ? d : new Vector3(je.image ? je.image.width : 0, je.image ? je.image.height : 0)),
                    $ = new CustomTexture(X, te, lt, ut, wt, It, zt, I),
                    me = new Expression($.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        texture: X,
                        textureSize: te,
                        crop: lt,
                        projection: ut,
                        axis: wt,
                        size: It,
                        mat: $.mat,
                        alpha: zt,
                        calpha: me,
                        mode: I
                    }),
                    color: $,
                    alpha: me,
                    mode: I
                }
            }
            case LayerTypeEnum.MATCAP: {
                let je = (f = e.texture) != null ? f : new TextureWrap;
                je.needsUpdate = !0;
                let ft = new nFloat((p = e.alpha) != null ? p : 1),
                    lt = new nTexture(je),
                    ut = new nInt((g = e.mode) != null ? g : 0),
                    wt = new Matcap(lt, ft, ut),
                    It = new Expression(wt.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        texture: lt,
                        alpha: ft,
                        calpha: It,
                        mode: ut
                    }),
                    color: wt,
                    alpha: It,
                    mode: ut
                }
            }
            case LayerTypeEnum.FRESNEL: {
                let je = new nColor((x = e.color) != null ? x : 16777215),
                    ft = new nFloat((y = e.bias) != null ? y : .1),
                    lt = new nFloat((m = e.scale) != null ? m : 1),
                    ut = new nFloat((v = e.intensity) != null ? v : 2),
                    wt = new nFloat((w = e.factor) != null ? w : 1),
                    It = new nFloat((b = e.alpha) != null ? b : 1),
                    zt = new nInt((T = e.mode) != null ? T : 0),
                    I = new Fresnel(je, ft, lt, ut, wt, It, zt),
                    X = new Expression(I.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        color: je,
                        bias: ft,
                        scale: lt,
                        intensity: ut,
                        factor: wt,
                        alpha: It,
                        calpha: X,
                        mode: zt
                    }),
                    color: I,
                    alpha: X,
                    mode: zt
                }
            }
            case LayerTypeEnum.RAINBOW: {
                let je = new nFloat((_ = e.filmThickness) != null ? _ : 30),
                    ft = new nFloat((S = e.movement) != null ? S : 0),
                    lt = new nVector3((N = e.wavelengths) != null ? N : new Vector3(0, 0, 0)),
                    ut = new nFloat((C = e.noiseStrength) != null ? C : 0),
                    wt = new nFloat((M = e.noiseScale) != null ? M : 1),
                    It = new nVector3((E = e.offset) != null ? E : new Vector3(0, 0, 0)),
                    zt = new nFloat((D = e.alpha) != null ? D : 1),
                    I = new Rainbow(je, ft, lt, ut, wt, It, zt),
                    X = new Expression(I.calpha, "f"),
                    te = new nInt((O = e.mode) != null ? O : 0);
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        filmThickness: je,
                        movement: ft,
                        wavelengths: lt,
                        noiseStrength: ut,
                        noiseScale: wt,
                        offset: It,
                        alpha: zt,
                        calpha: X,
                        mode: te
                    }),
                    color: I,
                    alpha: X,
                    mode: te
                }
            }
            case LayerTypeEnum.TRANSMISSION: {
                let je = new nFloat((F = e.thickness) != null ? F : 10),
                    ft = new nFloat((k = e.ior) != null ? k : 1.5),
                    lt = new nFloat((W = e.roughness) != null ? W : .5),
                    ut = new nVector2((j = e.transmissionSamplerSize) != null ? j : new Vector2(2048, 2048)),
                    wt = (Z = e.transmissionSamplerMap) != null ? Z : new TextureWrap,
                    It = (U = e.transmissionDepthMap) != null ? U : new TextureWrap,
                    zt = new nTexture(wt),
                    I = new nTexture(It),
                    X = window.innerWidth,
                    te = window.innerHeight,
                    $ = X >= te ? new nVector2(te / X, 1) : new nVector2(1, X / te),
                    me = new nFloat((G = e.alpha) != null ? G : 1),
                    Ve = new Transmission(je, ft, lt, ut, zt, I, $, me),
                    Ze = new Expression(Ve.calpha, "f"),
                    st = new nInt((R = e.mode) != null ? R : 0);
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        thickness: je,
                        ior: ft,
                        roughness: lt,
                        transmissionSamplerSize: ut,
                        transmissionSamplerMap: zt,
                        transmissionDepthMap: I,
                        aspectRatio: $,
                        alpha: me,
                        calpha: Ze,
                        mode: st
                    }),
                    color: Ve,
                    alpha: Ze,
                    mode: st
                }
            }
            case LayerTypeEnum.DEPTH: {
                let je = new nInt((J = e.gradientType) != null ? J : 0),
                    ft = new nBool((re = e.smooth) != null ? re : !1),
                    lt = new nFloat((se = e.near) != null ? se : 50),
                    ut = new nFloat((V = e.far) != null ? V : 200),
                    wt = new nFloat((he = e.isVector) != null ? he : 1),
                    It = new nFloat((ce = e.isWorldSpace) != null ? ce : 0),
                    zt = new nVector3((Y = e.origin) != null ? Y : new Vector3),
                    I = new nVector3((ee = e.direction) != null ? ee : new Vector3),
                    X = new nInt((ue = e.num) != null ? ue : 0),
                    te;
                e.colors ? te = new nVector4Array(X.value + 1, e.colors) : (te = new nVector4Array(X.value + 1, new Vector4(0, 0, 0, 1)), te.value[1] = new Vector4(1, 1, 1, 1));
                let $;
                e.steps ? $ = new nFloatArray(e.steps.length, e.steps) : ($ = new nFloatArray(10, 1), $.value[0] = 0);
                let me = new nFloat((q = e.alpha) != null ? q : 1),
                    Ve = new nInt((z = e.mode) != null ? z : 0),
                    Ze = new Depth(je, ft, lt, ut, wt, It, zt, I, te, $, X, me),
                    st = new Expression(Ze.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        gradientType: je,
                        smooth: ft,
                        near: lt,
                        far: ut,
                        isVector: wt,
                        isWorldSpace: It,
                        origin: zt,
                        direction: I,
                        colors: te,
                        steps: $,
                        num: X,
                        alpha: me,
                        calpha: st,
                        mode: Ve
                    }),
                    color: Ze,
                    alpha: st,
                    mode: Ve
                }
            }
            case LayerTypeEnum.NOISE: {
                let je = new nFloat((Q = e.scale) != null ? Q : 1),
                    ft = new nVector3((oe = e.size) != null ? oe : new Vector3(100, 100, 100)),
                    lt = new nFloat((le = e.move) != null ? le : 1),
                    ut = new nVector2((xe = e.fA) != null ? xe : new Vector2(1.7, 9.2)),
                    wt = new nVector2((fe = e.fB) != null ? fe : new Vector2(8.3, 2.8)),
                    It = new nVector2((ye = e.distortion) != null ? ye : new Vector2(1, 1)),
                    zt = new nVector4(e.colorA),
                    I = new nVector4(e.colorB),
                    X = new nVector4(e.colorC),
                    te = new nVector4(e.colorD),
                    $ = new nFloat((Oe = e.alpha) != null ? Oe : 1),
                    me = new nInt((P = e.mode) != null ? P : 0),
                    Ve = new nInt((L = e.noiseType) != null ? L : 0),
                    Ze = new Noise(je, ft, lt, ut, wt, It, zt, I, X, te, $, Ve),
                    st = new Expression(Ze.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        scale: je,
                        size: ft,
                        move: lt,
                        fA: ut,
                        fB: wt,
                        distortion: It,
                        colorA: zt,
                        colorB: I,
                        colorC: X,
                        colorD: te,
                        alpha: $,
                        calpha: st,
                        mode: me,
                        noiseType: Ve
                    }),
                    color: Ze,
                    alpha: st,
                    mode: me
                }
            }
            case LayerTypeEnum.NORMAL: {
                let je = new nVector3((ae = e.cnormal) != null ? ae : new Vector3(1, 1, 1)),
                    ft = new nFloat((pe = e.alpha) != null ? pe : 1),
                    lt = new nInt((ve = e.mode) != null ? ve : 0),
                    ut = new CustomNormal(je, ft),
                    wt = new Expression("alpha / clamp(alpha + accumAlpha, 0.00001, 1.0 )", "f");
                return wt.keywords.alpha = ft, {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        cnormal: je,
                        alpha: ft,
                        calpha: wt,
                        mode: lt
                    }),
                    color: ut,
                    alpha: wt,
                    mode: lt
                }
            }
            case LayerTypeEnum.GRADIENT: {
                let je = new nInt((Ce = e.gradientType) != null ? Ce : 0),
                    ft = new nBool((Fe = e.smooth) != null ? Fe : !1),
                    lt;
                e.colors ? lt = new nVector4Array(e.colors.length, e.colors) : (lt = new nVector4Array(10, new Vector4(0, 0, 0, 1)), lt.value[1] = new Vector4(1, 1, 1, 1));
                let ut;
                e.steps ? ut = new nFloatArray(e.steps.length, e.steps) : (ut = new nFloatArray(10, 1), ut.value[0] = 0);
                let wt = new nVector2((de = e.offset) != null ? de : new Vector2(0, 0)),
                    It = new nVector2((He = e.morph) != null ? He : new Vector2(0, 0)),
                    zt = new nFloat((Qe = e.angle) != null ? Qe : 0),
                    I = new nFloat((Ue = e.alpha) != null ? Ue : 1),
                    X = new nInt((Ee = e.mode) != null ? Ee : 0),
                    te = new Gradient(je, ft, lt, ut, wt, It, zt, I),
                    $ = new Expression(te.calpha, "f");
                return {
                    layer: new Layer(e.id, e.uuid, {
                        type: t,
                        gradientType: je,
                        smooth: ft,
                        colors: lt,
                        steps: ut,
                        offset: wt,
                        morph: It,
                        angle: zt,
                        alpha: I,
                        calpha: $,
                        mode: X
                    }),
                    color: te,
                    alpha: $,
                    mode: X
                }
            }
            case LayerTypeEnum.DISPLACE: {
                let je = new nInt((H = e.displacementType) != null ? H : 0);
                if (je.value === 0) {
                    let ft = new nVector3((Le = e.offset) != null ? Le : new Vector3(0, 0, 0)),
                        lt = new nFloat((Pe = e.scale) != null ? Pe : 10),
                        ut = new nFloat((it = e.intensity) != null ? it : 8),
                        wt = new nFloat((Ie = e.movement) != null ? Ie : 1),
                        It = new nFloat((we = e.alpha) != null ? we : 1),
                        zt = new nInt((et = e.mode) != null ? et : 0),
                        I = new nInt((mt = e.noiseType) != null ? mt : 0),
                        X = new VertexDisplacement(je, ut, wt, ft, lt, I);
                    return {
                        layer: new Layer(e.id, e.uuid, {
                            displacementType: je,
                            type: t,
                            offset: ft,
                            scale: lt,
                            intensity: ut,
                            movement: wt,
                            alpha: It,
                            mode: zt,
                            noiseType: I
                        }),
                        position: X
                    }
                } else if (je.value === 1) {
                    let ft = (Ut = e.texture) != null ? Ut : new TextureWrap,
                        lt = ft.matrix;
                    e.mat && lt.copy(e.mat), ft.needsUpdate = !0;
                    let ut = new nFloat((St = e.intensity) != null ? St : 8),
                        wt = new nTexture(ft),
                        It = new nFloat((Gt = e.crop) != null ? Gt : 0),
                        zt = new nFloat((Ur = e.alpha) != null ? Ur : 1),
                        I = new nInt(($o = e.mode) != null ? $o : 0),
                        X = new VertexDisplacement(je, ut, wt, It);
                    return {
                        layer: new Layer(e.id, e.uuid, {
                            displacementType: je,
                            type: t,
                            intensity: ut,
                            texture: wt,
                            crop: It,
                            mat: X.mat,
                            alpha: zt,
                            mode: I
                        }),
                        position: X
                    }
                }
                return {}
            }
        }
        return {}
    }
    blendColors() {
        let e = this._layerNodes.findIndex(r => r.type === LayerNodesEnum.COLOR),
            t = this._layerNodes.findIndex(r => r.type === LayerNodesEnum.LIGHTING);
        if (e !== -1 && e < t) {
            let r = this._layerNodes[e].color;
            for (let n = e + 1; n < t; ++n) {
                let s = this._layerNodes[n];
                s.type === LayerNodesEnum.COLOR && (r = new Blend(r, s.color, s.alpha, s.mode))
            }
            this._material.color = r
        } else this._material.color = void 0
    }
    blendAfterColors() {
        let e = new Expression("outgoingLight", "f"),
            t = this._layerNodes.findIndex(r => r.type === LayerNodesEnum.LIGHTING);
        if (this._layerNodes.length > t + 1) {
            for (let r = t + 1; r < this._layerNodes.length; ++r) {
                let n = this._layerNodes[r];
                n.type === LayerNodesEnum.COLOR && (e = new Blend(e, n.color, n.alpha, n.mode))
            }
            "afterColor" in this._material && (this._material.afterColor = e)
        } else "afterColor" in this._material && (this._material.afterColor = void 0)
    }
    blendPositions() {
        let e = this._layerNodes.filter(t => t.type === LayerNodesEnum.POSITION);
        if (e.length > 0) {
            let t = e[0].position;
            for (let r = 1; r < e.length; ++r) e[r] && (t = new Operator(t, e[r].position, Operator.ADD), t = new Operator(t, new nFloat(.5).setReadonly(!0), Operator.MUL));
            this._material.position = t
        } else this._material.position = void 0
    }
    cleanupChangedLayer(e) {
        switch (this._layerNodes = this._layerNodes.filter(t => t.id !== e.id), e.type) {
            case LayerTypeEnum.DISPLACE: {
                this.blendPositions();
                break
            }
            default: {
                this.blendColors(), this.blendAfterColors();
                break
            }
        }
    }
};
