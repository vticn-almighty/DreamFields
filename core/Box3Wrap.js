import { Line3, Matrix4, Box3, Vector3 } from 'three'

function $O(i, e, t = 0, r = e.count) {
    let n = 1 / 0,
        s = 1 / 0,
        o = 1 / 0,
        a = -1 / 0,
        l = -1 / 0,
        c = -1 / 0;
    for (let u = t; u < r; u++) {
        let h = e.getX(u),
            d = e.getY(u),
            f = e.getZ(u);
        h < n && (n = h), d < s && (s = d), f < o && (o = f), h > a && (a = h), d > l && (l = d), f > c && (c = f)
    }
    return i.min.set(n, s, o), i.max.set(a, l, c), i
}

let qr = new Vector3
let ke = new Vector3
let Ml = new Box3
let _r = new Matrix4

const A1 = (i, e, t, r) => {
    var n;
    if ("isAbstractMesh" in i) {
        let s = i.geometry.userData.parameters,
            o = i.geometry.getAttribute("position");
        i.geometry.userData.type === "SubdivGeometry" ?
            qr.copy(i.originalGeometry.boundingSphere.center) :
            ($O(Ml, o, i.geometry.drawRange.start, i.geometry.drawRange.count < 1 / 0 ? i.geometry.drawRange.count : o.count), Ml.getCenter(qr))

        i.forceComputeSize ? Ml.getSize(ke).multiplyScalar(.5) : ke.set(s.width, s.height, (n = s.depth) != null ? n : 0).multiplyScalar(.5)
    } else if (("objectHelper" in i) && r === !0) {
        let s = i.geometryHelper.getAttribute("position");
        Ml.setFromArray(s.array);
        Ml.getCenter(qr);
        Ml.getSize(ke).multiplyScalar(.5)
    } else qr.setScalar(0), ke.setScalar(0);
    _r.copy(e).multiply(i.matrixWorld)
    ke.x === 0 && ke.y === 0 && ke.z === 0 ?
        t.push(new Vector3(qr.x, qr.y, qr.z).applyMatrix4(_r)) :
        t.push(new Vector3(-ke.x, ke.y, ke.z).add(qr).applyMatrix4(_r),
            new Vector3(-ke.x, -ke.y, ke.z).add(qr).applyMatrix4(_r),
            new Vector3(ke.x, -ke.y, ke.z).add(qr).applyMatrix4(_r),
            new Vector3(ke.x, ke.y, ke.z).add(qr).applyMatrix4(_r),
            new Vector3(-ke.x, ke.y, -ke.z).add(qr).applyMatrix4(_r),
            new Vector3(-ke.x, -ke.y, -ke.z).add(qr).applyMatrix4(_r),
            new Vector3(ke.x, -ke.y, -ke.z).add(qr).applyMatrix4(_r),
            new Vector3(ke.x, ke.y, -ke.z).add(qr).applyMatrix4(_r))
}

export default class Box3Wrap extends Box3 {
    constructor() {
        super(...arguments);
        this.matrix = new Matrix4;
        this.vertices = [];
        this.faces = [];
        this.edges = [];
        this.centerEdges = []
    }
    copy(e) {
        return super.copy(e), this.matrix.copy(e.matrix), this.vertices = e.vertices.map(t => t.clone()), this.faces = e.faces.map(t => t.clone()), this.edges = e.edges.map(t => t.clone()), this.centerEdges = e.centerEdges.map(t => t.clone()), this
    }
    setFromObjectSize(e, t = !1) {
        e.updateWorldMatrix(!1, t), this.makeEmpty(), this.matrix.copy(e.matrixWorld);
        let r = new Matrix4().copy(e.matrixWorld).invert();
        return this.expandByObjectSize(e, r, t)
    }
    expandByObjectSize(e, t, r = !1) {
        let n = [];
        return r === !0 ? e.traverseEntity(s => A1(s, t, n, e.enableHelper === !0)) : A1(e, t, n, e.enableHelper === !0), this.setFromPoints(n)
    }
    getCenter(e) {
        return e = super.getCenter(e), e.applyMatrix4(this.matrix), e
    }
    getPositionToCenter(e) {
        return e = super.getCenter(e), e.applyMatrix4(_r.copy(this.matrix).setPosition(0, 0, 0)), e
    }
    computeVertices() {
        this.getSize(ke).multiplyScalar(.5), this.getCenter(qr), _r.copy(this.matrix).setPosition(qr), this.vertices = [new Vector3(-ke.x, ke.y, ke.z).applyMatrix4(_r), new Vector3(-ke.x, -ke.y, ke.z).applyMatrix4(_r), new Vector3(ke.x, -ke.y, ke.z).applyMatrix4(_r), new Vector3(ke.x, ke.y, ke.z).applyMatrix4(_r), new Vector3(-ke.x, ke.y, -ke.z).applyMatrix4(_r), new Vector3(-ke.x, -ke.y, -ke.z).applyMatrix4(_r), new Vector3(ke.x, -ke.y, -ke.z).applyMatrix4(_r), new Vector3(ke.x, ke.y, -ke.z).applyMatrix4(_r)]
    }
    computeEdges() {
        this.vertices.length > 0 && this.computeVertices(), this.edges = [new Line3(this.vertices[0], this.vertices[3]), new Line3(this.vertices[1], this.vertices[2]), new Line3(this.vertices[5], this.vertices[6]), new Line3(this.vertices[4], this.vertices[7]), new Line3(this.vertices[0], this.vertices[1]), new Line3(this.vertices[3], this.vertices[2]), new Line3(this.vertices[7], this.vertices[6]), new Line3(this.vertices[4], this.vertices[5]), new Line3(this.vertices[0], this.vertices[4]), new Line3(this.vertices[1], this.vertices[5]), new Line3(this.vertices[2], this.vertices[6]), new Line3(this.vertices[3], this.vertices[7])], this.centerEdges = this.edges.map(e => e.getCenter(new Vector3))
    }
    computeFaces() {
        this.vertices.length > 0 && this.computeVertices(), this.faces = [new Vector3().copy(this.vertices[0]).sub(this.vertices[2]).multiplyScalar(.5).add(this.vertices[2]), new Vector3().copy(this.vertices[7]).sub(this.vertices[5]).multiplyScalar(.5).add(this.vertices[5]), new Vector3().copy(this.vertices[4]).sub(this.vertices[1]).multiplyScalar(.5).add(this.vertices[1]), new Vector3().copy(this.vertices[3]).sub(this.vertices[6]).multiplyScalar(.5).add(this.vertices[6]), new Vector3().copy(this.vertices[4]).sub(this.vertices[3]).multiplyScalar(.5).add(this.vertices[3]), new Vector3().copy(this.vertices[1]).sub(this.vertices[6]).multiplyScalar(.5).add(this.vertices[6])]
    }
};

