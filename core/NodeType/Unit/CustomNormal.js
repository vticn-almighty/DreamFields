import NodeTemp from '../NodeTemp'
import { Function } from './Function';

class CustomNormal extends NodeTemp {
    constructor(e, t) {
        super("v3");
        this.nodeType = "CustomNormal";
        this.cnormal = e, this.alpha = t
    }
    generate(e, t) {
        if (e.isShader("fragment")) {
            let r = e.include(CustomNormal.Nodes.customNormal),
                n = [];
            return n.push(this.cnormal.build(e, "v3")), n.push("normal"), n.push(this.alpha.build(e, "f")), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("CustomNormalNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.cnormal.copy(e.cnormal), this.alpha.copy(e.alpha), this
    }
}

CustomNormal.Nodes = function () {
    return {
        customNormal: new Function(/*glsl*/`
            vec3 customNormal(vec3 cnormal, vec3 norm, float alpha) {
				vec3 normal = packNormalToRGB( norm ).rgb;
				normal *= step( vec3(0.5), cnormal );

				accumAlpha += ( 1.0 - accumAlpha ) * alpha;

				return normal;
			}`)
    }
}();

export { CustomNormal }