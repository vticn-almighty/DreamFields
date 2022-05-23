import { nTexture, nFloat } from '../ReadonlyUnit'
import { Reflect } from './Reflect'
import NodeTemp from '../NodeTemp'

class TextureCube extends NodeTemp {
    constructor(e = new nTexture, t, r) {
        super("v4");
        this.nodeType = "TextureCube";
        this.value = e;
        this.radianceNode = new TextureCubeUV(this.value, t != null ? t : new Reflect(Reflect.VECTOR), r);
        this.irradianceNode = new TextureCubeUV(this.value, new Normal(Normal.WORLD), new nFloat(1).setReadonly(!0))
    }
    generate(e, t) {
        return e.isShader("fragment") ? (e.require("irradiance"), e.context.bias && e.context.bias.setTexture(this.value),
            (e.slot === "irradiance" ? this.irradianceNode : this.radianceNode).build(e, t)) : (console.warn("TextureCubeNode is not compatible with " + e.shader + " shader."), e.format("vec4( 0.0 )", this.getType(e), t))
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this.radianceNode.copy(e.radianceNode), this.irradianceNode.copy(e.irradianceNode), this
    }
};


export { TextureCube }