import { Lambert, Basic, Phong, Toon, Standard } from './NodeType/ShaderUnit'
import LightingNodeMaterial from './LightingNodeMaterial'


export class BasicNodeMaterial extends LightingNodeMaterial {
    get color() {
        return this.fragment.color
    }
    set color(e) {
        this.fragment.color = e
    }
    get afterColor() {
        return this.fragment.afterColor
    }
    set afterColor(e) {
        this.fragment.afterColor = e
    }
    get alpha() {
        return this.fragment.alpha
    }
    set alpha(e) {
        this.fragment.alpha = e
    }
    get shadingAlpha() {
        return this.fragment.shadingAlpha
    }
    set shadingAlpha(e) {
        this.fragment.shadingAlpha = e
    }
    get shadingBlend() {
        return this.fragment.shadingBlend
    }
    set shadingBlend(e) {
        this.fragment.shadingBlend = e
    }
    get position() {
        return this.fragment.position
    }
    set position(e) {
        this.fragment.position = e
    }
    constructor(e = new Basic, t) {
        super(e, e, t);
        this.type = "BasicNodeMaterial", this.fragment = e
    }
};



export class PhongNodeMaterial extends LightingNodeMaterial {
    get color() {
        return this.fragment.color
    }
    set color(e) {
        this.fragment.color = e
    }
    get afterColor() {
        return this.fragment.afterColor
    }
    set afterColor(e) {
        this.fragment.afterColor = e
    }
    get alpha() {
        return this.fragment.alpha
    }
    set alpha(e) {
        this.fragment.alpha = e
    }
    get shadingAlpha() {
        return this.fragment.shadingAlpha
    }
    set shadingAlpha(e) {
        this.fragment.shadingAlpha = e
    }
    get shadingBlend() {
        return this.fragment.shadingBlend
    }
    set shadingBlend(e) {
        this.fragment.shadingBlend = e
    }
    get position() {
        return this.fragment.position
    }
    set position(e) {
        this.fragment.position = e
    }
    get specular() {
        return this.fragment.specular
    }
    set specular(e) {
        this.fragment.specular = e
    }
    get shininess() {
        return this.fragment.shininess
    }
    set shininess(e) {
        this.fragment.shininess = e
    }
    constructor(e = new Phong, t) {
        super(e, e, t);
        this.type = "PhongNodeMaterial", this.fragment = e
    }
};



export class LambertNodeMaterial extends LightingNodeMaterial {
    get color() {
        return this.fragment.color
    }
    set color(e) {
        this.fragment.color = e
    }
    get afterColor() {
        return this.fragment.afterColor
    }
    set afterColor(e) {
        this.fragment.afterColor = e
    }
    get alpha() {
        return this.fragment.alpha
    }
    set alpha(e) {
        this.fragment.alpha = e
    }
    get shadingAlpha() {
        return this.fragment.shadingAlpha
    }
    set shadingAlpha(e) {
        this.fragment.shadingAlpha = e
    }
    get shadingBlend() {
        return this.fragment.shadingBlend
    }
    set shadingBlend(e) {
        this.fragment.shadingBlend = e
    }
    get position() {
        return this.fragment.position
    }
    set position(e) {
        this.fragment.position = e
    }
    get emissive() {
        return this.fragment.emissive
    }
    set emissive(e) {
        this.fragment.emissive = e
    }
    get emissiveIntensity() {
        return this.fragment.emissiveIntensity
    }
    set emissiveIntensity(e) {
        this.fragment.emissiveIntensity = e
    }
    constructor(e = new Lambert, t) {
        super(e, e, t);
        this.type = "LambertNodeMaterial", this.fragment = e
    }
};


export class ToonNodeMaterial extends LightingNodeMaterial {
    get color() {
        return this.fragment.color
    }
    set color(e) {
        this.fragment.color = e
    }
    get afterColor() {
        return this.fragment.afterColor
    }
    set afterColor(e) {
        this.fragment.afterColor = e
    }
    get alpha() {
        return this.fragment.alpha
    }
    set alpha(e) {
        this.fragment.alpha = e
    }
    get shadingAlpha() {
        return this.fragment.shadingAlpha
    }
    set shadingAlpha(e) {
        this.fragment.shadingAlpha = e
    }
    get shadingBlend() {
        return this.fragment.shadingBlend
    }
    set shadingBlend(e) {
        this.fragment.shadingBlend = e
    }
    get position() {
        return this.fragment.position
    }
    set position(e) {
        this.fragment.position = e
    }
    get specular() {
        return this.fragment.specular
    }
    set specular(e) {
        this.fragment.specular = e
    }
    get shininess() {
        return this.fragment.shininess
    }
    set shininess(e) {
        this.fragment.shininess = e
    }
    constructor(e = new Toon, t) {
        super(e, e, t);
        this.type = "ToonNodeMaterial", this.fragment = e
    }
};


export class StandardNodeMaterial extends LightingNodeMaterial {
    get color() {
        return this.fragment.color
    }
    set color(e) {
        this.fragment.color = e
    }
    get afterColor() {
        return this.fragment.afterColor
    }
    set afterColor(e) {
        this.fragment.afterColor = e
    }
    get alpha() {
        return this.fragment.alpha
    }
    set alpha(e) {
        this.fragment.alpha = e
    }
    get shadingAlpha() {
        return this.fragment.shadingAlpha
    }
    set shadingAlpha(e) {
        this.fragment.shadingAlpha = e
    }
    get shadingBlend() {
        return this.fragment.shadingBlend
    }
    set shadingBlend(e) {
        this.fragment.shadingBlend = e
    }
    get position() {
        return this.fragment.position
    }
    set position(e) {
        this.fragment.position = e
    }
    get roughness() {
        return this.fragment.roughness
    }
    set roughness(e) {
        this.fragment.roughness = e
    }
    get metalness() {
        return this.fragment.metalness
    }
    set metalness(e) {
        this.fragment.metalness = e
    }
    get reflectivity() {
        return this.fragment.reflectivity
    }
    set reflectivity(e) {
        this.fragment.reflectivity = e
    }
    constructor(e = new Standard, t) {
        super(e, e, t);
        this.type = "StandardNodeMaterial", this.fragment = e
    }
};