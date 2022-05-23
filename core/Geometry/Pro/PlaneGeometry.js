import {
    PlaneGeometry as Proto
}
    from 'three'

export class PlaneGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n;
        let t = Object.assign({},
            (r = e == null ? void 0 : e.parameters) != null ? r : {
                width: 100,
                depth: 0,
                widthSegments: 8,
                heightSegments: 8
            },
            i.parameters);
        return {
            parameters: Object.assign(t, {
                width: Math.abs(t.width),
                height: Math.abs((n = t.height) != null ? n : t.width),
                depth: 0
            })
        }
    }
    static build(i) {
        let {
            width: e = 100,
            height: t = e,
            widthSegments: r = 8,
            heightSegments: n = 8
        } = i.parameters,
            s = new Proto(e, t, r, n);
        return s.scale(1, 1, 1),
            Object.assign(s, {
                userData: {
                    ...i,
                    type: "PlaneGeometry"
                }
            })
    }
};