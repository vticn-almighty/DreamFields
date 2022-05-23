import { nFloat } from '../../nodeType/ReadonlyUnit'
import NodeTemp from '../NodeTemp'
import Node from '../Node'
import { Function } from './Function';
import Expression from '../Expression'
import { Const } from './Const';
import { Struct } from './Struct';


class TextureCubeUV extends NodeTemp {
    constructor(e = new Node, t = new Node, r = new Node) {
        super("v4");
        this.nodeType = "TextureCubeUV";
        this.value = e, this.uv = t, this.bias = r
    }
    bilinearCubeUV(e, t, r, n) {
        var l, c, u, h;
        let s = new TextureCubeUV(TextureCubeUV.Nodes.bilinearCubeUV, [t, r, n]);
        this.colorSpaceTL = (l = this.colorSpaceTL) != null ? l : new ColorSpace(new Expression("", "v4")),
            this.colorSpaceTL.fromDecoding(e.getTextureEncodingFromMap(this.value.value)),
            this.colorSpaceTL.input.parse(s.build(e) + ".tl"), this.colorSpaceTR = (c = this.colorSpaceTR) != null ? c : new ColorSpace(new Expression("", "v4")),
            this.colorSpaceTR.fromDecoding(e.getTextureEncodingFromMap(this.value.value)),
            this.colorSpaceTR.input.parse(s.build(e) + ".tr"), this.colorSpaceBL = (u = this.colorSpaceBL) != null ? u : new ColorSpace(new Expression("", "v4")),
            this.colorSpaceBL.fromDecoding(e.getTextureEncodingFromMap(this.value.value)),
            this.colorSpaceBL.input.parse(s.build(e) + ".bl"), this.colorSpaceBR = (h = this.colorSpaceBR) != null ? h : new ColorSpace(new Expression("", "v4")),
            this.colorSpaceBR.fromDecoding(e.getTextureEncodingFromMap(this.value.value)),
            this.colorSpaceBR.input.parse(s.build(e) + ".br");
        let o = {
            include: e.isShader("vertex"),
            ignoreCache: !0
        };
        e.addContext(o), this.colorSpaceTLExp = new Expression(this.colorSpaceTL.build(e, "v4"), "v4"),
            this.colorSpaceTRExp = new Expression(this.colorSpaceTR.build(e, "v4"), "v4"),
            this.colorSpaceBLExp = new Expression(this.colorSpaceBL.build(e, "v4"), "v4"),
            this.colorSpaceBRExp = new Expression(this.colorSpaceBR.build(e, "v4"), "v4"), e.removeContext();
        let a = new Expression("mix( mix( cubeUV_TL, cubeUV_TR, cubeUV.f.x ), mix( cubeUV_BL, cubeUV_BR, cubeUV.f.x ), cubeUV.f.y )", "v4");
        return a.keywords.cubeUV_TL = this.colorSpaceTLExp, a.keywords.cubeUV_TR = this.colorSpaceTRExp, a.keywords.cubeUV_BL = this.colorSpaceBLExp, a.keywords.cubeUV_BR = this.colorSpaceBRExp, a.keywords.cubeUV = s, a
    }
    generate(e, t) {
        if (e.isShader("fragment")) {
            let r = this.uv,
                n = this.bias || e.context.roughness,
                s = new FunctionCall(TextureCubeUV.Nodes.roughnessToMip, [n]),
                o = new Math(s, TextureCubeUV.Nodes.m0, TextureCubeUV.Nodes.cubeUV_maxMipLevel, nt.CLAMP),
                a = new Math(o, Math.FLOOR),
                l = new Math(o, Math.FRACT),
                c = this.bilinearCubeUV(e, this.value, r, a),
                u = this.bilinearCubeUV(e, this.value, r, new Operator(a, new nFloat(1).setReadonly(!0), Hn.ADD)),
                h = new Math(c, u, l, Math.MIX);
            return e.format(h.build(e), "v4", t)
        } else return console.warn("TextureCubeUVNode is not compatible with " + e.shader + " shader."), e.format("vec4( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.uv.copy(e.uv), this.bias.copy(e.bias), this.value.copy(e.value), e.colorSpaceTL ? this.colorSpaceTL ? this.colorSpaceTL.copy(e.colorSpaceTL) : this.colorSpaceTL = e.colorSpaceTL.clone() : this.colorSpaceTL = void 0, e.colorSpaceTR ? this.colorSpaceTR ? this.colorSpaceTR.copy(e.colorSpaceTR) : this.colorSpaceTR = e.colorSpaceTR.clone() : this.colorSpaceTR = void 0, e.colorSpaceBL ? this.colorSpaceBL ? this.colorSpaceBL.copy(e.colorSpaceBL) : this.colorSpaceBL = e.colorSpaceBL.clone() : this.colorSpaceBL = void 0, e.colorSpaceBR ? this.colorSpaceBR ? this.colorSpaceBR.copy(e.colorSpaceBR) : this.colorSpaceBR = e.colorSpaceBR.clone() : this.colorSpaceBR = void 0, e.colorSpaceTLExp ? this.colorSpaceTLExp ? this.colorSpaceTLExp.copy(e.colorSpaceTLExp) : this.colorSpaceTLExp = e.colorSpaceTLExp.clone() : this.colorSpaceTLExp = void 0, e.colorSpaceTRExp ? this.colorSpaceTRExp ? this.colorSpaceTRExp.copy(e.colorSpaceTRExp) : this.colorSpaceTRExp = e.colorSpaceTRExp.clone() : this.colorSpaceTRExp = void 0, e.colorSpaceBLExp ? this.colorSpaceBLExp ? this.colorSpaceBLExp.copy(e.colorSpaceBLExp) : this.colorSpaceBLExp = e.colorSpaceBLExp.clone() : this.colorSpaceBLExp = void 0, e.colorSpaceBRExp ? this.colorSpaceBRExp ? this.colorSpaceBRExp.copy(e.colorSpaceBRExp) : this.colorSpaceBRExp = e.colorSpaceBRExp.clone() : this.colorSpaceBRExp = void 0, this
    }
}

TextureCubeUV.Nodes = function () {
    let e = new Struct(/*glsl*/`
        struct TextureCubeUVData {
			vec4 tl;
			vec4 tr;
			vec4 br;
			vec4 bl;
			vec2 f;
		}`),
        t = new Const("float cubeUV_maxMipLevel 8.0", !0),
        r = new Const("float cubeUV_minMipLevel 4.0", !0),
        n = new Const("float cubeUV_maxTileSize 256.0", !0),
        s = new Const("float cubeUV_minTileSize 16.0", !0),
        o = new Function(/*glsl*/`float getFace(vec3 direction) {
				vec3 absDirection = abs(direction);
				float face = -1.0;
				if (absDirection.x > absDirection.z) {
					if (absDirection.x > absDirection.y)
						face = direction.x > 0.0 ? 0.0 : 3.0;
					else
						face = direction.y > 0.0 ? 1.0 : 4.0;
				} else {
					if (absDirection.z > absDirection.y)
						face = direction.z > 0.0 ? 2.0 : 5.0;
					else
						face = direction.y > 0.0 ? 1.0 : 4.0;
				}
				return face;
		}`);
    o.useKeywords = !1;
    let a = new Function(/*glsl*/`vec2 getUV(vec3 direction, float face) {
				vec2 uv;
				if (face == 0.0) {
					uv = vec2(direction.z, direction.y) / abs(direction.x); // pos x
				} else if (face == 1.0) {
					uv = vec2(-direction.x, -direction.z) / abs(direction.y); // pos y
				} else if (face == 2.0) {
					uv = vec2(-direction.x, direction.y) / abs(direction.z); // pos z
				} else if (face == 3.0) {
					uv = vec2(-direction.z, direction.y) / abs(direction.x); // neg x
				} else if (face == 4.0) {
					uv = vec2(-direction.x, direction.z) / abs(direction.y); // neg y
				} else {
					uv = vec2(direction.x, direction.y) / abs(direction.z); // neg z
				}
				return 0.5 * (uv + 1.0);
		}`);
    a.useKeywords = !1;
    let l = new Function(/*glsl*/`TextureCubeUVData bilinearCubeUV(sampler2D envMap, vec3 direction, float mipInt) {
			float face = getFace(direction);
			float filterInt = max(cubeUV_minMipLevel - mipInt, 0.0);
			mipInt = max(mipInt, cubeUV_minMipLevel);
			float faceSize = exp2(mipInt);
			float texelSize = 1.0 / (3.0 * cubeUV_maxTileSize);
			vec2 uv = getUV(direction, face) * (faceSize - 1.0);
			vec2 f = fract(uv);
			uv += 0.5 - f;
			if (face > 2.0) {
				uv.y += faceSize;
				face -= 3.0;
			}
			uv.x += face * faceSize;
			if(mipInt < cubeUV_maxMipLevel){
				uv.y += 2.0 * cubeUV_maxTileSize;
			}
			uv.y += filterInt * 2.0 * cubeUV_minTileSize;
			uv.x += 3.0 * max(0.0, cubeUV_maxTileSize - 2.0 * faceSize);
			uv *= texelSize;
			vec4 tl = texture2D(envMap, uv);
			uv.x += texelSize;
			vec4 tr = texture2D(envMap, uv);
			uv.y += texelSize;
			vec4 br = texture2D(envMap, uv);
			uv.x -= texelSize;
			vec4 bl = texture2D(envMap, uv);
			return TextureCubeUVData( tl, tr, br, bl, f );
		}`, [e, o, a, t, r, n, s]);
    l.useKeywords = !1;
    let c = new Const("float r0 1.0", !0),
        u = new Const("float v0 0.339", !0),
        h = new Const("float m0 -2.0", !0),
        d = new Const("float r1 0.8", !0),
        f = new Const("float v1 0.276", !0),
        p = new Const("float m1 -1.0", !0),
        g = new Const("float r4 0.4", !0),
        x = new Const("float v4 0.046", !0),
        y = new Const("float m4 2.0", !0),
        m = new Const("float r5 0.305", !0),
        v = new Const("float v5 0.016", !0),
        w = new Const("float m5 3.0", !0),
        b = new Const("float r6 0.21", !0),
        T = new Const("float v6 0.0038", !0),
        _ = new Const("float m6 4.0", !0),
        S = [c, u, h, d, f, p, g, x, y, m, v, w, b, T, _],
        N = new Function(/*glsl*/`float roughnessToMip(float roughness) {
			float mip = 0.0;
			if (roughness >= r1) {
				mip = (r0 - roughness) * (m1 - m0) / (r0 - r1) + m0;
			} else if (roughness >= r4) {
				mip = (r1 - roughness) * (m4 - m1) / (r1 - r4) + m1;
			} else if (roughness >= r5) {
				mip = (r4 - roughness) * (m5 - m4) / (r4 - r5) + m4;
			} else if (roughness >= r6) {
				mip = (r5 - roughness) * (m6 - m5) / (r5 - r6) + m5;
			} else {
				mip = -2.0 * log2(1.16 * roughness);// 1.16 = 1.79^0.25
			}
			return mip;
		}`, S);
    return {
        bilinearCubeUV: l,
        roughnessToMip: N,
        m0: h,
        cubeUV_maxMipLevel: t
    }
}();

export { TextureCubeUV }