import { Readonly } from '../Unit'

class nFloat extends Readonly {
    constructor(e) {
        super("f");
        this.nodeType = "Float";
        this.value = e != null ? e : 0
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format(this.value + (this.value % 1 ? "" : ".0"), n, t)
    }
    copy(e) {
        return super.copy(e), this.value = e.value, this
    }
};

export { nFloat }