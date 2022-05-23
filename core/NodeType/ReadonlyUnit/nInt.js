import { Readonly } from '../Unit'

class nInt extends Readonly {
    constructor(e) {
        super("i");
        this.nodeType = "Int";
        this.value = Math.floor(e != null ? e : 0)
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format(this.value.toString(), n, t)
    }
    copy(e) {
        return super.copy(e), this.value = e.value, this
    }
};



export { nInt }