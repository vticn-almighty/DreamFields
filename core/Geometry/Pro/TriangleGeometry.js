import ShapeWrap from '../../ShapeWrap';
import {
    VectorGeometry
}
    from './VectorGeometry'

export class TriangleGeometry {
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
                extrudeBevelSegments: 1,
                isRect: !1
            },
            i.parameters);
        return {
            shape: i.shape && i.shape instanceof ShapeWrap ? i.shape : new ShapeWrap,
            parameters: Object.assign(t, {
                surfaceMaxCount: ((s = t.surfaceMaxCount) != null ? s : t.cornerRadius > 0) ? 1e3 : 100,
                width: Math.abs(t.width),
                height: Math.abs((o = t.height) != null ? o : t.width * (t.isRect ? 1 : Math.sqrt(3) / 2)),
                depth: Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth : (a = t.depth) != null ? a : 0)
            })
        }
    }
    static build(i) {
        let {
            width: e = 100,
            height: t,
            cornerRadius: r,
            depth: n,
            extrudeBevelSize: s,
            extrudeBevelSegments: o,
            isRect: a,
            surfaceMaxCount: l
        } = i.parameters,
            c = i.shape,
            u = e * .5,
            h = t * .5;
        a ? (c.addPoint(c.createPoint(- u, h)), c.addPoint(c.createPoint(u, -h)), c.addPoint(c.createPoint(- u, -h))) : (c.addPoint(c.createPoint(0, h)), c.addPoint(c.createPoint(u, -h)), c.addPoint(c.createPoint(- u, -h))),
            c.isClosed = !0;
        for (let f = 0, p = c.points.length; f < p; f++) c.points[f].roundness = r;
        c.roundness = r,
            c.update();
        let d = VectorGeometry.create({
            shape: c,
            parameters: {
                surfaceMaxCount: l,
                roundness: r,
                depth: n,
                extrudeBevelSize: s,
                extrudeBevelSegments: o
            }
        });
        return Object.assign(d, {
            userData: {
                ...i,
                type: "TriangleGeometry"
            }
        })
    }
};