import NodeTemp from '../NodeTemp'

class Normal extends NodeTemp {
    constructor(e) {
        super("v3");
        this.nodeType = "Normal";
        this.scope = e != null ? e : Normal.VIEW
    }
    getShared() {
        return this.scope === Normal.WORLD
    }
    build(e, t, r, n) {
        let s = e.context[this.scope + "Normal"];
        return s ? s.build(e, t, r, n) : super.build(e, t, r)
    }
    generate(e, t, r, n, s) {
        let o;
        switch (this.scope) {
            case Normal.VIEW:
                e.isShader("vertex") ? o = "transformedNormal" : o = "geometryNormal";
                break;
            case Normal.LOCAL:
                e.isShader("vertex") ? o = "objectNormal" : (e.requires.normal = !0, o = "vObjectNormal");
                break;
            case Normal.WORLD:
                e.isShader("vertex") ? o = "inverseTransformDirection( transformedNormal, viewMatrix ).xyz" : (e.requires.worldNormal = !0, o = "vWNormal");
                break
        }
        return e.format(o, this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.scope = e.scope, this
    }
    toJSON(e) {
        let t = this.getJSONNode(e);
        return t || (t = this.createJSONNode(e), t.scope = this.scope), t.nodeType = this.nodeType, t
    }
    fromJSON(e, t) {
        return super.fromJSON(e, t), e.scope && (this.scope = e.scope), this
    }
}

Normal.LOCAL = "local", Normal.WORLD = "world", Normal.VIEW = "view", Normal.NORMAL = "normal";


export { Normal }