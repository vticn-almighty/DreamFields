import { Vector2 } from 'three'
import Effect from './normal/Effect'
import { PixelationEffect, DepthOfFieldEffect, BrightnessContrastEffect, HueSaturationEffect, ColorAverageEffect, NoiseEffect, VignetteEffect, ChromaticAberrationEffect, BlendFunction, BloomEffect } from 'postprocessing'

class BloomEffect extends Effect {
    constructor() {
        super(BloomEffect);
        this.blendFunction = BlendFunction.SCREEN
    }
    set intensity(e) {
        this.effect.intensity = e
    }
    get intensity() {
        return this.effect.intensity
    }
    set luminanceThreshold(e) {
        this.effect.luminanceMaterial.threshold = e
    }
    get luminanceThreshold() {
        return this.effect.luminanceMaterial.threshold
    }
    set luminanceSmoothing(e) {
        this.effect.luminanceMaterial.smoothing = e
    }
    get luminanceSmoothing() {
        return this.effect.luminanceMaterial.smoothing
    }
    set blurScale(e) {
        this.effect.blurPass.scale = e
    }
    get blurScale() {
        return this.effect.blurPass.scale
    }
    set kernelSize(e) {
        this.effect.blurPass.kernelSize = e
    }
    get kernelSize() {
        return this.effect.blurPass.kernelSize
    }
};

class BrightnessContrastEffect extends Effect {
    constructor() {
        super(BrightnessContrastEffect)
    }
    set contrast(e) {
        this.effect.uniforms.get("contrast").value = e
    }
    get contrast() {
        return this.effect.uniforms.get("contrast").value
    }
    set brightness(e) {
        this.effect.uniforms.get("brightness").value = e
    }
    get brightness() {
        return this.effect.uniforms.get("brightness").value
    }
};

class ChromaticAberrationEffect extends Effect {
    constructor() {
        super(ChromaticAberrationEffect);
        this.effect.offset = new Vector2(.01, .01)
    }
    set offset(e) {
        this.effect.offset.set(e[0] / 1e3, e[1] / 1e3)
    }
    get offset() {
        return [this.effect.offset.x * 1e3, this.effect.offset.y * 1e3]
    }
};

class ColorAverageEffect extends Effect {
    constructor() {
        super(ColorAverageEffect)
    }
};

class HueSaturationEffect extends Effect {
    constructor() {
        super(HueSaturationEffect);
        this._hue = 0
    }
    set hue(e) {
        this._hue = e, this.effect.setHue(e)
    }
    get hue() {
        return this._hue
    }
    set saturation(e) {
        this.effect.uniforms.get("saturation").value = e
    }
    get saturation() {
        return this.effect.uniforms.get("saturation").value
    }
};

class NoiseEffect extends Effect {
    constructor() {
        super(NoiseEffect);
        this.blendFunction = BlendFunction.OVERLAY
    }
};

class VignetteEffect extends Effect {
    constructor() {
        super(VignetteEffect)
    }
    get eskil() {
        return this.effect.eskil
    }
    set eskil(e) {
        this.effect.eskil = e
    }
    get darkness() {
        return this.effect.uniforms.get("darkness").value
    }
    set darkness(e) {
        this.effect.uniforms.get("darkness").value = e
    }
    get offset() {
        return this.effect.uniforms.get("offset").value
    }
    set offset(e) {
        this.effect.uniforms.get("offset").value = e
    }
};

class DepthOfFieldEffect extends Effect {
    constructor(e) {
        super(DepthOfFieldEffect, e)
    }
    set focalLength(e) {
        this.effect.circleOfConfusionMaterial.uniforms.focalLength.value = e
    }
    get focalLength() {
        return this.effect.circleOfConfusionMaterial.uniforms.focalLength.value
    }
    set focusDistance(e) {
        this.effect.circleOfConfusionMaterial.uniforms.focusDistance.value = e
    }
    get focusDistance() {
        return this.effect.circleOfConfusionMaterial.uniforms.focusDistance.value
    }
    get bokehScale() {
        return this.effect.bokehScale
    }
    set bokehScale(e) {
        this.effect.bokehScale = e
    }
};

class PixelationEffect extends Effect {
    constructor() {
        super(PixelationEffect)
    }
    get granularity() {
        return this.effect.getGranularity()
    }
    set granularity(e) {
        this.effect.setGranularity(e)
    }
};


export { BloomEffect, BrightnessContrastEffect, ChromaticAberrationEffect, ColorAverageEffect, HueSaturationEffect, NoiseEffect, VignetteEffect, DepthOfFieldEffect, PixelationEffect }