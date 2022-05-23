import { Euler, MathUtils, Object3D, Vector3 } from 'three'
import _ from 'lodash'
import { ClonerDefault } from './Tool'



export default class Cloner extends Object3D {
    constructor(e, t = {}) {
        super();
        this.object = e;
        let r = e.recursiveBBox.getSize(new Vector3),
            n = .1;
        this.parameters = ClonerDefault.defaultData(r.toArray(), n), _.merge(this.parameters, t),
         this.update(), this.setHideBase(this.parameters.hideBase)
    }
    refreshMaterial() {
        if ("material" in this.object)
            for (let e of this.children) e.material = this.object.material
    }
    setHideBase(e) {
        if ("material" in this.object) {
            if (Array.isArray(this.object.material)) {
                if (this.children.length > 0) {
                    for (let t of this.object.material) t.visible = !0;
                    if (e) {
                        let t = this.object.material.map(r => r.clone());
                        for (let r of this.children) r.material = t
                    } else
                        for (let t of this.children) t.material = this.object.material
                }
                for (let t of this.object.material) t.visible = !e
            } else {
                if (this.children.length > 0)
                    if (this.object.material.visible = !0, e) {
                        let t = this.object.material.clone();
                        for (let r of this.children) r.material = t
                    } else
                        for (let t of this.children) t.material = this.object.material;
                this.object.material.visible = !e
            }
            this.parameters.hideBase = e
        }
    }
    update() {
        switch (this._updateCount(), this.parameters.type) {
            case "radial":
                this._updateRadial(this.parameters);
                break;
            case "linear":
                this._updateLinear(this.parameters);
                break;
            case "grid":
                this._updateGrid(this.parameters)
        }
        this.children.forEach(e => e.updateMatrix())
    }
    _updateCount() {
        let e = this.parameters.type === "grid" ? this.parameters.grid.count[0] * this.parameters.grid.count[1] * this.parameters.grid.count[2] : this.parameters.count;
        if (this.children.length !== e)
            if (this.children.length < e)
                for (let t = 0, r = e - this.children.length; t < r; ++t) {
                    let n = this.object.shallowClone(!1);
                    n.visible = !0, this.add(n), this.parameters.hideBase && this.setHideBase(!0)
                } else
                for (let t = 0, r = this.children.length - e; t < r; ++t) this.remove(this.children[0])
    }
    _updateRadial(e) {
        let t = e.radial,
            r = t.start * MathUtils.DEG2RAD,
            n = t.end * MathUtils.DEG2RAD,
            s = r - n,
            o = new Euler(t.rotation[0] * MathUtils.DEG2RAD, t.rotation[1] * MathUtils.DEG2RAD, t.rotation[2] * MathUtils.DEG2RAD),
            a;
        switch (t.axis) {
            case "z":
                a = new Vector3(0, 0, 1);
                break;
            case "y":
                a = new Vector3(0, 1, 0);
                break;
            default:
            case "x":
                a = new Vector3(1, 0, 0);
                break
        }
        for (let [l, c] of this.children.entries()) {
            c.hiddenMatrix.identity(), c.scale.x = t.scale[0] + 1, c.scale.y = t.scale[1] + 1, c.scale.z = t.scale[2] + 1, c.position.setScalar(0);
            let u = s / e.count * l - r;
            switch (t.axis) {
                case "x":
                    c.rotation.set(0, u, 0);
                    break;
                case "y":
                    c.rotation.set(0, 0, u);
                    break;
                case "z":
                    c.rotation.set(u, 0, 0);
                    break
            }
            c.translateOnAxis(a, t.radius), c.position.x += t.position[0], c.position.y += t.position[1], c.position.z += t.position[2], t.alignment === !0 ? (c.rotation.x += o.x, c.rotation.y += o.y, c.rotation.z += o.z) : c.rotation.copy(o)
        }
    }
    _updateLinear(e) {
        if (e.type !== "linear") throw new Error;
        let t = e.linear,
            r = new Euler(t.rotation[0] * MathUtils.DEG2RAD, t.rotation[1] * MathUtils.DEG2RAD, t.rotation[2] * MathUtils.DEG2RAD);
        for (let [n, s] of this.children.entries()) s.hiddenMatrix.identity(), s.scale.x = t.scale[0] * n + 1, s.scale.y = t.scale[1] * n + 1, s.scale.z = t.scale[2] * n + 1, s.rotation.x = r.x * n, s.rotation.y = r.y * n, s.rotation.z = r.z * n, s.position.x = t.position[0] * n, s.position.y = t.position[1] * n, s.position.z = t.position[2] * n
    }
    _updateGrid(e) {
        let t = 0,
            r = e.grid;
        if (r.useCenter === !0) {
            let n = {
                x: r.count[0] % 2 == 0 ? 2 : 1,
                y: r.count[1] % 2 == 0 ? 2 : 1,
                z: r.count[2] % 2 == 0 ? 2 : 1
            },
                s = new Vector3(r.size[0] * (r.count[0] - n.x) * .5, r.size[1] * (r.count[1] - n.y) * .5, r.size[2] * (r.count[2] - n.z) * .5);
            for (let o = 0; o < r.count[0]; o++)
                for (let a = 0; a < r.count[1]; a++)
                    for (let l = 0; l < r.count[2]; l++) {
                        let c = this.children[t++];
                        c.hiddenMatrix.identity(), c.scale.setScalar(1), c.rotation.set(0, 0, 0), c.position.x = r.size[0] * o - s.x, c.position.y = r.size[1] * a - s.y, c.position.z = r.size[2] * l - s.z
                    }
        } else
            for (let n = 0; n < r.count[0]; n++)
                for (let s = 0; s < r.count[1]; s++)
                    for (let o = 0; o < r.count[2]; o++) {
                        let a = this.children[t++];
                        a.hiddenMatrix.identity(), a.scale.setScalar(1), a.rotation.set(0, 0, 0), a.position.x = r.size[0] * n, a.position.y = -r.size[1] * s, a.position.z = -r.size[2] * o
                    }
    }
    fromJSON(e) {
        return this
    }
    toJSON() {
        return {}
    }
    fromClonerState(e) {
        return e.hideBase !== void 0 && this.setHideBase(e.hideBase), _.merge(this.parameters, e), this.update(), this
    }
};


