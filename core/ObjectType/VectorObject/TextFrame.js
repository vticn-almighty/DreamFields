


import { DoubleSide, Vector3, MeshBasicMaterial } from 'three'

import SpecialMesh from '../../SpecialMesh'
import { packageColor } from '../../Tool'
import { AlignTypeEnum, VerticalAlignmentEnum, TextTransformEnum } from '../../Enum'
import { Basic } from '../../Lighting'
import { TextFrameGeometry, VectorGeometry } from '../../Geometry'
import Message from '../../normal/Message'
import CharacterMesh from '../../CharacterMesh'
import ShapeWrap from '../../ShapeWrap'
import { EmptyObject } from '../../ObjectType/VirtualObject'


class TextFrame extends SpecialMesh {
    constructor(e, t = new Basic({
        transparent: !0,
        opacity: 1,
        visible: !1,
        side: DoubleSide
    })) {
        super(e, t);
        this.objectType = "TextFrame";
        this.charContainer = new Object3D, this.add(this.charContainer),
            this.material.visible = !1, this._geometryUserData = e.userData,
            this.userData.textFrame = {
                hexColor: null,
                opacity: 1,
                visible: !0,
                text: "",
                fontSize: 16,
                lineHeight: 1.5,
                letterSpacing: 1,
                fontFamily: "roboto_regular",
                textTransform: TextTransformEnum.None,
                horizontalAlignment: 1,
                verticalAlignment: VerticalAlignmentEnum.Top,
                LOD: 16,
                maxLineSize: this._geometryUserData.parameters.width,
                textOrigin: new Vector3(this._geometryUserData.parameters.width * -.5, this._geometryUserData.parameters.height * .5, 0),
                textLines: []
            }, this.createTextLine()
    }
    static createFromState(e, t, r) {
        let n = TextFrameGeometry.create({
            parameters: {
                width: t.width,
                height: t.height
            }
        }),
            s = new TextFrame(n).fromState(t, r);
        return s.uuid = e, s
    }
    async updateText(e) {
        this.clearText();
        let t = this.userData.textFrame,
            r = t.fontFamily;
        await CharacterMesh.loadFont(r), t.text = e;
        let n = t.textOrigin,
            s = new MeshBasicMaterial({
                visible: t.visible,
                transparent: !0,
                side: DoubleSide
            }),
            o = e.split(`
`),
            a = 0;
        this.userData.textFrame.textLines = o.map((l, c) => {
            let u = new Message(a, t.lineHeight, t.fontSize);
            return u.message = l.split("").map(h => {
                let d = {
                    char: h,
                    fontFamily: r,
                    letterSpacing: t.letterSpacing,
                    fontSize: t.fontSize,
                    LOD: 16
                },
                    f = s.clone();
                f.color = t.hexColor, f.opacity = t.opacity;
                let p = new CharacterMesh(d, f);
                return u.addChar3D(p, n), this.charContainer.add(p), p
            }), a += u.maxCharSize * u.lineHeight, u
        }), this.textFullUpdate(), this.checkOverFlow()
    }
    clearText() {
        let e = this.userData.textFrame.textLines;
        for (; this.charContainer.children.length;) {
            let t = this.charContainer.children[0];
            this.charContainer.remove(t)
        }
        for (; e.length;) e.pop()
    }
    raycast(e, t) {
        let r = [];
        if (super.raycast(e, r), r.length > 0) {
            t.push(r[0]);
            return
        }
        let n = [];
        for (let s = 0, o = this.charContainer.children.length; s < o; ++s)
            if (this.charContainer.children[s] instanceof CharacterMesh && (e.intersectObject(this.charContainer.children[s], !1, n), n.length > 0)) {
                n[0].object = this, t.push(n[0]);
                return
            }
    }
    updateGeometry(e) {
        var c, u, h, d;
        let t = this.userData,
            r = this.geometry.userData,
            n = r.parameters.width,
            s = r.parameters.height,
            o = (u = (c = e.parameters) == null ? void 0 : c.width) != null ? u : n,
            a = (d = (h = e.parameters) == null ? void 0 : h.height) != null ? d : s,
            l = t.textFrame;
        super.updateGeometry(e), l.maxLineSize = o, l.textOrigin.set(-.5 * o, .5 * a, 0), a !== s ? (this.checkOverFlow(), this.checkCapacity()) : o !== n && (n < o ? this.checkCapacity() : n > o && this.checkOverFlow())
    }
    checkOverFlow(e = 0) {
        let t = this.userData,
            r = t.textFrame.textOrigin,
            n = t.textFrame.textLines;
        for (let s = e; s < n.length; s++) {
            n[s].updateYLinePos(this.getNewLinePosition(s)), n[s].fullUpdate(r);
            let o = [];
            for (; n[s].checkOverFlow(t.textFrame.maxLineSize);) n[s].containSpaceOverFlow() ? o.unshift(n[s].getWord(n[s].message.length - 1, -1)) : o.unshift(n[s].popChar());
            if (o.length > 0) {
                n[s + 1] === void 0 ? (n[s].isEndLine(!1), this.createTextLine()) : n[s].endLine && (this.createTextLine(s + 1), n[s].isEndLine(!1), n[s + 1].isEndLine(!0));
                let a = 0;
                for (let l = 0; l < o.length; l += 1)
                    for (let c = 0; c < o[l].length; c += 1) n[s + 1].addChar3D(o[l][c], r, a), a += 1;
                n[s + 1].fullUpdate(r)
            }
            n[s].fullUpdate(r)
        }
        this.textFullUpdate(e)
    }
    checkCapacity(e = 0) {
        let t = this.userData,
            r = t.textFrame.textOrigin,
            n = t.textFrame.maxLineSize,
            s = t.textFrame.textLines;
        for (let o = e; o < s.length; o += 1)
            if (s[o].updateYLinePos(this.getNewLinePosition(o)), s[o].fullUpdate(r), !!s[o - 1])
                for (; !s[o - 1].endLine;) {
                    let a, l = s[o - 1].spaceLeft(n);
                    if (s[o].wordSize(0, 1) <= l) {
                        s[o].containSpace() ? a = s[o].getWord(0, 1) : a = s[o].popChar(0);
                        for (let c = 0; c < a.length; c += 1) a[c] && s[o - 1].addChar3D(a[c], r)
                    } else {
                        s[o].isEmpty() ? (s[o].endLine && s[o - 1].isEndLine(!0), s.splice(o, 1), o -= 1) : (s[o].updateYLinePos(this.getNewLinePosition(o)), s[o].fullUpdate(r));
                        break
                    }
                }
        this.textFullUpdate(e)
    }
    createTextLine(e = this.userData.textFrame.textLines.length) {
        let r = this.userData.textFrame;
        r.textLines.splice(e, 0, new Message(this.getNewLinePosition(e), r.lineHeight, r.fontSize))
    }
    textFullUpdate(e = 0) {
        let r = this.userData.textFrame,
            n = r.textLines,
            s = this.getVerticalAlignmentOffSet();
        for (let o = e; o < n.length; o++) n[o].updateYLinePos(this.getNewLinePosition(o)), n[o].fullUpdate(r.textOrigin), n[o].alignText(r.textOrigin, r.maxLineSize, r.horizontalAlignment, r.verticalAlignment, s)
    }
    getVerticalAlignmentOffSet() {
        switch (this.userData.textFrame.verticalAlignment) {
            case VerticalAlignmentEnum.Top:
                return 0;
            case VerticalAlignmentEnum.Center:
                return this.getRemainingVerticalSpace() / 2;
            case VerticalAlignmentEnum.Bottom:
                return this.getRemainingVerticalSpace();
            default:
                return 0
        }
    }
    getRemainingVerticalSpace() {
        let t = this.userData.textFrame.textLines;
        return this.geometry.userData.parameters.height - this.getNewLinePosition(t.length)
    }
    getNewLinePosition(e) {
        let r = this.userData.textFrame.textLines,
            n = 0;
        for (let s = 0; s < e; s += 1) n += r[s].maxCharSize * r[s].lineHeight;
        return n
    }
    updateColor(e) {
        var n;
        let t = this.userData;
        t.textFrame.hexColor = e;
        let r = t.textFrame.textLines;
        for (let s = 0; s < r.length; s++) {
            let o = r[s].message;
            for (let a = 0; a < o.length; a++) {
                let l = o[a].material;
                ((n = l.color) == null ? void 0 : n.isColor) && (l.color = e)
            }
        }
    }
    updateOpacity(e) {
        let t = this.userData;
        t.textFrame.opacity = e;
        let r = t.textFrame.textLines;
        for (let n = 0; n < r.length; n++) {
            let s = r[n].message;
            for (let o = 0; o < s.length; o++) {
                let a = s[o].material;
                a.opacity = e
            }
        }
    }
    updateVisible(e) {
        let t = this.userData;
        t.textFrame.visible = e;
        let r = t.textFrame.textLines;
        for (let n = 0; n < r.length; n++) {
            let s = r[n].message;
            for (let o = 0; o < s.length; o++) {
                let a = s[o].material;
                a.visible = e
            }
        }
    }
    async updateFontFamily(e) {
        await CharacterMesh.loadFont(e);
        let r = this.userData.textFrame,
            n = r.textLines;
        r.fontFamily = e;
        for (let s = 0; s < n.length; s++) {
            let o = n[s].message;
            for (let a = 0; a < o.length; a++) o[a].updateFontFamily(e)
        }
        this.textFullUpdate(), this.checkOverFlow(), this.checkCapacity()
    }
    updateFontSize(e) {
        let r = this.userData.textFrame,
            n = r.textLines,
            s = r.fontSize;
        r.fontSize = e;
        for (let o = 0; o < n.length; o++) n[o].updateFontSize(e);
        this.textFullUpdate(), e > s ? this.checkOverFlow() : e < s && this.checkCapacity()
    }
    async updateTextTransform(e) {
        let r = this.userData.textFrame;
        await CharacterMesh.loadFont(r.fontFamily);
        let n = r.textLines;
        switch (r.textTransform = e, e) {
            case TextTransformEnum.Upper:
                for (let s = 0; s < n.length; s++) {
                    let o = n[s].message;
                    for (let a = 0; a < o.length; a++) n[s].message[a].updateChar(o[a].char.toUpperCase())
                }
                break;
            case TextTransformEnum.Lower:
                for (let s = 0; s < n.length; s++) {
                    let o = n[s].message;
                    for (let a = 0; a < o.length; a++) n[s].message[a].updateChar(o[a].char.toLowerCase())
                }
                break;
            default:
                for (let s = 0; s < n.length; s++) {
                    let o = n[s].message;
                    for (let a = 0; a < o.length; a++) n[s].message[a].updateChar(o[a].originalChar)
                }
        }
        this.textFullUpdate(), this.checkOverFlow(), this.checkCapacity()
    }
    updateLetterSpacing(e) {
        let t = this.userData,
            r = t.textFrame.textLines;
        t.textFrame.letterSpacing = e;
        for (let n = 0; n < r.length; n++) {
            let s = r[n].message;
            for (let o = 0; o < s.length; o++) s[o].updateLetterSpacing(e)
        }
        this.textFullUpdate(), this.checkOverFlow(), this.checkCapacity()
    }
    updateLOD(e) {
        let t = this.userData;
        t.textFrame.LOD = e;
        let r = t.textFrame.textLines;
        for (let n = 0; n < r.length; n++);
        this.textFullUpdate(), this.checkOverFlow(), this.checkCapacity()
    }
    updateLineHeight(e) {
        let t = this.userData,
            r = t.textFrame.textLines;
        t.textFrame.lineHeight = e;
        for (let n = 0; n < r.length; n++) r[n].updatelineHeight(e);
        this.textFullUpdate()
    }
    updateVerticalAlignment(e) {
        let t = this.userData;
        t.textFrame.verticalAlignment = e, this.textFullUpdate()
    }
    updateHorizontalAlignment(e) {
        let t = this.userData;
        t.textFrame.horizontalAlignment = e, this.textFullUpdate()
    }
    // toJSON(e) {
    //     let t = super.toJSON(e),
    //         r = t.object;
    //     r.ObjectType = "TextFrame";
    //     let s = this.userData.textFrame.textLines.map(o => {
    //         let a = o.message.map(l => ({
    //             char: l.char,
    //             originalChar: l.originalChar,
    //             fontFamily: l.fontFamily,
    //             letterSpacing: l.letterSpacing,
    //             fontSize: l.fontSize,
    //             LOD: l.LOD
    //         }));
    //         return {
    //             align: o.align,
    //             endLine: o.endLine,
    //             lineHeight: o.lineHeight,
    //             maxCharSize: o.maxCharSize,
    //             yLinePos: o.yLinePos,
    //             message: a
    //         }
    //     });
    //     return r.userData.textFrame.textLinesData = s, t
    // }
    // async fromJSONasync(e) {
    //     if (super.fromJSON(e), e.userData !== void 0) {
    //         let t = e.userData.textFrame;
    //         await CharacterMesh.loadFont(t.fontFamily), t.textOrigin = new Vector3(t.textOrigin.x, t.textOrigin.y, t.textOrigin.z);
    //         let r = new ui({
    //             color: t.hexColor,
    //             opacity: t.opacity,
    //             visible: t.visible,
    //             transparent: !0,
    //             side:DoubleSide
    //         });
    //         t.textLinesData && (t.textLines = t.textLinesData.map((n, s) => {
    //             let o = new Yo(Number(n.yLinePos), Number(n.lineHeight), Number(n.maxCharSize)),
    //                 a = n.message.map((l, c) => {
    //                     if (l.char === void 0) {
    //                         let d = t.textLines[s].message[c];
    //                         if ("geometries" in d) {
    //                             let f = d.geometries[0].userData.parameters;
    //                             Object.assign(l, {
    //                                 LOD: f.lod,
    //                                 char: f.char,
    //                                 fontFamily: f.fontFamily,
    //                                 fontSize: f.fontSize,
    //                                 letterSpacing: f.letterSpacing,
    //                                 originalChar: f.char
    //                             })
    //                         }
    //                     }
    //                     let u = {
    //                         char: l.char,
    //                         fontFamily: l.fontFamily,
    //                         letterSpacing: Number(l.letterSpacing),
    //                         fontSize: Number(l.fontSize),
    //                         LOD: l.LOD
    //                     },
    //                         h = new CharacterMesh(u, r.clone());
    //                     return o.addChar3D(h, t.textOrigin), this.charContainer.add(h), h
    //                 });
    //             return o.message = a, o
    //         }), this.userData.textFrame = t), this.textFullUpdate()
    //     }
    //     return this
    // }
    fromTextFrameData(e, t) {
        if (e.color !== void 0) {
            let r = packageColor(e.color, t);
            this.updateColor(r), this.updateOpacity(r.a)
        }
        e.alpha !== void 0 && this.updateOpacity(e.alpha);
        e.font !== void 0 && this.updateFontFamily(e.font);
        e.horizontalAlign !== void 0 && this.updateHorizontalAlignment(e.horizontalAlign);
        e.verticalAlign !== void 0 && this.updateVerticalAlignment(e.verticalAlign);
        e.textTransform !== void 0 && this.updateTextTransform(e.textTransform);
        e.fontSize !== void 0 && this.updateFontSize(e.fontSize);
        e.lineHeight !== void 0 && this.updateLineHeight(e.lineHeight);
        e.letterSpacing !== void 0 && this.updateLetterSpacing(e.letterSpacing);
        e.text !== void 0 && e.text !== "" && this.updateText(e.text);
        (e.width !== void 0 || e.height !== void 0) && this.updateGeometry({
            parameters: {
                width: e.width,
                height: e.height
            }
        })
    }
    fromState(e, t) {
        return super.fromState(e), this.fromTextFrameData(e, t), this
    }
    convertToVector() {
        let {
            fontFamily: e,
            hexColor: t
        } = this.userData.textFrame, r = new EmptyObject;
        r.name = "Text Shape";
        let n = CharacterMesh.fontCache[e];
        for (let s of this.charContainer.children) s instanceof CharacterMesh && n.generateShapes(s.char, 1).forEach(o => {
            let a = new ShapeWrap().fromShape(o);
            a.applyScale(s.scale.x, s.scale.y);
            let l = VectorGeometry.create({
                shape: a
            }),
                c = new Basic({
                    side: DoubleSide
                });
            c.color = t;
            let u = new VectorObject(l, c);
            u.name = s.char, u.position.copy(s.position), u.rotation.copy(s.rotation), r.attach(u)
        });
        return r
    }
}



let Bl = TextFrame;
Bl.VerticalAlign = VerticalAlignmentEnum, Bl.HorizontalAlign = AlignTypeEnum, Bl.TextTransform = TextTransformEnum;



export { TextFrame }