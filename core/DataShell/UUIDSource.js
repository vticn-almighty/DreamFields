import {
    OpBEnum
}
from '../Enum'

export class UUIDSource {
    modifyById(e, t) {
        let r = this;
        if (r[e] === void 0) throw new Error("not expected"); {
            let s = {...r,
                [e] : t
            };
            return Object.setPrototypeOf(s, UUIDSource.prototype),
            s
        }
    }
    add(e, t) {
        var n;
        let r = this.runOp({
            type: OpBEnum.Add,
            id: e,
            data: t
        });
        return (n = r == null ? void 0 : r.data) != null ? n: this
    }
    runOp(e) {
        let t = this;
        if (e.type === OpBEnum.Add) {
            let r = t[e.id],
            n;
            r === void 0 ? n = {
                type: OpBEnum.Delete,
                id: e.id
            }: n = {
                type: OpBEnum.Add,
                id: e.id,
                data: r
            };
            let {
                id: s,
                data: o
            } = e,
            a = {...t,
                [s] : o
            };
            return Object.setPrototypeOf(a, UUIDSource.prototype),
            {
                data: a,
                actual: e,
                reverse: n
            }
        } else if (e.type === OpBEnum.Delete) {
            let {
                id: r
            } = e,
            n = t[r];
            if (n === void 0) return null; {
                let s = {...t
                };
                return Object.setPrototypeOf(s, UUIDSource.prototype),
                delete s[r],
                {
                    data: s,
                    actual: e,
                    reverse: {
                        type: OpBEnum.Add,
                        id: r,
                        data: n
                    }
                }
            }
        }
        throw new Error("illegal arg")
    }
};