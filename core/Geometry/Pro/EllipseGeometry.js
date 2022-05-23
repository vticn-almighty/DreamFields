import ShapeWrap from '../../ShapeWrap'
import {
    VectorGeometry
}
    from './VectorGeometry'
import {
    MathUtils,
    Vector2
}
    from 'three'
import ShapeWrap from '../../ShapeWrap'
import {
    Point
}
    from '../../Point'
let Vg = Math.PI * 2;

function vl(i, e) {
    return new Point(MathUtils.generateUUID(), new Vector2(i, e))
}
function Hg({
    x: i,
    y: e
},
    t, r, n, s) {
    return {
        x: i * t + n,
        y: e * r + s
    }
}

function r1(i, e, t, r) {
    let n = r * e / 100,
        s = n * (Math.abs(t) / Math.abs(e)),
        o = new Vector2(n / e, s / t),
        a = i.points.map(l => {
            let c = l.clone();
            return c.uuid = MathUtils.generateUUID(),
                c
        }).reverse();
    return a.forEach(l => {
        l.position.multiply(o);
        let c = l.controls[0].position.clone().multiply(o),
            u = l.controls[1].position.clone().multiply(o);
        l.controls[0].position.copy(u),
            l.controls[1].position.copy(c)
    }),
        a
}

function t1(i, e, t, r) {
    let n = r1(i, e, t, r),
        s = new ShapeWrap;
    n.forEach(o => s.addPoint(o)),
        s.isClosed = !0,
        i.shapeHoles.push(s)
}

function hf(i, e, t, r, n, s) {
    let o = vl(i, e);
    o.controls[0].position.set(t, r);
    o.controls[1].position.set(n, s);
    return o
}

function GO(i, e, t, r = 0, n = 0, s = 0) {
    let o = .5522847498,
        a = e * o,
        l = t * o;
    i.addPoint(hf(n - e, s, n - e, s - l, n - e, s + l)),
        i.addPoint(hf(n, s + t, n - a, s + t, n + a, s + t)),
        i.addPoint(hf(n + e, s, n + e, s + l, n + e, s - l)),
        i.addPoint(hf(n, s - t, n + a, s - t, n - a, s - t)),
        r > 0 && t1(i, e, t, r)
}

function $M(i, e, t, r, n, s) {
    let o = -e / t;
    for (let a = 0; a <= t; a++) {
        let l = o * a,
            c = Math.sin(l) * r,
            u = Math.cos(l) * n;
        i.addPoint(vl(c, u))
    }
    return e < Math.PI * 2 ? s > 0 ? e1(i, r, n, s) : i.addPoint(vl(0, 0)) : (i.removePoint(i.points[i.points.length - 1]), s > 0 && t1(i, r, n, s)),
        1
}

export
    function DO(i, e) {
    let t = e === 1.5707963267948966 ? .551915024494 : e === -1.5707963267948966 ? -.551915024494 : 4 / 3 * Math.tan(e / 4),
        r = Math.cos(i),
        n = Math.sin(i),
        s = Math.cos(i + e),
        o = Math.sin(i + e);
    return [{
        x: r - n * t,
        y: n + r * t
    },
    {
        x: s + o * t,
        y: o - s * t
    },
    {
        x: s,
        y: o
    }]
}

function WM(i, e, t, r) {
    let n = i * r - e * t < 0 ? -1 : 1,
        s = Math.min(1, Math.max(- 1, i * t + e * r));
    return n * Math.acos(s)
}

function IO(i, e, t, r, n, s, o, a, l, c) {
    let u = Math.pow(n, 2),
        h = Math.pow(s, 2),
        d = Math.pow(o, 2),
        f = Math.pow(a, 2),
        p = u * h - u * f - h * d;
    p < 0 && (p = 0),
        p /= u * f + h * d,
        p = Math.sqrt(p) * (l === c ? -1 : 1);
    let g = p * n / s * a,
        x = p * -s / n * o,
        y = g + (i + t) / 2,
        m = x + (e + r) / 2,
        v = (o - g) / n,
        w = (a - x) / s,
        b = (- o - g) / n,
        T = (- a - x) / s,
        _ = WM(1, 0, v, w),
        S = WM(v, w, b, T);
    return !c && S > 0 && (S -= Vg),
        c && S < 0 && (S += Vg),
    {
        centerx: y,
        centery: m,
        ang1: _,
        ang2: S
    }
}

function qM({
    px: i,
    py: e,
    cx: t,
    cy: r,
    rx: n,
    ry: s,
    largeArcFlag: o,
    sweepFlag: a
}) {
    let l = [];
    if (n === 0 || s === 0) return [];
    let c = (i - t) / 2,
        u = (e - r) / 2;
    if (c === 0 && u === 0) return [];
    n = Math.abs(n),
        s = Math.abs(s);
    let h = Math.pow(c, 2) / Math.pow(n, 2) + Math.pow(u, 2) / Math.pow(s, 2);
    h > 1 && (n *= Math.sqrt(h), s *= Math.sqrt(h));
    let d = IO(i, e, t, r, n, s, c, u, o, a),
        {
            ang1: f,
            ang2: p
        } = d,
        {
            centerx: g,
            centery: x
        } = d,
        y = Math.abs(p) / (Vg / 4);
    Math.abs(1 - y) < 1e-7 && (y = 1);
    let m = Math.max(Math.ceil(y), 1);
    p /= m;
    for (let v = 0; v < m; v++) l.push(DO(f, p)),
        f += p;
    return l.map(v => {
        let {
            x: w,
            y: b
        } = Hg(v[0], n, s, g, x),
            {
                x: T,
                y: _
            } = Hg(v[1], n, s, g, x),
            {
                x: S,
                y: N
            } = Hg(v[2], n, s, g, x);
        return {
            x1: w,
            y1: b,
            x2: T,
            y2: _,
            x: S,
            y: N
        }
    })
}
function e1(i, e, t, r) {
    r1(i, e, t, r).forEach(s => i.addPoint(s))
}

function UO(i, e, t, r, n, s, o, a) {
    let l = Math.round(n / r.length);
    i.addPoint(vl(e, t));
    for (let c = 0, u = r.length; c < u; c++) {
        let h = r[c],
            d = i.points[c],
            f = vl(h.x, h.y);
        d.controls[1].position.set(h.x1, h.y1);
        f.controls[0].position.set(h.x2, h.y2);
        i.addPoint(f)
    }
    return a > 0 ? e1(i, s, o, a) : i.addPoint(vl(0, 0)),
        l
}

function subdivisions(i, e, t, r, n, s) {
    if (r >= Math.PI * 2) return n > 30 || n % 4 == 0 ? (GO(i, e, t, s), Math.round(n / 4)) : $M(i, r, n, e, t, s);
    let o = {
        x: 0,
        y: t
    },
        a = r + Math.PI * .5,
        l = {
            x: Math.cos(a) * e,
            y: Math.sin(a) * t
        },
        c = qM({
            px: o.x,
            py: o.y,
            cx: l.x,
            cy: l.y,
            rx: e,
            ry: t,
            largeArcFlag: r > Math.PI,
            sweepFlag: !0
        });
    return n > 30 || n % c.length == 0 ? UO(i, o.x, o.y, c, n, e, t, s) : $M(i, r, n, e, t, s)
}

export class EllipseGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var n, s, o;
        let t = Object.assign({},
            (n = e == null ? void 0 : e.parameters) != null ? n : {
                width: 100,
                depth: 0,
                spikes: 64,
                angle: 360,
                innerRadius: 0,
                extrudeDepth: 0,
                extrudeBevelSize: 0,
                extrudeBevelSegments: 1,
                surfaceMaxCount: 1e3
            },
            i.parameters);
        return {
            shape: i.shape && i.shape instanceof ShapeWrap ? i.shape : new ShapeWrap,
            parameters: Object.assign(t, {
                width: Math.abs(t.width),
                height: Math.abs((s = t.height) != null ? s : t.width),
                depth: Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth : (o = t.depth) != null ? o : 0)
            })
        }
    }
    static build(i) {
        let {
            width: e,
            height: t,
            spikes: r,
            angle: n,
            innerRadius: s,
            depth: o,
            extrudeBevelSize: a,
            extrudeBevelSegments: l,
            surfaceMaxCount: c
        } = i.parameters;
        let u = i.shape;
        let h = e * .5,
            d = t * .5;
        let f = subdivisions(u, h, d, n * Math.PI / 180, r, s);
        u.isClosed = !0,
            u.update();
        let p = VectorGeometry.create({
            shape: u,
            parameters: {
                subdivisions: f,
                surfaceMaxCount: c,
                depth: o,
                extrudeBevelSize: a,
                extrudeBevelSegments: l
            }
        });
        return Object.assign(p, {
            userData: {
                ...i,
                type: "EllipseGeometry"
            }
        })
    }
};