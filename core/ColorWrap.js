import { Color } from 'three'


export default class ColorWrap extends Color {
    constructor(e, t, r, n) {
        super(e, t, r);
        this.a = n
    }
    setRGBA(e, t, r, n) {
        super.setRGB(e, t, r), this.a = n
    }
    get x() {
        return this.r
    }
    get y() {
        return this.g
    }
    get z() {
        return this.b
    }
    get w() {
        return this.a
    }
    set x(e) {
        this.r = e
    }
    set y(e) {
        this.g = e
    }
    set z(e) {
        this.b = e
    }
    set w(e) {
        this.a = e
    }
};
