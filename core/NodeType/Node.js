
import { MathUtils } from 'three'


export default class Node{
    constructor(e) {
        this.hashProperties = void 0;
        this.isNode = !0;
        this.shortcuts = {};
        this.uuid = MathUtils.generateUUID();
        this.type = e;
        this.name = "";
        this.userData = {}
    }
    analyze(e, t) {
        t = t != null ? t : {}, e.analyzing = !0, this.build(e.addFlow(t.slot, t.cache, t.context), "v4"), e.clearVertexNodeCode(), e.clearFragmentNodeCode(), e.removeFlow(), e.analyzing = !1
    }
    analyzeAndFlow(e, t, r) {
        return r = r != null ? r : {}, this.analyze(e, r), this.flow(e, t, r)
    }
    flow(e, t, r) {
        r = r != null ? r : {}, e.addFlow(r.slot, r.cache, r.context);
        let n = {
            result: this.build(e, t),
            code: e.clearNodeCode(),
            extra: e.context.extra
        };
        return e.removeFlow(), n
    }
    build(e, t, r) {
        t = t != null ? t : this.getType(e, t);
        let n = e.getNodeData(r != null ? r : this);
        return e.analyzing && this.appendDepsNode(e, n, t), e.nodes.indexOf(this) === -1 && e.nodes.push(this), this.updateFrame !== void 0 && e.updaters.indexOf(this) === -1 && e.updaters.push(this), this.generate(e, t, r)
    }
    updateFrame(e) { }
    generateReadonly(e, t, r, n, s, o) {
        return ""
    }
    generate(e, t, r, n, s) {
        return ""
    }
    parse(e, t, r, n) { }
    appendDepsNode(e, t, r) {
        t.deps = (t.deps || 0) + 1;
        let n = e.getTypeLength(r);
        (n > (t.outputMax || 0) || this.getType(e, r)) && (t.outputMax = n, t.output = r)
    }
    setName(e) {
        this.name = e
    }
    getName() {
        return this.name
    }
    getType(e, t) {
        return t === "sampler2D" || t === "samplerCube" ? t : this.type
    }
    getJSONNode(e) {
        if ((e == null ? void 0 : e.materials) && (e == null ? void 0 : e.materials[this.uuid]) !== void 0) return e.materials[this.uuid]
    }
    getHash() {
        let e = "{",
            t, r;
        for (t in this) r = this[t], r instanceof Node && (e += '"' + t + '":' + r.getHash() + ",");
        if (this.hashProperties)
            for (let n = 0; n < this.hashProperties.length; n++) t = this.hashProperties[n], r = this[t], e += '"' + t + '":"' + String(r) + '",';
        return e += '"id":"' + this.uuid + '"}', e
    }
    copy(e) {
        return this.name = e.name, e.type && (this.type = e.type), e.frameId && (this.frameId = e.frameId), e.hashProperties && (this.hashProperties = e.hashProperties.map(t => t)), this.userData = JSON.parse(JSON.stringify(e.userData)), this.shortcuts = JSON.parse(JSON.stringify(e.shortcuts)), this
    }
    clone() {
        return new this.constructor().copy(this)
    }
    createJSONNode(e) {
        let t = e === void 0 || typeof e == "string";
        if (typeof this.type != "string") throw new Error("Node does not allow serialization.");
        let r = {};
        return r.uuid = this.uuid, r.type = this.type, this.name !== "" && (r.name = this.name), JSON.stringify(this.userData) !== "{}" && (r.userData = this.userData), !t && e && (e.nodes[this.uuid] = r), r
    }
    toJSON(e) {
        var t;
        return (t = this.getJSONNode(e)) != null ? t : this.createJSONNode(e)
    }
    fromJSON(e, t) {
        return this.uuid = e.uuid, this.type = e.type, e.name && (this.name = e.name), e.userData && (this.userData = e.userData), this
    }
};



