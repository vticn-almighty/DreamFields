
export default class Layer{
    constructor(e, t, r, n) {
        this.next = void 0;
        this.uniforms = {};
        this.textures = {};
        this.defines = {};
        if (this.id = e, this.uuid = t, r) {
            this.type = r.type;
            for (let s in r) s !== "type" && s !== "calpha" && (this.uniforms[`f${this.id}_${s}`] = r[s]);
            for (let s in n) this.defines[s] = n[s]
        }
    }
    copy(e) {
        this.id = e.id, this.type = e.type, this.defines = { ...e.defines }
        for (let t in e.uniforms) this.getName(t) === "transmissionSamplerMap" || this.getName(t) === "transmissionDepthMap" || (this.uniforms[t] ? this.uniforms[t].copy(e.uniforms[t]) : this.uniforms[t] = e.uniforms[t].clone());
        return this
    }

    copyUniforms(e) {
        for (let t in this.uniforms) {
            let r = this.getName(t);
            r !== void 0 && e.uniforms[`f${e.id}_${r}`] && r !== "transmissionDepthMap" && r !== "transmissionSamplerMap" && this.uniforms[t].copy(e.uniforms[`f${e.id}_${r}`])
        }
        return this
    }
    hasValueByKey(e) {
        return this.uniforms[e] !== void 0
    }
    hasValue(e) {
        return this.hasValueByKey(`f${this.id}_${e}`)
    }
    setValue(e, t) {
        let r = `f${this.id}_${e}`;
        this.hasValueByKey(r) && t !== void 0 && (this.uniforms[r].value = t)
    }
    getValue(e) {
        let t = `f${this.id}_${e}`;
        if (this.hasValueByKey(t)) return this.uniforms[t].value
    }
    getValues() {
        let e = {
            type: this.type
        };
        for (let t in this.uniforms) {
            let r = this.getName(t);
            if (r === void 0) continue;
            let s = this.uniforms[`f${this.id}_${r}`].value;
            s !== void 0 && (Array.isArray(s) ? e[r] = s.map(o => o.clone ? o.clone() : o) : e[r] = s.clone ? s.clone() : s)
        }
        return e
    }
    getName(e) {
        let r = /f\d+_(.*)/.exec(e);
        if (r && r.length > 1) return r[1];
        console.log(`Layer.getName:DoubleSideror ${e}`)
    }
    getNames() {
        let e = [];
        for (let t in this.uniforms) {
            let r = this.getName(t);
            r && e.push(r)
        }
        return e
    }
    isEqual(e) {
        for (let t in e.uniforms) {
            let r = e.getName(t);
            if (!r) return !1;
            let n = this.getValue(r),
                s = e.uniforms[t].value;
            if (s.value instanceof Texture) {
                if (n.image !== s.image) return !1
            } else if (Array.isArray(s)) {
                let o = n;
                for (let a = 0, l = o.length; a < l; ++a)
                    if (o[a] !== s[a]) return !1
            } else {
                let o = n;
                if (o.equals) {
                    if (!o.equals(s)) return !1
                } else if (n !== s) return !1
            }
        }
        return !0
    }
    dispose() { }
};



