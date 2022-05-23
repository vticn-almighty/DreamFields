

import NodeTemp from '../NodeTemp'
import Node from '../Node'


class Blend extends NodeTemp {
    constructor(e = new Node, t = new Node, r = new Node, n = new Node) {
        super("v3");
        this.nodeType = "Blend";
        this.a = e, this.b = t, this.alpha = r, this.mode = n
    }
    generate(e, t) {
        if (e.isShader("fragment")) {
            let r = [];
            r.push(this.a.build(e, "c"));
            r.push(this.b.build(e, "c"));
            r.push(this.alpha.build(e, "f"));
            r.push(this.mode.build(e, "i"));
            return e.format("spe_blend(" + r.join(",") + ")", this.getType(e), t)
        } else return console.warn("BlendNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        super.copy(e);
        this.a.copy(e.a);
        this.b.copy(e.b);
        this.alpha.copy(e.alpha);
        this.mode.copy(e.mode);
        return this
    }
}

export { Blend }