import Node from '../Node'
import { nFloat, nInt, nColor } from '../ReadonlyUnit'
import { UniformsLib, UniformsUtils } from 'three'


class Lambert extends Node {
	constructor() {
		super("lambert");
		this.nodeType = "Lambert";
		this.color = new nColor(5855577), this.emissive = new nColor(0),
			this.emissiveIntensity = new nFloat(1), this.shadingAlpha = new nFloat(1),
			this.shadingBlend = new nInt(0)
	}
	build(e) {
		let t;
		if (e.define("LAMBERT"), e.requires.lights = !0, e.extensions.derivatives = !0, e.isShader("vertex")) {
			let r = this.position ? this.position.analyzeAndFlow(e, "v3", {
				cache: "position"
			}) : void 0;
			e.mergeUniform(UniformsUtils.merge([UniformsLib.fog, UniformsLib.lights]));
			e.addParsCode(["varying vec3 vViewPosition;", "varying vec3 vLightFront;", "varying vec3 vIndirectFront;", "#ifndef DOUBLE_SIDED", "   #define DOUBLE_SIDED", "#endif", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "	varying vec3 vIndirectBack;", "#endif", "#include <bsdfs>", "#include <lights_pars_begin>", "#include <color_pars_vertex>", "#include <fog_pars_vertex>", "#include <normal_pars_vertex>", "#include <shadowmap_pars_vertex>", "#include <clipping_planes_pars_vertex>"].join(`
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
			r && n.push(r.code, r.result ? "displaced_position = " + r.result + ";" : ""),
				n.push("transformed = displaced_position;", "transformedNormal = normalMatrix * displaced_normal;", "#ifndef FLAT_SHADED", "    vNormal = transformedNormal;", "#endif"),
				n.push("	#include <project_vertex>", "	#include <clipping_planes_vertex>", "	vViewPosition = - mvPosition.xyz;", "	#include <worldpos_vertex>",
			/*glsl*/`
					vec3 diffuse = vec3( 1.0 );
					GeometricContext geometry;
					geometry.position = mvPosition.xyz;
					geometry.normal = normalize( transformedNormal );
					geometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );
					GeometricContext backGeometry;
					backGeometry.position = geometry.position;
					backGeometry.normal = -geometry.normal;
					backGeometry.viewDir = geometry.viewDir;
					vLightFront = vec3( 0.0 );
					vIndirectFront = vec3( 0.0 );
					#ifdef DOUBLE_SIDED
						vLightBack = vec3( 0.0 );
						vIndirectBack = vec3( 0.0 );
					#endif
					IncidentLight directLight;
					float dotNL;
					vec3 directLightColor_Diffuse;
					vIndirectFront += getAmbientLightIrradiance( ambientLightColor );
					vIndirectFront += getLightProbeIrradiance( lightProbe, geometry.normal );
					#ifdef DOUBLE_SIDED
						vIndirectBack += getAmbientLightIrradiance( ambientLightColor );
						vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometry.normal );
					#endif
					#if NUM_POINT_LIGHTS > 0
						#pragma unroll_loop_start
						for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
							getPointLightInfo( pointLights[ i ], geometry, directLight );
							dotNL = dot( geometry.normal, directLight.direction );
							directLightColor_Diffuse = directLight.color;
							vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
							#ifdef DOUBLE_SIDED
								vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
							#endif
						}
						#pragma unroll_loop_end
					#endif
					#if NUM_SPOT_LIGHTS > 0
						#pragma unroll_loop_start
						for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
							getSpotLightInfo( spotLights[ i ], geometry, directLight );
							dotNL = dot( geometry.normal, directLight.direction );
							directLightColor_Diffuse = directLight.color;
							vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
							#ifdef DOUBLE_SIDED
								vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
							#endif
						}
						#pragma unroll_loop_end
					#endif
					#if NUM_DIR_LIGHTS > 0
						#pragma unroll_loop_start
						for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
							getDirectionalLightInfo( directionalLights[ i ], geometry, directLight );
							dotNL = dot( geometry.normal, directLight.direction );
							directLightColor_Diffuse = directLight.color;
							vLightFront += saturate( dotNL ) * directLightColor_Diffuse;
							#ifdef DOUBLE_SIDED
								vLightBack += saturate( -dotNL ) * directLightColor_Diffuse;
							#endif
						}
						#pragma unroll_loop_end
					#endif
					#if NUM_HEMI_LIGHTS > 0
						#pragma unroll_loop_start
						for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
							vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );
							#ifdef DOUBLE_SIDED
								vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometry.normal );
							#endif
						}
						#pragma unroll_loop_end
					#endif
				`, "	#include <shadowmap_vertex>", "	#include <fog_vertex>"), t = n.join(`
`)
		} else {
			this.color === void 0 && (this.color = new nColor(5855577)),
				this.color.analyze(e, {
					slot: "color"
				}), this.shadingAlpha.analyze(e), this.shadingBlend.analyze(e),
				this.afterColor && this.afterColor.analyze(e, {
					slot: "afterColor"
				}), this.alpha && this.alpha.analyze(e);
			let r = this.color.flow(e, "c", {
				slot: "color"
			}),
				n = this.emissive.flow(e, "c", {
					slot: "emissive"
				}),
				s = this.emissiveIntensity.flow(e, "f", {
					slot: "emissive"
				}),
				o = this.shadingAlpha.flow(e, "f"),
				a = this.shadingBlend.flow(e, "i"),
				l = this.afterColor ? this.afterColor.flow(e, "c", {
					slot: "afterColor"
				}) : void 0,
				c = this.alpha ? this.alpha.flow(e, "f") : void 0;
			e.requires.transparent = c !== void 0, e.addParsCode(["varying vec3 vViewPosition;", "varying vec3 vLightFront;", "varying vec3 vIndirectFront;", "#ifndef DOUBLE_SIDED", "   #define DOUBLE_SIDED", "#endif", "#include <normal_pars_fragment>", "#ifdef DOUBLE_SIDED", "	varying vec3 vLightBack;", "	varying vec3 vIndirectBack;", "#endif", "#include <bsdfs>", "#include <lights_pars_begin>", "#include <fog_pars_fragment>", "#include <shadowmap_pars_fragment>", "#include <shadowmask_pars_fragment>", "#include <clipping_planes_pars_fragment>", "#include <dithering_pars_fragment>"].join(`
`));
			let u = ["#include <normal_fragment_begin>", /*glsl*/`
				// NOTE: gl_FrontFacing alternative using face normal estimation.
				vec3 viewdx = dFdx(vViewPosition);
				vec3 viewdy = dFdy(vViewPosition);
				vec3 faceNormal = normalize(cross(viewdx, viewdy));
				bool isFrontFacing = (dot(normal, faceNormal) >= 0.0);
				`, "#include <clipping_planes_fragment>"];
			u.push(r.code, "vec3 diffuseColor = " + r.result + ";", "ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );"), c && u.push(c.code, "#ifdef ALPHATEST", "if ( " + c.result + " <= ALPHATEST ) discard;", "#endif"), u.push("#ifdef DOUBLE_SIDED", "	reflectedLight.indirectDiffuse += ( isFrontFacing ) ? vIndirectFront : vIndirectBack;", "#else", "	reflectedLight.indirectDiffuse += vIndirectFront;", "#endif", "#include <lightmap_fragment>", "reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );", "#ifdef DOUBLE_SIDED", "	reflectedLight.directDiffuse = ( isFrontFacing ) ? vLightFront : vLightBack;", "#else", "	reflectedLight.directDiffuse = vLightFront;", "#endif", "reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();"), n && u.push(n.code, "reflectedLight.directDiffuse += " + n.result + " * " + s.result + ";"), u.push("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;"),
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
		return super.copy(e), this.emissiveIntensity = e.emissiveIntensity.clone(), e.color && (this.color = e.color.clone()), e.position && (this.position = e.position.clone()), e.afterColor && (this.afterColor = e.afterColor.clone()), e.alpha && (this.alpha = e.alpha.clone()), e.shadingAlpha && (this.shadingAlpha = e.shadingAlpha.clone()), e.shadingBlend && (this.shadingBlend = e.shadingBlend.clone()), e.emissive && (this.emissive = e.emissive.clone()), this
	}
};


export { Lambert }