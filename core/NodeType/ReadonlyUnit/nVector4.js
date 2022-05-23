import { Readonly } from '../Unit'
import ColorWrap from '../../ColorWrap'

class nVector4 extends Readonly {
    constructor(e) {
        super("v4");
        this.nodeType = "Vector4";
        this.value = e instanceof ColorWrap ? e : new ColorWrap(e.r, e.g, e.b, e.a)
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format("vec4(" + this.value.r + ", " + this.value.g + ", " + this.value.b + ", " + this.value.a + ")", n, t)
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this
    }
};

export { nVector4 }