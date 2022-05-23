import {
    PyShapeGeometry
}
    from '../Base/GeometryBase';
export class PyramidGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n, s;
        let t = Object.assign({},
            (r = e == null ? void 0 : e.parameters) != null ? r : {
                width: 100,
                radialSegments: 4,
                heightSegments: 1,
                cornerRadius: 0,
                cornerSegments: 8,
                openEnded: !1
            },
            i.parameters);
        return {
            parameters: Object.assign(t, {
                width: Math.abs(t.width),
                height: Math.abs((n = t.height) != null ? n : t.width),
                depth: Math.abs((s = t.depth) != null ? s : t.width)
            })
        }
    }
    static build(i) {
        let {
            width: e,
            height: t,
            depth: r,
            radialSegments: n,
            heightSegments: s,
            openEnded: o,
            cornerRadius: a,
            cornerSegments: l
        } = i.parameters,
            c = new PyShapeGeometry(e * .5, t, n, s, o, a, l);
        return c.scale(1, 1, r / e),
            Object.assign(c, {
                userData: {
                    ...i,
                    type: "PyramidGeometry"
                }
            })
    }
};