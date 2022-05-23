import { Function } from './Function';
import { nMatrix3, nTexture } from '../ReadonlyUnit'
import NodeTemp from '../NodeTemp'

class CustomTexture extends NodeTemp {
    constructor(e = new nTexture, t, r, n, s, o, a, l) {
        super("v3");
        this.nodeType = "CustomTexture";
        this.firstTime = !0;
        this.texture = e;
        this.textureSize = t;
        this.crop = r;
        this.projection = n;
        this.axis = s;
        this.size = o;
        this.mat = new nMatrix3(this.texture.value.matrix);
        this.alpha = a;
        this.mode = l;
        this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        e.require("position");
        e.require("uv");
        e.requires.uv = [!0];
        e.extensions.shaderTextureLOD = !0;
        e.extensions.derivatives = !0;
        let r;
        switch (this.projection.value) {
            case 3:
                r = e.include(CustomTexture.Nodes.cylindrical);
                break;
            case 2:
                r = e.include(CustomTexture.Nodes.spherical);
                break;
            case 1:
                let s = new Function(/*glsl*/`
            vec3 g${this.uuid.toString().replace(/-/g, "")}_planarTexture(sampler2D tex, vec2 textureSize, float crop, mat3 mat, vec2 size, float alpha, int mode, out float calpha) {

                vec2 uvs = ( mat * vec3( (g${this.uuid.toString().replace(/-/g, "")}_vCustomUv * 2. - 1.) / (size * .5), 1. ) / 2. + 0.5 ).xy;

                vec4 tmp = texture2D( tex, uvs );

                vec3 col = tmp.rgb;
                float lalpha = alpha * tmp.a;
                if ( crop > 0.5 ) {
                    if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
                        lalpha = 0.0;
                    }
                }
                calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
                accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
                return col;
            }
        `);
                r = e.include(s);
                break;
            default:
                r = e.include(CustomTexture.Nodes.uv);
                break
        }
        if (this.projection.value === 1 && this.firstTime) {
            let s = `g${this.uuid.toString().replace(/-/g, "")}`;
            e.addVertexParsCode(`varying vec2 ${s}_vCustomUv;`);
            e.addFragmentParsCode(`varying vec2 ${s}_vCustomUv;`);
            e.addVertexFinalCode(/*glsl*/`
                    vec3 ${s}_posN = transformed;
${this.axis.value === 0 ? /*glsl*/`
                                   float ${s}_u = (1. + (${s}_posN.z)) / 2.;
                                   float ${s}_v = (1. + (${s}_posN.y)) / 2.;
                                   `: ""}

${this.axis.value === 1 ? /*glsl*/`
                                   float ${s}_u = (1. + (${s}_posN.x)) / 2.;
                                   float ${s}_v = (1. - (${s}_posN.z)) / 2.;
                                   `: ""}

${this.axis.value === 2 ? /*glsl*/`
                                   float ${s}_u = (1. + (${s}_posN.x)) / 2.;
                                   float ${s}_v = (1. + (${s}_posN.y)) / 2.;
                                   `: ""}

                    ${s}_vCustomUv = vec2(${s}_u, ${s}_v);
                `)
        }
        e.addFragmentVariable(this.calpha, "float");
        let n = [];
        return n.push(this.texture.getTexture(e, "t")), n.push(this.textureSize.build(e, "v2")), n.push(this.crop.build(e, "f")), n.push(this.mat.build(e, "mat3")), n.push(this.size.build(e, "v2")), n.push(this.alpha.build(e, "f")), n.push(this.mode.build(e, "i")), n.push(this.calpha), this.firstTime = !this.firstTime, e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.texture.copy(e.texture), this.textureSize = e.textureSize.clone(), this.crop = e.crop.clone(), this.projection = e.projection.clone(), this.axis = e.axis.clone(), this.size = e.size.clone(), this.alpha = e.alpha.clone(), this.mode = e.mode.clone(), this
    }
}

CustomTexture.Nodes = function () {
    let e = new Function(/*glsl*/`
            vec3 cylindricalTexture(sampler2D tex, vec2 textureSize, float crop, mat3 mat, vec2 size, float alpha, int mode, out float calpha) {
                vec3 posN = normalize(position);
                float u = 0.5 + atan(posN.z, posN.x) / (2.*3.1415);
                float scaledHeight = position.y / (size.y * 0.5);
                float v =  (scaledHeight / 2.) + .5;

                vec2 calculatedUv = vec2(u,v);
				vec2 uvs = ( mat * vec3( calculatedUv * 2. - 1., 1. ) / 2. + 0.5 ).xy;

                vec2 df = fwidth(uvs);
               	if(df.x > 0.5) df.x = 0.;

				#ifdef GL_EXT_shader_texture_lod
                vec4 tmp = texture2DLodEXT(tex, uvs, log2(max(df.x, df.y)*min(textureSize.x, textureSize.y)));
				#else
                vec4 tmp = textureLod(tex, uvs, log2(max(df.x, df.y)*min(textureSize.x, textureSize.y)));
				#endif

				vec3 col = tmp.rgb;
				float lalpha = alpha * tmp.a;
				if ( crop > 0.5 ) {
					if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
						lalpha = 0.0;
					}
				}
				calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
				return col;
			}
`),
        t = new Function(/*glsl*/`
            vec3 sphericalTexture(sampler2D tex, vec2 textureSize, float crop, mat3 mat, vec2 size, float alpha, int mode, out float calpha) {
                vec3 posN = normalize(vPosition);
                float u = 0.5 + atan(posN.z, posN.x) / (2.*3.1415);
                float v = 0.5 + asin(posN.y) / 3.1415;

                vec2 calculatedUv = vec2(u,v);
				vec2 uvs = ( mat * vec3( calculatedUv * 2. - 1., 1. ) / 2. + 0.5 ).xy;

                vec2 df = fwidth(uvs);
               	if(df.x > 0.5) df.x = 0.;
				#ifdef GL_EXT_shader_texture_lod
                vec4 tmp = texture2DLodEXT(tex, uvs, log2(max(df.x, df.y)*min(textureSize.x, textureSize.y)));
				#else
                vec4 tmp = textureLod(tex, uvs, log2(max(df.x, df.y)*min(textureSize.x, textureSize.y)));
				#endif

				vec3 col = tmp.rgb;
				float lalpha = alpha * tmp.a;
				if ( crop > 0.5 ) {
					if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
						lalpha = 0.0;
					}
				}
				calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
				return col;
			}
`),
        r = new Function(/*glsl*/`
            vec3 uvTexture(sampler2D tex, vec2 textureSize, float crop, mat3 mat, vec2 size, float alpha, int mode, out float calpha) {

				vec2 uvs = ( mat * vec3( vUv * 2. - 1., 1. ) / 2. + 0.5 ).xy;
				vec4 tmp = texture2D( tex, uvs );

				vec3 col = tmp.rgb;

				float lalpha = alpha * tmp.a;
				if ( crop > 0.5 ) {
					if ( uvs.x < 0.0 || uvs.x > 1.0 || uvs.y < 0.0 || uvs.y > 1.0 )  {
						lalpha = 0.0;
					}
				}
				calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
				return col;
			}`);
    return {
        cylindrical: e,
        spherical: t,
        uv: r
    }
}();

export { CustomTexture }