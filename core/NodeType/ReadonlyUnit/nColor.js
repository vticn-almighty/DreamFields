import { Readonly } from '../Unit'

import ColorWrap from '../../ColorWrap'

class nColor extends Readonly {
    constructor(e = 0, t, r, n) {
        super("c");
        this.nodeType = "Color";
        this.value = e instanceof ColorWrap ? e : new ColorWrap(e || 0, t, r, n)
    }
    setRGBA(e) {
        this.value.setRGBA(e.r, e.g, e.b, e.a)
    }
    generate(e, t, r, n, s, o) {
        r = e.getUUID(r != null ? r : this.getUUID()), n = n != null ? n : this.getType(e);
        let a = e.getNodeData(r),
            l = this.getReadonly() && this.generateReadonly !== void 0;
        if (this.alpha) {
            let c = this.alpha.build(e, "f");
            e.addFragmentNodeCode(`accumAlpha += ( 1.0 - accumAlpha ) * ${c};`)
        }
        return l ? this.generateReadonly(e, t, r, n, s, o) : e.isShader("vertex") ? (a.vertex || (
            a.vertex = e.createVertexUniform(n, this, s, o, this.getLabel())),
            e.format(a.vertex.name, n, t)) : (a.fragment || (a.fragment = e.createFragmentUniform(n, this, s, o, this.getLabel())),
                e.format(a.fragment.name, n, t))
    }
    generateReadonly(e, t, r, n, s, o) {
        return e.format("vec3(" + this.value.r + ", " + this.value.g + ", " + this.value.b + ")", n, t)
    }
};

export { nColor }