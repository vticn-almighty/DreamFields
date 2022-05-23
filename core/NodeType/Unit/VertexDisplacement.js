
import { DisplacementTypeEnum, NoiseFunctionEnum } from '../../Enum'
import { nMatrix3, nInt } from '../ReadonlyUnit'
import NodeTemp from '../NodeTemp'
import { Function } from './Function';
import ShaderChunk from '../../ShaderChunk'




class VertexDisplacement extends NodeTemp {
    constructor(e = new nInt(0), t, r, n, s, o) {
        super("v3");
        this.nodeType = "VertexDisplacement";
        this.displacementTypeIndex = e, this.intensity = t,
            this.movementOrTexture = r,
            Object.values(DisplacementTypeEnum)[this.displacementTypeIndex.value] === DisplacementType.MAP && (this.mat = new nMatrix3(this.movementOrTexture.value.matrix)),
            this.cropOrOffset = n, this.scale = s, this.noiseFunctionIndex = o
    }
    generate(e, t) {
        if (e.isShader("vertex")) {
            e.define("USE_LAYER_DISPLACE");
            let r, n = [];
            switch (n.push("displaced_position"), n.push("displaced_normal"), Object.values(DisplacementType)[this.displacementTypeIndex.value]) {
                case DisplacementTypeEnum.MAP: {
                    r = e.include(VertexDisplacement.Nodes.map), n.push(this.movementOrTexture.getTexture(e, "t")), n.push("uv"), n.push(this.cropOrOffset.build(e, "f")), this.mat && n.push(this.mat.build(e, "mat3"));
                    break
                }
                case DisplacementTypeEnum.NOISE: {
                    let o = Object.values(NoiseFunctionEnum)[this.noiseFunctionIndex.value],
                        a = new Function(/*glsl*/`vec3 orthogonal(vec3 v) {
                        return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
                    }`),
                        l = new Function(/*glsl*/`vec3 distorted(vec3 p, vec3 n, float scale, float intensity, vec3 offset, float neighbour_offset, float movement) {
                        return p + n * ${o}((p + offset) * scale * 0.001 + neighbour_offset + (movement * 0.1)) * intensity;
                    }`, [ShaderChunk.simplex, ShaderChunk.simplexFractal, ShaderChunk.simplexAshima, ShaderChunk.fbm, ShaderChunk.perlin]),
                        c = new Function(/*glsl*/`vec3 vertexDisplacementNoise(vec3 position, vec3 normal, float scale, vec3 offset, float movement, float intensity, out vec3 displaced_normal) {
                        vec3 displaced_position = distorted(position, normal, scale, intensity, offset, neighbor_offset, movement);
                        vec3 tangent1 = orthogonal(normal);
                        vec3 tangent2 = normalize(cross(normal, tangent1));

                        // TODO(Max): The distance to the neighbors was originally scaled by 0.1.
                        // This caused some small oval/circular visual artifacts in the lighting.
                        // For now, simply using neighbors further away betters the problem,
                        // but we should figure out the underlying cause when we have some time.
                        // Maybe its related to how we calculate the tangent and bitangent?
                        vec3 nearby1 = position + tangent1;
                        vec3 nearby2 = position + tangent2;
                        vec3 distorted1 = distorted(nearby1, normal, scale, intensity, offset, neighbor_offset, movement);
                        vec3 distorted2 = distorted(nearby2, normal, scale, intensity, offset, neighbor_offset, movement);
                        displaced_normal = normalize(cross(distorted1 - displaced_position, distorted2 - displaced_position));
                        return displaced_position;
                    }`, [l, a]);
                    r = e.include(c), n.push(this.scale.build(e, "f")), n.push(this.cropOrOffset.build(e, "v3")), n.push(this.movementOrTexture.build(e, "f"));
                    break
                }
            }
            return n.push(this.intensity.build(e, "f")), n.push("displaced_normal"), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("VertexDisplacementNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        var t, r;
        return super.copy(e), this.noiseFunctionIndex = (t = e.noiseFunctionIndex) == null ? void 0 : t.clone(), this.scale = (r = e.scale) == null ? void 0 : r.clone(), this.cropOrOffset = e.cropOrOffset.clone(), this.intensity = e.intensity.clone(), this.movementOrTexture = e.movementOrTexture.clone(), this
    }
}
VertexDisplacement.Nodes = function () {
    let e = new Function(/*glsl*/`vec3 orthogonal(vec3 v) {
				return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
			}`),
        t = new Function(/*glsl*/`float displacementMapTexture(sampler2D tex, float crop, vec2 uv, mat3 mat, vec2 offset) {
				vec2 uvs = (mat * vec3(uv * 2.0 - 1.0, 1.0) / 2.0 + 0.5).xy + offset;
				vec4 tmp = texture2D(tex, uvs);
				vec3 col = tmp.rgb;
				if (crop > 0.5) {
					if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
						return 0.0;
					}
				}
				return col.r;
			}`);
    return {
        map: new Function(/*glsl*/`vec3 vertexDisplacementMap(vec3 position, vec3 normal, sampler2D tex, vec2 uv, float crop, mat3 mat, float intensity, out vec3 displaced_normal) {
				vec3 displaced_position = position + normal * displacementMapTexture(tex, crop, uv, mat, vec2(0.0)) * intensity;
				vec3 tangent1 = normalize(orthogonal(normal));
				vec3 tangent2 = normalize(cross(normal, tangent1));
				vec3 nearby1 = position + tangent1 * 0.1;
				vec3 nearby2 = position + tangent2 * 0.1;
				vec3 distorted1 = nearby1 + normal * displacementMapTexture(tex, crop, uv, mat, vec2(neighbor_offset)) * intensity;
				vec3 distorted2 = nearby2 + normal * displacementMapTexture(tex, crop, uv, mat, vec2(neighbor_offset)) * intensity;
				displaced_normal = normalize(cross(distorted1 - displaced_position, distorted2 - displaced_position));
				return displaced_position;
			}`, [e, t])
    }
}();


export { VertexDisplacement }