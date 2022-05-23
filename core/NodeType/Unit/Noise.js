





import { NoiseFunctionEnum } from '../../Enum'
import NodeTemp from '../NodeTemp'
import { Function } from './Function';
import Node from '../Node'
import ShaderChunk from '../../ShaderChunk';


class Noise extends NodeTemp {
    constructor(e = new Node, t = new Node, r = new Node, n = new Node, s = new Node, o = new Node, a = new Node, l = new Node, c = new Node, u = new Node, h = new Node, d = new Node) {
        super("v3");
        this.nodeType = "Noise";
        this.scale = e, this.size = t, this.move = r, this.fA = n, this.fB = s, this.distortion = o, this.colorA = a, this.colorB = l,
            this.colorC = c, this.colorD = u, this.alpha = h,
            this.noiseType = d,
            this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t, r, n, s) {
        e.require("uv"), e.requires.uv = [!0],
            e.addFragmentVariable(this.calpha, "float");
        let o = Object.values(NoiseFunctionEnum)[this.noiseType.value],
            a = new Function(/*glsl*/`vec3 ${o}customNoise(float scale, vec3 size, float move, vec2 fA, vec2 fB, vec2 distortion, vec4 colorA, vec4 colorB, vec4 colorC, vec4 colorD, float alpha, out float calpha) {
                vec3 st = position / size;
				st /= scale;
				vec3 q = vec3(${o}(st),
							  ${o}(st + vec3(1.0)),
							  ${o}(st + vec3(1.0)));
				vec3 r = vec3(${o}(st + vec3(distortion, 1.0) * q + vec3(fA, 1.0) + move),
							  ${o}(st + vec3(distortion, 1.0) * q + vec3(fB, 1.0) + move), 
							  ${o}(st * q));
				float f = ${o}(st + r);
				vec4 color;
				color = mix(colorA, colorB, clamp((f * f) * 4.0, 0.0, 1.0));
				color = mix(color, colorC, clamp(length(q), 0.0, 1.0));
				color = mix(color, colorD, clamp(length(r.x), 0.0, 1.0));

                float lalpha = alpha * color.a;
                calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );

			    accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
				return clamp(color, 0.0, 1.0).rgb;
			}`, [ShaderChunk.simplex, ShaderChunk.simplexFractal, ShaderChunk.simplexAshima, ShaderChunk.fbm, ShaderChunk.perlin]),
            l = e.include(a),
            c = [];
        return c.push(this.scale.build(e, "f")), c.push(this.size.build(e, "v3")), c.push(this.move.build(e, "f")), c.push(this.fA.build(e, "v2")), c.push(this.fB.build(e, "v2")), c.push(this.distortion.build(e, "v2")), c.push(this.colorA.build(e, "v4")), c.push(this.colorB.build(e, "v4")), c.push(this.colorC.build(e, "v4")), c.push(this.colorD.build(e, "v4")), c.push(this.alpha.build(e, "f")), c.push(this.calpha), e.format(l + "(" + c.join(",") + ")", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.scale.copy(e.scale), this.size.copy(e.size), this.move.copy(e.move), this.fA.copy(e.fA), this.fB.copy(e.fB), this.distortion.copy(e.distortion), this.colorA.copy(e.colorA), this.colorB.copy(e.colorB), this.colorC.copy(e.colorC), this.colorD.copy(e.colorD), this.alpha.copy(e.alpha), this.calpha = e.calpha, this.noiseType.copy(e.noiseType), this
    }
}



Noise.numOctaves = 5;


export { Noise }