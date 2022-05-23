import {
    VectorGeometry
}
    from './VectorGeometry';
import ShapeWrap from '../../ShapeWrap';
export class RectangleGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var o, a, l, c, u;
        let t = Object.assign({},
            (o = e == null ? void 0 : e.parameters) != null ? o : {
                width: 100,
                depth: 0,
                cornerRadius: [0, 0, 0, 0],
                cornerType: 1,
                extrudeDepth: 0,
                extrudeBevelSize: 0,
                extrudeBevelSegments: 1
            },
            i.parameters),
            r = Object.assign((a = e == null ? void 0 : e.ui) != null ? a : {
                enabledIndieCorners: !1
            },
                i.ui),
            n = t.cornerRadius.reduce((h, d) => h + d, 0);
        return {
            shape: i.shape && i.shape instanceof ShapeWrap ? i.shape : new ShapeWrap,
            parameters: Object.assign(t, {
                surfaceMaxCount: ((l = t.surfaceMaxCount) != null ? l : n > 0) ? 1e3 : 100,
                width: Math.abs(t.width),
                height: Math.abs((c = t.height) != null ? c : t.width),
                depth: Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth : (u = t.depth) != null ? u : 0)
            }),
            ui: r
        }
    }
    static build(i) {
        let e = i.shape,
            {
                width: t,
                height: r,
                cornerRadius: n,
                cornerType: s,
                depth: o,
                extrudeBevelSize: a,
                extrudeBevelSegments: l,
                surfaceMaxCount: c
            } = i.parameters,
            u = {
                x: t * .5,
                y: r * .5
            },
            h = {
                x: -u.x,
                y: -u.y
            },
            d = {
                x: u.x,
                y: u.y
            };

        function f(b, T, _) {
            return T > t && _ > r ? Math.min(b * t / T, b * r / _) : T > t ? b * t / T : _ > r ? b * r / _ : b
        }
        let p = [];
        p[0] = n[0] === 0 ? 0 : f(n[0], n[0] + n[3], n[0] + n[1]),
            p[1] = n[1] === 0 ? 0 : f(n[1], n[1] + n[2], n[1] + n[0]);
        p[2] = n[2] === 0 ? 0 : f(n[2], n[2] + n[1], n[2] + n[3]),
            p[3] = n[3] === 0 ? 0 : f(n[3], n[3] + n[0], n[3] + n[2]);
        let g = h.x,
            x = d.x,
            y = d.y,
            m = h.y;
        e.addPoint(e.createPoint(g, y));
        e.addPoint(e.createPoint(x, y));
        e.addPoint(e.createPoint(x, m));
        e.addPoint(e.createPoint(g, m));
        e.isClosed = !0;
        let v = !0;
        for (let b = 0, T = e.points.length; b < T; b++) e.points[b].roundness = p[b],
            b > 0 && p[b] !== p[b - 1] && (v = !1);
        v && (e.roundness = p[0]),
            e.useCubicForRoundedCorners = s !== 1,
            e.update();
        let w = VectorGeometry.create({
            shape: e,
            parameters: {
                surfaceMaxCount: c,
                depth: o,
                extrudeBevelSize: a,
                extrudeBevelSegments: l
            }
        });
        return Object.assign(w, {
            userData: {
                ...i,
                type: "RectangleGeometry"
            }
        })
    }
};