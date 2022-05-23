import { BlendFunction } from 'postprocessing'
export default class Effect{
    constructor(e, t) {
        this.enabled = !1;
        this.effect = new e(t), Object.defineProperty(this, "opacity", {
            enumerable: !0,
            set(r) {
                this.effect.blendMode.opacity.value = r
            },
            get() {
                return this.effect.blendMode.opacity.value
            }
        }), Object.defineProperty(this, "blendFunction", {
            enumerable: !0,
            set(r) {
                this.effect.blendMode.setBlendFunction(Number(r))
            },
            get() {
                return this.effect.blendMode.blendFunction
            }
        }), this.blendFunction = BlendFunction.NORMAL
    }
    toJSON() {
        let e = ["constructor", "effect", "subscriptions"],
            t = { ...this },
            r = Object.getPrototypeOf(this),
            n = Object.getOwnPropertyNames(r);
        for (let s of n) {
            let o = Object.getOwnPropertyDescriptor(r, s);
            o && typeof o.get == "function" && (t[s] = this[s])
        }
        return e.forEach(s => delete t[s]), t
    }
};

