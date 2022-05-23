import { Vector2 } from 'three'
import { AlignTypeEnum } from '../Enum'
let Vf = new Vector2

export default class Message {
    constructor(e, t, r) {
        this.message = [];
        this.endLine = !0;
        this.yLinePos = e, this.lineHeight = t, this.maxCharSize = r, this.nextChar3DPos = new Vector2(0, this.yLinePos + this.maxCharSize * this.lineHeight), this.align = AlignTypeEnum.Left
    }
    addChar3D(e, t, r = this.message.length) {
        this.message.splice(r, 0, e), e.fontSize > this.maxCharSize ? (this.maxCharSize = e.fontSize, this.nextChar3DPos.y = this.yLinePos + this.maxCharSize * this.lineHeight, this.fullUpdate(t)) : (e.updatePosition(this.nextChar3DPos, t), this.nextChar3DPos.x += e.charSize)
    }
    deleteChar3D(e = this.message.length - 1) {
        let t = this.message[e];
        if (t) return this.message.splice(e, 1), this.nextChar3DPos.x -= t.charSize, t
    }
    isEndLine(e) {
        this.endLine = e
    }
    fullUpdate(e, t = 0) {
        this.nextChar3DPos.x = 0;
        for (let r = t, n = this.message.length; r < n; r += 1) this.message[r].updatePosition(this.nextChar3DPos, e), this.nextChar3DPos.x += this.message[r].charSize
    }
    checkOverFlow(e) {
        let t, r = this.message.length - 1;
        if (r <= 0) return !1;
        for (; r >= 0;) {
            if (this.message[r].char !== " ") {
                t = this.message[r];
                break
            }
            r -= 1
        }
        return !!(r >= 0 && t && t.localPosition.x + t.charSize > e)
    }
    containSpaceOverFlow(e = this.message.length - 1) {
        for (let t = e; t >= 0; t -= 1)
            if (this.message[t].char === " ") return !0;
        return !1
    }
    containSpace(e = this.message.length - 1) {
        if (this.endLine) return !0;
        for (let t = e; t >= 0; t -= 1)
            if (this.message[t].char === " ") return !0;
        return !1
    }
    popWord(e = this.message.length - 1) {
        let t = [],
            r = !0,
            n;
        for (n = e; n >= 0; n -= 1)
            if (this.message[n].char === " ") {
                r = !1, t.length === 0 && (n -= 1, t.splice(0, 0, this.message[n]));
                break
            } else t.splice(0, 0, this.message[n]);
        return r ? t = [] : this.message.splice(n + 1, t.length), t
    }
    getWord(e = 0, t = 1) {
        let r = [],
            n = e;
        for (n = e; ; n += t) {
            if (!this.message[n] || this.message[n].char === " ") {
                r.length === 0 && this.message[n] && (r.push(this.message[n]), this.message.splice(n, 1));
                break
            }
            t > 0 ? (r.push(this.message[n]), this.message.splice(n, 1), n -= t) : (r.splice(0, 0, this.message[n]), this.message.splice(n, 1))
        }
        return r
    }
    getWordAtIndex(e) {
        let t = [];
        for (let r = e; r < this.message.length && this.message[r].char !== " "; r++) t.push(this.message[r]);
        for (let r = e - 1; r >= 0 && this.message[r].char !== " "; r--) t.splice(0, 0, this.message[r]);
        return t
    }
    wordSize(e = 0, t = -1) {
        let r = 0,
            n = e;
        for (; n >= 0 && n < this.message.length;) {
            if (this.message[n].char === " ") {
                r === 0 && (r = this.message[n].charSize);
                break
            }
            r += this.message[n].charSize, n += t
        }
        return (n < 0 || n >= this.message.length) && !this.endLine ? this.message[e] ? this.message[e].charSize : 999999999 : r === 0 ? 999999999 : r
    }
    spaceLeft(e) {
        return e - this.nextChar3DPos.x
    }
    popChar(e = this.message.length - 1) {
        return this.nextChar3DPos.x -= this.message[e].charSize, this.message.splice(e, 1)
    }
    isEmpty() {
        return !this.message.length
    }
    updateNextCharPosY() {
        this.nextChar3DPos.y = this.yLinePos + this.maxCharSize * this.lineHeight
    }
    updateYLinePos(e) {
        this.yLinePos = e, this.updateNextCharPosY()
    }
    updatelineHeight(e) {
        this.lineHeight = e, this.updateNextCharPosY()
    }
    updateFontSize(e, t = 0, r = this.message.length - 1) {
        for (let n = t; n <= r; n += 1) this.message[n].updateFontSize(e);
        this.maxCharSize = e, this.nextChar3DPos.y = this.yLinePos + this.maxCharSize * this.lineHeight
    }
    countSpaces() {
        let e = 0;
        for (let t = 0; t < this.message.length; t++) this.message[t].char === " " && (e += 1);
        return e
    }
    alignText(e, t, r, n, s) {
        switch (r) {
            case AlignTypeEnum.Left:
                this.leftAlign(e, s);
                break;
            case AlignTypeEnum.Center:
                this.centerAlign(this.spaceLeft(t), e, s);
                break;
            case AlignTypeEnum.Right:
                this.rightAlign(this.spaceLeft(t), e, s);
                break;
            case AlignTypeEnum.Justify:
                this.justifyAlign(this.spaceLeft(t), e, s);
                break
        }
    }
    offsetCharacters(e, t, r) {
        Vf.set(t, r);
        let n = this.message.length;
        for (let s = 0; s < n; s++) this.message[s].updatePosition(this.message[s].localPosition.add(Vf), e)
    }
    leftAlign(e, t) {
        this.align = AlignTypeEnum.Left, this.offsetCharacters(e, 0, t)
    }
    centerAlign(e, t, r) {
        this.align = AlignTypeEnum.Center, this.offsetCharacters(t, e / 2, r)
    }
    rightAlign(e, t, r) {
        this.align = AlignTypeEnum.Right, this.offsetCharacters(t, e, r)
    }
    justifyAlign(e, t, r) {
        if (this.align = AlignTypeEnum.Justify, this.endLine) {
            this.offsetCharacters(t, 0, r);
            return
        }
        let n = this.countSpaces();
        if (n === 0) {
            this.offsetCharacters(t, 0, r);
            return
        }
        let s = e / n,
            o = 0;
        for (let a = 0; a < this.message.length; a++) this.message[a].char === " " && (o += s), Vf.set(o, r), this.message[a].updatePosition(this.message[a].localPosition.add(Vf), t)
    }
    clone() {
        let e = new Message(this.yLinePos, this.lineHeight, this.maxCharSize);
        e.nextChar3DPos = this.nextChar3DPos.clone(), e.align = this.align, e.endLine = this.endLine;
        for (let t = 0; t < this.message.length; t++) e.message.push(this.message[t].clone());
        return e
    }
};

