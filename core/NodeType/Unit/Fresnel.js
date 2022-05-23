
import NodeTemp from '../NodeTemp'
import { Function } from './Function';

class Fresnel extends NodeTemp {
    constructor(e, t, r, n, s, o, a) {
        super("v3");
        this.nodeType = "Fresnel";
        this.color = e;
        this.bias = t;
        this.scale = r;
        this.intensity = n;
        this.factor = s;
        this.alpha = o;
        this.mode = a;
        this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        if (e.require("vWorldViewDir"), e.require("worldNormal"), e.isShader("fragment")) {
            e.addFragmentVariable(this.calpha, "float");
            let r = e.include(Fresnel.Nodes.fresnel),
                n = [];
            return n.push(this.color.build(e, "c")), n.push(this.bias.build(e, "f")), n.push(this.scale.build(e, "f")), n.push(this.intensity.build(e, "f")), n.push(this.factor.build(e, "f")), n.push(this.alpha.build(e, "f")), n.push(this.mode.build(e, "i")), n.push(this.calpha), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("FresnelNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.color = e.color.clone(), this.bias = e.bias.clone(), this.scale = e.scale.clone(), this.intensity = e.intensity.clone(), this.factor = e.factor.clone(), this.alpha = e.alpha.clone(), this.mode = e.mode.clone(), this.calpha = e.calpha, this
    }
}

Fresnel.Nodes = function () {
    return {
        fresnel: new Function(/*glsl*/`vec3 fresnel(vec3 color, float bias, float scale, float intensity, float factor, float alpha, int mode, out float calpha) {
				float fresnel = bias + scale * pow( abs( factor + dot( normalize( vWorldViewDir ), normalize( vWNormal ) ) ), intensity );

				float lalpha = clamp( fresnel, 0.0, 1.0 ) * alpha;
				calpha = lalpha / clamp(lalpha + accumAlpha, 0.001, 1.0);
				accumAlpha += (1.0 - accumAlpha) * lalpha;
				return color;
			}`)
    }
}();


export { Fresnel }