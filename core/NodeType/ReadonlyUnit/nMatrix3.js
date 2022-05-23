import { Matrix3 } from 'three'
import { Readonly } from '../Unit'

class nMatrix3 extends Readonly {
    constructor(e) {
        super("m3");
        this.nodeType = "Matrix3";
        this.value = e != null ? e : new Matrix3
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format("mat3(" + this.value.elements.join(", ") + ")", n, t)
    }
    copy(e) {
        return super.copy(e), this.elements = e.elements, this
    }
    get elements() {
        return this.value.elements
    }
    set elements(e) {
        this.value.fromArray(e)
    }
};


export { nMatrix3 }