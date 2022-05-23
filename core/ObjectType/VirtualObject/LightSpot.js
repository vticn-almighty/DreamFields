
import { CameraHelper, SpotLight, MathUtils, Vector3, Quaternion } from 'three'
import { SpotLightWrapperHelper } from '../../Helper'
import { HelperWrapper } from '../../Wrapper'
import { Object3DWrapper } from '../../Wrapper'
let oA = new Vector3;
let aA = new Vector3;
let lA = new Quaternion;

class LightSpot extends HelperWrapper(Object3DWrapper(SpotLight), SpotLightWrapperHelper) {
    constructor(...e) {
        super(...e);
        this.objectType = "LightSpot";
        this._gizmos = {};
        this.castShadow = !0, this.shadow.mapSize.width = 1024, this.shadow.mapSize.height = 1024;
        let r = this.shadow.camera;
        r.fov = MathUtils.RAD2DEG * 2 * this.angle, r.aspect = 1, r.near = 100, r.far = 2500;
        let n = new CameraHelper(this.shadow.camera);
        n.visible = !1, this._gizmos.shadowmap = n, this.update()
    }
    static createFromState(e, t, r) {
        let n = new LightSpot().fromState(t, r);
        return n.uuid = e, n
    }
    get gizmos() {
        return this._gizmos
    }
    showGizmos() {
        for (let e in this._gizmos) {
            let t = this._gizmos[e];
            t instanceof CameraHelper && (t.visible = !0)
        }
    }
    hideGizmos() {
        for (let e in this._gizmos) {
            let t = this._gizmos[e];
            t instanceof CameraHelper && (t.visible = !1)
        }
    }
    update() {
        this.shadow.camera.updateProjectionMatrix();
        for (let e in this._gizmos) {
            let t = this._gizmos[e];
            t instanceof CameraHelper && t.update()
        }
    }
    updateMatrixWorld(e) {
        super.updateMatrixWorld(e);
        aA.setFromMatrixPosition(this.matrixWorld);
        lA.setFromRotationMatrix(this.matrixWorld);
        oA.copy(this.up).applyQuaternion(lA).negate().multiplyScalar(this.distance);
        this.target.position.copy(aA).add(oA);
        this.target.updateMatrixWorld();
        this.enableHelper === !0 && this.objectHelper.visible === !0 && this.objectHelper.update()
    }
    copy(e, t = !0) {
        return super.copy(e, t), this.color.copy(e.color),
            this.intensity = e.intensity, this.distance = e.distance,
            this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay,
            this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
    toJSON(e) {
        let t = super.toJSON(e),
            r = t.object;
        return r.ObjectType = "LightSpot",
            r.color = this.color.getHex(), r.intensity = this.intensity,
            r.distance = this.distance, r.angle = this.angle, r.decay = this.decay,
            r.penumbra = this.penumbra, r.shadow = this.shadow.toJSON(), t
    }
    fromJSON(e) {
        var n;
        super.fromJSON(e);
        this.color.set(e.color);
        this.intensity = e.intensity;
        this.distance = e.distance, this.angle = e.angle, this.decay = e.decay;
        this.penumbra = e.penumbra;
        this.shadow.normalBias = (n = e.shadow.normalBias) != null ? n : 0;
        this.shadow.radius = e.shadow.radius;
        this.shadow.mapSize.fromArray(e.shadow.mapSize);
        let t = this.shadow.camera,
            r = e.shadow.camera;
        return t.near = r.near, t.far = r.far, t.zoom = r.zoom, t.fov = r.fov,
            t.focus = r.focus, t.aspect = r.aspect, t.filmGauge = r.filmGauge,
            t.filmOffset = r.filmOffset,
            r.view !== void 0 && (t.view = Object.assign({}, r.view)), this
    }
    fromSpotLightState(e, t) {
        return super.fromLightState(e, t),
            e.distance !== void 0 && (this.distance = e.distance),
            e.decay !== void 0 && (this.decay = e.decay),
            e.angle !== void 0 && (this.angle = e.angle),
            e.penumbra !== void 0 && (this.penumbra = e.penumbra), this
    }
    fromState(e, t) {
        return super.fromState(e), this.fromSpotLightState(e, t), this
    }
};

export { LightSpot }