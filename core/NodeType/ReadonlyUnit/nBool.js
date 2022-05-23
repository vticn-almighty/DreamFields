import { Readonly } from '../Unit'

class nBool extends Readonly {
    constructor(e) {
        super("b");
        this.nodeType = "Bool";
        this.value = e != null ? e : !1
    }
    generateReadonly(e, t, r, n) {
        return e.format(this.value ? "true" : "false", n, t)
    }
    copy(e) {
        return super.copy(e), this.value = e.value, this
    }
};

export { nBool }