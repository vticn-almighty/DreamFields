




import NodeTemp from '../NodeTemp'
import Node from '../Node'
import { LinearEncoding, sRGBEncoding } from 'three';
import { Function } from './Function';


class ColorSpace extends NodeTemp {
    constructor(e = new Node, t) {
        super("v4");
        this.nodeType = "ColorSpace";
        this.factor = new Node;
        this.input = e;
        this.method = t != null ? t : ColorSpace.LINEAR_TO_LINEAR;
        this.hashProperties = ["method"]
    }
    static getEncodingComponents(e) {
        switch (e) {
            case LinearEncoding:
                return ["Linear"];
            case sRGBEncoding:
                return ["sRGB"];
            default:
                return []
        }
    }
    generate(e, t) {
        var a;
        let r = this.input.build(e, "v4"),
            n = this.getType(e),
            s = ColorSpace.Nodes[this.method],
            o = e.include(s);
        if (o === ColorSpace.LINEAR_TO_LINEAR) return e.format(r, n, t);
        if (((a = s.inputs) == null ? void 0 : a.length) === 2) {
            let l = this.factor.build(e, "f");
            return e.format(o + "( " + r + ", " + l + " )", n, t)
        } else return e.format(o + "( " + r + " )", n, t)
    }
    fromEncoding(e) {
        let t = ColorSpace.getEncodingComponents(e);
        this.method = "LinearTo" + t[0], this.factor = t[1]
    }
    fromDecoding(e) {
        let t = ColorSpace.getEncodingComponents(e);
        this.method = t[0] + "ToLinear", this.factor = t[1]
    }
    copy(e) {
        return super.copy(e), this.input.copy(e.input), this.method = e.method, this.factor.copy(e.factor), this
    }
}


ColorSpace.Nodes = {
    LinearToLinear: new Function(["vec4 LinearToLinear( in vec4 value ) {", "	return value;", "}"].join(`
`)),
    sRGBToLinear: new Function(["vec4 sRGBToLinear( in vec4 value ) {", "	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.w );", "}"].join(`
`)),
    LinearTosRGB: new Function(["vec4 LinearTosRGB( in vec4 value ) {", "	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.w );", "}"].join(`
`))
}, ColorSpace.LINEAR_TO_LINEAR = "LinearToLinear", ColorSpace.SRGB_TO_LINEAR = "sRGBToLinear", ColorSpace.LINEAR_TO_SRGB = "LinearTosRGB";


export { ColorSpace }