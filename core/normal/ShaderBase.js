import Node from '../nodeType/Node'
import NodeBase from './NodeBase'
import { Function, Const, TextureCube, Struct } from '../nodeType/Unit'
import { nVector2, nVector3, nVector4, nCubeTexture, nTexture } from '../nodeType/ReadonlyUnit'

let SF = {
    float: "f",
    vec2: "v2",
    vec3: "v3",
    vec4: "v4",
    mat4: "v4",
    int: "i",
    bool: "b",
    "float[]": "f[]",
    "vec4[]": "v4[]"
}
let MF = {
    t: "sampler2D",
    tc: "samplerCube",
    b: "bool",
    i: "int",
    f: "float",
    c: "vec3",
    v2: "vec2",
    v3: "vec3",
    v4: "vec4",
    m3: "mat3",
    m4: "mat4",
    "f[]": "float[]",
    "v4[]": "vec4[]"
}

export default class ShaderBase {
    constructor() {
        this.includes = {
            consts: {},
            functions: {},
            structs: {}
        };
        this.cache = "";
        this.slot = "";
        this.shader = "";
        this.context = {};
        this.getIncludesCode = function () {
            function e(t, r) {
                return t.deps.length - r.deps.length
            }
            return function (r, n) {
                let s = this.getIncludes(r, n);
                if (!s) return "";
                let o = "";
                s = s.sort(e);
                for (let a = 0; a < s.length; a++) s[a].src && (o += s[a].src + `
`);
                return o
            }
        }();
        this.slots = [], this.caches = [], this.contexts = [], this.keywords = {}, this.nodeData = {}, this.fragmentVariables = {}, this.requires = {
            uv: [],
            color: [],
            lights: !1,
            fog: !1,
            transparent: !1,
            irradiance: !1,
            position: !1,
            worldPosition: !1,
            normal: !1,
            worldNormal: !1,
            vWorldViewDir: !1,
            modelMatrix: !1,
            viewMatrix: !1,
            projectionMatrix: !1
        }, this.includes = {
            consts: [],
            functions: [],
            structs: []
        }, this.attributes = {}, this.prefixCode = ["#ifdef TEXTURE_LOD_EXT", "	#define texCube(a, b) textureCube(a, b)", "	#define texCubeBias(a, b, c) textureCubeLodEXT(a, b, c)", "	#define tex2D(a, b) texture2D(a, b)", "	#define tex2DBias(a, b, c) texture2DLodEXT(a, b, c)", "#else", "	#define texCube(a, b) textureCube(a, b)", "	#define texCubeBias(a, b, c) textureCube(a, b, c)", "	#define tex2D(a, b) texture2D(a, b)", "	#define tex2DBias(a, b, c) texture2D(a, b, c)", "#endif", `
        // NOTE: Include Spline's blending modes. This could be part of BlendNode
        #define SPE_BLENDING_NORMAL 0
        #define SPE_BLENDING_MULTIPLY 1
        #define SPE_BLENDING_SCREEN 2
        #define SPE_BLENDING_OVERLAY 3

        vec3 spe_normalBlend( vec3 a, vec3 b, float alpha ) {
            return mix( a, b, alpha );
        }

        vec3 spe_multiplyBlend( vec3 a, vec3 b, float alpha ) {
            return mix( a, a * b, alpha );
        }

        vec3 spe_screenBlend( vec3 a, vec3 b, float alpha ) {
            vec3 tmp = 1.0 - ( 1.0 - a ) * ( 1.0 - b );
            return mix( a, tmp, alpha );
        }

        vec3 spe_overlayBlend( vec3 a, vec3 b, float alpha ) {
            vec3 tmp = mix( 1. - 2. * (1. - a) * (1. - b), 2. * a * b, step( a, vec3(.5) ) );
            return clamp( mix( a, tmp, alpha ), 0.0, 1.0 );
        }

        vec3 spe_blend( vec3 a, vec3 b, float alpha, int mode ) {
            if ( mode == SPE_BLENDING_NORMAL ) return spe_normalBlend( a, b, alpha );
            else if ( mode == SPE_BLENDING_MULTIPLY ) return spe_multiplyBlend( a, b, alpha );
            else if ( mode == SPE_BLENDING_SCREEN ) return spe_screenBlend( a, b, alpha );
            else if ( mode == SPE_BLENDING_OVERLAY ) return spe_overlayBlend( a, b, alpha );
            return vec3( 1.0 );
        }
        `, "#include <packing>", "#include <common>"].join(`
`), this.parsCode = {
                vertex: ["float neighbor_offset = 0.0001;", ""].join(`
`),
                fragment: ["float accumAlpha = 0.0;", `void accumulateAlpha(float alpha) {
                accumAlpha += (1.0 - accumAlpha) * alpha;
            }`, ""].join(`
`)
            }, this.code = {
                vertex: "",
                fragment: ""
            }, this.nodeCode = {
                vertex: "",
                fragment: ""
            }, this.resultCode = {
                vertex: "",
                fragment: ""
            }, this.finalCode = {
                vertex: "",
                fragment: ""
            }, this.inputs = {
                uniforms: {
                    list: [],
                    vertex: [],
                    fragment: []
                },
                arrayUniforms: {
                    list: [],
                    vertex: [],
                    fragment: []
                },
                vars: {
                    varying: [],
                    vertex: [],
                    fragment: []
                }
            }, this.defines = {}, this.uniforms = {}, this.extensions = {
                derivatives: !1,
                fragDepth: !1,
                drawBuffers: !1,
                shaderTextureLOD: !1
            }, this.updaters = [], this.nodes = [], this.analyzing = !1
    }
    build(e, t) {
        this.buildShader("vertex", e), this.buildShader("fragment", t);
        for (let r = 0; r < this.requires.uv.length; r++)
            if (this.requires.uv[r]) {
                let n = r > 0 ? r + 1 : "";
                this.addVaryCode("varying vec2 vUv" + n + ";"), r > 0 && this.addVertexParsCode("attribute vec2 uv" + n + ";"), this.addVertexFinalCode("vUv" + n + " = uv" + n + ";")
            } return this.requires.color[0] && (this.addVaryCode("varying vec4 vColor;"), this.addVertexParsCode("attribute vec4 color;"), this.addVertexFinalCode("vColor = color;")), this.requires.color[1] && (this.addVaryCode("varying vec4 vColor2;"), this.addVertexParsCode("attribute vec4 color2;"), this.addVertexFinalCode("vColor2 = color2;")), this.requires.position && (this.addVaryCode("varying vec3 vPosition;"), this.addVertexFinalCode("vPosition = transformed;")), this.requires.worldPosition && (this.addVaryCode("varying vec3 vWPosition;"), this.addVertexFinalCode("vWPosition = ( modelMatrix * vec4( transformed, 1.0 ) ).xyz;")), this.requires.normal && (this.addVaryCode("varying vec3 vObjectNormal;"), this.addVertexFinalCode("vObjectNormal = normal;")), this.requires.modelMatrix && this.addFragmentParsCode("uniform mat4 modelMatrix;"), this.requires.viewMatrix && this.addFragmentParsCode("uniform mat4 viewMatrix;"), this.requires.projectionMatrix && this.addFragmentParsCode("uniform mat4 projectionMatrix;"), this.requires.worldNormal && (this.addVaryCode("varying vec3 vWNormal;"), this.addVertexFinalCode("vWNormal = inverseTransformDirection( transformedNormal, viewMatrix ).xyz;")), this.requires.vWorldViewDir && (this.addVaryCode("varying vec3 vWorldViewDir;"), this.addVertexFinalCode("vWorldViewDir = isPerspectiveMatrix( projectionMatrix ) ?  ( (modelMatrix * vec4(position, 1.0)).xyz - cameraPosition ) : vec3( -viewMatrix[0][2], -viewMatrix[1][2], -viewMatrix[2][2] );")), this
    }
    buildShader(e, t) {
        this.resultCode[e] = t.build(this.setShader(e), "v4")
    }
    setMaterial(e, t) {
        return this.material = e, this.renderer = t, this.requires.lights = e.lights, this.requires.fog = e.fog, this.mergeDefines(e.defines), this
    }
    addFlow(e, t, r) {
        return this.addSlot(e).addCache(t).addContext(r)
    }
    removeFlow() {
        return this.removeSlot().removeCache().removeContext()
    }
    addCache(e) {
        return this.cache = e != null ? e : "", this.caches.push(this.cache), this
    }
    removeCache() {
        return this.caches.pop(), this.cache = this.caches[this.caches.length - 1] || "", this
    }
    addContext(e) {
        return this.context = Object.assign({}, this.context, e), this.context.extra = this.context.extra || {}, this.contexts.push(this.context), this
    }
    removeContext() {
        return this.contexts.pop(), this.context = this.contexts[this.contexts.length - 1] || {}, this
    }
    addSlot(e) {
        return this.slot = e || "", this.slots.push(this.slot), this
    }
    removeSlot() {
        return this.slots.pop(), this.slot = this.slots[this.slots.length - 1] || "", this
    }
    addFragmentVariable(e, t) {
        this.fragmentVariables[e] === void 0 && (this.addFragmentCode(`${t} ${e};`), this.fragmentVariables[e] = "")
    }
    addVertexCode(e) {
        this.addCode(e, "vertex")
    }
    addFragmentCode(e) {
        this.addCode(e, "fragment")
    }
    addCode(e, t) {
        this.code[t != null ? t : this.shader] += e + `
`
    }
    addVertexNodeCode(e) {
        this.addNodeCode(e, "vertex")
    }
    addFragmentNodeCode(e) {
        this.addNodeCode(e, "fragment")
    }
    addNodeCode(e, t) {
        this.nodeCode[t != null ? t : this.shader] += e + `
`
    }
    clearNodeCode(e) {
        e = e != null ? e : this.shader;
        let t = this.nodeCode[e];
        return this.nodeCode[e] = "", t
    }
    clearVertexNodeCode() {
        return this.clearNodeCode("vertex")
    }
    clearFragmentNodeCode() {
        return this.clearNodeCode("fragment")
    }
    addVertexFinalCode(e) {
        this.addFinalCode(e, "vertex")
    }
    addFragmentFinalCode(e) {
        this.addFinalCode(e, "fragment")
    }
    addFinalCode(e, t) {
        this.finalCode[t != null ? t : this.shader] += e + `
`
    }
    addVertexParsCode(e) {
        this.addParsCode(e, "vertex")
    }
    addFragmentParsCode(e) {
        this.addParsCode(e, "fragment")
    }
    addParsCode(e, t) {
        this.parsCode[t != null ? t : this.shader] += e + `
`
    }
    addVaryCode(e) {
        this.addVertexParsCode(e), this.addFragmentParsCode(e)
    }
    isCache(e) {
        return this.caches.indexOf(e) !== -1
    }
    isSlot(e) {
        return this.slots.indexOf(e) !== -1
    }
    define(e, t) {
        this.defines[e] = t === void 0 ? 1 : t
    }
    require(e) {
        this.requires[e] = !0
    }
    isDefined(e) {
        return this.defines[e] !== void 0
    }
    getVar(e, t, r, n = "varying", s = "V", o = "") {
        let a = this.getVars(n),
            l = a[e];
        if (!l) {
            let c = a.length;
            l = {
                name: r || "node" + s + c + (o ? "_" + o : ""),
                type: t
            }, a.push(l), a[e] = l
        }
        return l
    }
    getTempVar(e, t, r, n) {
        return this.getVar(e, t, r, this.shader, "T", n)
    }
    getAttribute(e, t) {
        if (!this.attributes[e]) {
            let r = this.getVar(e, t);
            this.addVertexParsCode("attribute " + t + " " + e + ";"), this.addVertexFinalCode(r.name + " = " + e + ";"), this.attributes[e] = {
                varying: r,
                name: e,
                type: t
            }
        }
        return this.attributes[e]
    }
    getCode(e) {
        return [this.prefixCode, this.parsCode[e], this.getVarListCode(this.getVars("varying"), "varying"), this.getVarListCode(this.inputs.uniforms[e], "uniform"), this.getVarListCode(this.inputs.arrayUniforms[e], "uniform"), this.getIncludesCode("consts", e), this.getIncludesCode("structs", e), this.getIncludesCode("functions", e), "void main() {", this.getVarListCode(this.getVars(e)), this.code[e], this.resultCode[e], this.finalCode[e], "}"].join(`
`)
    }
    getVarListCode(e, t) {
        t = t != null ? t : "";
        let r = "";
        for (let n = 0, s = e.length; n < s; ++n) {
            let o = e[n],
                a = o.type,
                l = o.name,
                c = o.size,
                u = this.getFormatByType(a);
            if (u === void 0) throw new Error("Node pars " + u + " not found.");
            u.includes("[]") ? r += t + " " + u.substring(0, u.length - 2) + " " + l + `[${c}];
` : r += t + " " + u + " " + l + `;
`
        }
        return r
    }
    getVars(e) {
        return this.inputs.vars[e != null ? e : this.shader]
    }
    getNodeData(e) {
        let t = e instanceof Node ? e.uuid : e;
        return this.nodeData[t] = this.nodeData[t] || {}
    }
    createUniform(e, t, r, n, s, o) {
        if (t.includes("[]")) {
            let a = this.inputs.arrayUniforms,
                l = a.list.length,
                c = new NodeBase({
                    type: t,
                    size: r.size,
                    name: n || "nodeUA" + l + (o ? "_" + o : ""),
                    node: r,
                    needsUpdate: s
                });
            return a.list.push(c), a[e].push(c), a[e][c.name] = c, this.uniforms[c.name] = c, c
        } else {
            let a = this.inputs.uniforms,
                l = a.list.length,
                c = new NodeBase({
                    type: t,
                    name: n || "nodeU" + l + (o ? "_" + o : ""),
                    node: r,
                    needsUpdate: s
                });
            return a.list.push(c), a[e].push(c), a[e][c.name] = c, this.uniforms[c.name] = c, c
        }
    }
    createVertexUniform(e, t, r, n, s) {
        return this.createUniform("vertex", e, t, r, n, s)
    }
    createFragmentUniform(e, t, r, n, s) {
        return this.createUniform("fragment", e, t, r, n, s)
    }
    include(e, t, r) {
        var o;
        let n;
        if (e = typeof e == "string" ? Ir.get(e) : e, this.context.include === !1) return e.name;
        e instanceof Function ? n = this.includes.functions : e instanceof Const ? n = this.includes.consts : e instanceof Struct && (n = this.includes.structs);
        let s = n[this.shader] = n[this.shader] || [];
        if (e) {
            let a = s[e.name];
            if (a || (a = s[e.name] = {
                node: e,
                deps: []
            }, s.push(a), a.src = e.build(this, "source")), e instanceof Function && t && s[t.name] && s[t.name].deps.indexOf(e) === -1 && (s[t.name].deps.push(e), (o = e.includes) == null ? void 0 : o.length)) {
                let l = 0;
                do this.include(e.includes[l++], t); while (l < e.includes.length)
            }
            return r && (a.src = r), e.name
        } else throw new Error("Include not found.")
    }
    colorToVectorProperties(e) {
        return e.replace("r", "x").replace("g", "y").replace("b", "z").replace("a", "w")
    }
    colorToVector(e) {
        return e.replace(/c/g, "v3")
    }
    getIncludes(e, t) {
        return this.includes[e][t || this.shader]
    }
    getConstructorFromLength(e) {
        return wF[e - 1]
    }
    isTypeMatrix(e) {
        return /^m/.test(e)
    }
    getTypeLength(e) {
        return e === "f" ? 1 : parseInt(this.colorToVector(e).substr(1))
    }
    getTypeFromLength(e) {
        return e === 1 ? "f" : "v" + e
    }
    findNode(...e) {
        for (let t = 0; t < arguments.length; t++) {
            let r = e[t];
            if (r == null ? void 0 : r.isNode) return r
        }
    }
    resolve(...e) {
        for (let t = 0; t < arguments.length; t++) {
            let r = e[t];
            if (r !== void 0) {
                if (r.isNode) return r;
                if (r.isTexture) switch (r.mapping) {
                    case Es:
                    case Cs:
                        return new nCubeTexture(r);
                    case ia:
                    case Yl:
                        return new TextureCube(new nTexture(r));
                    default:
                        return new nTexture(r)
                } else {
                    if (r.isVector2) return new nVector2(r);
                    if (r.isVector3) return new nVector3(r);
                    if (r.isVector4) return new nVector4(r)
                }
            }
        }
    }
    format(e, t, r) {
        switch (this.colorToVector(r + " <- " + t)) {
            case "f <- v2":
                return e + ".x";
            case "f <- v3":
                return e + ".x";
            case "f <- v4":
                return e + ".x";
            case "f <- i":
            case "f <- b":
                return "float( " + e + " )";
            case "v2 <- f":
                return "vec2( " + e + " )";
            case "v2 <- v3":
                return e + ".xy";
            case "v2 <- v4":
                return e + ".xy";
            case "v2 <- i":
            case "v2 <- b":
                return "vec2( float( " + e + " ) )";
            case "v3 <- f":
                return "vec3( " + e + " )";
            case "v3 <- v2":
                return "vec3( " + e + ", 0.0 )";
            case "v3 <- v4":
                return e + ".xyz";
            case "v3 <- i":
            case "v3 <- b":
                return "vec2( float( " + e + " ) )";
            case "v4 <- f":
                return "vec4( " + e + " )";
            case "v4 <- v2":
                return "vec4( " + e + ", 0.0, 1.0 )";
            case "v4 <- v3":
                return "vec4( " + e + ", 1.0 )";
            case "v4 <- i":
            case "v4 <- b":
                return "vec4( float( " + e + " ) )";
            case "i <- f":
            case "i <- b":
                return "int( " + e + " )";
            case "i <- v2":
                return "int( " + e + ".x )";
            case "i <- v3":
                return "int( " + e + ".x )";
            case "i <- v4":
                return "int( " + e + ".x )";
            case "b <- f":
                return "( " + e + " != 0.0 )";
            case "b <- v2":
                return "( " + e + " != vec2( 0.0 ) )";
            case "b <- v3":
                return "( " + e + " != vec3( 0.0 ) )";
            case "b <- v4":
                return "( " + e + " != vec4( 0.0 ) )";
            case "b <- i":
                return "( " + e + " != 0 )"
        }
        return e
    }
    getTypeByFormat(e) {
        return SF[e] || e
    }
    getFormatByType(e) {
        return MF[e] || e
    }
    getUUID(e, t) {
        return t = t !== void 0 ? t : !0, t && this.cache && (e = this.cache + "-" + e), e
    }
    getElementByIndex(e) {
        return J1[e]
    }
    getIndexByElement(e) {
        return J1.indexOf(e)
    }
    isShader(e) {
        return this.shader === e
    }
    setShader(e) {
        return this.shader = e, this
    }
    mergeDefines(e) {
        for (let t in e) this.defines[t] = e[t];
        return this.defines
    }
    mergeUniform(e) {
        for (let t in e) this.uniforms[t] = e[t];
        return this.uniforms
    }
    getTextureEncodingFromMap(e) {
        let t;
        return e ? e.isTexture && (t = e.encoding) : t = xn, t === xn && this.context.gamma && (t = We), t
    }
};

