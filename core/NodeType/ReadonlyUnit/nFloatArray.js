import { Readonly } from '../Unit'

class nFloatArray extends Readonly {
    constructor(e = 1, t) {
        super("f[]");
        this.nodeType = "FloatArray";
        this.size = e, this.value = Array.isArray(t) ? t : typeof t == "number" ? new Array(e).fill(t) : new Array(e).fill(0)
    }
    copy(e) {
        return super.copy(e), this.size = e.size, this.value = [...e.value], this
    }
};


export { nFloatArray }