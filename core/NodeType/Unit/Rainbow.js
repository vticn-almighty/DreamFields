import { Function } from './Function';
import NodeTemp from '../NodeTemp'
import ShaderChunk from '../../ShaderChunk';

class Rainbow extends NodeTemp {
    constructor(e, t, r, n, s, o, a) {
        super("v3");
        this.nodeType = "Rainbow";
        this.filmThickness = e, this.movement = t, this.wavelengths = r, this.noiseStrength = n, this.noiseScale = s, this.offset = o, this.alpha = a, this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        if (e.require("vWorldViewDir"), e.require("worldNormal"), e.isShader("fragment")) {
            e.require("uv"), e.requires.uv = [!0], e.addFragmentVariable(this.calpha, "float");
            let r = e.include(Rainbow.Nodes.rainbow),
                n = [];
            return n.push(this.filmThickness.build(e, "f")), n.push(this.movement.build(e, "f")), n.push(this.wavelengths.build(e, "v3")), n.push(this.noiseStrength.build(e, "f")), n.push(this.noiseScale.build(e, "f")), n.push(this.offset.build(e, "v3")), n.push(this.alpha.build(e, "f")), n.push(this.calpha), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("RainbowNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.filmThickness = e.filmThickness.clone(), this.movement = e.movement.clone(), this.wavelengths = e.wavelengths.clone(), this.noiseStrength = e.noiseStrength.clone(), this.noiseScale = e.noiseScale.clone(), this.offset = e.offset.clone(), this.alpha = e.alpha.clone(), this.calpha = e.calpha, this
    }
}

Rainbow.Nodes = function () {
    let e = new Function(/*glsl*/`vec3 attenuation(vec3 wavelengths, float filmThickness, float movement, float noiseStrength, float noiseScale, vec3 offset) {
                 vec3 st = position / noiseScale;
				 vec3 q = vec3(simplex3d(st),
							  simplex3d(st + vec3(1.0)),
							  simplex3d(st + vec3(1.0)));

				 vec3 r = vec3(simplex3d(st + vec3(1.4, 1.3, 1.0) * q + vec3(1.7, 9.2, 1.0)),
							  simplex3d(st + vec3(2.0, 1.2, 1.0) * q + vec3(8.3, 2.8, 1.0)),
							  simplex3d(st * q));

                 float noise = simplex3d(st + r);

                 return .5 + .5 * cos((((filmThickness + (noise * noiseStrength)) / (vec3(wavelengths.r * 1.0, wavelengths.g * 0.8, wavelengths.b * 0.6) + 1.0)) * dot(normalize(vWorldViewDir + (offset * -0.001)), normalize(vWNormal))) + movement);
             }`, [ShaderChunk.simplex]);
    return {
        rainbow: new Function(/*glsl*/`vec3 rainbow(float filmThickness, float movement, vec3 wavelengths, float noiseStrength, float noiseScale, vec3 offset, float alpha, out float calpha) {
                 vec3 res = clamp(attenuation(wavelengths, filmThickness, movement, noiseStrength, noiseScale, offset), 0.0, 2.0);

                 float rainbowContribution = clamp(res.r + res.g + res.b, 0.0, 1.0);
                 float lalpha = alpha * rainbowContribution;
                 calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
                 accumAlpha += ( 1.0 - accumAlpha ) * lalpha;

                 return res;
             }`, [e])
    }
}();


export { Rainbow }