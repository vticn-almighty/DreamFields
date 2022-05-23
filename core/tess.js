



var Tess = {};

Tess.ODD = 0;
Tess.NONZERO = 1;
Tess.POSITIVE = 2;
Tess.NEGATIVE = 3;
Tess.ABS_GEQ_TWO = 4;
Tess.POLYGONS = 0
Tess.CONNECTED_POLYGONS = 1
Tess.BOUNDARY_CONTOURS = 2


function assert(i, e) {
    if (!i) throw e || "Assertion Failed!"
}


var Geom = {};

Geom.vertEq = function (u, v) {
    return (u.s === v.s && u.t === v.t);
};

/* Returns TRUE if u is lexicographically <= v. */
Geom.vertLeq = function (u, v) {
    return ((u.s < v.s) || (u.s === v.s && u.t <= v.t));
};

/* Versions of VertLeq, EdgeSign, EdgeEval with s and t transposed. */
Geom.transLeq = function (u, v) {
    return ((u.t < v.t) || (u.t === v.t && u.s <= v.s));
};

Geom.edgeGoesLeft = function (e) {
    return Geom.vertLeq(e.Dst, e.Org);
};

Geom.edgeGoesRight = function (e) {
    return Geom.vertLeq(e.Org, e.Dst);
};

Geom.vertL1dist = function (u, v) {
    return (Math.abs(u.s - v.s) + Math.abs(u.t - v.t));
};

//TESSreal tesedgeEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
Geom.edgeEval = function (u, v, w) {
    /* Given three vertices u,v,w such that VertLeq(u,v) && VertLeq(v,w),
    * evaluates the t-coord of the edge uw at the s-coord of the vertex v.
    * Returns v->t - (uw)(v->s), ie. the signed distance from uw to v.
    * If uw is vertical (and thus passes thru v), the result is zero.
    *
    * The calculation is extremely accurate and stable, even when v
    * is very close to u or w.  In particular if we set v->t = 0 and
    * let r be the negated result (this evaluates (uw)(v->s)), then
    * r is guaranteed to satisfy MIN(u->t,w->t) <= r <= MAX(u->t,w->t).
    */
    assert(Geom.vertLeq(u, v) && Geom.vertLeq(v, w));

    var gapL = v.s - u.s;
    var gapR = w.s - v.s;

    if (gapL + gapR > 0.0) {
        if (gapL < gapR) {
            return (v.t - u.t) + (u.t - w.t) * (gapL / (gapL + gapR));
        } else {
            return (v.t - w.t) + (w.t - u.t) * (gapR / (gapL + gapR));
        }
    }
    /* vertical line */
    return 0.0;
};

//TESSreal tesedgeSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
Geom.edgeSign = function (u, v, w) {
    /* Returns a number whose sign matches EdgeEval(u,v,w) but which
    * is cheaper to evaluate.  Returns > 0, == 0 , or < 0
    * as v is above, on, or below the edge uw.
    */
    assert(Geom.vertLeq(u, v) && Geom.vertLeq(v, w));

    var gapL = v.s - u.s;
    var gapR = w.s - v.s;

    if (gapL + gapR > 0.0) {
        return (v.t - w.t) * gapL + (v.t - u.t) * gapR;
    }
    /* vertical line */
    return 0.0;
};


/***********************************************************************
* Define versions of EdgeSign, EdgeEval with s and t transposed.
*/

//TESSreal testransEval( TESSvertex *u, TESSvertex *v, TESSvertex *w )
Geom.transEval = function (u, v, w) {
    /* Given three vertices u,v,w such that TransLeq(u,v) && TransLeq(v,w),
    * evaluates the t-coord of the edge uw at the s-coord of the vertex v.
    * Returns v->s - (uw)(v->t), ie. the signed distance from uw to v.
    * If uw is vertical (and thus passes thru v), the result is zero.
    *
    * The calculation is extremely accurate and stable, even when v
    * is very close to u or w.  In particular if we set v->s = 0 and
    * let r be the negated result (this evaluates (uw)(v->t)), then
    * r is guaranteed to satisfy MIN(u->s,w->s) <= r <= MAX(u->s,w->s).
    */
    assert(Geom.transLeq(u, v) && Geom.transLeq(v, w));

    var gapL = v.t - u.t;
    var gapR = w.t - v.t;

    if (gapL + gapR > 0.0) {
        if (gapL < gapR) {
            return (v.s - u.s) + (u.s - w.s) * (gapL / (gapL + gapR));
        } else {
            return (v.s - w.s) + (w.s - u.s) * (gapR / (gapL + gapR));
        }
    }
    /* vertical line */
    return 0.0;
};

//TESSreal testransSign( TESSvertex *u, TESSvertex *v, TESSvertex *w )
Geom.transSign = function (u, v, w) {
    /* Returns a number whose sign matches TransEval(u,v,w) but which
    * is cheaper to evaluate.  Returns > 0, == 0 , or < 0
    * as v is above, on, or below the edge uw.
    */
    assert(Geom.transLeq(u, v) && Geom.transLeq(v, w));

    var gapL = v.t - u.t;
    var gapR = w.t - v.t;

    if (gapL + gapR > 0.0) {
        return (v.s - w.s) * gapL + (v.s - u.s) * gapR;
    }
    /* vertical line */
    return 0.0;
};


//int tesvertCCW( TESSvertex *u, TESSvertex *v, TESSvertex *w )
Geom.vertCCW = function (u, v, w) {
    /* For almost-degenerate situations, the results are not reliable.
    * Unless the floating-point arithmetic can be performed without
    * rounding errors, *any* implementation will give incorrect results
    * on some degenerate inputs, so the client must have some way to
    * handle this situation.
    */
    return (u.s * (v.t - w.t) + v.s * (w.t - u.t) + w.s * (u.t - v.t)) >= 0.0;
};

/* Given parameters a,x,b,y returns the value (b*x+a*y)/(a+b),
* or (x+y)/2 if a==b==0.  It requires that a,b >= 0, and enforces
* this in the rare case that one argument is slightly negative.
* The implementation is extremely stable numerically.
* In particular it guarantees that the result r satisfies
* MIN(x,y) <= r <= MAX(x,y), and the results are very accurate
* even when a and b differ greatly in magnitude.
*/
Geom.interpolate = function (a, x, b, y) {
    return (a = (a < 0) ? 0 : a, b = (b < 0) ? 0 : b, ((a <= b) ? ((b == 0) ? ((x + y) / 2) : (x + (y - x) * (a / (a + b)))) : (y + (x - y) * (b / (a + b)))));
};

/*
#ifndef FOR_TRITE_TEST_PROGRAM
#define Interpolate(a,x,b,y)	RealInterpolate(a,x,b,y)
#else

// Claim: the ONLY property the sweep algorithm relies on is that
// MIN(x,y) <= r <= MAX(x,y).  This is a nasty way to test that.
#include <stdlib.h>
extern int RandomInterpolate;

double Interpolate( double a, double x, double b, double y)
{
    printf("*********************%d\n",RandomInterpolate);
    if( RandomInterpolate ) {
        a = 1.2 * drand48() - 0.1;
        a = (a < 0) ? 0 : ((a > 1) ? 1 : a);
        b = 1.0 - a;
    }
    return RealInterpolate(a,x,b,y);
}
#endif*/

Geom.intersect = function (o1, d1, o2, d2, v) {
    /* Given edges (o1,d1) and (o2,d2), compute their point of intersection.
    * The computed point is guaranteed to lie in the intersection of the
    * bounding rectangles defined by each edge.
    */
    var z1, z2;
    var t;

    /* This is certainly not the most efficient way to find the intersection
    * of two line segments, but it is very numerically stable.
    *
    * Strategy: find the two middle vertices in the VertLeq ordering,
    * and interpolate the intersection s-value from these.  Then repeat
    * using the TransLeq ordering to find the intersection t-value.
    */

    if (!Geom.vertLeq(o1, d1)) { t = o1; o1 = d1; d1 = t; } //swap( o1, d1 ); }
    if (!Geom.vertLeq(o2, d2)) { t = o2; o2 = d2; d2 = t; } //swap( o2, d2 ); }
    if (!Geom.vertLeq(o1, o2)) { t = o1; o1 = o2; o2 = t; t = d1; d1 = d2; d2 = t; }//swap( o1, o2 ); swap( d1, d2 ); }

    if (!Geom.vertLeq(o2, d1)) {
        /* Technically, no intersection -- do our best */
        v.s = (o2.s + d1.s) / 2;
    } else if (Geom.vertLeq(d1, d2)) {
        /* Interpolate between o2 and d1 */
        z1 = Geom.edgeEval(o1, o2, d1);
        z2 = Geom.edgeEval(o2, d1, d2);
        if (z1 + z2 < 0) { z1 = -z1; z2 = -z2; }
        v.s = Geom.interpolate(z1, o2.s, z2, d1.s);
    } else {
        /* Interpolate between o2 and d2 */
        z1 = Geom.edgeSign(o1, o2, d1);
        z2 = -Geom.edgeSign(o1, d2, d1);
        if (z1 + z2 < 0) { z1 = -z1; z2 = -z2; }
        v.s = Geom.interpolate(z1, o2.s, z2, d2.s);
    }

    /* Now repeat the process for t */

    if (!Geom.transLeq(o1, d1)) { t = o1; o1 = d1; d1 = t; } //swap( o1, d1 ); }
    if (!Geom.transLeq(o2, d2)) { t = o2; o2 = d2; d2 = t; } //swap( o2, d2 ); }
    if (!Geom.transLeq(o1, o2)) { t = o1; o1 = o2; o2 = t; t = d1; d1 = d2; d2 = t; } //swap( o1, o2 ); swap( d1, d2 ); }

    if (!Geom.transLeq(o2, d1)) {
        /* Technically, no intersection -- do our best */
        v.t = (o2.t + d1.t) / 2;
    } else if (Geom.transLeq(d1, d2)) {
        /* Interpolate between o2 and d1 */
        z1 = Geom.transEval(o1, o2, d1);
        z2 = Geom.transEval(o2, d1, d2);
        if (z1 + z2 < 0) { z1 = -z1; z2 = -z2; }
        v.t = Geom.interpolate(z1, o2.t, z2, d1.t);
    } else {
        /* Interpolate between o2 and d2 */
        z1 = Geom.transSign(o1, o2, d1);
        z2 = -Geom.transSign(o1, d2, d1);
        if (z1 + z2 < 0) { z1 = -z1; z2 = -z2; }
        v.t = Geom.interpolate(z1, o2.t, z2, d2.t);
    }
};

// Kc
function TESSface() {
    this.next = null;		/* next face (never NULL) */
    this.prev = null;		/* previous face (never NULL) */
    this.anEdge = null;		/* a half edge with this left face */

    /* Internal data (keep hidden) */
    this.trail = null;		/* "stack" for conversion to strips */
    this.n = 0;				/* to allow identiy unique faces */
    this.marked = false;	/* flag for conversion to strips */
    this.inside = false;	/* this face is in the polygon interior */
};
// lf

function TESShalfEdge(side) {
    this.next = null;		/* doubly-linked list (prev==Sym->next) */
    this.Sym = null;		/* same edge, opposite direction */
    this.Onext = null;		/* next edge CCW around origin */
    this.Lnext = null;		/* next edge CCW around left face */
    this.Org = null;		/* origin vertex (Overtex too long) */
    this.Lface = null;		/* left face */

    /* Internal data (keep hidden) */
    this.activeRegion = null;	/* a region with this upper edge (sweep.c) */
    this.winding = 0;			/* change in winding number when crossing
                                   from the right face to the left face */
    this.side = side;
};

TESShalfEdge.prototype = {
    get Rface() { return this.Sym.Lface; },
    set Rface(v) { this.Sym.Lface = v; },
    get Dst() { return this.Sym.Org; },
    set Dst(v) { this.Sym.Org = v; },
    get Oprev() { return this.Sym.Lnext; },
    set Oprev(v) { this.Sym.Lnext = v; },
    get Lprev() { return this.Onext.Sym; },
    set Lprev(v) { this.Onext.Sym = v; },
    get Dprev() { return this.Lnext.Sym; },
    set Dprev(v) { this.Lnext.Sym = v; },
    get Rprev() { return this.Sym.Onext; },
    set Rprev(v) { this.Sym.Onext = v; },
    get Dnext() { return /*this.Rprev*/this.Sym.Onext.Sym; },  /* 3 pointers */
    set Dnext(v) { /*this.Rprev*/this.Sym.Onext.Sym = v; },  /* 3 pointers */
    get Rnext() { return /*this.Oprev*/this.Sym.Lnext.Sym; },  /* 3 pointers */
    set Rnext(v) { /*this.Oprev*/this.Sym.Lnext.Sym = v; },  /* 3 pointers */
};
// xl
function TESSvertex() {
    this.next = null;	/* next vertex (never NULL) */
    this.prev = null;	/* previous vertex (never NULL) */
    this.anEdge = null;	/* a half-edge with this origin */

    /* Internal data (keep hidden) */
    this.coords = [0, 0, 0];	/* vertex location in 3D */
    this.s = 0.0;
    this.t = 0.0;			/* projection onto the sweep plane */
    this.pqHandle = 0;		/* to allow deletion from priority queue */
    this.n = 0;				/* to allow identify unique vertices */
    this.idx = 0;			/* to allow map result to original verts */
}
// XM
function TESSmesh() {
    var e = new TESSvertex,
        t = new TESSface,
        r = new TESShalfEdge(0),
        n = new TESShalfEdge(1);
    e.next = e.prev = e;
    e.anEdge = null;
    t.next = t.prev = t;
    r.next = r;
    r.Sym = n;
    n.next = n;
    n.Sym = r;
    this.vHead = e;
    this.fHead = t;
    this.eHead = r;
    this.eHeadSym = n
}

TESSmesh.prototype = {
    makeEdge_(e) {
        var t = new TESShalfEdge(0),
            r = new TESShalfEdge(1);
        e.Sym.side < e.side && (e = e.Sym);
        var n = e.Sym.next;
        return r.next = n, n.Sym.next = t, t.next = e, e.Sym.next = r, t.Sym = r, t.Onext = t, t.Lnext = r, t.Org = null, t.Lface = null, t.winding = 0, t.activeRegion = null, r.Sym = t, r.Onext = r, r.Lnext = t, r.Org = null, r.Lface = null, r.winding = 0, r.activeRegion = null, t
    },
    splice_(e, t) {
        var r = e.Onext,
            n = t.Onext;
        r.Sym.Lnext = t, n.Sym.Lnext = e, e.Onext = n, t.Onext = r
    },
    makeVertex_(e, t, r) {
        var n = e;
        assert(n, "Vertex can't be null!");
        var s = r.prev;
        n.prev = s, s.next = n, n.next = r, r.prev = n, n.anEdge = t;
        var o = t;
        do o.Org = n, o = o.Onext; while (o !== t)
    },
    makeFace_(e, t, r) {
        var n = e;
        assert(n, "Face can't be null");
        var s = r.prev;
        n.prev = s, s.next = n, n.next = r, r.prev = n, n.anEdge = t, n.trail = null, n.marked = !1, n.inside = r.inside;
        var o = t;
        do o.Lface = n, o = o.Lnext; while (o !== t)
    },
    killEdge_(e) {
        e.Sym.side < e.side && (e = e.Sym);
        var t = e.next,
            r = e.Sym.next;
        t.Sym.next = r, r.Sym.next = t
    },
    killVertex_(e, t) {
        var r = e.anEdge,
            n = r;
        do n.Org = t, n = n.Onext; while (n !== r);
        var s = e.prev,
            o = e.next;
        o.prev = s, s.next = o
    },
    killFace_(e, t) {
        var r = e.anEdge,
            n = r;
        do n.Lface = t, n = n.Lnext; while (n !== r);
        var s = e.prev,
            o = e.next;
        o.prev = s, s.next = o
    },
    makeEdge() {
        var e = new TESSvertex,
            t = new TESSvertex,
            r = new TESSface,
            n = this.makeEdge_(this.eHead);
        return this.makeVertex_(e, n, this.vHead), this.makeVertex_(t, n.Sym, this.vHead), this.makeFace_(r, n, this.fHead), n
    },
    splice(e, t) {
        var r = !1,
            n = !1;
        if (e !== t) {
            if (t.Org !== e.Org && (n = !0, this.killVertex_(t.Org, e.Org)), t.Lface !== e.Lface && (r = !0, this.killFace_(t.Lface, e.Lface)), this.splice_(t, e), !n) {
                var s = new TESSvertex;
                this.makeVertex_(s, t, e.Org), e.Org.anEdge = e
            }
            if (!r) {
                var o = new TESSface;
                this.makeFace_(o, t, e.Lface), e.Lface.anEdge = e
            }
        }
    },
    delete(e) {
        var t = e.Sym,
            r = !1;
        if (e.Lface !== e.Rface && (r = !0, this.killFace_(e.Lface, e.Rface)), e.Onext === e) this.killVertex_(e.Org, null);
        else if (e.Rface.anEdge = e.Oprev, e.Org.anEdge = e.Onext, this.splice_(e, e.Oprev), !r) {
            var n = new TESSface;
            this.makeFace_(n, e, e.Lface)
        }
        t.Onext === t ? (this.killVertex_(t.Org, null), this.killFace_(t.Lface, null)) : (e.Lface.anEdge = t.Oprev, t.Org.anEdge = t.Onext, this.splice_(t, t.Oprev)), this.killEdge_(e)
    },
    addEdgeVertex(e) {
        var t = this.makeEdge_(e),
            r = t.Sym;
        this.splice_(t, e.Lnext), t.Org = e.Dst;
        var n = new TESSvertex;
        return this.makeVertex_(n, r, t.Org), t.Lface = r.Lface = e.Lface, t
    },
    splitEdge(e) {
        var t = this.addEdgeVertex(e),
            r = t.Sym;
        return this.splice_(e.Sym, e.Sym.Oprev), this.splice_(e.Sym, r), e.Dst = r.Org, r.Dst.anEdge = r.Sym, r.Rface = e.Rface, r.winding = e.winding, r.Sym.winding = e.Sym.winding, r.idx = e.idx, r.Sym.idx = e.Sym.idx, r
    },
    connect(e, t) {
        var r = !1,
            n = this.makeEdge_(e),
            s = n.Sym;
        if (t.Lface !== e.Lface && (r = !0, this.killFace_(t.Lface, e.Lface)), this.splice_(n, e.Lnext), this.splice_(s, t), n.Org = e.Dst, s.Org = t.Org, n.Lface = s.Lface = e.Lface, e.Lface.anEdge = s, !r) {
            var o = new TESSface;
            this.makeFace_(o, n, e.Lface)
        }
        return n
    },
    zapFace(e) {
        var t = e.anEdge,
            r, n, s, o, a;
        n = t.Lnext;
        do r = n, n = r.Lnext, r.Lface = null, r.Rface === null && (r.Onext === r ? this.killVertex_(r.Org, null) : (r.Org.anEdge = r.Onext, this.splice_(r, r.Oprev)), s = r.Sym, s.Onext === s ? this.killVertex_(s.Org, null) : (s.Org.anEdge = s.Onext, this.splice_(s, s.Oprev)), this.killEdge_(r)); while (r != t);
        o = e.prev, a = e.next, a.prev = o, o.next = a
    },
    countFaceVerts_(e) {
        var t = e.anEdge,
            r = 0;
        do r++, t = t.Lnext; while (t !== e.anEdge);
        return r
    },
    mergeConvexFaces(e) {
        var t, r, n, s, o, a, l;
        for (t = this.fHead.next; t !== this.fHead; t = t.next)
            if (!!t.inside)
                for (r = t.anEdge, o = r.Org; n = r.Lnext, s = r.Sym, s && s.Lface && s.Lface.inside && (a = this.countFaceVerts_(t), l = this.countFaceVerts_(s.Lface), a + l - 2 <= e && Geom.vertCCW(r.Lprev.Org, r.Org, s.Lnext.Lnext.Org) && Geom.vertCCW(s.Lprev.Org, s.Org, r.Lnext.Lnext.Org) && (n = s.Lnext, this.delete(s), r = null, s = null)), !(r && r.Lnext.Org === o);) r = n;
        return !0
    },
    check() {
        var e = this.fHead,
            t = this.vHead,
            r = this.eHead,
            n, s, o, a, l, c;
        for (s = e, s = e;
            (n = s.next) !== e; s = n) {
            assert(n.prev === s), l = n.anEdge;
            do assert(l.Sym !== l), assert(l.Sym.Sym === l), assert(l.Lnext.Onext.Sym === l), assert(l.Onext.Sym.Lnext === l), assert(l.Lface === n), l = l.Lnext; while (l !== n.anEdge)
        }
        for (assert(n.prev === s && n.anEdge === null), a = t, a = t;
            (o = a.next) !== t; a = o) {
            assert(o.prev === a), l = o.anEdge;
            do assert(l.Sym !== l), assert(l.Sym.Sym === l), assert(l.Lnext.Onext.Sym === l), assert(l.Onext.Sym.Lnext === l), assert(l.Org === o), l = l.Onext; while (l !== o.anEdge)
        }
        for (assert(o.prev === a && o.anEdge === null), c = r, c = r;
            (l = c.next) !== r; c = l) assert(l.Sym.next === c.Sym), assert(l.Sym !== l), assert(l.Sym.Sym === l), assert(l.Org !== null), assert(l.Dst !== null), assert(l.Lnext.Onext.Sym === l), assert(l.Onext.Sym.Lnext === l);
        assert(l.Sym.next === c.Sym && l.Sym === this.eHeadSym && l.Sym.Sym === l && l.Org === null && l.Dst === null && l.Lface === null && l.Rface === null)
    }
}
// YM

function PQnode() {
    this.handle = null;
}
// JM
function PQhandleElem() {
    this.key = null;
    this.node = null;
}
// NO
function PriorityQ(e, t) {
    this.leq = t, this.max = 0, this.nodes = [], this.handles = [], this.initialized = !1, this.freeList = 0, this.size = 0, this.max = e, this.nodes = [], this.handles = [];
    for (var r = 0; r < e + 1; r++) this.nodes[r] = new PQnode, this.handles[r] = new PQhandleElem;
    this.initialized = !1, this.nodes[1].handle = 1, this.handles[1].key = null
}

PriorityQ.prototype = {

    floatDown_(e) {
        var t = this.nodes,
            r = this.handles,
            n, s, o;
        for (n = t[e].handle; ;) {
            if (o = e << 1, o < this.size && this.leq(r[t[o + 1].handle].key, r[t[o].handle].key) && ++o, assert(o <= this.max), s = t[o].handle, o > this.size || this.leq(r[n].key, r[s].key)) {
                t[e].handle = n, r[n].node = e;
                break
            }
            t[e].handle = s, r[s].node = e, e = o
        }
    },
    floatUp_(e) {
        var t = this.nodes,
            r = this.handles,
            n, s, o;
        for (n = t[e].handle; ;) {
            if (o = e >> 1, s = t[o].handle, o === 0 || this.leq(r[s].key, r[n].key)) {
                t[e].handle = n, r[n].node = e;
                break
            }
            t[e].handle = s, r[s].node = e, e = o
        }
    },
    init() {
        for (var e = this.size; e >= 1; --e) this.floatDown_(e);
        this.initialized = !0
    },
    min() {
        return this.handles[this.nodes[1].handle].key
    },
    insert(e) {
        var t, r;
        if (t = ++this.size, t * 2 > this.max) {
            this.max *= 2;
            var n, s;
            for (s = this.nodes.length, this.nodes.length = this.max + 1, n = s; n < this.nodes.length; n++) this.nodes[n] = new PQnode;
            for (s = this.handles.length, this.handles.length = this.max + 1, n = s; n < this.handles.length; n++) this.handles[n] = new PQhandleElem
        }
        return this.freeList === 0 ? r = t : (r = this.freeList, this.freeList = this.handles[r].node), this.nodes[t].handle = r, this.handles[r].node = t, this.handles[r].key = e, this.initialized && this.floatUp_(t), r
    },
    extractMin() {
        var e = this.nodes,
            t = this.handles,
            r = e[1].handle,
            n = t[r].key;
        return this.size > 0 && (e[1].handle = e[this.size].handle, t[e[1].handle].node = 1, t[r].key = null, t[r].node = this.freeList, this.freeList = r, --this.size, this.size > 0 && this.floatDown_(1)), n
    },
    delete(e) {
        var t = this.nodes,
            r = this.handles,
            n;
        assert(e >= 1 && e <= this.max && r[e].key !== null), n = r[e].node, t[n].handle = t[this.size].handle, r[t[n].handle].node = n, --this.size, n <= this.size && (n <= 1 || this.leq(r[t[n >> 1].handle].key, r[t[n].handle].key) ? this.floatDown_(n) : this.floatUp_(n)), r[e].key = null, r[e].node = this.freeList, this.freeList = e
    }
}

// jg
function ActiveRegion() {
    this.eUp = null;		/* upper edge, directed right to left */
    this.nodeUp = null;	/* dictionary node corresponding to eUp */
    this.windingNumber = 0;	/* used to determine which regions are
                            * inside the polygon */
    this.inside = false;		/* is this region inside the polygon? */
    this.sentinel = false;	/* marks fake edges at t = +/-infinity */
    this.dirty = false;		/* marks regions where the upper or lower
                    * edge has changed, but we haven't checked
                    * whether they intersect yet */
    this.fixUpperEdge = false;	/* marks temporary edges introduced when
                        * we process a "right vertex" (one without
                        * any edges leaving to the right) */
};
// QM

function DictNode() {
    this.key = null;
    this.next = null;
    this.prev = null;
};
// RO

function Dict(frame, leq) {
    this.head = new DictNode();
    this.head.next = this.head;
    this.head.prev = this.head;
    this.frame = frame;
    this.leq = leq;
};
Dict.prototype = {


    min() {
        return this.head.next
    },
    max() {
        return this.head.prev
    },
    insert(e) {
        return this.insertBefore(this.head, e)
    },
    search(e) {
        var t = this.head;
        do t = t.next; while (t.key !== null && !this.leq(this.frame, e, t.key));
        return t
    },
    insertBefore(e, t) {
        do e = e.prev; while (e.key !== null && !this.leq(this.frame, e.key, t));
        var r = new DictNode;
        return r.key = t, r.next = e.next, e.next.prev = r, r.prev = e, e.next = r, r
    },
    delete(e) {
        e.next.prev = e.prev, e.prev.next = e.next
    }
}
// BO
var Sweep = {};

Sweep.regionBelow = function (e) {
    return e.nodeUp.prev.key
}, Sweep.regionAbove = function (e) {
    return e.nodeUp.next.key
}, Sweep.debugEvent = function (e) { }, Sweep.addWinding = function (e, t) {
    e.winding += t.winding, e.Sym.winding += t.Sym.winding
}, Sweep.edgeLeq = function (e, t, r) {
    var n = e.event,
        s = t.eUp,
        o = r.eUp;
    if (s.Dst === n) return o.Dst === n ? Geom.vertLeq(s.Org, o.Org) ? Geom.edgeSign(o.Dst, s.Org, o.Org) <= 0 : Geom.edgeSign(s.Dst, o.Org, s.Org) >= 0 : Geom.edgeSign(o.Dst, n, o.Org) <= 0;
    if (o.Dst === n) return Geom.edgeSign(s.Dst, n, s.Org) >= 0;
    var a = Geom.edgeEval(s.Dst, n, s.Org),
        l = Geom.edgeEval(o.Dst, n, o.Org);
    return a >= l
}, Sweep.deleteRegion = function (e, t) {
    t.fixUpperEdge && assert(t.eUp.winding === 0), t.eUp.activeRegion = null, e.dict.delete(t.nodeUp)
}, Sweep.fixUpperEdge = function (e, t, r) {
    assert(t.fixUpperEdge), e.mesh.delete(t.eUp), t.fixUpperEdge = !1, t.eUp = r, r.activeRegion = t
}, Sweep.topLeftRegion = function (e, t) {
    var r = t.eUp.Org,
        n;
    do t = Sweep.regionAbove(t); while (t.eUp.Org === r);
    if (t.fixUpperEdge) {
        if (n = e.mesh.connect(Sweep.regionBelow(t).eUp.Sym, t.eUp.Lnext), n === null) return null;
        Sweep.fixUpperEdge(e, t, n), t = Sweep.regionAbove(t)
    }
    return t
}, Sweep.topRightRegion = function (e) {
    var t = e.eUp.Dst;
    do e = Sweep.regionAbove(e); while (e.eUp.Dst === t);
    return e
}, Sweep.addRegionBelow = function (e, t, r) {
    var n = new ActiveRegion;
    return n.eUp = r, n.nodeUp = e.dict.insertBefore(t.nodeUp, n), n.fixUpperEdge = !1, n.sentinel = !1, n.dirty = !1, r.activeRegion = n, n
}, Sweep.isWindingInside = function (e, t) {
    switch (e.windingRule) {
        case Tess.ODD:
            return (t & 1) != 0;
        case Tess.NONZERO:
            return t !== 0;
        case Tess.POSITIVE:
            return t > 0;
        case Tess.NEGATIVE:
            return t < 0;
        case Tess.ABS_GEQ_TWO:
            return t >= 2 || t <= -2
    }
    throw new Error("Invalid winding rulle")
}, Sweep.computeWinding = function (e, t) {
    t.windingNumber = Sweep.regionAbove(t).windingNumber + t.eUp.winding, t.inside = Sweep.isWindingInside(e, t.windingNumber)
}, Sweep.finishRegion = function (e, t) {
    var r = t.eUp,
        n = r.Lface;
    n.inside = t.inside, n.anEdge = r, Sweep.deleteRegion(e, t)
}, Sweep.finishLeftRegions = function (e, t, r) {
    for (var n, s = null, o = t, a = t.eUp; o !== r;) {
        if (o.fixUpperEdge = !1, s = Sweep.regionBelow(o), n = s.eUp, n.Org != a.Org) {
            if (!s.fixUpperEdge) {
                Sweep.finishRegion(e, o);
                break
            }
            n = e.mesh.connect(a.Lprev, n.Sym), Sweep.fixUpperEdge(e, s, n)
        }
        a.Onext !== n && (e.mesh.splice(n.Oprev, n), e.mesh.splice(a, n)), Sweep.finishRegion(e, o), a = s.eUp, o = s
    }
    return a
}, Sweep.addRightEdges = function (e, t, r, n, s, o) {
    var a, l, c, u, h = !0;
    c = r;
    do assert(Geom.vertLeq(c.Org, c.Dst)), Sweep.addRegionBelow(e, t, c.Sym), c = c.Onext; while (c !== n);
    for (s === null && (s = Sweep.regionBelow(t).eUp.Rprev), l = t, u = s; a = Sweep.regionBelow(l), c = a.eUp.Sym, c.Org === u.Org;) c.Onext !== u && (e.mesh.splice(c.Oprev, c), e.mesh.splice(u.Oprev, c)), a.windingNumber = l.windingNumber - c.winding, a.inside = Sweep.isWindingInside(e, a.windingNumber), l.dirty = !0, !h && Sweep.checkForRightSplice(e, l) && (Sweep.addWinding(c, u), Sweep.deleteRegion(e, l), e.mesh.delete(u)), h = !1, l = a, u = c;
    l.dirty = !0, assert(l.windingNumber - c.winding === a.windingNumber), o && Sweep.walkDirtyRegions(e, l)
}, Sweep.spliceMergeVertices = function (e, t, r) {
    e.mesh.splice(t, r)
}, Sweep.vertexWeights = function (e, t, r) {
    var n = Geom.vertL1dist(t, e),
        s = Geom.vertL1dist(r, e),
        o = .5 * s / (n + s),
        a = .5 * n / (n + s);
    e.coords[0] += o * t.coords[0] + a * r.coords[0], e.coords[1] += o * t.coords[1] + a * r.coords[1], e.coords[2] += o * t.coords[2] + a * r.coords[2]
}, Sweep.getIntersectData = function (e, t, r, n, s, o) {
    t.coords[0] = t.coords[1] = t.coords[2] = 0, t.idx = -1, Sweep.vertexWeights(t, r, n), Sweep.vertexWeights(t, s, o)
}, Sweep.checkForRightSplice = function (e, t) {
    var r = Sweep.regionBelow(t),
        n = t.eUp,
        s = r.eUp;
    if (Geom.vertLeq(n.Org, s.Org)) {
        if (Geom.edgeSign(s.Dst, n.Org, s.Org) > 0) return !1;
        Geom.vertEq(n.Org, s.Org) ? n.Org !== s.Org && (e.pq.delete(n.Org.pqHandle), Sweep.spliceMergeVertices(e, s.Oprev, n)) : (e.mesh.splitEdge(s.Sym), e.mesh.splice(n, s.Oprev), t.dirty = r.dirty = !0)
    } else {
        if (Geom.edgeSign(n.Dst, s.Org, n.Org) < 0) return !1;
        Sweep.regionAbove(t).dirty = t.dirty = !0, e.mesh.splitEdge(n.Sym), e.mesh.splice(s.Oprev, n)
    }
    return !0
}, Sweep.checkForLeftSplice = function (e, t) {
    var r = Sweep.regionBelow(t),
        n = t.eUp,
        s = r.eUp,
        o;
    if (assert(!Geom.vertEq(n.Dst, s.Dst)), Geom.vertLeq(n.Dst, s.Dst)) {
        if (Geom.edgeSign(n.Dst, s.Dst, n.Org) < 0) return !1;
        Sweep.regionAbove(t).dirty = t.dirty = !0, o = e.mesh.splitEdge(n), e.mesh.splice(s.Sym, o), o.Lface.inside = t.inside
    } else {
        if (Geom.edgeSign(s.Dst, n.Dst, s.Org) > 0) return !1;
        t.dirty = r.dirty = !0, o = e.mesh.splitEdge(s), e.mesh.splice(n.Lnext, s.Sym), o.Rface.inside = t.inside
    }
    return !0
}, Sweep.checkForIntersect = function (e, t) {
    var r = Sweep.regionBelow(t),
        n = t.eUp,
        s = r.eUp,
        o = n.Org,
        a = s.Org,
        l = n.Dst,
        c = s.Dst,
        u, h, d = new TESSvertex,
        f, p;
    if (assert(!Geom.vertEq(c, l)), assert(Geom.edgeSign(l, e.event, o) <= 0), assert(Geom.edgeSign(c, e.event, a) >= 0), assert(o !== e.event && a !== e.event), assert(!t.fixUpperEdge && !r.fixUpperEdge), o === a || (u = Math.min(o.t, l.t), h = Math.max(a.t, c.t), u > h)) return !1;
    if (Geom.vertLeq(o, a)) {
        if (Geom.edgeSign(c, o, a) > 0) return !1
    } else if (Geom.edgeSign(l, a, o) < 0) return !1;
    return Sweep.debugEvent(e), Geom.intersect(l, o, c, a, d), assert(Math.min(o.t, l.t) <= d.t), assert(d.t <= Math.max(a.t, c.t)), assert(Math.min(c.s, l.s) <= d.s), assert(d.s <= Math.max(a.s, o.s)), Geom.vertLeq(d, e.event) && (d.s = e.event.s, d.t = e.event.t), f = Geom.vertLeq(o, a) ? o : a, Geom.vertLeq(f, d) && (d.s = f.s, d.t = f.t), Geom.vertEq(d, o) || Geom.vertEq(d, a) ? (Sweep.checkForRightSplice(e, t), !1) : !Geom.vertEq(l, e.event) && Geom.edgeSign(l, e.event, d) >= 0 || !Geom.vertEq(c, e.event) && Geom.edgeSign(c, e.event, d) <= 0 ? c === e.event ? (e.mesh.splitEdge(n.Sym), e.mesh.splice(s.Sym, n), t = Sweep.topLeftRegion(e, t), n = Sweep.regionBelow(t).eUp, Sweep.finishLeftRegions(e, Sweep.regionBelow(t), r), Sweep.addRightEdges(e, t, n.Oprev, n, n, !0), !0) : l === e.event ? (e.mesh.splitEdge(s.Sym), e.mesh.splice(n.Lnext, s.Oprev), r = t, t = Sweep.topRightRegion(t), p = Sweep.regionBelow(t).eUp.Rprev, r.eUp = s.Oprev, s = Sweep.finishLeftRegions(e, r, null), Sweep.addRightEdges(e, t, s.Onext, n.Rprev, p, !0), !0) : (Geom.edgeSign(l, e.event, d) >= 0 && (Sweep.regionAbove(t).dirty = t.dirty = !0, e.mesh.splitEdge(n.Sym), n.Org.s = e.event.s, n.Org.t = e.event.t), Geom.edgeSign(c, e.event, d) <= 0 && (t.dirty = r.dirty = !0, e.mesh.splitEdge(s.Sym), s.Org.s = e.event.s, s.Org.t = e.event.t), !1) : (e.mesh.splitEdge(n.Sym), e.mesh.splitEdge(s.Sym), e.mesh.splice(s.Oprev, n), n.Org.s = d.s, n.Org.t = d.t, n.Org.pqHandle = e.pq.insert(n.Org), Sweep.getIntersectData(e, n.Org, o, l, a, c), Sweep.regionAbove(t).dirty = t.dirty = r.dirty = !0, !1)
}, Sweep.walkDirtyRegions = function (e, t) {
    for (var r = Sweep.regionBelow(t), n, s; ;) {
        for (; r.dirty;) t = r, r = Sweep.regionBelow(r);
        if (!t.dirty && (r = t, t = Sweep.regionAbove(t), t === null || !t.dirty)) return;
        if (t.dirty = !1, n = t.eUp, s = r.eUp, n.Dst !== s.Dst && Sweep.checkForLeftSplice(e, t) && (r.fixUpperEdge ? (Sweep.deleteRegion(e, r), e.mesh.delete(s), r = Sweep.regionBelow(t), s = r.eUp) : t.fixUpperEdge && (Sweep.deleteRegion(e, t), e.mesh.delete(n), t = Sweep.regionAbove(r), n = t.eUp)), n.Org !== s.Org)
            if (n.Dst !== s.Dst && !t.fixUpperEdge && !r.fixUpperEdge && (n.Dst === e.event || s.Dst === e.event)) {
                if (Sweep.checkForIntersect(e, t)) return
            } else Sweep.checkForRightSplice(e, t);
        n.Org === s.Org && n.Dst === s.Dst && (Sweep.addWinding(s, n), Sweep.deleteRegion(e, t), e.mesh.delete(n), t = Sweep.regionAbove(r))
    }
}, Sweep.connectRightVertex = function (e, t, r) {
    var n, s = r.Onext,
        o = Sweep.regionBelow(t),
        a = t.eUp,
        l = o.eUp,
        c = !1;
    if (a.Dst !== l.Dst && Sweep.checkForIntersect(e, t), Geom.vertEq(a.Org, e.event) && (e.mesh.splice(s.Oprev, a), t = Sweep.topLeftRegion(e, t), s = Sweep.regionBelow(t).eUp, Sweep.finishLeftRegions(e, Sweep.regionBelow(t), o), c = !0), Geom.vertEq(l.Org, e.event) && (e.mesh.splice(r, l.Oprev), r = Sweep.finishLeftRegions(e, o, null), c = !0), c) {
        Sweep.addRightEdges(e, t, r.Onext, s, s, !0);
        return
    }
    Geom.vertLeq(l.Org, a.Org) ? n = l.Oprev : n = a, n = e.mesh.connect(r.Lprev, n), Sweep.addRightEdges(e, t, n, n.Onext, n.Onext, !1), n.Sym.activeRegion.fixUpperEdge = !0, Sweep.walkDirtyRegions(e, t)
}, Sweep.connectLeftDegenerate = function (e, t, r) {
    var n, s, o, a, l;
    if (n = t.eUp, Geom.vertEq(n.Org, r)) {
        assert(!1), Sweep.spliceMergeVertices(e, n, r.anEdge);
        return
    }
    if (!Geom.vertEq(n.Dst, r)) {
        e.mesh.splitEdge(n.Sym), t.fixUpperEdge && (e.mesh.delete(n.Onext), t.fixUpperEdge = !1), e.mesh.splice(r.anEdge, n), Sweep.sweepEvent(e, r);
        return
    }
    assert(!1), t = Sweep.topRightRegion(t), l = Sweep.regionBelow(t), o = l.eUp.Sym, s = a = o.Onext, l.fixUpperEdge && (assert(s !== o), Sweep.deleteRegion(e, l), e.mesh.delete(o), o = s.Oprev), e.mesh.splice(r.anEdge, o), Geom.edgeGoesLeft(s) || (s = null), Sweep.addRightEdges(e, t, o.Onext, a, s, !0)
}, Sweep.connectLeftVertex = function (e, t) {
    var r, n, s, o, a, l, c = new ActiveRegion;
    if (c.eUp = t.anEdge.Sym, r = e.dict.search(c).key, n = Sweep.regionBelow(r), !!n) {
        if (o = r.eUp, a = n.eUp, Geom.edgeSign(o.Dst, t, o.Org) === 0) {
            Sweep.connectLeftDegenerate(e, r, t);
            return
        }
        if (s = Geom.vertLeq(a.Dst, o.Dst) ? r : n, r.inside || s.fixUpperEdge) {
            if (s === r) l = e.mesh.connect(t.anEdge.Sym, o.Lnext);
            else {
                var u = e.mesh.connect(a.Dnext, t.anEdge);
                l = u.Sym
            }
            s.fixUpperEdge ? Sweep.fixUpperEdge(e, s, l) : Sweep.computeWinding(e, Sweep.addRegionBelow(e, r, l)), Sweep.sweepEvent(e, t)
        } else Sweep.addRightEdges(e, r, t.anEdge, t.anEdge, null, !0)
    }
}, Sweep.sweepEvent = function (e, t) {
    e.event = t, Sweep.debugEvent(e);
    for (var r = t.anEdge; r.activeRegion === null;)
        if (r = r.Onext, r === t.anEdge) {
            Sweep.connectLeftVertex(e, t);
            return
        } var n = Sweep.topLeftRegion(e, r.activeRegion);
    assert(n !== null);
    var s = Sweep.regionBelow(n),
        o = s.eUp,
        a = Sweep.finishLeftRegions(e, s, null);
    a.Onext === o ? Sweep.connectRightVertex(e, n, a) : Sweep.addRightEdges(e, n, a.Onext, o, o, !0)
}, Sweep.addSentinel = function (e, t, r, n) {
    var s = new ActiveRegion,
        o = e.mesh.makeEdge();
    o.Org.s = r, o.Org.t = n, o.Dst.s = t, o.Dst.t = n, e.event = o.Dst, s.eUp = o, s.windingNumber = 0, s.inside = !1, s.fixUpperEdge = !1, s.sentinel = !0, s.dirty = !1, s.nodeUp = e.dict.insert(s)
}, Sweep.initEdgeDict = function (e) {
    e.dict = new Dict(e, Sweep.edgeLeq);
    var t = e.bmax[0] - e.bmin[0],
        r = e.bmax[1] - e.bmin[1],
        n = e.bmin[0] - t,
        s = e.bmax[0] + t,
        o = e.bmin[1] - r,
        a = e.bmax[1] + r;
    Sweep.addSentinel(e, n, s, o), Sweep.addSentinel(e, n, s, a)
}, Sweep.doneEdgeDict = function (e) {
    for (var t, r = 0;
        (t = e.dict.min().key) !== null;) t.sentinel || (assert(t.fixUpperEdge), assert(++r == 1)), assert(t.windingNumber === 0), Sweep.deleteRegion(e, t)
}, Sweep.removeDegenerateEdges = function (e) {
    var t, r, n, s = e.mesh.eHead;
    for (t = s.next; t !== s; t = r) r = t.next, n = t.Lnext, Geom.vertEq(t.Org, t.Dst) && t.Lnext.Lnext !== t && (Sweep.spliceMergeVertices(e, n, t), e.mesh.delete(t), t = n, n = t.Lnext), n.Lnext === t && (n !== t && ((n === r || n === r.Sym) && (r = r.next), e.mesh.delete(n)), (t === r || t === r.Sym) && (r = r.next), e.mesh.delete(t))
}, Sweep.initPriorityQ = function (e) {
    var t, r, n, s = 0;
    for (n = e.mesh.vHead, r = n.next; r !== n; r = r.next) s++;
    for (s += 8, t = e.pq = new PriorityQ(s, Geom.vertLeq), n = e.mesh.vHead, r = n.next; r !== n; r = r.next) r.pqHandle = t.insert(r);
    return r !== n ? !1 : (t.init(), !0)
}, Sweep.donePriorityQ = function (e) {
    e.pq = null
}, Sweep.removeDegenerateFaces = function (e, t) {
    var r, n, s;
    for (r = t.fHead.next; r !== t.fHead; r = n) n = r.next, s = r.anEdge, assert(s.Lnext !== s), s.Lnext.Lnext === s && (Sweep.addWinding(s.Onext, s), e.mesh.delete(s));
    return !0
}, Sweep.computeInterior = function (e, t) {
    t === void 0 && (t = !0);
    var r, n;
    if (Sweep.removeDegenerateEdges(e), !Sweep.initPriorityQ(e)) return !1;
    for (Sweep.initEdgeDict(e);
        (r = e.pq.extractMin()) !== null;) {
        for (; n = e.pq.min(), !(n === null || !Geom.vertEq(n, r));)
            n = e.pq.extractMin(),
                Sweep.spliceMergeVertices(e, r.anEdge, n.anEdge);
        Sweep.sweepEvent(e, r)
    }
    return e.event = e.dict.min().key.eUp.Org, Sweep.debugEvent(e), Sweep.doneEdgeDict(e), Sweep.donePriorityQ(e), Sweep.removeDegenerateFaces(e, e.mesh) ? (t && e.mesh.check(), !0) : !1
}

function Tesselator() {
    this.mesh = new TESSmesh;
    this.normal = [0, 0, 0];
    this.sUnit = [0, 0, 0];
    this.tUnit = [0, 0, 0];
    this.bmin = [0, 0];

    this.bmax = [0, 0];
    this.windingRule = Tess.ODD;
    this.dict = null;
    this.pq = null;
    this.event = null;

    this.vertexIndexCounter = 0;
    this.vertices = [];
    this.vertexIndices = [];
    this.vertexCount = 0;
    this.elements = [];
    this.elementCount = 0

}

Tesselator.prototype = {


    dot_(e, t) {
        return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
    },
    normalize_(e) {
        var t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2];
        if (!t) throw "Zero-size vector!";
        t = Math.sqrt(t), e[0] /= t, e[1] /= t, e[2] /= t
    },
    longAxis_(e) {
        var t = 0;
        return Math.abs(e[1]) > Math.abs(e[0]) && (t = 1), Math.abs(e[2]) > Math.abs(e[t]) && (t = 2), t
    },
    computeNormal_(e) {
        var t, r, n, s, o, a, l = [0, 0, 0],
            c = [0, 0, 0],
            u = [0, 0, 0],
            h = [0, 0, 0],
            d = [0, 0, 0],
            f = [null, null, null],
            p = [null, null, null],
            g = this.mesh.vHead;
        t = g.next;
        for (var x = 0; x < 3; ++x) s = t.coords[x], c[x] = s, p[x] = t, l[x] = s, f[x] = t;
        for (t = g.next; t !== g; t = t.next)
            for (var y = 0; y < 3; ++y) s = t.coords[y], s < c[y] && (c[y] = s, p[y] = t), s > l[y] && (l[y] = s, f[y] = t);
        var m = 0;
        if (l[1] - c[1] > l[0] - c[0] && (m = 1), l[2] - c[2] > l[m] - c[m] && (m = 2), c[m] >= l[m]) {
            e[0] = 0, e[1] = 0, e[2] = 1;
            return
        }
        for (a = 0, r = p[m], n = f[m], u[0] = r.coords[0] - n.coords[0], u[1] = r.coords[1] - n.coords[1], u[2] = r.coords[2] - n.coords[2], t = g.next; t !== g; t = t.next) h[0] = t.coords[0] - n.coords[0], h[1] = t.coords[1] - n.coords[1], h[2] = t.coords[2] - n.coords[2], d[0] = u[1] * h[2] - u[2] * h[1], d[1] = u[2] * h[0] - u[0] * h[2], d[2] = u[0] * h[1] - u[1] * h[0], o = d[0] * d[0] + d[1] * d[1] + d[2] * d[2], o > a && (a = o, e[0] = d[0], e[1] = d[1], e[2] = d[2]);
        a <= 0 && (e[0] = e[1] = e[2] = 0, e[this.longAxis_(u)] = 1)
    },
    checkOrientation_() {
        for (var e = this.mesh.fHead, t, r = this.mesh.vHead, n, s = 0, o = e.next; o !== e; o = o.next)
            if (n = o.anEdge, !(n.winding <= 0))
                do s += (n.Org.s - n.Dst.s) * (n.Org.t + n.Dst.t), n = n.Lnext; while (n !== o.anEdge);
        if (s < 0) {
            for (t = r.next; t !== r; t = t.next) t.t = -t.t;
            this.tUnit[0] = -this.tUnit[0], this.tUnit[1] = -this.tUnit[1], this.tUnit[2] = -this.tUnit[2]
        }
    },
    projectPolygon_() {
        var e = this.mesh.vHead,
            t = [0, 0, 0],
            r, n, s = !1;
        t[0] = this.normal[0], t[1] = this.normal[1], t[2] = this.normal[2], !t[0] && !t[1] && !t[2] && (this.computeNormal_(t), s = !0), r = this.sUnit, n = this.tUnit;
        var o = this.longAxis_(t);
        r[o] = 0, r[(o + 1) % 3] = 1, r[(o + 2) % 3] = 0, n[o] = 0, n[(o + 1) % 3] = 0, n[(o + 2) % 3] = t[o] > 0 ? 1 : -1;
        for (var a = e.next; a !== e; a = a.next) a.s = this.dot_(a.coords, r), a.t = this.dot_(a.coords, n);
        s && this.checkOrientation_();
        for (var l = !0, c = e.next; c !== e; c = c.next) l ? (this.bmin[0] = this.bmax[0] = c.s, this.bmin[1] = this.bmax[1] = c.t, l = !1) : (c.s < this.bmin[0] && (this.bmin[0] = c.s), c.s > this.bmax[0] && (this.bmax[0] = c.s), c.t < this.bmin[1] && (this.bmin[1] = c.t), c.t > this.bmax[1] && (this.bmax[1] = c.t))
    },
    addWinding_(e, t) {
        e.winding += t.winding, e.Sym.winding += t.Sym.winding
    },
    tessellateMonoRegion_(e, t) {
        var r, n;
        if (r = t.anEdge, !(r.Lnext !== r && r.Lnext.Lnext !== r)) throw "Mono region invalid";
        for (; Geom.vertLeq(r.Dst, r.Org); r = r.Lprev);
        for (; Geom.vertLeq(r.Org, r.Dst); r = r.Lnext);
        n = r.Lprev;
        for (var s = void 0; r.Lnext !== n;)
            if (Geom.vertLeq(r.Dst, n.Org)) {
                for (; n.Lnext !== r && (Geom.edgeGoesLeft(n.Lnext) || Geom.edgeSign(n.Org, n.Dst, n.Lnext.Dst) <= 0);) s = e.connect(n.Lnext, n), n = s.Sym;
                n = n.Lprev
            } else {
                for (; n.Lnext !== r && (Geom.edgeGoesRight(r.Lprev) || Geom.edgeSign(r.Dst, r.Org, r.Lprev.Org) >= 0);) s = e.connect(r, r.Lprev), r = s.Sym;
                r = r.Lnext
            } if (n.Lnext === r) throw "Mono region invalid";
        for (; n.Lnext.Lnext !== r;) s = e.connect(n.Lnext, n), n = s.Sym;
        return !0
    },
    tessellateInterior_(e) {
        for (var t, r = e.fHead.next; r !== e.fHead; r = t)
            if (t = r.next, r.inside && !this.tessellateMonoRegion_(e, r)) return !1;
        return !0
    },
    discardExterior_(e) {
        for (var t, r = e.fHead.next; r !== e.fHead; r = t) t = r.next, r.inside || e.zapFace(r)
    },
    setWindingNumber_(e, t, r) {
        for (var n, s = e.eHead.next; s !== e.eHead; s = n) n = s.next, s.Rface.inside !== s.Lface.inside ? s.winding = s.Lface.inside ? t : -t : r ? e.delete(s) : s.winding = 0
    },
    getNeighbourFace_(e) {
        return !e.Rface || !e.Rface.inside ? -1 : e.Rface.n
    },
    outputPolymesh_(e, t, r, n) {
        var s, o = 0,
            a = 0,
            l;
        r > 3 && e.mergeConvexFaces(r);
        for (var c = e.vHead.next; c !== e.vHead; c = c.next) c.n = -1;
        for (var u = e.fHead.next; u !== e.fHead; u = u.next)
            if (u.n = -1, !!u.inside) {
                s = u.anEdge, l = 0;
                do {
                    var c = s.Org;
                    c.n === -1 && (c.n = a, a++), l++, s = s.Lnext
                } while (s !== u.anEdge);
                if (l > r) throw "Face vertex greater that support polygon";
                u.n = o, ++o
            } this.elementCount = o, t === Tess.CONNECTED_POLYGONS && (o *= 2), this.elements = [], this.elements.length = o * r, this.vertexCount = a, this.vertices = [], this.vertices.length = a * n, this.vertexIndices = [], this.vertexIndices.length = a;
        for (var c = e.vHead.next; c !== e.vHead; c = c.next)
            if (c.n !== -1) {
                var h = c.n * n;
                this.vertices[h + 0] = c.coords[0], this.vertices[h + 1] = c.coords[1], n > 2 && (this.vertices[h + 2] = c.coords[2]), this.vertexIndices[c.n] = c.idx
            } for (var d = 0, u = e.fHead.next; u !== e.fHead; u = u.next)
            if (!!u.inside) {
                s = u.anEdge, l = 0;
                do {
                    var c = s.Org;
                    this.elements[d++] = c.n, l++, s = s.Lnext
                } while (s !== u.anEdge);
                for (var f = l; f < r; ++f) this.elements[d++] = -1;
                if (t === Tess.CONNECTED_POLYGONS) {
                    s = u.anEdge;
                    do this.elements[d++] = this.getNeighbourFace_(s), s = s.Lnext; while (s !== u.anEdge);
                    for (var p = l; p < r; ++p) this.elements[d++] = -1
                }
            }
    },
    outputContours_(e, t) {
        var r, n, s = 0,
            o = 0;
        this.vertexCount = 0, this.elementCount = 0;
        for (var a = e.fHead.next; a !== e.fHead; a = a.next)
            if (!!a.inside) {
                n = r = a.anEdge;
                do this.vertexCount++, r = r.Lnext; while (r !== n);
                this.elementCount++
            } this.elements = [], this.elements.length = this.elementCount * 2, this.vertices = [], this.vertices.length = this.vertexCount * t, this.vertexIndices = [], this.vertexIndices.length = this.vertexCount;
        var l = 0,
            c = 0,
            u = 0;
        s = 0;
        for (var a = e.fHead.next; a !== e.fHead; a = a.next)
            if (!!a.inside) {
                o = 0, n = r = a.anEdge;
                do this.vertices[l++] = r.Org.coords[0], this.vertices[l++] = r.Org.coords[1], t > 2 && (this.vertices[l++] = r.Org.coords[2]), this.vertexIndices[c++] = this.vertexIdCallback ? this.vertexIdCallback(r) : r.Org.idx, o++, r = r.Lnext; while (r !== n);
                this.elements[u++] = s, this.elements[u++] = o, s += o
            }
    },
    addContour(e, t) {
        this.mesh === null && (this.mesh = new TESSmesh), e < 2 && (e = 2), e > 3 && (e = 3);
        for (var r = null, n = 0; n < t.length; n += e) r === null ? (r = this.mesh.makeEdge(), this.mesh.splice(r, r.Sym)) : (this.mesh.splitEdge(r), r = r.Lnext), r.Org.coords[0] = t[n + 0], r.Org.coords[1] = t[n + 1], e > 2 ? r.Org.coords[2] = t[n + 2] : r.Org.coords[2] = 0, r.Org.idx = this.vertexIndexCounter++, this.edgeCreateCallback && this.edgeCreateCallback(r), r.winding = 1, r.Sym.winding = -1
    },
    tesselate(e, t, r, n, s, o) {
        if (e === void 0 && (e = Tess.ODD), t === void 0 && (t = Tess.POLYGONS), o === void 0 && (o = !0), this.vertices = [], this.elements = [], this.vertexIndices = [], this.vertexIndexCounter = 0, s && (this.normal[0] = s[0], this.normal[1] = s[1], this.normal[2] = s[2]), this.windingRule = e, n < 2 && (n = 2), n > 3 && (n = 3), !this.mesh) return !1;
        this.projectPolygon_(), Sweep.computeInterior(this, o);
        var a = this.mesh;
        return t === Tess.BOUNDARY_CONTOURS ? this.setWindingNumber_(a, 1, !0) : this.tessellateInterior_(a), o && a.check(), t === Tess.BOUNDARY_CONTOURS ? this.outputContours_(a, n) : this.outputPolymesh_(a, t, r, n), !0
    }
}

Tess.tesselate = function (i) {
    var e = i.windingRule,
        t = e === void 0 ? Tess.ODD : e,
        r = i.elementType,
        n = r === void 0 ? Tess.POLYGONS : r,
        s = i.polySize,
        o = s === void 0 ? 3 : s,
        a = i.vertexSize,
        l = a === void 0 ? 2 : a,
        c = i.normal,
        u = c === void 0 ? [0, 0, 1] : c,
        h = i.contours,
        d = h === void 0 ? [] : h,
        f = i.strict,
        p = f === void 0 ? !0 : f,
        g = i.debug,
        x = g === void 0 ? !1 : g;
    if (!d && p) throw new Error("Contours can't be empty");
    if (!!d) {
        var y = new Tesselator;
        i.edgeCreateCallback && (y.edgeCreateCallback = i.edgeCreateCallback), i.vertexIdCallback && (y.vertexIdCallback = i.vertexIdCallback);
        for (var m = 0; m < d.length; m++) y.addContour(l || 2, d[m]);
        return y.tesselate(t, n, o, l, u, p), {
            vertices: y.vertices,
            vertexIndices: y.vertexIndices,
            vertexCount: y.vertexCount,
            elements: y.elements,
            elementCount: y.elementCount,
            mesh: x ? y.mesh : void 0
        }
    }
}

export default Tess;