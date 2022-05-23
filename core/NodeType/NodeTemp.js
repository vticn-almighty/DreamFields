import Node from './Node'
import { MathUtils } from 'three'
export default class NodeTemp extends Node {
    constructor(e, t) {
        super(e);
        this.scope = "";
        t = t != null ? t : {}, this.shared = t.shared !== void 0 ? t.shared : !0, this.unique = t.unique !== void 0 ? t.unique : !1
    }
    build(e, t, r, n) {
        if (t = t != null ? t : this.getType(e), this.getShared(e, t)) {
            let s = this.getUnique(e, t);
            s && this.uuid === void 0 && (this.uuid = MathUtils.generateUUID()), r = e.getUUID(r != null ? r : this.getUUID(), !s);
            let o = e.getNodeData(r),
                a = o.output || this.getType(e);
            if (e.analyzing) return (o.deps || 0) > 0 || this.getLabel() ? (this.appendDepsNode(e, o, t), this.generate(e, t, r)) : super.build(e, t, r);
            if (s) return o.name = o.name || super.build(e, t, r), o.name;
            if (!this.getLabel() && (!this.getShared(e, a) || e.context.ignoreCache || o.deps === 1)) return super.build(e, t, r);
            r = this.getUUID(!1);
            let l = this.getTemp(e, r);
            if (l) return e.format(l, a, t); {
                l = super.generate(e, t, r, o.output, n);
                let c = this.generate(e, a, r);
                return e.addNodeCode(l + " = " + c + ";"), e.format(l, a, t)
            }
        }
        return super.build(e, t, r)
    }
    getShared(e, t) {
        return t !== "sampler2D" && t !== "samplerCube" && this.shared
    }
    getUnique(e, t) {
        return this.unique
    }
    setLabel(e) {
        return this.label = e, this
    }
    getLabel() {
        return this.label
    }
    getUUID(e) {
        let t = this.uuid;
        return typeof this.scope == "string" && (t = this.scope + "-" + t), t
    }
    getTemp(e, t) {
        t = t || this.uuid;
        let r = e.getVars()[t];
        return r ? r.name : void 0
    }
    generate(e, t, r, n, s) {
        return this.getShared(e, t) || console.error("TempNode is not shared"), r = r != null ? r : this.uuid, e.getTempVar(r, n != null ? n : this.getType(e), s, this.getLabel()).name
    }
};
 