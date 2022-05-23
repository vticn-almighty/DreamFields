


import { Function } from './Function';
import NodeTemp from '../NodeTemp'

class Matcap extends NodeTemp {
    constructor(e, t, r) {
        super("v3");
        this.nodeType = "Matcap";
        this.texture = e, this.alpha = t, this.mode = r,
            this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        if (e.isShader("fragment")) {
            e.addFragmentVariable(this.calpha, "float");
            let r = e.include(Matcap.Nodes.matcap);
            e.require("normal"), e.requires.normal = !0;
            let n = [];
            return n.push(this.texture.getTexture(e, "t")), n.push("normal"), n.push(this.alpha.build(e, "f")), n.push(this.mode.build(e, "i")), n.push(this.calpha), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("MatcapNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.texture = e.texture.clone(), this.alpha = e.alpha.clone(), this.mode = e.mode.clone(), this.calpha = e.calpha, this
    }
}

Matcap.Nodes = function () {
    return {
        matcap: new Function(/*glsl*/`vec3 matcap(sampler2D matcapTex, vec3 normal, float alpha, int mode, out float calpha) {
                vec3 viewDir = normalize( vViewPosition );
                vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
                vec3 y = cross( viewDir, x );
                vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
                vec4 matcapColor = texture2D( matcapTex, uv );

                calpha =  alpha / clamp( alpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += ( 1.0 - accumAlpha ) * alpha;
                
                return matcapColor.rgb;
            }
            `)
    }
}();


export { Matcap }