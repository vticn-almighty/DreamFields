


import { SpotLightHelper, PointLightHelper, AxesHelper, DirectionalLightHelper, Vector3 } from 'three'
import CameraHelper from './CameraHelper'
import { ProtoHelperWrapper } from './Wrapper'
import { setRaycastHelper } from './Tool'

class CombinedCameraHelper extends ProtoHelperWrapper(CameraHelper) {
    constructor(e) {
        super(e);
        this.object = e;
        this.object = e, this.name = `CombinedCameraHelper: ${e.uuid}`
    }
    updateMatrixWorld(e) {
        super.updateMatrixWorld(e), this.updateTarget()
    }
    updateTarget() {
        let e = this.object.getTarget();
        this.updateWorldMatrix(!0, !1), this.worldToLocal(e)
    }
    raycast(e, t) {
        setRaycastHelper(this.object, this.geometry, e, t, !0)
    }
};

class DirectionalLightWrapperHelper extends ProtoHelperWrapper(DirectionalLightHelper) {
    constructor(e, t = 15, r = 10066329) {
        super(e, t, r);
        this.object = e;
        this.name = `DirectionalLightHelper: ${e.uuid}`
    }
    raycast(e, t) {
        setRaycastHelper(this.object, DirectionalLightHelper.geometryHelper, e, t)
    }
};

class EmptyObjectHelper extends ProtoHelperWrapper(AxesHelper) {
    constructor(e, t = 15) {
        super(t);
        this.object = e;
        this.object.updateMatrixWorld(), this.name = `EmptyObjectHelper: ${e.uuid}`, this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1
    }
    raycast(e, t) {
        setRaycastHelper(this.object, EmptyObjectHelper.geometryHelper, e, t)
    }
    update() { }
};


class PointLightWrapperHelper extends ProtoHelperWrapper(PointLightHelper) {
    constructor(e, t = 15, r = 6710886) {
        super(e, t, r);
        this.object = e;
        this.name = `PointLightHelper: ${e.uuid}`
    }
    raycast(e, t) {
        setRaycastHelper(this.object, PointLightHelper.geometryHelper, e, t)
    }
};

class SpotLightWrapperHelper extends ProtoHelperWrapper(SpotLightHelper) {
    constructor(e, t = 6710886) {
        super(e, t);
        this.object = e;
        this.name = `SpotLightHelper: ${e.uuid}`
    }
    raycast(e, t) {
        setRaycastHelper(this.object, SpotLightHelper.geometryHelper, e, t)
    }
    update() {
        if (this.object !== void 0) {
            let e = SpotLightHelper._vector,
                t = this.object.distance ? this.object.distance : 1e3,
                r = t * Math.tan(this.object.angle);
            this.cone.scale.set(r, r, t), e.setFromMatrixPosition(this.object.target.matrixWorld), this.cone.lookAt(e);
            let n = this.color !== void 0 ? this.color : this.light.color;
            if (this.cone.material instanceof Array)
                for (let s = 0, o = this.cone.material.length; s < o; s++) this.cone.material[s].color.set(n);
            else this.cone.material.color.set(n)
        }
    }
}

SpotLightWrapperHelper._vector = new Vector3;

export { CombinedCameraHelper, DirectionalLightWrapperHelper, EmptyObjectHelper, PointLightWrapperHelper, SpotLightWrapperHelper }