import DList from './DList'

export default class ReportOp{
    reportOp(e, t) {
        let r = this;
        if (t === null) return;
        r._current = t.data;
        let n = [];
        for (; !(r instanceof DList);) {
            let s = r._path,
                o = r._current;
            if (s !== "" && n.splice(0, 0, s), r = r._parent, r === null) return;
            r.update(s, o)
        }
        r.push(n, e, t.actual, t.reverse)
    }
    deleteChildren(e) {
        if (this._children) {
            let t = this._children[e];
            if (t) {
                let r = t[Symbol()];
                r && r(), delete this._children[e]
            }
        }
    }
}