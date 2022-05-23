
import NodeTemp from '../NodeTemp'

class FunctionCall extends NodeTemp {
    constructor(e, t) {
        super();
        this.inputs = [];
        this.nodeType = "FunctionCall";
        this.value = e, this.inputs = t != null ? t : []
    }
    getFunction() {
        return this.value
    }
    getType(e) {
        return this.value.getType(e)
    }
    generate(e, t, r, n, s) {
        n = this.getType(e);
        let o = this.value,
            a = o.build(e, t) + "( ",
            l = [];
        if (o.inputs) {
            for (let c = 0; c < o.inputs.length; c++) {
                let u = o.inputs[c],
                    h = this.inputs[c] || this.inputs[u.name];
                l.push(h.build(e, e.getTypeByFormat(u.type)))
            }
            a += l.join(", ") + " )"
        }
        return e.format(a, n, t)
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this.inputs = e.inputs.map(t => t.clone()), this
    }
    toJSON(e) {
        var r;
        let t = this.getJSONNode(e);
        if (!t) {
            let n = this.value;
            if (t = this.createJSONNode(e), t.value = this.value.toJSON(e).uuid, (r = n.inputs) == null ? void 0 : r.length) {
                t.inputs = {};
                for (let s = 0; s < n.inputs.length; s++) {
                    let o = n.inputs[s],
                        a = this.inputs[s];
                    t.inputs[o.name] = a.toJSON(e).uuid
                }
            }
        }
        return t
    }
};

export { FunctionCall }