import NodeTemp from '../NodeTemp'
import { Normal, Position } from '../Unit';

class Reflect extends NodeTemp {
    static CUBE = "cube";
    static SPHERE = "sphere";
    static VECTOR = "vector";


    constructor(e) {
        super("v3");
        this.nodeType = "Reflect";
        this.scope = e != null ? e : Reflect.CUBE
    }
    getUnique(e) {
        return !e.context.viewNormal
    }
    getType() {
        switch (this.scope) {
            case Reflect.SPHERE:
                return "v2"
        }
        return this.type
    }
    generate(e, t) {
        let r = this.getUnique(e);
        if (e.isShader("fragment")) {
            let n;
            switch (this.scope) {
                case Reflect.VECTOR: {
                    let s = new Normal(Normal.VIEW),
                        o = e.context.roughness,
                        a = s.build(e, "v3"),
                        l = new Position(Position.VIEW).build(e, "v3"),
                        c = o ? o.build(e, "f") : void 0,
                        u = `reflect( -normalize( ${l} ), ${a} )`;
                    c && (u = `normalize( mix( ${u}, ${a}, ${c} * ${c} ) )`);
                    let h = `inverseTransformDirection( ${u}, viewMatrix )`;
                    r ? (e.addNodeCode(`vec3 reflectVec = ${h};`), n = "reflectVec") : n = h;
                    break
                }
                case Reflect.CUBE: {
                    let s = new Reflect(Reflect.VECTOR).build(e, "v3"),
                        o = "vec3( -" + s + ".x, " + s + ".yz )";
                    r ? (e.addNodeCode(`vec3 reflectCubeVec = ${o};`), n = "reflectCubeVec") : n = o;
                    break
                }
                case Reflect.SPHERE: {
                    let s = new Reflect(Reflect.VECTOR).build(e, "v3"),
                        o = "normalize( ( viewMatrix * vec4( " + s + ", 0.0 ) ).xyz + vec3( 0.0, 0.0, 1.0 ) ).xy * 0.5 + 0.5";
                    r ? (e.addNodeCode(`vec2 reflectSphereVec = ${o};`), n = "reflectSphereVec") : n = o;
                    break
                }
            }
            return e.format(n, this.getType(), t)
        } else return console.warn("ReflectNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.type, t)
    }
    copy(e) {
        return super.copy(e), this.scope = e.scope, this
    }
    toJSON(e) {
        let t = this.getJSONNode(e);
        return t || (t = this.createJSONNode(e), t.scope = this.scope), t.nodeType = this.nodeType, t
    }
    fromJSON(e, t) {
        return super.fromJSON(e, t), e.scope && (this.scope = e.scope), this
    }
}

export { Reflect }