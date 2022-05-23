

import Node from '../Node'

class Raw extends Node {
    constructor(e = new Node) {
        super("v4");
        this.nodeType = "Raw";
        this.value = e
    }
    generate(e) {
        let t = this.value.analyzeAndFlow(e, this.type),
            r = t.code + `
`;
        return e.isShader("vertex") ? r += "gl_Position = " + t.result + ";" : r += "gl_FragColor = " + t.result + ";", r
    }
    copy(e) {
        return super.copy(e), this.value.copy(e.value), this
    }
};

export { Raw }