import { Vector4 } from 'three'
import { Readonly } from '../Unit'

class nVector4Array extends Readonly {
    constructor(e = 1, t) {
        super("v4[]");
        this.nodeType = "Vector4Array";
        this.size = e, this.value = Array.isArray(t) ? t : t instanceof Vector4 ? new Array(e).fill(t) : new Array(e).fill(new Vector4(0))
    }
    copy(e) {
        return super.copy(e), this.value = e.value.map(t => t.clone()), this
    }
};

export { nVector4Array }