import { BufferGeometry, Vector2, Vector3 } from 'three'
import { Geometry, Face3 } from 'three/examples/jsm/deprecated/Geometry'


var zO = ["a", "b", "c"];


function kO(i, e) {
    switch (e) {
        case "c":
            return i.c;
        case "b":
            return i.b;
        case "a":
        default:
            return i.a
    }
}

function Xg(i, e, t) {
    let r = Math.min(i, e),
        n = Math.max(i, e),
        s = r + "_" + n;
    return t.get(s)
}

function Yg(i, e, t, r, n, s) {
    let o = Math.min(i, e),
        a = Math.max(i, e),
        l = o + "_" + a,
        c;
    if (r.has(l)) c = r.get(l);
    else {
        let u = t[o],
            h = t[a];
        c = {
            a: u,
            b: h,
            newEdge: null,
            faces: []
        }, r.set(l, c)
    }
    c.faces.push(n), s[i].edges.push(c), s[e].edges.push(c)
}

function VO(i, e, t, r) {
    let n, s, o;
    for (n = 0, s = i.length; n < s; n++) t[n] = {
        edges: []
    };
    for (n = 0, s = e.length; n < s; n++) o = e[n], Yg(o.a, o.b, i, r, o, t), Yg(o.b, o.c, i, r, o, t), Yg(o.c, o.a, i, r, o, t)
}

function mf(i, e, t, r, n) {
    i.push(new Face3(e, t, r, void 0, void 0, n))
}

function bl(i, e) {
    return Math.abs(e - i) / 2 + Math.min(i, e)
}

function gf(i, e, t, r) {
    i.push([e.clone(), t.clone(), r.clone()])
}




export default class Modify {
    constructor(e = 1) {
        this.subdivisions = e
    }
    modify(e) {
        e instanceof BufferGeometry ? e = new Geometry().fromBufferGeometry(e) : e = e.clone(), e.mergeVertices();
        let t = this.subdivisions;
        for (; t-- > 0;) this._smooth(e);
        return e.computeFaceNormals(), e.computeVertexNormals(), e
    }
    _smooth(e) {
        let t = new Vector3,
            r, n, s, o, a, l = e.vertices,
            c = e.faces,
            u = e.faceVertexUvs[0],
            h = u !== void 0 && u.length > 0,
            d = [],
            f = new Map;
        VO(l, c, d, f);
        let p = [],
            g, x, y, m, v, w, b;
        for (let ce of Array.from(f.keys())) {
            for (x = f.get(ce), y = new Vector3, v = 3 / 8, w = 1 / 8, b = x.faces.length, b != 2 && (v = .5, w = 0, b != 1), y.addVectors(x.a, x.b).multiplyScalar(v), t.set(0, 0, 0), o = 0; o < b; o++) {
                for (m = x.faces[o], a = 0; a < 3 && (g = l[kO(m, zO[a])], !(g !== x.a && g !== x.b)); a++);
                g && t.add(g)
            }
            t.multiplyScalar(w), y.add(t), x.newEdge = p.length, p.push(y)
        }
        let T, _, S, N, C, M, E, D = [];
        for (n = 0, s = l.length; n < s; n++) {
            for (M = l[n], C = d[n].edges, r = C.length, r == 3 ? T = 3 / 16 : r > 3 && (T = 3 / (8 * r)), _ = 1 - r * Number(T), S = T, r <= 2 && (r == 2 ? (_ = 3 / 4, S = 1 / 8) : r == 1 || r == 0), E = M.clone().multiplyScalar(_), t.set(0, 0, 0), o = 0; o < r; o++) N = C[o], g = N.a !== M ? N.a : N.b, t.add(g);
            t.multiplyScalar(Number(S)), E.add(t), D.push(E)
        }
        let O = D.concat(p),
            F = D.length,
            k, W, j, Z = [],
            U = [],
            G, R, J, re, se = new Vector2,
            V = new Vector2,
            he = new Vector2;
        for (n = 0, s = c.length; n < s; n++) m = c[n], k = Number(Xg(m.a, m.b, f).newEdge) + F, W = Number(Xg(m.b, m.c, f).newEdge) + F, j = Number(Xg(m.c, m.a, f).newEdge) + F, mf(Z, k, W, j, m.materialIndex), mf(Z, m.a, k, j, m.materialIndex), mf(Z, m.b, W, k, m.materialIndex), mf(Z, m.c, j, W, m.materialIndex), h && (G = u[n], R = G[0], J = G[1], re = G[2], se.set(bl(R.x, J.x), bl(R.y, J.y)), V.set(bl(J.x, re.x), bl(J.y, re.y)), he.set(bl(R.x, re.x), bl(R.y, re.y)), gf(U, se, V, he), gf(U, R, se, he), gf(U, J, V, se), gf(U, re, he, V));
        e.vertices = O, e.faces = Z, h && (e.faceVertexUvs[0] = U)
    }
};
