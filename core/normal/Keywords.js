import { UV, Normal, Position } from '../nodeType/Unit'

export class Keywords {
    constructor() {
        this.nodes = {};
        this.keywords = {}
    }
    add(e) {
        this.nodes[e.name] = e
    }
    addKeyword(e, t, r) {
        r = r !== void 0 ? r : !0, this.keywords[e] = {
            callback: t,
            cache: r
        }
    }
    remove(e) {
        delete this.nodes[e.name]
    }
    removeKeyword(e) {
        delete this.keywords[e]
    }
    get(e) {
        return this.nodes[e]
    }
    getKeyword(e, t) {
        return this.keywords[e].callback(t)
    }
    getKeywordData(e) {
        return this.keywords[e]
    }
    contains(e) {
        return this.nodes[e] !== void 0
    }
    containsKeyword(e) {
        return this.keywords[e] !== void 0
    }
}





const kw = new Keywords;
export default kw;

kw.addKeyword("uv", function () {
    return new UV
});
kw.addKeyword("uv2", function () {
    return new UV(1)
});

kw.addKeyword("viewNormal", function () {
    return new Normal(Normal.VIEW)
});
kw.addKeyword("localNormal", function () {
    return new Normal(Normal.NORMAL)
});
kw.addKeyword("worldNormal", function () {
    return new Normal(Normal.WORLD)
});

kw.addKeyword("position", function () {
    return new Position
});
kw.addKeyword("worldPosition", function () {
    return new Position(Position.WORLD)
});
kw.addKeyword("viewPosition", function () {
    return new Position(Position.VIEW)
});

