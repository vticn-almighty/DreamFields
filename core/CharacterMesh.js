import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { DoubleSide, Mesh, Vector2, Vector3, MeshBasicMaterial } from 'three'


export default class CharacterMesh extends Mesh {
    constructor({
        char: e,
        originalChar: t,
        fontFamily: r,
        letterSpacing: n,
        fontSize: s,
        LOD: o = 16
    }, a = new MeshBasicMaterial({
        color: 0,
        opacity: 1,
        visible: !0,
        transparent: !0,
        side: DoubleSide
    })) {
        let l = CharacterMesh.loadChar(e, r, o);
        super(l.geometry, a);
        this.char = e;
        this.originalChar = t != null ? t : e;
        this.fontFamily = r;
        this.letterSpacing = n;
        this.fontSize = s;
        this.LOD = o;
        this.resolution = l.resolution;
        this.glyphsHa = l.glyphsHa;
        this.localPosition = new Vector2;
        this.charSize = 0;

        this.geometry.userData = {
            type: "CharacterGeometry",
            parameters: {
                char: this.char,
                fontFamily: this.fontFamily,
                letterSpacing: this.letterSpacing,
                fontSize: this.fontSize,
                lod: this.LOD,
                resolution: this.resolution,
                charSize: this.charSize,
                localPosition: this.localPosition
            }
        }, this.updateFontSize(this.fontSize)
    }
    static get FONTS_PATH() {
        return CharacterMesh._fontPath
    }
    static set FONTS_PATH(e) {
        CharacterMesh._fontPath = e
    }
    updatePosition(e, t) {
        this.localPosition.copy(e);
        let r = new Vector3(this.localPosition.x, -this.localPosition.y, 0);
        this.position.copy(r).add(t)
    }
    updateFontSize(e) {
        let t = e / this.resolution;
        this.fontSize = e, this.scale.set(this.fontSize, this.fontSize, 1), this.charSize = this.glyphsHa * t * this.letterSpacing
    }
    updateFontFamily(e) {
        if (this.fontFamily === e) return;
        this.fontFamily = e;
        let t = CharacterMesh.loadChar(this.char, e, this.LOD);
        this.geometry = t.geometry, this.resolution = t.resolution, this.glyphsHa = t.glyphsHa, this.geometry.userData = {
            type: "CharacterGeometry",
            parameters: {
                char: this.char,
                fontFamily: this.fontFamily,
                letterSpacing: this.letterSpacing,
                fontSize: this.fontSize,
                lod: this.LOD,
                resolution: this.resolution,
                charSize: this.charSize,
                localPosition: this.localPosition
            }
        }, this.updateFontSize(this.fontSize)
    }
    updateChar(e) {
        if (this.char === e) return;
        this.char = e;
        let t = CharacterMesh.loadChar(e, this.fontFamily, this.LOD);
        this.geometry = t.geometry, this.resolution = t.resolution, this.glyphsHa = t.glyphsHa, this.geometry.userData = {
            type: "CharacterGeometry",
            parameters: {
                char: this.char,
                fontFamily: this.fontFamily,
                letterSpacing: this.letterSpacing,
                fontSize: this.fontSize,
                lod: this.LOD,
                resolution: this.resolution,
                charSize: this.charSize,
                localPosition: this.localPosition
            }
        }, this.updateFontSize(this.fontSize)
    }
    updateLetterSpacing(e) {
        this.letterSpacing !== e && (this.letterSpacing = e, this.updateFontSize(this.fontSize))
    }
    updateLOD(e) {
        if (this.LOD === e) return;
        this.LOD = e;
        let t = CharacterMesh.loadChar(this.char, this.fontFamily, this.LOD);
        this.geometry = t.geometry, this.resolution = t.resolution, this.glyphsHa = t.glyphsHa, this.geometry.userData = {
            type: "CharacterGeometry",
            parameters: {
                char: this.char,
                fontFamily: this.fontFamily,
                letterSpacing: this.letterSpacing,
                fontSize: this.fontSize,
                lod: this.LOD,
                resolution: this.resolution,
                charSize: this.charSize,
                localPosition: this.localPosition
            }
        }, this.updateFontSize(this.fontSize)
    }
    clone() {
        let e = {
            char: this.char,
            originalChar: this.originalChar,
            fontFamily: this.fontFamily,
            letterSpacing: this.letterSpacing,
            fontSize: this.fontSize,
            LOD: this.LOD
        };
        return new CharacterMesh(e).copy(this)
    }
    static loadFont(e) {
        return new Promise(function (t, r) {
            CharacterMesh.fontCache[e] ? t(CharacterMesh.fontCache[e]) : new FontLoader().load(CharacterMesh.FONTS_PATH + e + ".json", s => {
                CharacterMesh.fontCache[e] = s, t(s)
            }, void 0, r)
        })
    }
    static loadChar(e, t, r) {
        if (CharacterMesh.charCache[e]) {
            if (CharacterMesh.charCache[e][r] && CharacterMesh.charCache[e][r].fontFamily === t) return CharacterMesh.charCache[e][r]
        } else CharacterMesh.charCache[e] = {};
        let n = CharacterMesh.fontCache[t],
            s = n.generateShapes(e, 1);
        return CharacterMesh.charCache[e][r] = {
            geometry: new ShapeGeometry(s, r),
            fontFamily: t,
            resolution: n.data.resolution,
            glyphsHa: n.data.glyphs[e].ha
        }, CharacterMesh.charCache[e][r]
    }
}

let rn = CharacterMesh;
rn.charCache = {}, rn.fontCache = {}, rn._fontPath = "/_assets/_fonts/";



