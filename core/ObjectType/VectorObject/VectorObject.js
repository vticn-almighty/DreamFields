



import { DoubleSide, EventDispatcher, Matrix3, Vector3 } from 'three'
import SpecialMesh from '../../SpecialMesh'
import { Basic } from '../../Lighting'
import { VectorGeometry } from '../../Geometry'
import { VoShapeGeometry } from '../../Geometry/Base/GeometryBase'

let nA = new Matrix3
let tA = new Vector3
let rA = new Vector3
let UF = new Vector3(0, 0, 1)



class VectorObject extends SpecialMesh {
    constructor(e = VectorGeometry.create({}), t = new Basic({
        side: DoubleSide
    })) {
        super(e, t);

        this.recursiveSelection = !1;
        this.objectType = "VectorObject";
        this.eventDispatcher = new EventDispatcher;
        this._onShapeUpdate = () => {
            if (this.geometry instanceof VoShapeGeometry) {
                if (this.geometry.updateFromShape()) {
                    let e = this.geometry.drawCount,
                        t = this.geometry.userData;
                    this.updateGeometry(Object.assign(this.geometry.userData, {
                        parameters: Object.assign(t.parameters, {
                            surfaceMaxCount: e + 1e3
                        })
                    }))
                }
            } else this.updateGeometry({});
            this.geometry.computeBoundingSphere(), this.geometry.computeBoundingBox()
        };
        var r;
        this.castShadow = !0, this.receiveShadow = !0, this.forceComputeSize = !0;
        this.shape = e.userData.shape;
        (r = this.shape.eventDispatcher) == null || r.addEventListener("update", this._onShapeUpdate)
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "VectorObject", t
    }
    fromState(e) {
        return super.fromState(e), this.shape.update(), this
    }
    setHelperVisibility() { }
    updateGeometry(e) {
        if (super.updateGeometry(e), "userData" in this.geometry) {
            let t = this.geometry.userData.parameters;
            this.eventDispatcher.dispatchEvent({
                type: "geometryUpdate",
                parameters: t
            })
        }
    }
    setShape(e) {
        var t, r;
        this.shape && ((t = this.shape.eventDispatcher) == null || t.removeEventListener("update", this._onShapeUpdate))
        this.shape = e, (r = this.shape.eventDispatcher) == null || r.addEventListener("update", this._onShapeUpdate)
    }
    updateWorldMatrix(e, t) {
        super.updateWorldMatrix(e, t);
        nA.getNormalMatrix(this.matrixWorld);
        tA.copy(UF).applyMatrix3(nA).normalize();
        rA.setFromMatrixPosition(this.matrixWorld);
        this.shape.plane.setFromNormalAndCoplanarPoint(tA, rA)
    }
    clone(e) {
        let t = this.shape.clone(),
            r = this.material.clone(),
            n = this.geometry.userData,
            s = VectorGeometry.create(Object.assign({}, n, {
                shape: t
            }))
        o = new VectorObject(s, r).copy(this, e);
        return o.shape = t, t.update(), o
    }
    raycast(e, t) {
        ir.prototype.raycast.call(this, e, t)
    }
};


export { VectorObject }