import { Readonly } from '../Unit'

import { CubeTexture } from 'three';
import { ColorSpace } from '../Unit'
import Expression from '../Expression'

class nCubeTexture extends Readonly {
    constructor(e = new CubeTexture, t, r) {
        super("v4", {
            shared: !0
        });
        this.nodeType = "CubeTexture";
        this.value = e, this.uv = t != null ? t : new Reflect, this.bias = r
    }
    getTexture(e, t) {
        return super.generate(e, t, this.value.uuid, "tc")
    }
    generate(e, t) {
        var c, u;
        if (t === "samplerCube") return this.getTexture(e, t);
        let r = this.getTexture(e, t),
            n = (c = this.uv) == null ? void 0 : c.build(e, "v3"),
            s = this.bias ? this.bias.build(e, "f") : void 0;
        s === void 0 && e.context.bias && (s = e.context.bias.setTexture(this).build(e, "f"));
        let o;
        s ? o = "texCubeBias( " + r + ", " + n + ", " + s + " )" : o = "texCube( " + r + ", " + n + " )";
        let a = {
            include: e.isShader("vertex"),
            ignoreCache: !0
        },
            l = this.getType(e);
        return e.addContext(a), this.colorSpace = (u = this.colorSpace) != null ? u : new ColorSpace(new Expression("", l)), this.colorSpace.fromDecoding(e.getTextureEncodingFromMap(this.value)), this.colorSpace.input.parse(o), o = this.colorSpace.build(e, l), e.removeContext(), e.format(o, l, t)
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), e.uv ? this.uv ? this.uv.copy(e.uv) : this.uv = e.uv.clone() : this.uv = void 0, e.bias ? this.bias ? this.bias.copy(e.bias) : this.bias = e.bias.clone() : this.bias = void 0, this
    }
};

export { nCubeTexture }