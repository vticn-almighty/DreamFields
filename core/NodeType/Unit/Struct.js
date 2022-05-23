import NodeTemp from '../NodeTemp'
let xF = new RegExp(`^structs*([a-z_0-9]+)s*{s*((.|
    )*?)}`, "gim")
let vF = new RegExp("s*(w*?)s*(w*?)(=|,)", "gim")

class Struct extends NodeTemp {
    constructor(e = "") {
        super();
        this.inputs = [];
        this.src = "";
        this.nodeType = "Struct";
        this.parse(e)
    }
    getType(e) {
        return e.getTypeByFormat(this.name)
    }
    getInputByName(e) {
        let t = this.inputs.length;
        for (; t--;)
            if (this.inputs[t].name === e) return this.inputs[t]
    }
    generate(e, t, r, n, s) {
        return t === "source" ? this.src + ";" : e.format("( " + this.src + " )", this.getType(e), t)
    }
    parse(e = "") {
        this.src = e, this.inputs = [];
        let t = xF.exec(e);
        if (t) {
            let r = t[2],
                n;
            for (; n = vF.exec(r);) this.inputs.push({
                type: n[1],
                name: n[2]
            });
            this.name = t[1]
        } else this.name = "";
        this.type = this.name
    }
};

export { Struct }