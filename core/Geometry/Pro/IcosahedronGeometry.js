import {
    IcosahedronGeometryBase
}
    from '../Base/PolyhedronGeometryRoundBase';
import {
    IcosahedronGeometry as Proto
}
    from 'three'

export class IcosahedronGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n, s;
        let t = Object.assign({},
            (r = e == null ? void 0 : e.parameters) != null ? r : {
                width: 100,
                detail: 0,
                corner: 0,
                cornerSides: 4
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
            detail: n,
            corner: s,
            cornerSides: o
        } = i.parameters,
            a = n === 0 && s !== 0 ? new IcosahedronGeometryBase(e * .5, s, o) : new Proto(e * .5, n);
        a.scale(1, t / e, r / e);
        return Object.assign(a, {
            userData: {
                ...i,
                type: "IcosahedronGeometry"
            }
        })
    }
}