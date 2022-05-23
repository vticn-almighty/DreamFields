import ShapeWrap from '../../ShapeWrap'
import {
    VectorGeometry
}
    from './VectorGeometry'

export class PolygonGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var n, s, o, a;
        let t = Object.assign({},
            (n = e == null ? void 0 : e.parameters) != null ? n : {
                width: 100,
                depth: 0,
                spikes: 5,
                cornerRadius: 0,
                extrudeDepth: 0,
                extrudeBevelSize: 0,
                extrudeBevelSegments: 3
            },
            i.parameters);
        return {
            shape: i.shape && i.shape instanceof ShapeWrap ? i.shape : new ShapeWrap,
            parameters: Object.assign(t, {
                surfaceMaxCount: ((s = t.surfaceMaxCount) != null ? s : t.cornerRadius > 0) ? 1e3 : 100,
                width: Math.abs(t.width),
                height: Math.abs((o = t.height) != null ? o : t.width),
                depth: Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth : (a = t.depth) != null ? a : 0)
            })
        }
    }
    static build(i) {
        let {
            width: e,
            height: t,
            spikes: r,
            cornerRadius: n,
            depth: s,
            extrudeBevelSize: o,
            extrudeBevelSegments: a,
            surfaceMaxCount: l
        } = i.parameters;
        c = i.shape;
        u = e * .5;
        h = t * .5,
            d = 0;
        f = 0,
            p = 2 * Math.PI / r;
        for (let x = 0; x < r; x++) {
            let y = p * x,
                m = d + Math.sin(y) * u,
                v = f + Math.cos(y) * h;
            c.addPoint(c.createPoint(m, v))
        }
        c.isClosed = !0;
        for (let x = 0, y = c.points.length; x < y; x++) c.points[x].roundness = n;
        c.roundness = n,
            c.update();
        let g = VectorGeometry.create({
            shape: c,
            parameters: {
                surfaceMaxCount: l,
                roundness: n,
                depth: s,
                extrudeBevelSize: o,
                extrudeBevelSegments: a
            }
        });
        return Object.assign(g, {
            userData: {
                ...i,
                type: "PolygonGeometry"
            }
        })
    }
};