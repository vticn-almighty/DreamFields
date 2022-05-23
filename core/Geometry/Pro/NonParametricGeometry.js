import {
    BufferGeometry,
    BoxGeometry,
    BufferGeometryLoader,
    Vector3
}
    from 'three'
import Modify from '../../normal/Modify';
let Dr = new Vector3;
export class NonParametricGeometry {
    static create(i) {
        return this.build(this.normalizeInputs(i))
    }
    static normalizeInputs(i, e) {
        var s, o;
        let t = (o = (s = i.geometry) != null ? s : e == null ? void 0 : e.geometry) != null ? o : new BufferGeometry().copy(new BoxGeometry(100, 100, 100)),
            r;
        e === void 0 ? (t.computeBoundingBox(), t.boundingBox.getSize(Dr), r = {
            width: Dr.x,
            height: Dr.y,
            depth: Dr.z,
            subdivisions: 0
        }) : r = e.parameters;
        let n = {
            ...r,
            ...i.parameters
        }
        return {
            parameters: {
                width: Math.abs(n.width),
                height: Math.abs(n.height),
                depth: Math.abs(n.depth),
                subdivisions: Math.abs(n.subdivisions)
            },
            geometry: t
        }
    }
    static build(i) {
        var l;
        let {
            width: e,
            height: t,
            depth: r,
            subdivisions: n
        } = i.parameters,
            s = (l = i.geometry) != null ? l : new BufferGeometry().copy(new BoxGeometry(100, 100, 100)),
            o = s.userData.parameters;
        o === void 0 ? (s.computeBoundingBox(), s.boundingBox.getSize(Dr)) : Dr.set(o.width, o.height, o.depth),
            (e !== Dr.x || t !== Dr.y || r !== Dr.z) && s.scale(Dr.x === 0 ? 1 : e / Dr.x, Dr.y === 0 ? 1 : t / Dr.y, Dr.z === 0 ? 1 : r / Dr.z);
        let a = s.originalGeometry;
        return n > 0 ? (a === void 0 || (o == null ? void 0 : o.subdivisions) !== n) && (a === void 0 && (a = s), s = new Modify(n).modify(a).toBufferGeometry()) : (a !== void 0 && (s = a), a = void 0, s.getAttribute("normal") === void 0 && s.computeVertexNormals()),
            a !== void 0 && Object.assign(s, {
                originalGeometry: a
            }),
            delete i.geometry,
            Object.assign(s, {
                userData: {
                    ...i,
                    type: "NonParametricGeometry"
                }
            })
    }
    static loadFromUrl(i, e, t) {
        new BufferGeometryLoader(t).load(i, n => {
            let s = this.normalizeInputs({
                geometry: n
            });
            n.boundingBox.getSize(Dr);
            let o = 100 / Dr.x;
            Object.assign(s.parameters, {
                width: 100,
                height: Dr.y * o,
                depth: Dr.z * o
            }),
                e(this.build(s))
        })
    }
};