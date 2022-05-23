import { Vector2 } from 'three'
import { Readonly } from '../Unit'

class nVector2 extends Readonly {
    constructor(e = 0, t) {
        super("v2");
        this.nodeType = "Vector2";
        this.value = e instanceof Vector2 ? e : new Vector2(e, t)
    }
    get x() {
        return this.value.x
    }
    set x(e) {
        this.value.x = e
    }
    get y() {
        return this.value.y
    }
    set y(e) {
        this.value.y = e
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format("vec2(" + this.value.x + ", " + this.value.y + ")", n, t)
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this
    }
};

export { nVector2 }