import ColorWrap from '../ColorWrap'
import { TransitionEnum, LayerTypeEnum, LayerModeEnum, SideEnum } from '../Enum'
import { DoubleSide, BufferGeometryLoader, FrontSide, Color, HemisphereLight, Color, Vector3, BackSide } from 'three'
import { Physical, Basic, Lambert, Toon, Phong } from '../Lighting'
import { Mesh3D, VectorObject, Mesh2D, SubdivObject, TextFrame } from '../ObjectType/VectorObject'

import { LightDirectional, CombinedCamera, LightPoint, EmptyObject, LightSpot } from '../ObjectType/VirtualObject'
import ShapeWrap from '../ShapeWrap'
import SpecialMesh from '../SpecialMesh'
import NonParametric from '../ObjectType/NonParametric'
import fetchGeometry from '../Geometry'
import { initLayer } from './ConfigureLayer'
import { CameraTool, MatrixTool, LayerTool, ShapeTool, ParametricMeshTool, ColorTool } from './Proto'

let xs = i => "objectHelper" in i
let jf = new Vector3;

export function throwFailed(i, e) {
    if (!i) throw e || "Assertion Failed!"
}


export function packageColor(i, e) {
    let t;
    if (typeof i == "string") {
        let r = e == null ? void 0 : e.getColor(i);
        r ? t = r : (console.warn("Tried to create color layer params with a color key that does not exist in the assets manager"), t = new ColorWrap(0, 0, 0, 0))
    } else return "a" in i ? new ColorWrap(i.r, i.g, i.b, i.a) : new ColorWrap(i.r, i.g, i.b, 1);
    return t
}

export function createEffectList(i, e) {
    return e && e.enabled && i.push(e.effect), i
}


export function setMatrix(i, e) {
    var r;
    let t = !1;
    e.position && (i.position.fromArray(e.position), t = !0);
    e.rotation && (i.rotation.fromArray(e.rotation), t = !0);
    e.scale && (t = !0, i.scale.fromArray(e.scale));
    e.hiddenMatrix !== void 0 && "hiddenMatrix" in i && (t = !0, i.hiddenMatrix.fromArray((r = e.hiddenMatrix) != null ? r : MatrixTool.identity));
    t && i.updateMatrix();
    e.position && e.rotation && e.scale && e.hiddenMatrix !== void 0 && i.updateWorldMatrix(!1, !0);
    i.ObjectType === "CombinedCamera" && (e.isUpVectorFlipped !== void 0 && (i.isUpVectorFlipped = e.isUpVectorFlipped), i.updateUp())
}

export function setAmbientLight(i, e, t) {
    setMatrix(i, e);
    e.name !== void 0 && (i.name = e.name);
    e.visible !== void 0 && (i.isEntity ? i.visibility = e.visible : i.visible = e.visible)
    e.color !== void 0 && (i.color = packageColor(e.color, t));
    e.intensity !== void 0 && (i.intensity = e.intensity);
    e.shadows !== void 0 && !(i instanceof HemisphereLight) && (i.castShadow = e.shadows);
    i.shadow && !(i instanceof HemisphereLight) && e.depth !== void 0 && (i.shadow.camera.far = e.depth, i.shadow.needsUpdate = !0);
    e.helper !== void 0 && xs(i) && (i.enableHelper = e.helper, i.gizmos.shadowmap.visible = e.helper)
}



export function visualIntensitySettings(i, e, t) {
    if (t.type === "displace" && (i === "intensity" || i === "visible")) {
        let r = e.uniforms[`f${e.id}_intensity`];
        return r ? (r.value = t.intensity * (t.visible ? 1 : 0), r) : void 0
    }
    if (t.type !== "displace" && (i === "alpha" || i === "visible")) {
        let r = e.uniforms[`f${e.id}_alpha`];
        return r ? (r.value = t.alpha * (t.visible ? 1 : 0), r) : void 0
    }
}



export function createMaterialByLayers(i, e) {
    var o;
    let t = (o = i.layers) != null ? o : LayerTool.defaultTwoLayerData("phong").layers,
        r = getSurfaceLightLayer(t),
        n;
    switch (r.category) {
        case "basic":
            n = new Basic;
            break;
        case "lambert": {
            n = new Lambert;
            break
        }
        case "toon": {
            n = new Toon;
            break
        }
        case "physical":
            n = new Physical;
            break;
        case "phong":
        default: {
            n = new Phong;
            break
        }
    }
    let s = n.userData.layers;
    removeAllLayers(s);
    for (let a = t.length - 1; a >= 0; a--) overloadLayer(s, t[a], e);
    switch (r.category) {
        case "basic":
            break;
        case "lambert": {
            let c = n,
                h = packageColor(r.emissive, e);
            h instanceof Color ? c.emissive.value = h : c.emissive.value.setHex(ColorTool.getHex(h));
            break
        }
        case "toon": {
            let c = n,
                u = r;
            c.shininess.value = u.shininess;
            let h = packageColor(u.specular, e);
            h instanceof Color ? c.specular.value = h : c.specular.value.setHex(ColorTool.getHex(h));
            break
        }
        case "physical":
            let a = n,
                l = r;
            a.metalness.value = l.metalness, a.roughness.value = l.roughness, a.reflectivity.value = l.reflectivity;
            break;
        case "phong":
        default: {
            let c = n,
                u = r;
            c.shininess.value = u.shininess;
            let h = packageColor(u.specular, e);
            h instanceof Color ? c.specular.value = h : c.specular.value.setHex(ColorTool.getHex(h));
            break
        }
    }
    return s.blendColors(), s.blendAfterColors(), s.blendPositions(), n
}

export function getSurfaceLightLayer(i) {
    for (let e of i)
        if (e.data.type === "light") return e.data;
    return {
        type: "light",
        category: "basic",
        visible: !0,
        alpha: 1,
        mode: LayerModeEnum.Normal
    }
}


export function removeAllLayers(i) {
    for (let e of i.getLayers()) {
        i.removeLayer(e.id)
    }
}


export function overloadLayer(i, e, t) {
    let r = initLayer(e, t);
    r.type === "transmission" && (r.transmissionSamplerMap = t == null ? void 0 : t.transmissionSamplerMap, r.transmissionDepthMap = t == null ? void 0 : t.transmissionDepthMap);
    let n = i.addLayer(r);
    n.uuid = e.id;
    for (let s in e.data) visualIntensitySettings(s, n, e.data)
}


export const setRaycastHelper = (i, e, t, r, n = !1) => {
    let s = e,
        o = i.matrixWorld;
    if (s.boundingSphere === null && s.computeBoundingSphere(), _y.copy(s.boundingSphere), _y.applyMatrix4(o), t.ray.intersectsSphere(_y) === !1 || (iA.copy(o).invert(), Hf.copy(t.ray).applyMatrix4(iA), s.boundingBox !== null && Hf.intersectsBox(s.boundingBox) === !1)) return;
    let a, l, c, u, h = s.index,
        d = s.attributes.position,
        f = s.drawRange,
        p, g;
    if (n === !1) {
        let y = Math.max(0, f.start),
            m = Math.min(h.count, f.start + f.count);
        for (p = y, g = m; p < g; p += 3)
            if (l = h.getX(p), c = h.getX(p + 1), u = h.getX(p + 2), a = x(i, t, Hf, d, l, c, u), a) {
                a.faceIndex = Math.floor(p / 3), r.push(a);
                return
            }
    } else {
        let m = s.attributes.position,
            v = new Vector3;
        w = new Vector3;
        b = new Vector3;
        T = new Vector3;
        _ = 2,
            N = 1 / ((i.scale.x + i.scale.y + i.scale.z) / 3),
            C = N * N,
            M = Math.max(0, f.start),
            E = Math.min(m.count, f.start + f.count);
        for (let D = M, O = E - 1; D < O; D += _) {
            if (v.fromBufferAttribute(m, D), w.fromBufferAttribute(m, D + 1), Hf.distanceSqToSegment(v, w, T, b) > C) continue;
            T.applyMatrix4(i.matrixWorld);
            let k = t.ray.origin.distanceTo(T);
            k < t.near || k > t.far || r.push({
                distance: k,
                point: b.clone().applyMatrix4(i.matrixWorld),
                object: i
            })
        }
    }

    function x(y, m, v, w, b, T, _) {
        let S = new Vector3;
        N = new Vector3;
        C = new Vector3;
        M = new Vector3;
        E = new Vector3;
        if (S.fromBufferAttribute(w, b), N.fromBufferAttribute(w, T), C.fromBufferAttribute(w, _), v.intersectTriangle(S, N, C, !1, M) === null) return null;
        E.copy(M), E.applyMatrix4(y.matrixWorld);
        let O = m.ray.origin.distanceTo(E);
        return O < m.near || O > m.far ? null : {
            faceIndex: 1,
            distance: O,
            point: E.clone(),
            object: y
        }
    }
};


export function setPosition(i, e, t, r, n, s, o) {
    jf.set(n, s, o).unproject(r);
    let a = e[i];
    if (a !== void 0) {
        let l = t.getAttribute("position");
        for (let c = 0, u = a.length; c < u; c++) l.setXYZ(a[c], jf.x, jf.y, jf.z)
    }
}






export function createGeometry(i) {
    let e = {
        parameters: i,
        type: i.type
    };
    if (i.type === "VectorGeometry") {
        let r = ShapeWrap.createFromState(i.shape, i.width, i.height);
        e.shape = r
    } else i.type === "NonParametricGeometry" && (i.data.groups && i.data.groups.forEach(r => {
        var n;
        return r.materialIndex = Math.max((n = r.materialIndex) != null ? n : 0, 0)
    }), e.geometry = new BufferGeometryLoader().parse(i));
    let t;
    try {
        t = fetchGeometry(e)
    } catch (r) {
        console.error(r)
    }
    if (!t) {
        let r = ShapeWrap.createFromState(ShapeTool.defaultData(), 100, 100);
        e.shape = r, t = fetchGeometry(e)
    }
    return t
}


export function createSingleMaterial(i, e) {
    return typeof i == "string" ? e.getMaterialOrDeletedPlaceholder(i) : createMaterialByLayers(i, e)
}


export function createMultipleMaterial(i, e) {
    return i.map(t => createSingleMaterial(t, e))
}

export function setSingleMaterial(i, e) {
    e.flatShading !== void 0 && (i.flatShading = e.flatShading, i.needsUpdate = !0), e.wireframe !== void 0 && (i.wireframe = e.wireframe), e.side !== void 0 && (e.side === SideEnum.Front ? i.side = FrontSide : e.side === SideEnum.Back ? i.side = BackSide : i.side = DoubleSide)
}

export function setMultipleMaterial(i, e) {
    if (Array.isArray(i.material))
        for (let t of i.material) setSingleMaterial(t, e);
    else {
        let t = i.material;
        setSingleMaterial(t, e)
    }
    i.ObjectType === "SubdivObject" && e.flatShading !== void 0 && (i.material.flatShading = !1, i.smoothShading = !e.flatShading, i.updateMesh())
}


export function createMeshEntity(i, e, t) {
    let r;
    if (e.geometry.type === "SubdivGeometry") r = SubdivObject.createFromState(i, e, t);
    else {
        let n = createGeometry(e.geometry),
            s = "materials" in e ? createMultipleMaterial(e.materials, t) : createSingleMaterial(e.material, t);
        ParametricMeshTool.is2DParametricMesh(n.userData.type) ? r = new Mesh2D(n, s) : (n == null ? void 0 : n.userData.type) === "VectorGeometry" ? r = new VectorObject(n, s) : e.geometry.type === "NonParametricGeometry" ? r = new NonParametric(n, s) : r = new Mesh3D(n, s), r.uuid = i, r.fromState(e)
    }
    return setMultipleMaterial(r, e), r
}


export function createEntity(i, e, t) {
    return e.type === "Mesh" ? createMeshEntity(i, e, t) : e.type === "TextFrame" ? TextFrame.createFromState(i, e, t) : e.type === "Empty" ? EmptyObject.createFromState(i, e) : e.type === "PointLight" ? LightPoint.createFromState(i, e, t) : e.type === "SpotLight" ? LightSpot.createFromState(i, e, t) : e.type === "DirectionalLight" ? LightDirectional.createFromState(i, e, t) : CameraTool.is(e.type) ? CombinedCamera.createFromState(i, e) : (console.error(e), new EmptyObject)
}


export function loadTransmissionMap(i, e) {
    e.uniforms[`f${e.id}_transmissionSamplerMap`].value = i.texture
    e.uniforms[`f${e.id}_transmissionDepthMap`].value = i.depthTexture
}


export function initTransmissionMaterial(i, e, t) {
    if (!t.userData.layers) return !1;
    let r = !1,
        n = t.userData.layers.getLayersOfType(LayerTypeEnum.TRANSMISSION);
    n.length > 0 ? (e.layers.set(3), r = !0, i !== void 0 && n.forEach(s => loadTransmissionMap(i, s))) : e.layers.set(0)
    return r
}


export function checkTransmissionFlag(i, e) {
    let t = !1;
    return e.traverseEntity(r => {
        if (r instanceof SpecialMesh)
            if (Array.isArray(r.material))
                for (let n = 0; n < r.material.length; n++)
                    initTransmissionMaterial(i, r, r.material[n]) && (t = !0);
            else initTransmissionMaterial(i, r, r.material) && (t = !0)
    }), t
}

export function destroyEntity(i, e) {
    "material" in i && disposeMaterial(i.material, e);
    "geometry" in i && i.geometry.dispose();
}



export function asArray(i) {
    return Array.isArray(i) ? i : [i]
}


export function disposeMaterial(i, e) {
    asArray(i).forEach(t => {
        e.isSharedMaterial(t) || t.dispose()
    })
}


export function platformCheck() {
    return ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document
}


export function initTransition(i, e, t) {
    switch (i) {
        case TransitionEnum.LINEAR:
            return "cubicBezier( 0, 0, 1, 1 )";
        case TransitionEnum.EASE:
            return "cubicBezier( .25, .1, .25, 1 )";
        case TransitionEnum.EASE_IN:
            return "cubicBezier( .42, 0, 1, 1 )";
        case TransitionEnum.EASE_OUT:
            return "cubicBezier( 0, 0, .58, 1 )";
        case TransitionEnum.EASE_IN_OUT:
            return "cubicBezier( .42, 0, .58, 1 )";
        case TransitionEnum.CUBIC:
            let {
                control1: r, control2: n
            } = e;
            return `cubicBezier( ${r[0]}, ${r[1]}, ${n[0]}, ${n[1]} )`;
        case TransitionEnum.SPRING:
            let {
                mass: s, stiffness: o, damping: a, velocity: l
            } = t;
            return `spring( ${s}, ${o}, ${a}, ${l} )`
    }
}
