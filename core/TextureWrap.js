import { Texture, } from 'three'


function bF(i) {
    if (/^data:/i.test(i.src)) return i.src;
    let e;
    if (i instanceof HTMLCanvasElement) e = i;
    else {
        _l === void 0 && (_l = document.createElement("canvas")), _l.width = i.width, _l.height = i.height;
        let r = _l.getContext("2d");
        i instanceof ImageData ? r.putImageData(i, 0, 0) : r.drawImage(i, 0, 0, i.width, i.height), e = _l
    }
    let t = i.src.startsWith("blob:") ? i.fileName : i.src;
    return /\.jpe?g$/i.test(t) ? e.toDataURL("image/jpeg", .6) : e.toDataURL("image/png")
}

function Y1(i) {
    return typeof HTMLImageElement != "undefined" && i instanceof HTMLImageElement || typeof HTMLCanvasElement != "undefined" && i instanceof HTMLCanvasElement || typeof ImageBitmap != "undefined" && i instanceof ImageBitmap ? bF(i) : (console.warn("THREE.Texture: Unable to serialize Texture."), "")
}


export default class TextureWrap extends Texture {
    toJSON(e) {
        let t = super.toJSON(e),
            r = e === void 0 || typeof e == "string";
        if (this.image !== void 0 && !r) {
            let n = this.image;
            if (Array.isArray(n)) {
                e.images[n.uuid].url = [];
                for (let s = 0; s < n.length; s++) e.images[n.uuid].url[s] = Y1(n[s])
            } else e.images[n.uuid].url = Y1(n)
        }
        return t
    }
};

