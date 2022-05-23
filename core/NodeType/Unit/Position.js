



import NodeTemp from '../NodeTemp'


class Position extends NodeTemp {
    constructor(e) {
        super("v3");
        this.nodeType = "Position";
        this.scope = e != null ? e : Position.LOCAL
    }
    getType() {
        switch (this.scope) {
            case Position.PROJECTION:
                return "v4"
        }
        return this.type
    }
    getShader() {
        switch (this.scope) {
            case Position.LOCAL:
            case Position.WORLD:
                return !1
        }
        return !0
    }
    generate(e, t, r, n, s) {
        let o;
        switch (this.scope) {
            case Position.LOCAL:
                e.isShader("vertex") ? o = "transformed" : (e.requires.position = !0, o = "vPosition");
                break;
            case Position.WORLD:
                if (e.isShader("vertex")) return "( modelMatrix * vec4( transformed, 1.0 ) ).xyz";
                e.requires.worldPosition = !0, o = "vWPosition";
                break;
            case Position.VIEW:
                o = e.isShader("vertex") ? "-mvPosition.xyz" : "vViewPosition";
                break;
            case Position.PROJECTION:
                o = e.isShader("vertex") ? "( projectionMatrix * modelViewMatrix * vec4( position, 1.0 ) )" : "vec4( 0.0 )";
                break
        }
        return e.format(o, this.getType(), t)
    }
    copy(e) {
        return super.copy(e), this.scope = e.scope, this
    }
    toJSON(e) {
        let t = this.getJSONNode(e);
        return t || (t = this.createJSONNode(e), t.scope = this.scope), t.nodeType = this.nodeType, t
    }
    fromJSON(e, t) {
        return super.fromJSON(e, t), e.scope && (this.scope = e.scope), this
    }
}
Position.LOCAL = "local", Position.WORLD = "world";
Position.VIEW = "view", Position.PROJECTION = "projection";




export { Position }

