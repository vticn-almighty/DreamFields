import { Function } from './Function';
import NodeTemp from '../NodeTemp'


class Transmission extends NodeTemp {
    constructor(e, t, r, n, s, o, a, l) {
        super("v3");
        this.nodeType = "Transmission";
        this.thickness = e, this.ior = t, this.roughness = r,
            this.transmissionSamplerSize = n, this.transmissionSamplerMap = s,
            this.transmissionDepthMap = o, this.aspectRatio = a, this.alpha = l,
            this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        if (e.extensions.shaderTextureLOD = !0, e.extensions.derivatives = !0, e.isShader("fragment")) {
            e.define("NUM_SAMPLES", 30), e.require("worldPosition"), e.requires.worldNormal = !0,
                e.requires.modelMatrix = !0, e.requires.projectionMatrix = !0,
                e.addFragmentVariable(this.calpha, "float");
            let r = e.include(Transmission.Nodes.transmission),
                n = [];
            return n.push(this.thickness.build(e, "f")), n.push(this.ior.build(e, "f")), n.push(this.roughness.build(e, "f")),
                n.push(this.transmissionSamplerSize.build(e, "v2")), n.push(this.transmissionSamplerMap.getTexture(e, "t")), n.push(this.transmissionDepthMap.getTexture(e, "t")),
                n.push(this.aspectRatio.build(e, "v2")), n.push("normal"), n.push(this.alpha.build(e, "f")),
                n.push(this.calpha), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("TransmissionNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(this), this.thickness = e.thickness.clone(), this.ior = e.ior.clone(), this.roughness = e.roughness.clone(), this.transmissionSamplerSize = e.transmissionSamplerSize.clone(), this.transmissionSamplerMap = e.transmissionSamplerMap, this.transmissionDepthMap = e.transmissionDepthMap, this.alpha = e.alpha.clone(), this.calpha = e.calpha, this
    }
}

Transmission.Nodes = function () {
    let e = new Function(/*glsl*/`
            float gaussian(vec2 i) {
                const float sigma = float(NUM_SAMPLES) * .25;
                return exp( -.5* dot(i/=sigma,i) ) / ( 6.28 * sigma*sigma );
            }`),
        t = new Function(/*glsl*/`
            vec4 blur(sampler2D sp, vec2 U, vec2 scale, float lod, sampler2D dm, vec2 unrefractedU, vec2 aspectRatio) {
                // Slightly modified version of this:

                const int LOD = 2;
                const int sLOD = 4; // tile size = 2^LOD

                vec4 O = vec4(0);
                const int s = NUM_SAMPLES/sLOD;
                for ( int i = 0; i < s*s; i++ ) {
                    int modulo = (i)-((i)/(s))*(s);
                    vec2 d = vec2(float(modulo), float(i/s))*float(sLOD) - float(NUM_SAMPLES)/2.;
                    vec2 uv = U + (scale * aspectRatio) * d;
                    // What is the depth of the opaque object we're trying to sample
                    float opaqueDepth = texture2D(dm, uv).r;
                    if (opaqueDepth < gl_FragCoord.z) {
                        uv = unrefractedU + ((scale * min(lod / 2., 1.)) * aspectRatio) * d;
                        lod = lod > 4.0 ? lod : lod / 2.0;
                    }
		            #ifdef TEXTURE_LOD_EXT
                    O += gaussian(d) * texture2DLodEXT( sp, uv, lod);
                    #else
                    O += gaussian(d) * textureLod( sp, uv, lod);
                    #endif
                }
                return O / O.a;
            }`, [e]),
        r = new Function(/*glsl*/`
            vec3 getVolumeTransmissionRay( vec3 n, vec3 v, float thickness, float ior, mat4 modelMatrix ) {
		        // Direction of refracted light.
		        vec3 refractionVector = refract( -v,  n, 1.0 / ior );
		        // Compute rotation-independant scaling of the model matrix.
		        vec3 modelScale;
		        modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		        modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		        modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		        // The thickness is specified in local space.
		        return normalize( refractionVector ) * thickness * modelScale;
	        }`),
        n = new Function(/*glsl*/`
float applyIorToRoughness( float roughness, float ior ) {
		// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
		// an IOR of 1.5 results in the default amount of microfacet refraction.
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	} `),
        s = new Function(/*glsl*/`
vec4 getTransmissionSample( vec2 fragCoord, float roughness, float ior, vec2 transmissionSamplerSize, sampler2D transmissionSamplerMap, sampler2D transmissionDepthMap, vec2 unrefractedCoords, vec2 aspectRatio) {
		float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
        float lod = applyIorToRoughness(roughness, ior);

        return blur(transmissionSamplerMap, fragCoord, vec2(lod / (transmissionSamplerSize.x / 2.)), min(framebufferLod / 5.5, 8.5), transmissionDepthMap, unrefractedCoords, aspectRatio);
	}`, [n, t]),
        o = new Function(/*glsl*/`
vec4 getIBLVolumeRefraction( vec3 n, vec3 v, float roughness, vec3 position, mat4 modelMatrix, mat4 viewMatrix, mat4 projMatrix, float ior, float thickness, vec2 transmissionSamplerSize, sampler2D transmissionSamplerMap, sampler2D transmissionDepthMap, vec2 aspectRatio ) {
        vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
        vec3 refractedRayExit = position + transmissionRay;

        // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
        vec4 ndcPos = projMatrix * viewMatrix *  vec4( refractedRayExit, 1.0 );
        vec2 refractionCoords = ndcPos.xy / ndcPos.w;
        refractionCoords += 1.0;
        refractionCoords /= 2.0;

        vec4 ndcPosUnrefracted = projMatrix * viewMatrix * vec4(position, 1.0 );
        vec2 unrefractedCoords = ndcPosUnrefracted.xy / ndcPosUnrefracted.w;
        unrefractedCoords += 1.0;
        unrefractedCoords /= 2.0;

        // Sample framebuffer to get pixel the refracted ray hits.
        vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior, transmissionSamplerSize, transmissionSamplerMap, transmissionDepthMap, unrefractedCoords, aspectRatio );
        // Get the specular component.
        return vec4( ( 1.0 ) * transmittedLight.rgb, transmittedLight.a );
    }`, [s, r]);
    return {
        transmission: new Function(/*glsl*/`
            vec3 transmission(float thickness, float ior, float roughness, vec2 transmissionSamplerSize, sampler2D transmissionSamplerMap, sampler2D transmissionDepthMap, vec2 aspectRatio, vec3 normal, float alpha, out float calpha) {
                vec3 v = vec3(0.);
                if (isOrthographic) {
                    v = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
                } else {
                    v = normalize(vWPosition - cameraPosition);
                }
                vec4 transmission = getIBLVolumeRefraction(vWNormal, -v, roughness,  vWPosition, modelMatrix, viewMatrix, projectionMatrix, ior, thickness, transmissionSamplerSize, transmissionSamplerMap, transmissionDepthMap, aspectRatio );
                float lalpha = alpha;

                 calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
                 accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
                 return transmission.rgb;
            }`, [o])
    }
}();


export { Transmission }