



import { Matrix4 } from 'three'
import SpecialMesh from '../../SpecialMesh'
import { createSingleMaterial } from '../../Tool'
import { Phong } from '../../Lighting'
import Tool from '../../normal/Tool'
import NonParametric from '../../ObjectType/NonParametric'


class SubdivObject extends SpecialMesh {
    constructor(e, t, r, n = new Phong) {
        super(r != null ? r : t, n);
        this.subdivPointer = e;
        this.originalGeometry = t;
        this.subdividedGeometry = r;
        this.objectType = "SubdivObject";
        this.hiddenMatrixOld = new Matrix4;
        this.smoothShading = !0;
        this.matrixWorldRigid = new Matrix4;
        this.castShadow = !0, this.receiveShadow = !0, this.forceComputeSize = !1
    }
    static createFromState(e, t, r) {
        let {
            subdivPointer: n,
            originalGeometry: s,
            subdividedGeometry: o
        } = Tool.build(t.geometry, void 0, void 0, !t.flatShading), a = createSingleMaterial(t.material, r), l = new SubdivObject(n, s, o || void 0, a);
        return l.calcBoundingBox(), l.freeSubdivPointer(), l.uuid = e, l.fromState(t), l
    }
    shallowClone(e) {
        return new NonParametric(this.geometry, this.material).shallowCopy(this, e)
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "SubdivObject", t
    }
    buildFromStore(e) {
        var s, o, a;
        let {
            originalGeometry: t,
            subdividedGeometry: r,
            subdivPointer: n
        } = Tool.build(e, this.subdivPointer, void 0, this.smoothShading, this.shearScale);
        if (this.subdivPointer = n, t !== void 0 && ((s = this.originalGeometry) == null || s.dispose(), this.originalGeometry = t), r !== void 0 && ((o = this.subdividedGeometry) == null || o.dispose(), this.subdividedGeometry = r != null ? r : void 0), this.geometry = (a = this.subdividedGeometry) != null ? a : this.originalGeometry, this.cloner)
            for (let l of this.cloner.children) l.geometry = this.geometry;
        e.width && (this.geometry.userData.parameters = {
            width: e.width,
            height: e.height,
            depth: e.depth
        })
    }
    updateMesh(e = !1) {
        Tool.buildLevel(this.subdivPointer, !0, this.smoothShading, this.originalGeometry, e ? this.shearScaleInv : void 0), this.subdividedGeometry && Tool.buildLevel(this.subdivPointer, !1, this.smoothShading, this.subdividedGeometry, e ? this.shearScaleInv : void 0)
    }
    updateTopology() {
        var e;
        this.originalGeometry.dispose(),
            this.originalGeometry = Tool.buildLevel(this.subdivPointer, !0, this.smoothShading),
            this.subdividedGeometry && (this.subdividedGeometry.dispose(),
                this.subdividedGeometry = Tool.buildLevel(this.subdivPointer, !1, this.smoothShading)),
            this.geometry = (e = this.subdividedGeometry) != null ? e : this.originalGeometry
    }
    raycast(e, t) {
        var r;
        this.geometry = this.originalGeometry;
        ir.prototype.raycast.call(this, e, t);
        this.geometry = (r = this.subdividedGeometry) != null ? r : this.originalGeometry
    }
    updateMatrixWorldSVD() {
        let e = this.matrixWorld.elements,
            t = [
                [e[0], e[4], e[8]],
                [e[1], e[5], e[9]],
                [e[2], e[6], e[10]]
            ],
            {
                u: r,
                v: n,
                q: s
            } = SVD(t),
            o = pA.set(r[0][0], r[0][1], r[0][2], 0, r[1][0], r[1][1], r[1][2], 0, r[2][0], r[2][1], r[2][2], 0, 0, 0, 0, 1),
            a = zF.set(n[0][0], n[0][1], n[0][2], 0, n[1][0], n[1][1], n[1][2], 0, n[2][0], n[2][1], n[2][2], 0, 0, 0, 0, 1),
            l = kF.copy(a).transpose();
        this.shearScale = VF.makeScale(s[0], s[1], s[2]).multiply(l).premultiply(a), this.shearScaleInv = HF.copy(this.shearScale).invert(), this.matrixWorldRigid.multiplyMatrices(o, l), s.every(c => Math.abs(s[0] - c) < .01) && (this.shearScale = void 0, this.shearScaleInv = void 0)
    }
    // activateSVDCompensation() {
    //     this.shearScale !== void 0 && (this.matrixAutoUpdate = !1, this.matrix.copy(this.matrixWorldRigid).copyPosition(this.matrixWorld), this.hiddenMatrixOld.copy(this.hiddenMatrix), this.hiddenMatrix.copy(this.parent.matrixWorld).invert())
    // }
    // deactivateSVDCompensation() {
    //     this.shearScale !== void 0 && (this.shearScale = void 0, this.shearScaleInv = void 0, this.matrixAutoUpdate = !0, this.hiddenMatrix.copy(this.hiddenMatrixOld))
    // }
    // calcBoundingBox() {
    //     let e = this.originalGeometry;
    //     e.boundingSphere === null && (e.boundingSphere = new Sphere);
    //     let t = e.attributes.position,
    //         r = e.boundingSphere.center;
    //     Si.setFromBufferAttribute(t), Si.getCenter(r), e.boundingSphere.radius = r.distanceTo(Si.max), isNaN(e.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this), Si.getSize(co);
    //     let n = {
    //         width: co.x,
    //         height: co.y,
    //         depth: co.z
    //     };
    //     return this.geometry.userData.parameters = n, n
    // }
    // updateBoundingBox(e) {
    //     let t = this.originalGeometry;
    //     Si.min.set(e[0], e[2], e[4]), Si.max.set(e[1], e[3], e[5]), this.shearScaleInv && (Si.min.applyMatrix4(this.shearScaleInv), Si.max.applyMatrix4(this.shearScaleInv)), t.boundingSphere === null && (t.boundingSphere = new Sphere);
    //     let r = t.boundingSphere.center;
    //     Si.getCenter(r), t.boundingSphere.radius = r.distanceTo(Si.max), isNaN(t.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this), Si.getSize(co);
    //     let n = {
    //         width: co.x,
    //         height: co.y,
    //         depth: co.z
    //     };
    //     return this.geometry.userData.parameters = n, n
    // }
    // freeSubdivPointer() {
    //     this.subdivPointer && (Ly.free_bvh(this.subdivPointer), Ly.free_subdivision_surface(this.subdivPointer), this.subdivPointer = 0)
    // }
    // updateGeometry(e) {
    //     this.geometry.userData.scale || (this.geometry.userData.scale = Array(3)), this.geometry.userData.scale[0] = this.geometry.userData.parameters.width === 0 ? 1 : e.parameters.width / this.geometry.userData.parameters.width, this.geometry.userData.scale[1] = this.geometry.userData.parameters.height === 0 ? 1 : e.parameters.height / this.geometry.userData.parameters.height, this.geometry.userData.scale[2] = this.geometry.userData.parameters.depth === 0 ? 1 : e.parameters.depth / this.geometry.userData.parameters.depth, mA(this.originalGeometry.attributes, ...this.geometry.userData.scale), this.originalGeometry.attributes.position.needsUpdate = !0, this.originalGeometry.attributes.normal.needsUpdate = !0, this.subdividedGeometry && (mA(this.subdividedGeometry.attributes, ...this.subdividedGeometry.userData.scale), this.subdividedGeometry.attributes.position.needsUpdate = !0, this.subdividedGeometry.attributes.normal.needsUpdate = !0), this.geometry.userData.parameters = { ...e.parameters }
    // }
};


export { SubdivObject }