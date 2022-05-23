import {
    HeShapeGeometry
}
    from '../Base/GeometryBase'

export class HelixGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var a, l, c;
        let t = Object.assign({},
            (a = e == null ? void 0 : e.parameters) != null ? a : {
                width: 100,
                revolutions: 2,
                segments: 40,
                pathRadius: 10,
                pathType: 0,
                pathSegments: 30,
                cornerRadius: 30,
                cornerSegments: 4
            },
            i.parameters),
            r = Math.abs(t.width),
            n = Math.abs((l = t.height) != null ? l : r),
            s = Math.abs((c = t.depth) != null ? c : r),
            o = Math.abs(Math.min(r, s)) / 2;
        return {
            parameters: Object.assign(t, {
                width: r,
                height: n,
                depth: s,
                radius: o,
                segments: Math.round(t.segments),
                pathSegments: Math.round(t.pathSegments),
                cornerSegments: Math.round(t.cornerSegments)
            })
        }
    }
    static build(i) {
        let {
            width: e,
            height: t,
            depth: r,
            radius: n,
            revolutions: s,
            segments: o,
            pathRadius: a,
            pathType: l,
            pathSegments: c,
            cornerRadius: u,
            cornerSegments: h
        } = i.parameters,
            d = new HeShapeGeometry(!1, e, t, r, n, s, o, a, l, c, u, h);
        return Object.assign(d, {
            userData: {
                ...i,
                type: "HelixGeometry"
            }
        })
    }
}