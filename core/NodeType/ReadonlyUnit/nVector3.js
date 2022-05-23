import { Vector3 } from 'three'
import { Readonly } from '../Unit'

class nVector3 extends Readonly {
    constructor(e = 0, t, r) {
        super("v3");
        this.nodeType = "Vector3";
        this.value = e instanceof Vector3 ? e : new Vector3(e, t, r)
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
    get z() {
        return this.value.z
    }
    set z(e) {
        this.value.z = e
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format("vec3(" + this.value.x + ", " + this.value.y + ", " + this.value.z + ")", n, t)
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this
    }
};

export { nVector3 }
