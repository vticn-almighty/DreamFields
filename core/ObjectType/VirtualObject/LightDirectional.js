


import { CameraHelper, DirectionalLight } from 'three'
import { DirectionalLightWrapperHelper } from '../../Helper'
import { HelperWrapper } from '../../Wrapper'
import { Object3DWrapper } from '../../Wrapper'

function M1(i, e) {
    i.shadow.camera.right = e / 2;
    i.shadow.camera.left = -e / 2;
    i.shadow.camera.top = e / 2;
    i.shadow.camera.bottom = -e / 2;
    i.shadow.needsUpdate = !0
}

class LightDirectional extends HelperWrapper(Object3DWrapper(DirectionalLight), DirectionalLightWrapperHelper) {
    constructor(...e) {
        super(...e);
        this.objectType = "LightDirectional";
        this._gizmos = {};
        this.castShadow = !0, this.shadow.mapSize.width = 1024, this.shadow.mapSize.height = 1024;
        let r = this.shadow.camera;
        r.top = 1250, r.bottom = -1250, r.right = 1250, r.left = -1250, r.near = 1, r.far = 2500;
        let n = new CameraHelper(this.shadow.camera);
        n.visible = !1, this._gizmos.shadowmap = n, this.update()
    }
    static createFromState(e, t, r) {
        let n = new LightDirectional().fromState(t, r);
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
        super.updateMatrixWorld(e),
            this.enableHelper === !0 && this.objectHelper.visible === !0 && this.objectHelper.update()
    }
    copy(e, t = !0) {
        return super.copy(e, t), this.color.copy(e.color),
            this.intensity = e.intensity,
            this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
    toJSON(e) {
        let t = super.toJSON(e),
            r = t.object;
        return r.ObjectType = "LightDirectional", r.color = this.color.getHex(),
            r.intensity = this.intensity, r.shadow = this.shadow.toJSON(), t
    }
    fromJSON(e) {
        var n;
        super.fromJSON(e), this.color.set(e.color),
            this.intensity = e.intensity,
            this.shadow.normalBias = (n = e.shadow.normalBias) != null ? n : 0,
            this.shadow.radius = e.shadow.radius,
            this.shadow.mapSize.fromArray(e.shadow.mapSize);
        let t = this.shadow.camera,
            r = e.shadow.camera;
        return t.near = r.near, t.far = r.far, t.zoom = r.zoom,
            t.left = r.left, t.right = r.right, t.top = r.top, t.bottom = r.bottom,
            r.view !== void 0 && (t.view = Object.assign({}, r.view)), this
    }
    fromDirectionalLightState(e, t) {
        let r = e.depth !== void 0 && e.depth !== this.shadow.camera.far || e.size !== void 0 && e.size / 2 !== this.shadow.camera.right;
        return super.fromLightState(e, t), e.size !== void 0 && M1(this, e.size), r && this.update(), this
    }
    fromState(e, t) {
        return super.fromState(e), this.fromDirectionalLightState(e, t), this
    }
};


export { LightDirectional }