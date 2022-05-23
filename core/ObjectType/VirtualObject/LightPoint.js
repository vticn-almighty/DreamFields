import { Color, Box3Helper, PointLight, Box3, Color, Vector3 } from 'three'
import { PointLightWrapperHelper } from '../../Helper'
import {HelperWrapper} from '../../Wrapper'
import { Object3DWrapper } from '../../Wrapper'




class LightPoint extends HelperWrapper(Object3DWrapper(PointLight), PointLightWrapperHelper) {
    constructor(...e) {
        super(...e);
        this.objectType = "LightPoint";
        this._gizmos = {};
        this.castShadow = !0, this.shadow.mapSize.width = 1024, this.shadow.mapSize.height = 1024;
        let r = this.shadow.camera;
        r.fov = 90, r.aspect = 1, r.near = 100, r.far = 2500;
        let n = new Vector3(-r.far + this.position.x, -r.far + this.position.y, -r.far + this.position.z),
            s = new Vector3(r.far + this.position.x, r.far + this.position.y, r.far + this.position.z),
            o = new Box3(n, s),
            a = new Box3Helper(o, new Color(16755200));
        a.visible = !1, this._gizmos.shadowmap = a, this.update()
    }
    static createFromState(e, t, r) {
        let n = new LightPoint().fromState(t, r);
        return n.uuid = e, n
    }
    get gizmos() {
        return this._gizmos
    }
    showGizmos() {
        for (let e in this._gizmos) {
            let t = this._gizmos[e];
            t instanceof Box3Helper && (t.visible = !0)
        }
    }
    hideGizmos() {
        for (let e in this._gizmos) {
            let t = this._gizmos[e];
            t instanceof Box3Helper && (t.visible = !1)
        }
    }
    update() {
        if (this.shadow && (this.shadow.camera.updateProjectionMatrix(), this._gizmos))
            for (let e in this._gizmos) {
                let t = this._gizmos[e];
                if (t instanceof Box3Helper) {
                    let r = this.shadow.camera,
                        n = new Vector3(-r.far + this.position.x, -r.far + this.position.y, -r.far + this.position.z),
                        s = new Vector3(r.far + this.position.x, r.far + this.position.y, r.far + this.position.z);
                    t.box.set(n, s), t.updateMatrixWorld(!0)
                }
            }
    }
    updateMatrixWorld(e) {
        super.updateMatrixWorld(e), this.enableHelper === !0 && this.objectHelper.visible === !0 && this.objectHelper.update()
    }
    copy(e, t = !0) {
        return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this
    }
    toJSON(e) {
        let t = super.toJSON(e),
            r = t.object;
        return r.ObjectType = "LightPoint", r.color = this.color.getHex(), r.intensity = this.intensity, r.distance = this.distance, r.decay = this.decay, r.shadow = this.shadow.toJSON(), t
    }
    fromJSON(e) {
        var n, s;
        super.fromJSON(e), this.color.set(e.color), this.intensity = e.intensity, this.distance = e.distance, this.decay = e.decay, this.shadow.normalBias = (n = e.shadow.normalBias) != null ? n : 0, this.shadow.radius = e.shadow.radius, this.shadow.mapSize.fromArray((s = e.shadow.mapSize) != null ? s : [512, 512]), this.shadow.map && (this.shadow.map.dispose(), this.shadow.map = null);
        let t = this.shadow.camera,
            r = e.shadow.camera;
        return t.near = r.near, t.far = r.far, t.zoom = r.zoom, t.fov = r.fov, t.focus = r.focus, t.aspect = r.aspect, t.filmGauge = r.filmGauge, t.filmOffset = r.filmOffset, r.view !== void 0 && (t.view = Object.assign({}, r.view)), this
    }
    fromPointLightState(e, t) {
        return super.fromLightState(e, t), e.distance !== void 0 && (this.distance = e.distance), e.decay !== void 0 && (this.decay = e.decay), e.shadowRadius !== void 0 && (this.shadow.radius = e.shadowRadius), e.shadowResolution !== void 0 && (this.shadow.mapSize.set(e.shadowResolution, e.shadowResolution), this.shadow.map && (this.shadow.map.dispose(), this.shadow.map = null)), this
    }
    fromState(e, t) {
        return super.fromState(e), this.fromPointLightState(e, t), this
    }
};


export { LightPoint }