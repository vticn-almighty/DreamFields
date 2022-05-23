import Layer from "./Layer";

function Q1(i) {
    let e = i instanceof Layer ? i.type : i;
    return e === "texture" || e === "displace_map" || e === "matcap"
}
const cA = i => i.tagName === "VIDEO"

export default class Resize {
    static resize(e, t, r) {
        let n = e / t,
            s;
        if (!r.image) return;
        let o = r.image;
        cA(o) ? s = o.videoWidth / o.videoHeight : s = o.width / o.height, n > s && (r.imageType == "WEBCAM" ? r.repeat.set(-1, 1 * s / n) : r.repeat.set(1, 1 * s / n)), n < s && (r.imageType == "WEBCAM" ? r.repeat.set(1 * n / s * -1, 1) : r.repeat.set(1 * n / s, 1)), n == s && (r.imageType == "WEBCAM" ? r.repeat.set(-1, 1) : r.repeat.set(1, 1))
    }
    static resizeTextureLayer(e, t, r) {
        let n = e / t,
            s = r.image !== void 0 ? r.image.width / r.image.height : 1,
            o;
        n > s ? o = {
            x: 1,
            y: s / n
        } : n < s ? o = {
            x: n / s,
            y: 1
        } : o = {
            x: 1,
            y: 1
        }, r.repeat.set(o.x, o.y), r.updateMatrix()
    }
    static resizeTextureLayers(e, t, r) {
        let n = r.userData.layers,
            s = n.getLayers();
        for (let o = 0; o < s.length; o++) {
            let a = s[o];
            Q1(a) && (Resize.resizeTextureLayer(e, t, a.uniforms[`f${a.id}_texture`].value), n.updateLayerUniform())
        }
    }
    static resizeComplex(e, t, r, n) {
        let s = e / t,
            o, a = r.image;
        cA(a) ? o = a.videoWidth / a.videoHeight : o = a.width / a.height, n.geometry.type.includes("Shape") ? (s > o && (r.imageType == "WEBCAM" ? r.repeat.set(1 / e * -1, 1 / t * o / s) : r.repeat.set(1 / e, 1 / t * o / s)), s < o && (r.imageType == "WEBCAM" ? r.repeat.set(1 / e * s / o * -1, 1 / t) : r.repeat.set(1 / e * s / o, 1 / t)), s == o && (r.imageType == "WEBCAM" ? r.repeat.set(1 / e * -1, 1 / t) : r.repeat.set(1 / e, 1 / t))) : (s > o && (r.imageType == "WEBCAM" ? r.repeat.set(-1, 1 * o / s) : r.repeat.set(1, 1 * o / s)), s < o && (r.imageType == "WEBCAM" ? r.repeat.set(1 * s / o * -1, 1) : r.repeat.set(1 * s / o, 1)), s == o && (r.imageType == "WEBCAM" ? r.repeat.set(-1, 1) : r.repeat.set(1, 1)))
    }
};