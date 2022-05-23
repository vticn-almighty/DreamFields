



import { Readonly, UV, ColorSpace } from '../Unit'
import TextureWrap from '../../TextureWrap';
import Expression from '../Expression'

class nTexture extends Readonly {
    constructor(e = new TextureWrap, t, r, n) {
        super("v4", {
            shared: !0
        });
        this.nodeType = "Texture";
        this.value = e, this.uv = t != null ? t : new UV, this.bias = r, this.project = n !== void 0 ? n : !1
    }
    getTexture(e, t) {
        return super.generate(e, t, this.value.uuid, "t")
    }
    generate(e, t) {
        var u;
        if (t === "sampler2D") return this.getTexture(e, t);
        let r = this.getTexture(e, t),
            n = this.uv.build(e, this.project ? "v4" : "v2"),
            s = this.bias ? this.bias.build(e, "f") : void 0;
        s === void 0 && e.context.bias && (s = e.context.bias.setTexture(this).build(e, "f"));
        let o, a;
        this.project ? o = "texture2DProj" : o = s ? "tex2DBias" : "tex2D", s ? a = o + "( " + r + ", " + n + ", " + s + " )" : a = o + "( " + r + ", " + n + " )";
        let l = {
            include: e.isShader("vertex"),
            ignoreCache: !0
        },
            c = this.getType(e);
        return e.addContext(l), this.colorSpace = (u = this.colorSpace) != null ? u : new ColorSpace(new Expression("", c)), this.colorSpace.fromDecoding(e.getTextureEncodingFromMap(this.value)), this.colorSpace.input.parse(a), a = this.colorSpace.build(e, c), e.removeContext(), e.format(a, c, t)
    }
    copy(e) {
        return super.copy(e), e.value.isRenderTargetTexture ? this.value = e.value : this.value.copy(e.value), this.uv.copy(e.uv), e.bias ? this.bias ? this.bias.copy(e.bias) : this.bias = e.bias.clone() : this.bias = void 0, e.colorSpace ? this.colorSpace ? this.colorSpace.copy(e.colorSpace) : this.colorSpace = e.colorSpace.clone() : this.colorSpace = void 0, this.project = e.project, e.value.isRenderTargetTexture || (this.value.updateMatrix(), this.value.needsUpdate = !0), this
    }
};

export { nTexture }