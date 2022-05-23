import {
    SphereGeometry as Proto
}
    from 'three'

export class SphereGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n, s;
        let t = Object.assign({},
            (r = e == null ? void 0 : e.parameters) != null ? r : {
                width: 100,
                widthSegments: 64,
                heightSegments: 64,
                phiStart: 0,
                phiLength: 2 * Math.PI,
                thetaStart: 0,
                thetaLength: Math.PI
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
            width: e = 100,
            height: t = e,
            depth: r = e,
            widthSegments: n = 64,
            heightSegments: s = 64,
            phiStart: o,
            phiLength: a,
            thetaStart: l,
            thetaLength: c
        } = i.parameters,
            u = new Proto(.5 * e, n, s, o, a, l, c);
        return u.scale(1, t / e, r / e),
            Object.assign(u, {
                userData: {
                    ...i,
                    type: "SphereGeometry"
                }
            })
    }
};