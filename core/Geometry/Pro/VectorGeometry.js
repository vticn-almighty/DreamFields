import ShapeWrap from '../../ShapeWrap'
import {
    VoShapeGeometry,
    RvShapeGeometry
}
    from '../../Geometry/Base/GeometryBase'
export class VectorGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var c, u, h, d, f, p, g;
        let t = Object.assign({},
            (c = e == null ? void 0 : e.parameters) != null ? c : {
                width: 100,
                subdivisions: 40,
                roundness: 0,
                extrudeDepth: 0,
                surfaceMaxCount: 100,
                extrudeBevelSize: 0,
                extrudeBevelSegments: 3
            },
            i.parameters),
            r = Math.abs(t.width),
            n = Math.abs((u = t.height) != null ? u : t.width),
            s = Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth : (h = t.depth) != null ? h : 0),
            o = (d = i.shape) != null ? d : e == null ? void 0 : e.shape,
            a = (f = o == null ? void 0 : o.roundness) != null ? f : t.roundness;
        o !== void 0 && (o instanceof ShapeWrap ? (o.width !== r || o.height !== n) && o.applySize(r, n) : o = new ShapeWrap(r, n).fromJSON(o), ((p = i.parameters) == null ? void 0 : p.roundness) !== void 0 && ((g = i.parameters) == null ? void 0 : g.roundness) > 0 && o.update(!1));
        let l = o != null ? o : new ShapeWrap(r, n);
        return {
            parameters: Object.assign(t, {
                width: r,
                height: n,
                depth: s,
                extrudeDepth: s,
                roundness: a
            }),
            shape: l
        }
    }
    static build(i) {
        let {
            extrudeDepth: e,
            extrudeBevelSize: t,
            extrudeBevelSegments: r,
            subdivisions: n,
            roundness: s,
            surfaceMaxCount: o
        } = i.parameters;
        i.shape.roundness = s;
        let a;
        e <= 0 ? a = new VoShapeGeometry(i.shape, n, o) : a = new RvShapeGeometry(i.shape, e, t, n, r);
        return Object.assign(a, {
            userData: {
                ...i,
                type: "VectorGeometry"
            }
        })
    }
};