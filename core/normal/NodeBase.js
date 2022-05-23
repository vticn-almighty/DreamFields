

export default class NodeBase {
    constructor(e) {
        e = e != null ? e : {}, this.name = e.name, this.type = e.type, this.node = e.node, this.size = e.size, this.needsUpdate = e.needsUpdate
    }
    get value() {
        return this.node.value
    }
    set value(e) {
        this.node.value = e
    }
};


