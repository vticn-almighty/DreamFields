import {
    TorusKnotGeometry as Proto
}
    from 'three';
export class TorusKnotGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n, s, o;
        let t = Object.assign({},
            (r = e == null ? void 0 : e.parameters) != null ? r : {
                width: 100,
                tubularSegments: 64,
                radialSegments: 32,
                p: 2,
                q: 3
            },
            i.parameters);
        return {
            parameters: Object.assign(t, {
                width: Math.abs(t.width),
                height: Math.abs((n = t.height) != null ? n : t.width),
                depth: Math.abs((s = t.depth) != null ? s : t.width),
                tube: (o = t.tube) != null ? o : t.width * .125
            })
        }
    }
    static build(i) {
        let {
            width: e,
            tube: t,
            tubularSegments: r,
            radialSegments: n,
            p: s,
            q: o
        } = i.parameters,
            a = e * .5;
        a !== t && (a -= t);
        let l = new Proto(a, t, r, n, s, o);
        return Object.assign(l, {
            userData: {
                ...i,
                type: "TorusKnotGeometry"
            }
        })
    }
};