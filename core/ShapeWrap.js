import { SplineCurve, LineCurve3, QuadraticBezierCurve, CubicBezierCurve, LineCurve, EllipseCurve, Plane, MathUtils, Shape, Vector2, Vector3, EventDispatcher } from 'three'
import { Shape } from 'three';
import { MathUtils } from 'three';
import { Point } from './Point'

let Jc = new Vector2
let Fg = new Vector2
let bO = new Vector2
let wO = new Vector2
let SO = new Vector2
let MO = new Vector2
let kg = new Vector2
let TO = new Vector2
let EO = new Vector2
let CO = new Vector2
let LO = new Vector2
let PO = new Vector2


let qc = 1e-12
function ao(i, e = 12) {
    return i && i instanceof EllipseCurve ? e * 2 : i && (i instanceof LineCurve || i instanceof LineCurve3) ? 1 : i && i instanceof SplineCurve ? e * i.points.length : e
}


function kM(i, e, t, r, n = .5) {
    let s = Jc.subVectors(e, i).multiplyScalar(n).add(i),
        o = Fg.subVectors(t, e).multiplyScalar(n).add(e),
        a = bO.subVectors(r, t).multiplyScalar(n).add(t),
        l = s,
        c = wO.subVectors(o, s).multiplyScalar(n).add(s),
        u = SO.subVectors(a, o).multiplyScalar(n).add(o),
        h = a,
        d = MO.subVectors(u, c).multiplyScalar(n).add(c);
    return [i.x, i.y, l.x, l.y, c.x, c.y, d.x, d.y, u.x, u.y, h.x, h.y, r.x, r.y]
}


function zM(i, e, t, r, n, s) {
    let o = e.x - i.x,
        a = e.y - i.y,
        l = t.x - i.x,
        c = t.y - i.y,
        u = Math.sqrt((o + l) * (o + l) + (a + c) * (a + c)),
        h;
    return Ug(e, i, t) > Math.PI && (u *= -1), Qc(c, a) ? h = (a + c) * (r / u - .5) * 8 / 3 / (o - l) : h = (o + l) * (r / u - .5) * 8 / 3 / (c - a), n.set(e.x - h * a, e.y + h * o), s.set(t.x + h * c, t.y - h * l), [n, s]
}

export function GM(i, e, t) {
    let r = i.distanceTo(t),
        n = e.distanceTo(t);
    return r < n ? e : i
}

function UM(i, e, t, r, n) {
    let s = Math.sqrt(Math.pow(e.x - i.x, 2) + Math.pow(e.y - i.y, 2)),
        o = (i.y + e.y) / 2,
        a = (i.x + e.x) / 2,
        l = Math.sqrt(Math.pow(t, 2) - Math.pow(s / 2, 2)) * (i.y - e.y) / s,
        c = Math.sqrt(Math.pow(t, 2) - Math.pow(s / 2, 2)) * (e.x - i.x) / s;
    return r.set(a + l, o + c), n.set(a - l, o - c), [r, n]
}

export function Ug(i, e, t) {
    let r = Math.sqrt(Math.pow(e.x - i.x, 2) + Math.pow(e.y - i.y, 2)),
        n = Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)),
        s = Math.sqrt(Math.pow(t.x - i.x, 2) + Math.pow(t.y - i.y, 2));
    return Math.acos((n * n + r * r - s * s) / (2 * n * r))
}


function Gg(i, e) {
    return i.position.equals(i.controls[1].position) && e.position.equals(e.controls[0].position)
}

export function HM(i, e, t, r = 12, n = !0) {
    let s = OM.set(0, 0, 0),
        o = 0,
        a = [];
    for (let l = 0; l < e.length; l++) {
        if (t[l] === !1) continue;
        let c, u = e[l],
            h = Jc,
            d = ao(u, r);
        a.push(d);
        for (let f = 0; f <= d; f++)
            if (u instanceof CubicBezierCurve || u instanceof QuadraticBezierCurve || u instanceof LineCurve) {
                if (u.getPoint(f / d, h), s.set(h.x, h.y, 0), c == null ? void 0 : c.equals(s)) continue;
                c === void 0 ? c = BM : (i.setXYZ(o, c.x, c.y, c.z), o++, i.setXYZ(o, s.x, s.y, s.z), o++), c.copy(s)
            }
    }
    return n && o > 1 && !(i.getX(o - 1) === i.getX(0) && i.getY(o - 1) === i.getY(0) && i.getZ(o - 1) === i.getZ(0)) && (i.setXYZ(o, i.getX(0), i.getY(0), i.getZ(0)), o++), a
}


function VM(i, e, t = 12, r = !0) {
    let n = OM.set(0, 0, 0),
        s, o = 0,
        a = [];
    for (let l = 0; l < e.length; l++) {
        let c = e[l],
            u = Jc,
            h = ao(c, t);
        a.push(h);
        for (let d = 0; d <= h; d++)
            if (c instanceof CubicBezierCurve || c instanceof QuadraticBezierCurve || c instanceof LineCurve) {
                if (c.getPoint(d / h, u), n.set(u.x, u.y, 0), s !== void 0 && _O(s, n)) continue;
                s === void 0 && (s = BM), s.copy(n), i.setXYZ(o, n.x, n.y, n.z), o++
            }
    }
    return r && o > 1 && !(i.getX(o - 1) === i.getX(0) && i.getY(o - 1) === i.getY(0) && i.getZ(o - 1) === i.getZ(0)) && (i.setXYZ(o, i.getX(0), i.getY(0), i.getZ(0)), o++), i
}





function AO(i, e, t = Number.EPSILON) {
    return i.distanceTo(e) < t
}

function _O(i, e, t = Number.EPSILON) {
    return i.distanceTo(e) < t
}



function Qc(i, e, t = Number.EPSILON) {
    return Math.abs(i - e) < t
}

function jM(i, e, t = 12, r = !0) {
    let n, s = 0;
    for (let o = 0; o < e.length; o++) {
        let a = e[o],
            l = ao(a, t),
            c = Jc;
        for (let u = 0; u <= l; u++)
            if (a instanceof CubicBezierCurve || a instanceof QuadraticBezierCurve || a instanceof LineCurve) {
                if (a.getPoint(u / l, c), n !== void 0 && AO(n, c, qc)) continue;
                n === void 0 && (n = Fg), n.copy(c), i.push(c.x, c.y), s++
            }
    }
    return Qc(i[0], i[i.length - 2], qc) && Qc(i[1], i[i.length - 1], qc) && (i.pop(), i.pop()), r && s > 1 && !(Qc(i[s - 1], i[1], qc) && Qc(i[s - 2], i[0], qc)) && (i.push(i[0], i[1]), s++), i
}

function zg(i, e = 12, t = !1) {
    let r = [];
    for (let n = 0, s = i.length; n < s; n++) {
        let o = i[n],
            a = 0;
        if (t && o.roundedCurveCorner !== void 0) {
            let l = ao(o.roundedCurveCorner, e) * .5;
            n > 0 && (r[n - 1] += l), a += l
        }
        o.curveAfter !== void 0 && (a += ao(o.curveAfter, e)), r.push(a)
    }
    return i.length > 0 && t && i[0].roundedCurveCorner !== void 0 && (r[i.length - 1] += ao(i[0].roundedCurveCorner, e) * .5), r
}
function FM(i) {
    let e = new Vector2;
    e.addVectors(i.v0, Jc.subVectors(i.v1, i.v0).multiplyScalar(2 / 3));
    let t = new Vector2;
    return t.addVectors(i.v2, Fg.subVectors(i.v1, i.v2).multiplyScalar(2 / 3)), new CubicBezierCurve(i.v0, e, t, i.v2)
}


export default class ShapeWrap extends Shape {
    constructor(e = 100, t = 100) {
        super();
        this.points = [];
        this.shapeHoles = [];
        this.eventDispatcher = new EventDispatcher;
        this.plane = new Plane(new Vector3(0, 0, -1));
        this.subdivision = 0;
        this.controlSnapDistance = 4;
        this.pointIDs = 0;
        this.isMesh2D = !1;
        this._roundness = 0;
        this.isClosed = !1;
        this.useCubicForRoundedCorners = !0;
        this.uuid = MathUtils.generateUUID();
        this.needsUpdate = !1;
        this.roundedCurves = [];
        this._width = e, this._height = t
    }
    static createFromState(e, t, r) {
        let n = new ShapeWrap;
        return n.isClosed = e.isClosed, n.points = e.points.map(s => Point.create(s.id, s.data)), typeof e.roundness == "number" && (n.roundness = e.roundness), n.shapeHoles = e.shapeHoles.map(s => ShapeWrap.createFromState(s)), t !== void 0 && r !== void 0 && n.applySize(t, r), n.update(), n
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get roundness() {
        return this._roundness
    }
    set roundness(e) {
        if (this._roundness !== e) {
            this._roundness = e;
            for (let t = 0, r = this.points.length; t < r; t++) this.points[t].roundness = e;
            this.needsUpdate = !0
        }
    }
    getPointsIndexesByIds(e) {
        return e.map(t => this.getPointIndexById(t)).filter(t => t >= 0)
    }
    getPointIndexById(e) {
        return this.points.findIndex(t => t.uuid === e)
    }
    getLineIndexById(e) {
        return this.getPointIndexById(e)
    }
    getBezierPoint(e) {
        if (e <= this.points.length - 1) return this.points[e];
        if (this.shapeHoles.length > 0)
            for (let t = 0, r = this.shapeHoles.length; t < r; t++) {
                let n = this.shapeHoles[t],
                    s = e - this.points.length;
                if (s <= n.points.length - 1) return n.points[s]
            }
        throw new Error("This shape does not have a point for this index: " + e)
    }
    getBezierPointIndex(e) {
        let t = this.points.indexOf(e);
        if (t >= 0) return t;
        if (t = this.points.length, this.shapeHoles.length > 0)
            for (let r = 0, n = this.shapeHoles.length; r < n; r++) {
                let s = this.shapeHoles[r],
                    o = s.points.indexOf(e);
                if (o >= 0) return t + o;
                t += s.points.length
            }
        return -1
    }
    getAllPoints() {
        let e = [].concat(...this.shapeHoles.map(t => t.points));
        return [...this.points, ...e]
    }
    applySize(e, t) {
        e === 0 && (e = .001), t === 0 && (t = .001), this._width = e, this._height = t
    }
    applyScale(e, t) {
        let r = kg.set(e, t);
        for (let n = 0, s = this.points.length; n < s; n++) {
            let o = this.points[n];
            o.position.multiply(r), o.controls[0].position.multiply(r), o.controls[1].position.multiply(r)
        }
        for (let n = 0, s = this.shapeHoles.length; n < s; n++) this.shapeHoles[n].applyScale(e, t);
        this._update(!1)
    }
    createPoint(e, t = 0, r = MathUtils.generateUUID()) {
        let n;
        e instanceof Vector2 ? n = e : n = new Vector2(e, t);
        let s = new Point(r, n);
        return s.roundness = this.roundness, s
    }
    addPoint(e) {
        this.points.push(e), this.needsUpdate = !0
    }
    addPointAt(e, t) {
        this.points.splice(t, 0, e), this.needsUpdate = !0
    }
    getPointByUuid(e) {
        for (let t = 0, r = this.points.length; t < r; t++) {
            let n = this.points[t];
            if (n.uuid === e) return n
        }
    }
    getFirstPoint() {
        return this.points[0]
    }
    getLastPoint() {
        return this.points[this.points.length - 1]
    }
    removePoint(e) {
        let t = this.points.indexOf(e);
        t >= 0 && this.points.splice(t, 1), this.needsUpdate = !0
    }
    removePointById(e) {
        let t = this.points.find(r => r.uuid === e);
        t && this.removePoint(t)
    }
    update(e = !0) {
        for (let t = 0, r = this.shapeHoles.length; t < r; t++) this.shapeHoles[t].update(!1);
        this._update(e)
    }
    extractShapePointsToBuffer(e, t = 12, r = !1) {
        this.subdivision = t, this.curveDivisions === void 0 && this.computeCurveDivisions(t);
        let n = r ? this.roundedCurveDivisions : this.curveDivisions;
        return VM(e, r ? this.roundedCurves : this.curves, t, this.autoClose), n.reduce((s, o) => s + o, 0) + 1
    }
    computeCurveDivisions(e = 12) {
        return this.curveDivisions = zg(this.points, e, !1), this.roundedCurveDivisions = zg(this.points, e, !0), this.curveDivisions
    }
    extractFilteredShapePointsToBuffer(e, t, r = 12) {
        return HM(e, this.curves, t, r, this.autoClose).reduce((s, o) => s + o, 0) * 2
    }
    extractShapePointsToFlatArray(e, t = 12) {
        return this.subdivision = t, this.curveDivisions === void 0 && this.computeCurveDivisions(t), jM(e, this.roundedCurves, t, this.autoClose)
    }
    getCurveIndexFromVertexId(e, t = !1) {
        let r = 0;
        this.curveDivisions === void 0 && this.computeCurveDivisions(this.subdivision);
        let n = t ? this.roundedCurveDivisions : this.curveDivisions,
            s = 0;
        t && this.points[0].roundedCurveCorner !== void 0 && (s = ao(this.points[0].roundedCurveCorner, this.subdivision) * .5);
        let o = e - s;
        o < 0 && (o += n.reduce((a, l) => a + l, 0));
        for (let a = 0, l = n.length; a < l; a++) {
            let c = n[a];
            if (o < r + c) return [a, (o - r + 1) / c];
            r += c
        }
        return [0, 1]
    }
    getCurveT(e, t, r) {
        let n = this.points[e],
            s = this.points[e >= this.points.length - 1 ? 0 : e + 1],
            o = this.curveDivisions,
            a = o[e];
        if (Gg(n, s)) {
            let u = n.position.distanceTo(s.position);
            return n.position.distanceTo(kg.set(r.x, r.y)) / u
        }
        let l = 0;
        for (let u = 0; u < e; u++) l += o[u];
        return (t - l) / a
    }
    dispose() {
        this.eventDispatcher = null
    }
    _applyCurveForPoint(e, t) {
        Gg(t, e) ? this.lineTo(e.position.x, e.position.y) : this.bezierCurveTo(t.controls[1].position.x, t.controls[1].position.y, e.controls[0].position.x, e.controls[0].position.y, e.position.x, e.position.y);
        let r = this.curves[this.curves.length - 1];
        e.curveBefore = r, t.curveAfter = r;
        let n = r.clone();
        e.roundedCurveBefore = n, t.roundedCurveAfter = n, e.roundedCurveCorner = void 0, this.roundedCurves.push(n)
    }
    _update(e = !0) {
        var r;
        if (this.curves = [], this.roundedCurves = [], !this.points.length) return;
        for (let n = 0, s = this.points.length; n < s; n++) {
            let o = this.points[n];
            if (n === 0) this.moveTo(o.position.x, o.position.y);
            else {
                let a = this.points[n - 1];
                this._applyCurveForPoint(o, a)
            }
        }
        let t = this.getLastPoint();
        if ((t == null ? void 0 : t.curveAfter) && (t.curveAfter = void 0), this.isClosed) {
            let n = this.points[0],
                s = this.points[this.points.length - 1];
            this._applyCurveForPoint(n, s)
        }
        if (this.points.length > 2) {
            let n = 0;
            for (let s = 0, o = this.points.length; s < o; s++) {
                let a = this.points[s],
                    l = a.roundness;
                if (!a.controlsMoved() && l > 0) {
                    let c = a.curveBefore,
                        u = a.curveAfter;
                    if (c === void 0 || u === void 0) continue;
                    let h = a.roundedCurveBefore,
                        d = a.roundedCurveAfter,
                        f = c.getLength(),
                        p = u.getLength(),
                        g = Math.min(l, f * .499),
                        x = Math.min(l, p * .499),
                        y = Math.min(g, x),
                        m = 1 - y / f,
                        v = y / p,
                        w = c.getPointAt(m, kg),
                        b = u.getPointAt(v, TO);
                    this._subSplitCurve(c, h, m, w, void 0), this._subSplitCurve(u, d, v, void 0, b);
                    let T;
                    if (this.useCubicForRoundedCorners) {
                        let _ = Ug(w, a.position, b) / 2,
                            S = Math.tan(_) * w.distanceTo(a.position),
                            [N, C] = UM(w, b, S, EO, CO),
                            M = GM(N, C, a.position),
                            [E, D] = zM(M, w, b, S, LO, PO);
                        T = new CubicBezierCurve(w.clone(), E.clone(), D.clone(), b.clone())
                    } else T = new QuadraticBezierCurve(w.clone(), a.position.clone(), b.clone());
                    a.roundedCurveCorner = T, this.roundedCurves.splice(s + n, 0, T), n++
                }
            }
        }
        e && ((r = this.eventDispatcher) == null || r.dispatchEvent({
            type: "update"
        }))
    }
    _subSplitCurve(e, t, r, n, s) {
        if (e instanceof LineCurve) n !== void 0 && t.v2.copy(n), s !== void 0 && t.v1.copy(s);
        else {
            let o = e,
                a = t,
                l = o.getUtoTmapping(r, 0),
                c = kM(o.v0, o.v1, o.v2, o.v3, l);
            return n !== void 0 && (a.v0.set(c[0], c[1]), a.v1.set(c[2], c[3]), a.v2.set(c[4], c[5]), a.v3.set(c[6], c[7])), s !== void 0 && (a.v0.set(c[6], c[7]), a.v1.set(c[8], c[9]), a.v2.set(c[10], c[11]), a.v3.set(c[12], c[13])), a
        }
        return t
    }
    clone() {
        let e = new ShapeWrap(this._width, this._height);
        return e.points = this.points.map(t => t.clone()), e.isClosed = this.isClosed, e.roundness = this.roundness, e.isMesh2D = this.isMesh2D, e.shapeHoles = this.shapeHoles.map(t => t.clone()), e
    }
    toJSON() {
        return {
            points: this.points.reduce((e, t) => e.concat(t.toJSON()), []),
            shapeHoles: this.shapeHoles.map(e => e.toJSON()),
            isClosed: this.isClosed,
            roundness: this.roundness
        }
    }
    fromJSON(e) {
        var r;
        this.points = [], this.pointIDs = 0;
        let t = e.points.length / 7;
        for (let n = 0; n < t; n++) {
            let s = n * 7,
                o = e.points[s + 0],
                a = e.points[s + 1],
                l = e.points[s + 2],
                c = e.points[s + 3],
                u = e.points[s + 4],
                h = e.points[s + 5],
                d = e.points[s + 6],
                f = new Point(MathUtils.generateUUID(), new Vector2(o, a));
            f.controls[0].position.set(l, c), f.controls[1].position.set(u, h), f.roundness = d, this.points.push(f)
        }
        return this.shapeHoles = ((r = e.shapeHoles) == null ? void 0 : r.length) ? e.shapeHoles.map(n => {
            let s = new ShapeWrap;
            return s.fromJSON(n), s
        }) : [], this.isClosed = e.isClosed, this._roundness = e.roundness, this._update(), this
    }
    fromShape(e) {
        let t = (n, s) => {
            s instanceof CubicBezierCurve && s.v3.equals(n.position) && n.controls[0].position.copy(s.v2)
        },
            r = n => {
                let s = [],
                    o, a;
                for (o = 0, a = n.length; o < a; o++) n[o] instanceof QuadraticBezierCurve && (n[o] = FM(n[o]));
                for (o = 0, a = n.length; o < a; o++) {
                    let u = n[o],
                        h = o > 0 ? n[o - 1] : null,
                        d;
                    u instanceof CubicBezierCurve ? (d = this.createPoint(u.v0), d.controls[1].position.copy(u.v1)) : u instanceof LineCurve && (d = this.createPoint(u.v1)), d !== void 0 && (h !== null && t(d, h), s.push(d))
                }
                let l = n[n.length - 1],
                    c = !1;
                return l instanceof CubicBezierCurve ? l.v3.equals(s[0].position) && (s[0].controls[0].position.copy(l.v2), c = !0) : l instanceof LineCurve && l.v2.equals(s[0].position) && (c = !0), this.isClosed = c, s
            };
        return this.points = r(e.curves), e instanceof Shape && (this.shapeHoles = e.holes.map(n => {
            let s = new ShapeWrap;
            return s.fromShape(n), s
        })), this.update(), this
    }
}