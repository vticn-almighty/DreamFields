import { PerspectiveCamera, OrthographicCamera, Camera, Object3D, Vector3, Quaternion } from 'three'
import { CameraDefault } from '../../Tool'
import { CombinedCameraHelper } from '../../Helper'
import { Object3DWrapper } from '../../Wrapper'
import { HelperWrapper } from '../../Wrapper'
let Ey = new Vector3

class CombinedCamera extends HelperWrapper(Object3DWrapper(Camera), CombinedCameraHelper) {
    constructor(e = window.innerWidth, t = window.innerHeight, r = 45, n, s = 1e5) {
        super();
        this.objectType = "CombinedCamera";
        this._cameraType = "OrthographicCamera";
        this.targetOffset = CameraDefault.DefaultTargetOffset;
        this.isUpVectorFlipped = !1;
        this.angleOffsetFromUp = 0;
        this.width = e, this.height = t,
            this.orthoCamera = new OrthographicCamera(e * -.5, e * .5, t * .5, t * -.5, n != null ? n : -5e4, s);
        this.perspCamera = new PerspectiveCamera(r, e / t, n != null ? n : 50, s);
        this.left = this.orthoCamera.left, this.right = this.orthoCamera.right;
        this.top = this.orthoCamera.top, this.bottom = this.orthoCamera.bottom;
        this.far = this.orthoCamera.far, this.view = this.orthoCamera.view;
        this.aspect = this.perspCamera.aspect, this.fov = this.perspCamera.fov;
        this.focus = this.perspCamera.focus, this.filmGauge = this.perspCamera.filmGauge;
        this.filmOffset = this.perspCamera.filmOffset, this.toOrthographic(!0)
    }
    static createFromState(e, t) {
        let r = new CombinedCamera().fromState(t);
        return r.enableHelper = !0, r.objectHelper.update(), r.uuid = e, r
    }
    get isPerspectiveCamera() {
        return this.cameraType === "PerspectiveCamera"
    }
    get isOrthographicCamera() {
        return !this.isPerspectiveCamera
    }
    get cameraType() {
        return this._cameraType
    }
    setNear(e, t) {
        e === "PerspectiveCamera" ? this.perspCamera.near = t : this.orthoCamera.near = t
    }
    setZoom(e, t) {
        t >= 0 && (e === "PerspectiveCamera" ? this.perspCamera.zoom = t : this.orthoCamera.zoom = t)
    }
    set cameraType(e) {
        e === "PerspectiveCamera" ? this.toPerspective() : e === "OrthographicCamera" && this.toOrthographic()
    }
    get near() {
        return this._cameraType === "PerspectiveCamera" ? this.perspCamera.near : this.orthoCamera.near
    }
    set near(e) {
        this._cameraType === "PerspectiveCamera" ? this.perspCamera.near = e : this.orthoCamera.near = e
    }
    get zoom() {
        return this._cameraType === "PerspectiveCamera" ? this.perspCamera.zoom : this.orthoCamera.zoom
    }
    set zoom(e) {
        e >= 0 && (this._cameraType === "PerspectiveCamera" ? this.perspCamera.zoom = e : this.orthoCamera.zoom = e)
    }
    lookAt(e) {
        super.lookAt(e), this.getWorldPosition(Ey), this.targetOffset = Ey.distanceTo(e)
    }
    getTarget(e = new Vector3) {
        return this.getWorldDirection(Ey), this.getWorldPosition(Ey), Ey.multiplyScalar(this.targetOffset), e.copy(Ey).add(Ey), e
    }
    getDistanceToTarget() {
        let e = this.getTarget();
        return this.getWorldPosition(Ey), Ey.distanceTo(e)
    }
    updateUp() {
        let e = this.getWorldQuaternion(new Quaternion),
            t = new Vector3(0, 0, 1).applyQuaternion(e),
            r = new Vector3().copy(Object3D.DefaultUp);
        this.isUpVectorFlipped && r.negate(), r.applyQuaternion(e);
        let n = new Vector3().copy(Object3D.DefaultUp).projectOnPlane(t),
            s = new Vector3().crossVectors(n, r).dot(t) >= 0 ? 1 : -1;
        this.angleOffsetFromUp = n.angleTo(r) * s
    }
    getViewFrontToObject(e) {
        let t = e.getWorldPosition(new Vector3),
            n = e.getWorldDirection(new Vector3).multiplyScalar(this.targetOffset);
        return {
            position: t.clone().add(n),
            target: t
        }
    }
    getViewToObject(e) {
        let t = e.getWorldPosition(new Vector3),
            n = this.getWorldDirection(new Vector3).multiplyScalar(this.targetOffset);
        return {
            position: t.clone().sub(n),
            target: t
        }
    }
    setViewplaneSize(e, t) {
        this.left = -e * .5, this.right = e * .5, this.top = t * .5, this.bottom = -t * .5, this.aspect = e / t, this.updateProjectionMatrix()
    }
    toOrthographic(e) {
        this.orthoCamera.left = this.left, this.orthoCamera.right = this.right, this.orthoCamera.top = this.top, this.orthoCamera.bottom = this.bottom, this.orthoCamera.view = this.view, this.orthoCamera.far = this.far, this.orthoCamera.updateProjectionMatrix(), this.projectionMatrix = this.orthoCamera.projectionMatrix, this.projectionMatrixInverse = this.orthoCamera.projectionMatrixInverse, this._cameraType = "OrthographicCamera", (this.enableHelper === !0 || e === !0) && this.objectHelper.update()
    }
    toPerspective(e) {
        this.perspCamera.aspect = this.aspect, this.perspCamera.fov = this.fov, this.perspCamera.view = this.view, this.perspCamera.far = this.far, this.perspCamera.updateProjectionMatrix(), this.projectionMatrix = this.perspCamera.projectionMatrix, this.projectionMatrixInverse = this.perspCamera.projectionMatrixInverse, this._cameraType = "PerspectiveCamera", (this.enableHelper === !0 || e === !0) && this.objectHelper.update()
    }
    setFocalLength(e) {
        this.perspCamera.setFocalLength(e), this.toPerspective()
    }
    getFocalLength() {
        return this.perspCamera.getFocalLength()
    }
    getEffectiveFOV() {
        return this.perspCamera.getEffectiveFOV()
    }
    getFilmWidth() {
        return this.perspCamera.getFilmWidth()
    }
    getFilmHeight() {
        return this.perspCamera.getFilmHeight()
    }
    setViewOffset(e, t, r, n, s, o) {
        this._cameraType === "PerspectiveCamera" ? this.perspCamera.setViewOffset(e, t, r, n, s, o) : this.orthoCamera.setViewOffset(e, t, r, n, s, o)
    }
    clearViewOffset() {
        this._cameraType === "PerspectiveCamera" ? (this.perspCamera.clearViewOffset(), this.toPerspective()) : (this.orthoCamera.clearViewOffset(), this.toOrthographic())
    }
    updateProjectionMatrix(e) {
        this._cameraType === "PerspectiveCamera" ? this.toPerspective(e) : this._cameraType === "OrthographicCamera" && this.toOrthographic(e)
    }
    updateMatrixWorld(e) {
        super.updateMatrixWorld(e), this.matrixWorldInverse.copy(this.matrixWorld).invert()
    }
    updateWorldMatrix(e, t) {
        super.updateWorldMatrix(e, t), this.matrixWorldInverse.copy(this.matrixWorld).invert()
    }
    copy(e, t) {
        return super.copy(e, t), this.orthoCamera.copy(e.orthoCamera), this.perspCamera.copy(e.perspCamera), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.far = e.far, this.view = e.view === null ? null : Object.assign({}, e.view), this._cameraType = e._cameraType, this.aspect = e.aspect, this.fov = e.fov, this.focus = e.focus, this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this.targetOffset = e.targetOffset, this.updateProjectionMatrix(), this
    }
    fromCameraRender(e) {
        let t = {
            near: this.orthoCamera.near,
            far: this.orthoCamera.far
        },
            r = {
                near: this.perspCamera.near,
                far: this.perspCamera.far
            };
        return this.copy(e), this.name = "", this.enableHelper = !0, this.objectHelper.visible = !0, this.orthoCamera.near = t.near, this.orthoCamera.far = t.far, this.perspCamera.near = r.near, this.perspCamera.far = r.far, this.updateProjectionMatrix(), this
    }
    toJSON(e) {
        let t = super.toJSON(e),
            r = t.object;
        return r.ObjectType = "CombinedCamera", r.cameraType = this.cameraType, r.targetOffset = this.targetOffset, r.isUpVectorFlipped = this.isUpVectorFlipped, r.angleOffsetFromUp = this.angleOffsetFromUp, r.left = this.left, r.right = this.right, r.top = this.top, r.bottom = this.bottom, this.view !== null && (r.view = Object.assign({}, this.view)), r.zoomOrtho = this.orthoCamera.zoom, r.nearOrtho = this.orthoCamera.near, r.far = this.far, r.aspect = this.aspect, r.fov = this.fov, r.focus = this.focus, r.filmGauge = this.filmGauge, r.filmOffset = this.filmOffset, r.zoomPersp = this.perspCamera.zoom, r.nearPersp = this.perspCamera.near, t
    }
    fromJSON(e) {
        var t;
        if (super.fromJSON(e), this.cameraType = e.cameraType, e.targetOffset !== void 0 && (this.targetOffset = e.targetOffset), e.orbitControlsTarget !== void 0) {
            let r = this.getWorldPosition(new Vector3),
                n = new Vector3().fromArray(e.orbitControlsTarget);
            this.targetOffset = n.distanceTo(r)
        } else e.targetOffset !== void 0 && (this.targetOffset = e.targetOffset);
        return this.isUpVectorFlipped = !1, this.angleOffsetFromUp = (t = e.angleOffsetFromUp) != null ? t : 0, e.left !== void 0 && (this.left = e.left), e.right !== void 0 && (this.right = e.right), e.top !== void 0 && (this.top = e.top), e.bottom !== void 0 && (this.bottom = e.bottom), e.view !== void 0 && (this.view = Object.assign({}, e.view)), e.zoomOrtho !== void 0 && (this.orthoCamera.zoom = e.zoomOrtho), e.nearOrtho !== void 0 && (this.orthoCamera.near = e.nearOrtho), e.far !== void 0 && (this.far = e.far), e.aspect !== void 0 && (this.aspect = e.aspect), e.fov !== void 0 && (this.fov = e.fov), e.focus !== void 0 && (this.focus = e.focus), e.filmGauge !== void 0 && (this.filmGauge = e.filmGauge), e.filmOffset !== void 0 && (this.filmOffset = e.filmOffset), e.zoomPersp !== void 0 && (this.perspCamera.zoom = e.zoomPersp), e.nearPersp !== void 0 && (this.perspCamera.near = e.nearPersp), this.updateProjectionMatrix(), this
    }
    toCameraState(e = []) {
        let t = {
            type: this.cameraType,
            far: this.far,
            orthographic: {
                near: this.orthoCamera.near,
                zoom: this.orthoCamera.zoom
            },
            perspective: {
                near: this.perspCamera.near,
                fov: this.perspCamera.fov,
                zoom: this.perspCamera.zoom
            },
            up: this.up.toArray(),
            targetOffset: this.targetOffset,
            isUpVectorFlipped: this.isUpVectorFlipped
        };
        return cl(t, e)
    }
    fromCameraState(e) {
        let {
            orthographic: t,
            perspective: r
        } = e;
        return e.type !== void 0 && (this.cameraType = e.type), e.far !== void 0 && (this.far = e.far), t !== void 0 && (t.near !== void 0 && (this.orthoCamera.near = t.near), t.zoom !== void 0 && (this.orthoCamera.zoom = t.zoom)), r !== void 0 && (r.near !== void 0 && (this.perspCamera.near = r.near), r.fov !== void 0 && (this.perspCamera.fov = r.fov), r.zoom !== void 0 && (this.perspCamera.zoom = r.zoom)), e.up !== void 0 && this.up.fromArray(e.up), e.targetOffset !== void 0 && (this.targetOffset = e.targetOffset), e.isUpVectorFlipped !== void 0 && (this.isUpVectorFlipped = e.isUpVectorFlipped), this.updateProjectionMatrix(), this
    }
    toState(e) {
        return {
            ...super.toState(e), ...this.toCameraState(e),
            type: this.cameraType
        }
    }
    fromState(e) {
        return super.fromState(e), this.fromCameraState(e), this
    }
};

export { CombinedCamera }