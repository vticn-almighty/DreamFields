import _ from 'lodash'
import { BufferGeometryLoader, Float32BufferAttribute, Vector3 } from 'three'

function g1(i, e) {
    let t = e.x - i.x,
        r = e.y - i.y,
        n = Math.sqrt(t * t + r * r),
        s = t / n,
        o = r / n,
        a = Math.atan2(o, s);
    return {
        x: t,
        y: r,
        len: n,
        nx: s,
        ny: o,
        ang: a
    }
};

export const roundShapePolygon = (i, e, t) => {
    let r, n, s, o, a, l, c, u, h, d, f, p, g, x, y = e.length;
    for (o = e[y - 2], i.curves = [], r = 1; r < y - 1; r++) {
        a = e[r % y], l = e[(r + 1) % y];
        let m = g1(a, o),
            v = g1(a, l);
        c = m.nx * v.ny - m.ny * v.nx, u = m.nx * v.nx - m.ny * -v.ny,
            f = Math.asin(c), h = 1, d = !1, u < 0 ? f < 0 ? f = Math.PI + f : (f = Math.PI - f, h = -1, d = !0) : f > 0 && (h = -1, d = !0), p = f / 2,
            x = Math.abs(Math.cos(p) * t / Math.sin(p)),
            x > Math.min(m.len / 2, v.len / 2) ? (x = Math.min(m.len / 2, v.len / 2),
                g = Math.abs(x * Math.sin(p) / Math.cos(p))) :
                g = t, n = a.x + v.nx * x, s = a.y + v.ny * x, n += -v.ny * g * h,
            s += v.nx * g * h, i.absarc(n, s, g, m.ang + Math.PI / 2 * h, v.ang - Math.PI / 2 * h, d), o = a, a = l
    }
    i.closePath()
};

export const resizeGeometry = (i, {
    width: e,
    height: t,
    depth: r
}) => {
    e = Math.abs(e), t = Math.abs(t), r = Math.abs(r);
    let n = i.userData.parameters,
        s, o, a;
    e === 0 ? (e = n.width, s = 1) : s = e / n.width, t === 0 ? (t = n.height, o = 1) : o = t / n.height, r === 0 ? (r = n.depth, a = 1) : a = r / n.depth, i.scale(s, o, a), n.width = e, n.height = t, n.depth = r
};

export const addBarycentricAttribute = (i, e) => {
    let t = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)],
        r = i.attributes.position,
        n = new Float32Array(r.count * 3);
    for (let s = 0, o = r.count; s < o; s++) t[s % 3].toArray(n, s * 3);
    i.setAttribute(e, new Float32BufferAttribute(n, 3))
};

export const loadFromUrl = i => new Promise(e => {
    new BufferGeometryLoader().load(i, r => e(r))
});


export const fixUvs = (i, e, t) => {
    let r = i.getAttribute("uv");
    if (r)
        for (let n = 0; n < r.count; n++) {
            let s = r.getX(n),
                o = r.getY(n);
            r.setXY(n, (s + e / 2) / e, 1 - (o - t / 2) / t * -1)
        }
};

const GeometryTool = {
    addBarycentricAttribute,
    fixUvs,
    loadFromUrl,
    resizeGeometry,
    roundShapePolygon
}

export { GeometryTool }