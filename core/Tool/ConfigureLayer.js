import _ from 'lodash'
import { Vector4, Matrix3, Texture, Vector2, Vector3 } from 'three'
import { packageColor } from './Func'

export function configureLight(i) {
    let {
        alpha: e,
        mode: t
    } = i.data;
    return {
        ...{
            type: i.data.type
        },
        alpha: e,
        mode: t
    }
}

export function configureColor(i, e) {
    return {
        ...configureLight(i),
        color: packageColor(i.data.color, e)
    }
}



export function configureFresnel(i, e) {
    let {
        bias: t,
        scale: r,
        intensity: n,
        factor: s,
        color: o
    } = i.data;
    return {
        ...configureLight(i),
        color: packageColor(o, e),
        bias: t,
        scale: r,
        intensity: n,
        factor: s
    }
}

export function configureGradient(i) {
    let {
        gradientType: e,
        smooth: t,
        colors: r,
        steps: n,
        angle: s,
        offset: o,
        morph: a
    } = i.data;
    return {
        ...configureLight(i),
        gradientType: e,
        smooth: t,
        colors: r.map(l => new Vector4(l[0], l[1], l[2], l[3])),
        num: r.length,
        steps: n,
        offset: new Vector2(...o),
        morph: new Vector2(...a),
        angle: s
    }
}

export function configureDepth(i) {
    let {
        gradientType: e,
        near: t,
        far: r,
        isVector: n,
        isWorldSpace: s,
        origin: o,
        direction: a,
        colors: l,
        steps: c,
        smooth: u,
        num: h
    } = i.data;
    return {
        ...configureLight(i),
        gradientType: e,
        near: t,
        far: r,
        isVector: n,
        isWorldSpace: s,
        origin: new Vector3(...o),
        direction: a ? new Vector3(...a) : new Vector3(1, 0, 0),
        num: h,
        colors: l.map(d => new Vector4(d[0], d[1], d[2], d[3])),
        steps: c,
        smooth: u
    }
}


export function configureNormal(i) {
    let {
        cnormal: e
    } = i.data;
    return {
        ...configureLight(i),
        cnormal: new Vector3(e[0], e[1], e[2])
    }
}


export function configureNoise(i, e) {
    let {
        data: t
    } = i;
    return {
        ...configureLight(i),
        scale: t.scale,
        move: t.move,
        fA: new Vector2(...t.fA),
        fB: new Vector2(...t.fB),
        distortion: new Vector2(...t.distortion),
        colorA: packageColor(t.colorA, e),
        colorB: packageColor(t.colorB, e),
        colorC: packageColor(t.colorC, e),
        colorD: packageColor(t.colorD, e),
        noiseType: t.noiseType
    }
}

export function configureTexture(i, e) {
    let {
        projection: t,
        axis: r,
        crop: n,
        size: s
    } = i.data, {
        image: o,
        wrapping: a,
        repeat: l,
        offset: c
    } = i.data.texture, u = new Texture, h;
    if (typeof o == "string") h = e == null ? void 0 : e.getImage(o);
    else {
        let d = new Image;
        d.src = o.data, d.onload = () => {
            (e == null ? void 0 : e.onImageLoad) && (e == null || e.onImageLoad(o.data))
        }, h = d
    }
    return u.image = h, u.wrapS = u.wrapT = a, {
        ...configureLight(i),
        texture: u,
        mat: new Matrix3().setUvTransform(c[0], c[1], l[0], l[1], 0, 0, 0),
        crop: n,
        projection: t,
        axis: ["x", "y", "z"].indexOf(r),
        size: s
    }
}


export function configureRainbow(i) {
    let {
        data: e
    } = i;
    return {
        ...configureLight(i),
        filmThickness: e.filmThickness,
        movement: e.movement,
        wavelengths: new Vector3(...e.wavelengths),
        noiseStrength: e.noiseStrength,
        noiseScale: e.noiseScale,
        offset: new Vector3(...e.offset)
    }
}


export function configureTransmission(i, e) {
    let {
        data: t
    } = i;
    return {
        ...configureLight(i),
        thickness: t.thickness,
        ior: t.ior,
        roughness: t.roughness,
        transmissionSamplerMap: e.transmissionSamplerMap,
        transmissionDepthMap: e.transmissionDepthMap
    }
}


export function configureMatcap(i, e) {
    let t = new Texture,
        {
            image: r
        } = i.data.texture,
        n;
    if (typeof r == "string") n = e == null ? void 0 : e.getImage(r);
    else {
        let o = new Image;
        o.src = r.data, o.onload = () => {
            (e == null ? void 0 : e.onImageLoad) && (e == null || e.onImageLoad(r.data))
        }, n = o
    }
    t.image = n;
    let s = 16777215;
    return {
        ...configureLight(i),
        color: s,
        texture: t
    }
}

export function configureDisplace(i) {
    let {
        data: e
    } = i, t = {
        ...{
            type: i.data.type
        },
        intensity: e.intensity
    }
    if (e.displacementType === "noise") return {
        ...t,
        offset: new Vector3(...e.offset),
        scale: e.scale,
        movement: e.movement,
        noiseType: e.noiseType
    }; {
        let r = new Texture,
            n = new Matrix3().setUvTransform(0, 0, 1, 1, 0, 0, 0);
        return {
            ...t,
            texture: r,
            mat: n,
            crop: e.crop
        }
    }
}


function initLayer(i, e) {
    switch (i.data.type) {
        case "light":
            return configureLight(i);
        case "fresnel":
            return configureFresnel(i, e);
        case "gradient":
            return configureGradient(i);
        case "depth":
            return configureDepth(i);
        case "normal":
            return configureNormal(i);
        case "noise":
            return configureNoise(i, e);
        case "texture":
            return configureTexture(i, e);
        case "rainbow":
            return configureRainbow(i);
        case "transmission":
            return configureTransmission(i, e);
        case "matcap":
            return configureMatcap(i, e);
        case "displace":
            return configureDisplace(i);
        case "color":
        default:
            return configureColor(i, e)
    }
}


export { initLayer }