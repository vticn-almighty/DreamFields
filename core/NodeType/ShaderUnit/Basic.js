
import Node from '../Node'
import { nColor } from '../ReadonlyUnit'
import { UniformsLib, UniformsUtils } from 'three'


class Basic extends Node {
    constructor() {
        super("basic");
        this.nodeType = "Basic";
        this.color = new nColor(5855577)
    }
    generate(e) {
        let t;
        if (e.isShader("vertex")) {
            let r = this.position ? this.position.analyzeAndFlow(e, "v3", {
                cache: "position"
            }) : void 0;
            e.mergeUniform(UniformsUtils.merge([UniformsLib.fog])), e.addParsCode(["varying vec3 vViewPosition;", "#include <fog_pars_vertex>", "#include <normal_pars_vertex>"].join(`
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
            r && n.push(r.code, r.result ? "displaced_position = " + r.result + ";" : ""), n.push("transformed = displaced_position;", "transformedNormal = normalMatrix * displaced_normal;", "#ifndef FLAT_SHADED", "	vNormal = transformedNormal;", "#endif"), n.push("#include <project_vertex>", "#include <fog_vertex>", "#include <clipping_planes_vertex>", "	vViewPosition = - mvPosition.xyz;", "#include <worldpos_vertex>"), t = n.join(`
`)
        } else {
            this.color === void 0 && (this.color = new nColor(5855577)), this.color.analyze(e, {
                slot: "color"
            }), this.alpha && this.alpha.analyze(e), this.afterColor && this.afterColor.analyze(e, {
                slot: "afterColor"
            });
            let r = this.color.flow(e, "c", {
                slot: "color"
            }),
                n = this.alpha ? this.alpha.flow(e, "f") : void 0,
                s = this.afterColor ? this.afterColor.flow(e, "c", {
                    slot: "afterColor"
                }) : void 0;
            e.requires.transparent = n !== void 0, e.addParsCode(["#include <fog_pars_fragment>", "#include <dithering_pars_fragment>", "varying vec3 vViewPosition;", "#include <normal_pars_fragment>"].join(`
`));
            let o = ["#include <normal_fragment_begin>", r.code];
            n && o.push(n.code, "#ifdef ALPHATEST", " if ( " + n.result + " <= ALPHATEST ) discard;", "#endif"), s ? o.push(s.code, `vec3 outgoingLight = ${r.result};`, `vec3 finalColor = spe_blend(outgoingLight, ${s.result}, 1.0, SPE_BLENDING_NORMAL);`) : o.push(`vec3 finalColor = ${r.result};`), n ? o.push(`gl_FragColor = vec4( finalColor, accumAlpha * ${n.result} );`) : o.push("gl_FragColor = vec4(" + r.result + ", 1.0 );"), o.push("#include <fog_fragment>", "#include <dithering_fragment>"), t = o.join(`
`)
        }
        return t
    }
    copy(e) {
        return super.copy(e), e.color && (this.color = e.color.clone()), e.position && (this.position = e.position.clone()), e.alpha && (this.alpha = e.alpha.clone()), e.afterColor && (this.afterColor = e.afterColor.clone()), e.shadingAlpha && (this.shadingAlpha = e.shadingAlpha.clone()), e.shadingBlend && (this.shadingBlend = e.shadingBlend.clone()), this
    }
};

export { Basic }