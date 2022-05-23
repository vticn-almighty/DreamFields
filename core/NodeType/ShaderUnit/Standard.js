
import Node from '../Node'
import { nFloat, nInt, nColor } from '../ReadonlyUnit'
import { UniformsLib, UniformsUtils } from 'three'

class Standard extends Node {
    constructor() {
        super("standard");
        this.nodeType = "Standard";
        this.color = new nColor(5855577), this.roughness = new nFloat(.3), this.metalness = new nFloat(0), this.reflectivity = new nFloat(.5), this.shadingAlpha = new nFloat(1), this.shadingBlend = new nInt(0)
    }
    build(e) {
        let t;
        if (e.define("STANDARD"), e.requires.lights = !0, e.extensions.derivatives = !0, e.extensions.shaderTextureLOD = !0, e.isShader("vertex")) {
            let r = this.position ? this.position.analyzeAndFlow(e, "v3", {
                cache: "position"
            }) : void 0;
            e.mergeUniform(UniformsUtils.merge([UniformsLib.fog, UniformsLib.lights])), UniformsLib.LTC_1 && (e.uniforms.ltc_1 = {
                value: void 0
            }, e.uniforms.ltc_2 = {
                value: void 0
            }), e.addParsCode(["varying vec3 vViewPosition;", "#include <fog_pars_vertex>", "#include <normal_pars_vertex>", "#include <shadowmap_pars_vertex>", "#include <clipping_planes_pars_vertex>"].join(`
`));
            let n = ["#include <beginnormal_vertex>", /*glsl*/`
				#if !defined( USE_LAYER_DISPLACE )
					#include <defaultnormal_vertex>
				#endif

				vec3 displaced_position = position;
				vec3 displaced_normal = normal;

				#if defined( USE_LAYER_DISPLACE )
					vec3 transformed;
					vec3 transformedNormal;
				#endif
				`, "#include <normal_vertex>", /*glsl*/`
				#if !defined( USE_LAYER_DISPLACE )
					#include <begin_vertex>
				#endif /* !USE_LAYER_DISPLACE */
				`];
            r && n.push(r.code, r.result ? "displaced_position = " + r.result + ";" : ""), n.push("transformed = displaced_position;", "transformedNormal = normalMatrix * displaced_normal;", "#ifndef FLAT_SHADED", "    vNormal = transformedNormal;", "#endif"), n.push("#include <project_vertex>", "#include <fog_vertex>", "#include <clipping_planes_vertex>", "	vViewPosition = - mvPosition.xyz;", "#include <worldpos_vertex>", "#include <shadowmap_vertex>"), t = n.join(`
`)
        } else {
            let r = {
                gamma: !0
            };
            this.color === void 0 && (this.color = new nColor(5855577)), this.color.analyze(e, {
                slot: "color",
                context: r
            }), this.roughness.analyze(e), this.metalness.analyze(e), this.shadingAlpha.analyze(e), this.shadingBlend.analyze(e), this.afterColor && this.afterColor.analyze(e, {
                slot: "afterColor"
            }), this.alpha && this.alpha.analyze(e), this.reflectivity && this.reflectivity.analyze(e);
            let n = this.color.flow(e, "c", {
                slot: "color",
                context: r
            }),
                s = this.roughness.flow(e, "f"),
                o = this.metalness.flow(e, "f"),
                a = this.shadingAlpha.flow(e, "f"),
                l = this.shadingBlend.flow(e, "i"),
                c = this.afterColor ? this.afterColor.flow(e, "c", {
                    slot: "afterColor"
                }) : void 0,
                u = this.alpha ? this.alpha.flow(e, "f") : void 0,
                h = this.reflectivity ? this.reflectivity.flow(e, "f") : void 0;
            e.requires.transparent = u !== void 0, e.addParsCode(["varying vec3 vViewPosition;", "#include <normal_pars_fragment>", "#include <dithering_pars_fragment>", "#include <fog_pars_fragment>", "#include <bsdfs>", "#include <lights_pars_begin>", "#include <lights_physical_pars_fragment>", "#include <shadowmap_pars_fragment>"].join(`
`));
            let d = ["#include <clipping_planes_fragment>", "	#include <normal_fragment_begin>", /*glsl*/`
				// NOTE: gl_FrontFacing alternative using face normal estimation.
				vec3 viewdx = dFdx(vViewPosition);
				vec3 viewdy = dFdy(vViewPosition);
				vec3 faceNormal = normalize(cross(viewdx,viewdy));
				if (dot(normal, faceNormal) < 0.0) {
					normal *= -1.0;
				}
				`, "	PhysicalMaterial material;", "	material.diffuseColor = vec3( 1.0 );"];
            d.push(n.code, "	vec3 diffuseColor = " + n.result + ";", "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );", s.code, "	float roughnessFactor = " + s.result + ";", o.code, "	float metalnessFactor = " + o.result + ";"), u && d.push(u.code, "#ifdef ALPHATEST", "	if ( " + u.result + " <= ALPHATEST ) discard;", "#endif"), d.push("vec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );", "float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );"), d.push("material.diffuseColor = diffuseColor * ( 1.0 - metalnessFactor );", "material.roughness = max( roughnessFactor, 0.0525 );", "material.roughness += geometryRoughness;", "material.roughness = min( material.roughness, 1.0 );", "material.roughness = clamp( roughnessFactor, 0.04, 1.0 );"), h ? d.push(h.code, "material.specularColor = mix( vec3( 0.16 * pow2( " + h.result + " ) ), diffuseColor, metalnessFactor );") : d.push("material.specularColor = mix( vec3( 0.04 ), diffuseColor, metalnessFactor );"), d.push("#include <lights_fragment_begin>"), d.push("#include <lights_fragment_end>"), d.push("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;");
            d.push(/*glsl*/`
				if (outgoingLight != diffuseColor) {
					float lightAccu = clamp( length( reflectedLight.directSpecular + reflectedLight.indirectSpecular ), 0.0, 1.0 );
					accumAlpha += ( 1.0 - accumAlpha ) * ${a.result} * lightAccu;
					outgoingLight = spe_blend( diffuseColor, outgoingLight, ${a.result}, ${l.result} );
				}
				`), c && d.push(c.code, `outgoingLight = spe_blend(outgoingLight, ${c.result}, 1.0, SPE_BLENDING_NORMAL);`), u ? d.push(`gl_FragColor = vec4( outgoingLight, accumAlpha * ${u.result} );`) : d.push("gl_FragColor = vec4( outgoingLight, 1.0 );"), d.push("#include <encodings_fragment>", "#include <fog_fragment>", "#include <dithering_fragment>"), t = d.join(`
`)
        }
        return t
    }
    copy(e) {
        return super.copy(e), e.color && (this.color = e.color.clone()), this.roughness = e.roughness.clone(), this.metalness = e.metalness.clone(), e.position && (this.position = e.position.clone()), e.afterColor && (this.afterColor = e.afterColor.clone()), e.alpha && (this.alpha = e.alpha.clone()), e.reflectivity && (this.reflectivity = e.reflectivity.clone()), e.shadingAlpha && (this.shadingAlpha = e.shadingAlpha.clone()), e.shadingBlend && (this.shadingBlend = e.shadingBlend.clone()), this
    }
};

export { Standard }