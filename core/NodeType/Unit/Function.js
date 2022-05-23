


import NodeTemp from '../NodeTemp'
import kw from '../../normal/Keywords'
let gF = /^\s*([a-z_0-9]+)\s([a-z_0-9]+)\s*\((.*?)\)/i
let X1 = /[a-z_0-9]+/gi

class Function extends NodeTemp {
    constructor(e, t, r, n, s) {
        super(s);
        this.src = "";
        this.nodeType = "Function";
        this.useKeywords = !0;
        this.includes = [];
        this.extensions = {};
        this.keywords = {};
        this.isMethod = s === void 0, this.isInterface = !1, this.parse(e, t, r, n)
    }
    getShared(e, t) {
        return !this.isMethod
    }
    getType(e) {
        return e.getTypeByFormat(this.type)
    }
    getInputByName(e) {
        if (this.inputs) {
            let t = this.inputs.length;
            for (; t--;)
                if (this.inputs[t].name === e) return this.inputs[t]
        }
    }
    getIncludeByName(e) {
        if (this.includes) {
            let t = this.includes.length;
            for (; t--;)
                if (this.includes[t].name === e) return this.includes[t]
        }
    }
    generate(e, t, r, n, s) {
        let o, a = 0,
            l = this.src;
        if (this.includes)
            for (let u = 0; u < this.includes.length; u++) e.include(this.includes[u], this);
        for (let u in this.extensions) e.extensions[u] = !0;
        let c = [];
        for (; o = X1.exec(this.src);) c.push(o);
        for (let u = 0; u < c.length; u++) {
            let h = c[u],
                d = h[0],
                f = this.isMethod ? !this.getInputByName(d) : !0,
                p = d;
            if (this.keywords[d] || this.useKeywords && f && kw.containsKeyword(d)) {
                let g = this.keywords[d];
                if (!g) {
                    let x = kw.getKeywordData(d);
                    x.cache && (g = e.keywords[d]), g = g || kw.getKeyword(d, e), x.cache && (e.keywords[d] = g)
                }
                p = g.build(e)
            }
            d !== p && (l = l.substring(0, h.index + a) + p + l.substring(h.index + d.length + a),
                a += p.length - d.length), this.getIncludeByName(p) === void 0 && kw.contains(p) && e.include(kw.get(p))
        }
        return t === "source" ? l : this.isMethod ? (this.isInterface || e.include(this, void 0, l), this.name) : e.format("( " + l + " )", this.getType(e), t)
    }
    parse(e, t, r, n) {
        if (this.src = e || "", this.includes = t != null ? t : [], this.extensions = r != null ? r : {}, this.keywords = n != null ? n : {}, this.isMethod) {
            let s = gF.exec(this.src);
            if (this.inputs = [], s && s.length == 4) {
                this.type = s[1], this.name = s[2];
                let o = s[3].match(X1);
                if (o) {
                    let a = 0;
                    for (; a < o.length;) {
                        let l = o[a++],
                            c;
                        l === "in" || l === "out" || l === "inout" ? c = o[a++] : (c = l, l = "");
                        let u = o[a++];
                        this.inputs.push({
                            name: u,
                            type: c,
                            qualifier: l
                        })
                    }
                }
                this.isInterface = this.src.indexOf("{") === -1
            } else this.type = "", this.name = ""
        }
    }
    copy(e) {
        return super.copy(e), this.isMethod = e.isMethod, this.useKeywords = e.useKeywords, e.type !== void 0 && (this.type = e.type), this.parse(e.src, e.includes, e.extensions, e.keywords), this
    }
    toJSON(e) {
        var r;
        let t = this.getJSONNode(e);
        if (!t) {
            t = this.createJSONNode(e);
            t.src = this.src, t.isMethod = this.isMethod;
            t.useKeywords = this.useKeywords, this.isMethod || (t.type = this.type);
            t.extensions = JSON.parse(JSON.stringify(this.extensions));
            let n = {};
            for (let s in this.keywords) n[s] = this.keywords[s].toJSON(e).uuid;
            if (t.keywords = n, (r = this.includes) == null ? void 0 : r.length) {
                let s = [];
                for (let o = 0; o < this.includes.length; o++) s.push(this.includes[o].toJSON(e).uuid);
                t.includes = s
            }
            t.isMethod = this.isMethod, t.inputs = this.inputs
        }
        return t.nodeType = this.nodeType, t
    }
    fromJSON(e, t) {
        if (super.fromJSON(e, t), e.inputs !== void 0 && (this.inputs = e.inputs), e.isMethod !== void 0 && (this.isMethod = e.isMethod), e.src && (this.src = e.src), e.isMethod && (this.isMethod = e.isMethod), e.useKeywords && (this.useKeywords = e.useKeywords), e.type && (this.type = e.type), e.extensions && (this.extensions = e.extensions), e.keywords && t) {
            this.keywords = {};
            for (let r in e.keywords) this.keywords[r] = t.getNode(e.keywords[r])
        }
        return e.includes && t && (this.includes = e.includes.map(r => t.getNode(r))), this
    }
};


export { Function }