


import NodeTemp from '../NodeTemp'

class Readonly extends NodeTemp {
    constructor(e, t) {
        t = t != null ? t : {}, t.shared = t.shared !== void 0 ? t.shared : !1;
        super(e, t);
        this.readonly = !1
    }
    setReadonly(e) {
        return this.readonly = e, this.hashProperties = this.readonly ? ["value"] : void 0, this
    }
    getReadonly() {
        return this.readonly
    }
    createJSONNode(e) {
        let t = super.createJSONNode(e);
        return this.readonly === !0 && (t.readonly = this.readonly), t
    }
    fromJSON(e, t) {
        return super.fromJSON(e, t), e.readonly !== void 0 && this.setReadonly(e.readonly), this
    }
    generate(e, t, r, n, s, o) {
        r = e.getUUID(r != null ? r : this.getUUID()), n = n != null ? n : this.getType(e);
        let a = e.getNodeData(r);
        return this.getReadonly() && this.generateReadonly !== void 0 ? this.generateReadonly(e, t, r, n, s, o) : e.isShader("vertex") ? (a.vertex || (a.vertex = e.createVertexUniform(n, this, s, o, this.getLabel())), e.format(a.vertex.name, n, t)) : (a.fragment || (a.fragment = e.createFragmentUniform(n, this, s, o, this.getLabel())), e.format(a.fragment.name, n, t))
    }
    copy(e) {
        return super.copy(e), this.readonly = e.readonly, this
    }
};


export { Readonly }