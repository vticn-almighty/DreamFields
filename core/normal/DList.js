import { sg } from '../Tool'
export default class DList {
    constructor(e) {
        this.ts = [], this.actual = [], this.reverse = [], this._current = e
    }
    update(e, t) {
        if (e !== "") throw new Error("");
        this._current = t
    }
    push(e, t, r, n) {
        sg(this.ts, t, e)
        sg(this.actual, r, e)
        sg(this.reverse, n, e)
    }
    result() {
        return {
            data: this._current,
            ts: this.ts,
            actual: this.actual,
            reverse: this.reverse.reverse()
        }
    }
};
