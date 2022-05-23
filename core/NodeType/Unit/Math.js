import { MathEnum } from '../../Enum'
import NodeTemp from '../NodeTemp'
import Node from '../Node'

class Math extends NodeTemp {
    constructor(e = new Node, t = MathEnum.ABS, r, n) {
        super();
        this.nodeType = "Math";
        this.a = e, typeof t != "string" ? this.b = t : n = t,
            typeof r != "string" ? this.c = r : n = r, this.method = n,
            this.hashProperties = ["method"]
    }
    getNumInputs(e) {
        switch (this.method) {
            case MathEnum.MIX:
            case MathEnum.CLAMP:
            case MathEnum.REFRACT:
            case MathEnum.SMOOTHSTEP:
            case MathEnum.FACEFORWARD:
                return 3;
            case MathEnum.MIN:
            case MathEnum.MAX:
            case MathEnum.MOD:
            case MathEnum.STEP:
            case MathEnum.REFLECT:
            case MathEnum.DISTANCE:
            case MathEnum.DOT:
            case MathEnum.CROSS:
            case MathEnum.POW:
                return 2;
            default:
                return 1
        }
    }
    getInputType(e) {
        let t = e.getTypeLength(this.a.getType(e)),
            r = this.b ? e.getTypeLength(this.b.getType(e)) : 0,
            n = this.c ? e.getTypeLength(this.c.getType(e)) : 0;
        return t > r && t > n ? this.a.getType(e) : r > n ? this.b.getType(e) : this.c.getType(e)
    }
    getType(e) {
        switch (this.method) {
            case MathEnum.LENGTH:
            case MathEnum.DISTANCE:
            case MathEnum.DOT:
                return "f";
            case MathEnum.CROSS:
                return "v3"
        }
        return this.getInputType(e)
    }
    generate(e, t) {
        let r, n, s, o = this.a ? e.getTypeLength(this.a.getType(e)) : 0,
            a = this.b ? e.getTypeLength(this.b.getType(e)) : 0,
            l = this.c ? e.getTypeLength(this.c.getType(e)) : 0,
            c = this.getInputType(e),
            u = this.getType(e);
        switch (this.type = u, this.method) {
            case MathEnum.NEGATE:
                return e.format("( -" + this.a.build(e, c) + " )", c, t);
            case MathEnum.INVERT:
                return e.format("( 1.0 - " + this.a.build(e, c) + " )", c, t);
            case MathEnum.CROSS:
                r = this.a.build(e, "v3"), n = this.b.build(e, "v3");
                break;
            case MathEnum.STEP:
                r = this.a.build(e, o === 1 ? "f" : c), n = this.b.build(e, c);
                break;
            case MathEnum.MIN:
            case MathEnum.MAX:
            case MathEnum.MOD:
                r = this.a.build(e, c), n = this.b.build(e, a === 1 ? "f" : c);
                break;
            case MathEnum.REFRACT:
                r = this.a.build(e, c), n = this.b.build(e, c), s = this.c.build(e, "f");
                break;
            case MathEnum.MIX:
                r = this.a.build(e, c), n = this.b.build(e, c), s = this.c.build(e, l === 1 ? "f" : c);
                break;
            default:
                r = this.a.build(e, c), this.b && (n = this.b.build(e, c)), this.c && (s = this.c.build(e, c));
                break
        }
        let h = [];
        h.push(r), n && h.push(n), s && h.push(s);
        let d = this.getNumInputs(e);
        if (h.length !== d) throw Error(`Arguments not match used in "${this.method}". Require ${d}, currently ${h.length}.`);
        return e.format(this.method + "( " + h.join(", ") + " )", u, t)
    }
    copy(e) {
        return super.copy(e), this.a.copy(e.a), this.b = e.b instanceof Node ? e.b.clone() : e.b, this.c = e.c instanceof Node ? e.c.clone() : e.c, this.method = e.method, this
    }
}

let nt = Math;
nt.RAD = MathEnum.RAD, nt.DEG = MathEnum.DEG, nt.EXP = MathEnum.EXP, nt.EXP2 = MathEnum.EXP2,
    nt.LOG = MathEnum.LOG, nt.LOG2 = MathEnum.LOG2, nt.SQRT = MathEnum.SQRT,
    nt.INV_SQRT = MathEnum.INV_SQRT, nt.FLOOR = MathEnum.FLOOR, nt.CEIL = MathEnum.CEIL,
    nt.NORMALIZE = MathEnum.NORMALIZE, nt.FRACT = MathEnum.FRACT, nt.SATURATE = MathEnum.SATURATE,
    nt.SIN = MathEnum.SIN, nt.COS = MathEnum.COS, nt.TAN = MathEnum.TAN, nt.ASIN = MathEnum.ASIN,
    nt.ACOS = MathEnum.ACOS, nt.ARCTAN = MathEnum.ARCTAN, nt.ABS = MathEnum.ABS,
    nt.SIGN = MathEnum.SIGN, nt.LENGTH = MathEnum.LENGTH, nt.NEGATE = MathEnum.NEGATE,
    nt.INVERT = MathEnum.INVERT, nt.MIN = MathEnum.MIN, nt.MAX = MathEnum.MAX, nt.MOD = MathEnum.MOD,
    nt.STEP = MathEnum.STEP, nt.REFLECT = MathEnum.REFLECT, nt.DISTANCE = MathEnum.DISTANCE,
    nt.DOT = MathEnum.DOT, nt.CROSS = MathEnum.CROSS, nt.POW = MathEnum.POW, nt.MIX = MathEnum.MIX,
    nt.CLAMP = MathEnum.CLAMP, nt.REFRACT = MathEnum.REFRACT, nt.SMOOTHSTEP = MathEnum.SMOOTHSTEP,
    nt.FACEFORWARD = MathEnum.FACEFORWARD;


export { Math }