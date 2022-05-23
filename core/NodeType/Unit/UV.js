
import NodeTemp from '../NodeTemp'


class UV extends NodeTemp {
    constructor(e) {
        super("v2", {
            shared: !1
        });
        this.nodeType = "UV";
        this.index = e != null ? e : 0
    }
    generate(e, t) {
        e.requires.uv[this.index] = !0;
        let r = this.index > 0 ? this.index + 1 : "",
            n = e.isShader("vertex") ? "uv" + r : "vUv" + r;
        return e.format(n, this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.index = e.index, this
    }
    toJSON(e) {
        let t = this.getJSONNode(e);
        return t || (t = this.createJSONNode(e), t.index = this.index), t.nodeType = this.nodeType, t
    }
    fromJSON(e, t) {
        return super.fromJSON(e, t), e.index && (this.index = e.index), this
    }
};

export { UV }