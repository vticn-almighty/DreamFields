

import Node from '../Node'
import { nFloat, nInt, nColor } from '../ReadonlyUnit'
import { UniformsLib, UniformsUtils } from 'three'

class Phong extends Node {
    constructor() {
        super("phong");
        this.nodeType = "Phong";
        this.color = new nColor(5855577);
        this.specular = new nColor(1118481);
        this.shininess = new nFloat(30);
        this.shadingAlpha = new nFloat(1);
        this.shadingBlend = new nInt(0)
    }
    build(e) {
        let t;
        if (e.define("PHONG"), e.requires.lights = !0, e.extensions.derivatives = !0, e.isShader("vertex")) {
            let r = this.position ? this.position.analyzeAndFlow(e, "v3", {
                cache: "position"
            }) : void 0;
            e.mergeUniform(UniformsUtils.merge([UniformsLib.fog, UniformsLib.lights])), e.addParsCode(["varying vec3 vViewPosition;", "#include <fog_pars_vertex>", "#include <normal_pars_vertex>", "#include <shadowmap_pars_vertex>", "#include <clipping_planes_pars_vertex>"].join(`
`));
            let n = ["#include <beginnormal_vertex>", /*glsl*/`
				#ifndef USE_LAYER_DISPLACE
					#include <defaultnormal_vertex>
				#endif

				vec3 displaced_position = position;
				vec3 displaced_normal = normal;

				#ifdef USE_LAYER_DISPLACE
					vec3 transformed;
					vec3 transformedNormal;
				#endif
				`, "#include <normal_vertex>", /*glsl*/`
				#ifndef USE_LAYER_DISPLACE
					#include <begin_vertex>
				#endif
				`];
            r && n.push(r.code, r.result ? "displaced_position = " + r.result + ";" : ""), n.push("transformed = displaced_position;", "transformedNormal = normalMatrix * displaced_normal;", "#ifndef FLAT_SHADED", "    vNormal = transformedNormal;", "#endif"), n.push("	#include <project_vertex>", "	#include <clipping_planes_vertex>", "	vViewPosition = - mvPosition.xyz;", "	#include <worldpos_vertex>", "	#include <shadowmap_vertex>", "	#include <fog_vertex>"), t = n.join(`
`)
        } else {
            this.color === void 0 && (this.color = new nColor(5855577)), this.color.analyze(e, {
                slot: "color"
            }), this.specular.analyze(e), this.shininess.analyze(e), this.shadingAlpha.analyze(e), this.shadingBlend.analyze(e), this.afterColor && this.afterColor.analyze(e, {
                slot: "afterColor"
            }), this.alpha && this.alpha.analyze(e);
            let r = this.color.flow(e, "c", {
                slot: "color"
            }),
                n = this.specular.flow(e, "c"),
                s = this.shininess.flow(e, "f"),
                o = this.shadingAlpha.flow(e, "f"),
                a = this.shadingBlend.flow(e, "i"),
                l = this.afterColor ? this.afterColor.flow(e, "c", {
                    slot: "afterColor"
                }) : void 0,
                c = this.alpha ? this.alpha.flow(e, "f") : void 0;
            e.requires.transparent = c !== void 0, e.addParsCode(["uniform vec3 emissive;", "#include <normal_pars_fragment>", "#include <fog_pars_fragment>", "#include <bsdfs>", "#include <lights_pars_begin>", "#include <lights_phong_pars_fragment>", "#include <shadowmap_pars_fragment>", "#include <dithering_pars_fragment>"].join(`
`));
            let u = ["#include <normal_fragment_begin>", /*glsl*/`
				// NOTE: gl_FrontFacing alternative using face normal estimation.
				vec3 viewdx = dFdx(vViewPosition);
				vec3 viewdy = dFdy(vViewPosition);
				vec3 faceNormal = normalize(cross(viewdx,viewdy));
				if (dot(normal, faceNormal) < 0.0) {
					normal *= -1.0;
				}
				`, "	BlinnPhongMaterial material;"];
            u.push(r.code, "	vec3 diffuseColor = " + r.result + ";", "	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );", "	vec3 totalEmissiveRadiance = emissive;", n.code, "	vec3 specular = " + n.result + ";", s.code, "	float shininess = max( 0.0001, " + s.result + " );", "	float specularStrength = 1.0;"), c && u.push(c.code, "#ifdef ALPHATEST", "if ( " + c.result + " <= ALPHATEST ) discard;", "#endif"), u.push("material.diffuseColor = diffuseColor;"), u.push("material.specularColor = specular;", "material.specularShininess = shininess;", "material.specularStrength = specularStrength;", "#include <lights_fragment_begin>", "#include <lights_fragment_end>"), u.push("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;"),
                u.push(/*glsl*/`
				if (outgoingLight != diffuseColor) {
					float lightAccu = clamp( length( reflectedLight.directSpecular + reflectedLight.indirectSpecular ), 0.0, 1.0 );
					accumAlpha += ( 1.0 - accumAlpha ) * ${o.result} * lightAccu;
					outgoingLight = spe_blend( diffuseColor, outgoingLight, ${o.result}, ${a.result} );
				}
				`), l && u.push(l.code, `outgoingLight = spe_blend(outgoingLight, ${l.result}, 1.0, SPE_BLENDING_NORMAL);`), c ? u.push(`gl_FragColor = vec4( outgoingLight, accumAlpha * ${c.result} );`) : u.push("gl_FragColor = vec4( outgoingLight, 1.0 );"), u.push("#include <encodings_fragment>", "#include <fog_fragment>", "#include <dithering_fragment>"), t = u.join(`
`)
        }
        return t
    }
    copy(e) {
        return super.copy(e), e.color && (this.color = e.color.clone()), this.specular = e.specular.clone(), this.shininess = e.shininess.clone(), e.position && (this.position = e.position.clone()), e.afterColor && (this.afterColor = e.afterColor.clone()), e.alpha && (this.alpha = e.alpha.clone()), e.shadingAlpha && (this.shadingAlpha = e.shadingAlpha.clone()), e.shadingBlend && (this.shadingBlend = e.shadingBlend.clone()), this
    }
};

export { Phong }