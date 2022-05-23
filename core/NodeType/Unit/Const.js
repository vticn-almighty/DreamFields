



import NodeTemp from '../NodeTemp'
let yF = /^([a-z_0-9]+)\s([a-z_0-9]+)\s?\=?\s?(.*?)(\,|$)/i

class Const extends NodeTemp {
    constructor(e = "", t) {
        super();
        this.src = "";
        this.useDefine = !1;
        this.nodeType = "Const";
        this.parse(e || Const.PI, void 0, void 0, void 0, t)
    }
    getType(e) {
        return e.getTypeByFormat(this.type)
    }
    parse(e, t, r, n, s) {
        this.src = e || "";
        let o, a, l = "",
            c = yF.exec(e);
        this.useDefine = s != null ? s : this.src.charAt(0) === "#";
        c && c.length > 1 ? (a = c[1], o = c[2], l = c[3]) : (o = this.src, a = "f");
        this.name = o;
        this.type = a;
        this.value = l;
    }
    build(e, t) {
        if (t === "source") {
            if (this.value) return this.useDefine ? "#define " + this.name + " " + this.value : "const " + this.type + " " + this.name + " = " + this.value + ";";
            if (this.useDefine) return this.src
        }
        return e.include(this), e.format(this.name, this.getType(e), t)
    }
    generate(e, t, r, n, s) {
        return e.format(this.name, this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.parse(e.src, void 0, void 0, void 0, e.useDefine), this
    }
};
Const.PI = "PI", Const.PI2 = "PI2", Const.RECIPROCAL_PI = "RECIPROCAL_PI", Const.RECIPROCAL_PI2 = "RECIPROCAL_PI2", Const.LOG2 = "LOG2", Const.EPSILON = "EPSILON";


export { Const }