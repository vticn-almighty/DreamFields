import {
    OpCEnum,
    OpDEnum
}
    from '../Enum'

function Uc(i) {
    if (i.deepFreeze !== void 0) {
        i.deepFreeze(i);
        return
    }
    let e = Object.getOwnPropertyNames(i);
    for (let t of e) {
        let r = i[t];
        r && typeof r == "object" && Uc(r)
    }
    return Object.freeze(i)
}

function RS(i, e) {
    let t = 0;
    for (; t < i.length && t < e.length;) {
        if (i[t] < e[t]) return - 1;
        if (i[t] > e[t]) return 1;
        t += 1
    }
    return t !== e.length ? -1 : t !== i.length ? 1 : 0
}

function Fi(i, e, t) {
    if (i === void 0 ? e === void 0 ? (i = 0, e = 10) : i = e - 10 : e === void 0 && (e = i + 10), i > e) {
        let s = i;
        i = e,
            e = s
    }
    let r = [],
        n = 1 / (t + 1);
    for (let s = 0; s < t; s++) {
        let o = i + (e - i) * (s + .75 + Math.random() * .5) * n;
        r.push(o)
    }
    return r
}

function FS(i, e) {
    for (let t of i) e(t.id, t.data),
        FS(t.children, e)
}

function US(i, e) {
    e(i.id, i.data);
    for (let t of i.children) US(t, e)
}

export class ObjectList extends Array {
    constructor(...e) {
        super(...e);
        Object.setPrototypeOf(this, ObjectList.prototype)
    }
    deepFreeze() {
        let e = 0;
        for (; e < this.length;) Uc(this[e]),
            e++
    }
    fillCaches0(e, t) {
        var r;
        if ((r = this.objCaches) == null ? void 0 : r.has(e.id)) throw new Error("duplicated item");
        this.objCaches.set(e.id, e),
            this.parentCaches.set(e.id, t);
        for (let n of e.children) this.fillCaches0(n, e.id)
    }
    fillCaches() {
        if (this.objCaches === void 0) {
            this.objCaches = new Map,
                this.parentCaches = new Map;
            for (let e of this) this.fillCaches0(e, null)
        }
    }
    randomId() {
        this.fillCaches();
        let e = Array.from(this.objCaches.keys());
        if (e.length !== 0) return e[Math.max(0, Math.floor(Math.random() * e.length) - 1)]
    }
    isDescendantOf(e, t) {
        for (; e;) {
            let r = this.parent(e);
            if (r === t) return !0;
            e = r
        }
        return !1
    }
    data(e) {
        var t;
        return (t = this.get(e)) == null ? void 0 : t.data
    }
    has(e) {
        return this.childrenOf(e) !== void 0
    }
    get(e) {
        return this.fillCaches(),
            this.objCaches.get(e)
    }
    childrenOf(e) {
        var t;
        return e === null ? this : (t = this.get(e)) == null ? void 0 : t.children
    }
    traverseFrom(e, t) {
        if (e === null) this.traverse(t);
        else {
            let r = this.get(e);
            r && US(r, t)
        }
    }
    traverse(e) {
        FS(this, e)
    }
    totalSize() {
        return this.fillCaches(),
            this.objCaches.size
    }
    parent(e) {
        return this.fillCaches(),
            this.parentCaches.get(e)
    }
    childrenArray(e) {
        return e === null ? this : this.get(e).children
    }
    modifyById(e, t) {
        if (this.get(e) === void 0) throw new Error("not expected"); {
            let n = this.parent(e),
                s = this.childrenArray(n),
                o = s.findIndex(c => c.id === e);
            if (o < 0) throw new Error("not expected");
            let a = s[o];
            return s = [...s],
                s[o] = {
                    ...a,
                    data: t
                },
                this.modifyArrayBy(n, s)
        }
    }
    modifyArrayBy(e, t) {
        let r = e,
            n = t;
        for (; r !== null;) {
            let o = n,
                a = r;
            if (r = this.parent(r), r === void 0) throw new Error;
            n = this.childrenArray(r);
            let l = n.findIndex(c => c.id === a);
            if (l < 0) throw new Error;
            n = [...n],
                n[l] = {
                    ...n[l],
                    children: o
                }
        }
        Object.setPrototypeOf(n, ObjectList.prototype);
        let s = n;
        return s.fillCaches(),
            s
    }
    runOp(e) {
        switch (e.type) {
            case OpDEnum.Add:
                return this.addOp(e);
            case OpDEnum.Delete:
                return this.deleteOp(e);
            case OpDEnum.Move:
                return this.moveOp(e)
        }
    }
    addOp(e) {
        let {
            parent:
            t,
            fi: r,
            id: n,
            data: s,
            children: o
        } = e;
        if (t !== null && this.get(t) === void 0) return null;
        if (this.get(n) !== void 0) return null; {
            let a = t,
                l = this.childrenArray(a),
                c = {
                    fi: r,
                    id: n,
                    data: s,
                    children: o
                };
            return l = [...l, c],
                l.sort((h, d) => h.fi - d.fi),
                e.localIndex = l.indexOf(c),
            {
                data: this.modifyArrayBy(a, l),
                actual: e,
                reverse: {
                    type: OpDEnum.Delete,
                    id: n
                }
            }
        }
    }
    deleteOp(e) {
        let {
            id: t
        } = e;
        if (this.get(t) === null) return null; {
            let r = this.parent(t);
            if (r === void 0) return null;
            let n = this.childrenArray(r),
                s = n.findIndex(l => l.id === t);
            e.localIndex = s,
                n = [...n];
            let o = n.splice(s, 1)[0];
            return {
                data: this.modifyArrayBy(r, n),
                actual: e,
                reverse: {
                    type: OpDEnum.Add,
                    ...o,
                    parent: r
                }
            }
        }
    }
    moveOp(e) {
        let {
            parent: t,
            fi: r,
            id: n
        } = e;
        if (t !== null && this.get(t) === void 0) return this.deleteOp({
            type: OpDEnum.Delete,
            id: n
        });
        if (t !== null) {
            let d = t;
            for (; d !== null;) {
                if (d === void 0) throw new Error;
                if (d === n) throw new Error("cyclic tree");
                d = this.parent(d)
            }
        }
        let s = this.parent(n);
        if (s === void 0) return null;
        let o = s,
            a = this.childrenArray(s),
            l = a.findIndex(d => d.id === n);
        a = [...a];
        let c = a.splice(l, 1)[0],
            u = this.modifyArrayBy(s, a);
        s = t,
            a = u.childrenArray(s);
        let h = c.fi;
        return c = {
            ...c,
            fi: r
        },
            a = [...a, c],
            a.sort((d, f) => d.fi - f.fi),
            e.localIndex = a.indexOf(c),
            u = u.modifyArrayBy(s, a),
        {
            data: u,
            actual: e,
            reverse: {
                type: OpDEnum.Move,
                parent: o,
                fi: h,
                id: n
            }
        }
    }
    previous(e, t) {
        if (t === null) {
            let n = this.childrenArray(e);
            return n.length === 0 ? null : n[n.length - 1].id
        }
        let r = null;
        for (let n of this.childrenArray(e)) {
            if (n.id === t) return r;
            r = n.id
        }
        return null
    }
    traverseSortNext(e) {
        let t = this.parent(e);
        if (t !== void 0) {
            let r = this.childrenArray(t),
                n = r.findIndex(s => s.id === e) + 1;
            if (n < r.length) return r[n].id;
            if (t) return this.traverseSortNext(t)
        }
    }
    sortNext(e) {
        let t = this.childrenArray(e);
        return t.length > 0 ? t[0].id : this.traverseSortNext(e)
    }
    traverseSortPrevious(e) {
        let t = this.childrenArray(e);
        return t.length > 0 ? this.traverseSortPrevious(t[t.length - 1].id) : e
    }
    sortPrevious(e) {
        let t = this.parent(e);
        if (t !== void 0) {
            let r = this.childrenArray(t),
                n = r.findIndex(s => s.id === e) - 1;
            return n >= 0 ? this.traverseSortPrevious(r[n].id) : t
        }
    }
    getAllSorted(e) {
        let t = [];
        for (let r of e) {
            let n = this.getWithSortKey(r.id);
            n !== void 0 && t.push({
                ...r,
                ...n
            })
        }
        t.sort((r, n) => RS(r.sortKey, n.sortKey));
        for (let r of t) delete r.sortKey;
        return t
    }
    getWithSortKey(e) {
        var t = e;
        let r = [],
            n = this.get(t),
            s = n;
        if (n !== void 0) {
            for (; t;) r.splice(0, 0, n.fi),
                t = this.parent(t),
                t !== null && (n = this.get(t));
            return {
                ...s,
                sortKey: r
            }
        }
    }
    insertBeforeHelper(e, t, r) {
        return this.insertAfterHelper(e, this.previous(e, t), r)
    }
    insertAfterHelper(e, t, r) {
        let n = this.childrenArray(e);
        if (t === null) {
            if (n.length === 0) return Fi(0, r, r); {
                let s = n[0].fi;
                return Fi(s - r, s, r)
            }
        } else {
            let s = this.get(t);
            if (s === void 0 || this.parent(t) !== e) throw new Error("illegal args");
            let o = n.find(a => a.fi > s.fi);
            if (o === void 0) {
                let a = n[n.length - 1].fi;
                return Fi(a, a + r, r)
            } else return Fi(s.fi, o.fi, r)
        }
    }
};

export class LayerList extends Array {
    constructor(...e) {
        super(...e);
        Object.setPrototypeOf(this, LayerList.prototype)
    }
    deepFreeze() {
        let e = 0;
        for (; e < this.length;) Uc(this[e]),
            e++
    }
    fillCaches0(e) {
        this.objCaches.set(e.id, e)
    }
    fillCaches() {
        if (this.objCaches === void 0) {
            this.objCaches = new Map,
                Object.getOwnPropertyDescriptor(this, "objCaches").enumerable = !1;
            for (let e of this) this.fillCaches0(e)
        }
    }
    randomId() {
        this.fillCaches();
        let e = Array.from(this.objCaches.keys());
        if (e.length !== 0) return e[Math.max(0, Math.floor(Math.random() * e.length) - 1)]
    }
    data(e) {
        var t;
        return (t = this.get(e)) == null ? void 0 : t.data
    }
    get(e) {
        return this.fillCaches(),
            this.objCaches.get(e)
    }
    modifyById(e, t) {
        if (this.get(e) === void 0) throw new Error("not expected"); {
            let n = this,
                s = n.findIndex(l => l.id === e);
            if (s < 0) throw new Error("not expected");
            let o = n[s];
            return n = [...n],
                n[s] = {
                    ...o,
                    data: t
                },
                this.modifyArrayBy(n)
        }
    }
    modifyArrayBy(e) {
        Object.setPrototypeOf(e, LayerList.prototype);
        let t = e;
        return typeof process != "undefined" || t.fillCaches(),
            t
    }
    runOp(e) {
        switch (e.type) {
            case OpCEnum.Add:
                return this.addOp(e);
            case OpCEnum.Delete:
                return this.deleteOp(e);
            case OpCEnum.Move:
                return this.moveOp(e)
        }
    }
    addOp(e) {
        let {
            fi:
            t,
            id: r,
            data: n
        } = e,
            s = this,
            o = {
                fi: t,
                id: r,
                data: n
            };
        return s = [...s, o],
            s.sort((l, c) => l.fi - c.fi),
            e.localIndex = s.indexOf(o),
        {
            data: this.modifyArrayBy(s),
            actual: e,
            reverse: {
                type: OpCEnum.Delete,
                id: r
            }
        }
    }
    deleteOp(e) {
        let {
            id: t
        } = e,
            r = this,
            n = r.findIndex(a => a.id === t);
        if (n === -1) return null;
        e.localIndex = n,
            r = [...r];
        let s = r.splice(n, 1)[0];
        return {
            data: this.modifyArrayBy(r),
            actual: e,
            reverse: {
                type: OpCEnum.Add,
                ...s
            }
        }
    }
    moveOp(e) {
        let {
            fi: t,
            id: r
        } = e,
            n = this;
        n = [...n];
        let s = n.findIndex(c => c.id === r);
        if (s === -1) return null;
        let o = n[s].fi,
            a = {
                ...n[s],
                fi: t
            };
        return n[s] = a,
            n.sort((c, u) => c.fi - u.fi),
            e.localIndex = n.indexOf(a),
        {
            data: this.modifyArrayBy(n),
            actual: e,
            reverse: {
                type: OpCEnum.Move,
                fi: o,
                id: r
            }
        }
    }
    previous(e) {
        if (e === null) return this.length === 0 ? null : this[this.length - 1].id;
        let t = null;
        for (let r of this) {
            if (r.id === e) return t;
            t = r.id
        }
        return null
    }
    insertBeforeHelper(e, t) {
        return this.insertAfterHelper(this.previous(e), t)
    }
    insertAfterHelper(e, t) {
        let r = this;
        if (e === null) {
            if (r.length === 0) return Fi(0, t, t); {
                let n = r[0].fi;
                return Fi(n - t, n, t)
            }
        } else {
            let n = this.get(e);
            if (n === void 0) throw new Error("illegal args");
            let s = r.find(o => o.fi > n.fi);
            if (s === void 0) {
                let o = r[r.length - 1].fi;
                return Fi(o, o + t, t)
            } else return Fi(n.fi, s.fi, t)
        }
    }
};