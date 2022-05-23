import {
    Shape,
    LatheGeometry as Proto
}
    from 'three'

export class LatheGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var r, n, s, o, a; ((n = (r = i.parameters) == null ? void 0 : r.points) != null ? n : []).forEach(l => {
            Array.isArray(l) && (l.x = l[0], l.y = l[1])
        });
        let t = Object.assign({},
            (s = e == null ? void 0 : e.parameters) != null ? s : {
                width: 100,
                segments: 64,
                verticalSegments: 64,
                points: [{
                    x: 0,
                    y: -50,
                    id: 0
                },
                {
                    x: 50,
                    y: -50,
                    id: 1
                },
                {
                    x: 50,
                    y: 50,
                    id: 2
                },
                {
                    x: 0,
                    y: 50,
                    id: 3
                }]
            },
            i.parameters);
        return {
            parameters: Object.assign(t, {
                width: Math.abs(t.width),
                height: Math.abs((o = t.height) != null ? o : t.width),
                depth: Math.abs((a = t.depth) != null ? a : t.width)
            })
        }
    }
    static build(i) {
        let {
            points: e,
            segments: t,
            verticalSegments: r
        } = i.parameters,
            n = new Shape;
        n.moveTo(e[0].x, e[0].y);
        n.bezierCurveTo(e[1].x, e[1].y, e[2].x, e[2].y, e[3].x, e[3].y);
        let s = new Proto(n.extractPoints(r).shape, t);
        return s.rotateZ(Math.PI),
            Object.assign(s, {
                userData: {
                    ...i,
                    type: "LatheGeometry"
                }
            })
    }
};