
import { CombinedCamera } from '../ObjectType/VirtualObject'
import SpecialMesh from '../SpecialMesh'
import { packageColor, setAmbientLight, createEntity, checkTransmissionFlag, destroyEntity } from '../Tool'
import { HemisphereLight, Fog, Scene, Box3, Color, Vector3 } from 'three'
import { CameraInstanceDefault } from '../origin'
import { LayerTypeEnum } from '../Enum'
import _ from 'lodash'
import { ProtoWrapper } from '../Wrapper'
let Tn = i => "isEntity" in i
let SA = new Vector3


export default class SceneObject extends ProtoWrapper(Scene) {
    constructor(e, t) {
        super();
        this.objectType = "Scene";
        this.alpha = 1;
        this.backupFog = new Fog(16777215, .1, 2e3);
        this.fogUseBGColor = !1;
        this.wireframeState = !1;
        this.needsTransmissionDirty = !0;
        this._needsTransmission = !1;
        this._color = new Color(1, 0, 0);
        this.bgColor = new Color(1, 1, 1);
        this.entityByUuid = {};
        this.ambientLight = new HemisphereLight(13882323, 8553090, .75);
        this.ambientLight.name = "Default Ambient Light";
        this.personalCamera = this.createPersonalCamera();
        this.activeCamera = this.personalCamera, this.sharedAssetManager = t
        if (!(_.isBoolean(e.useProto) && e.useProto)) {
            this.init(e, t)
        }
    }
    needsTransmission(e) {
        return this.needsTransmissionDirty && (this._needsTransmission = checkTransmissionFlag(e, this),
            e !== void 0 && (this.needsTransmissionDirty = !1)), this._needsTransmission
    }
    find(e) {
        if (e === "" || e === void 0) return;
        let t = this.entityByUuid[e];
        return t === void 0 ? this.getObjectByProperty("uuid", e) : t
    }
    get color() {
        return this._color
    }
    set color(e) {
        this.fogUseBGColor === !0 && this.backupFog.color.copy(e), this._color.copy(e)
    }
    get enableFog() {
        return this.fog !== null
    }
    set enableFog(e) {
        this.fog = e === !0 ? this.backupFog : null
    }
    init(e, t) {
        this.createChildrenObjects(e.objects, this, t);
        this.personalCamera.removeFromParent();
        this.add(this.personalCamera);
        this.ambientLight.removeFromParent();
        this.add(this.ambientLight);
        this.setBackgroundColor(packageColor(e.backgroundColor, t));
        this.updateFog(e.fog, t);
        this.updateAmbientLight(e.environment.ambientLight, t);
        this.activeCamera = this.personalCamera
        if (e.publish.playCamera !== null) {
            let r = this.find(e.publish.playCamera);
            r instanceof CombinedCamera && this.switchActiveCamera(r)
        }
    }
    clearScene(e) {
        this.traverseEntity(t => {
            destroyEntity(t, e)
        });
        for (let t of this.children) Tn(t) && t.removeFromParent()
    }
    resetAfterClear(e, t) {
        this.init(e, t)
    }
    createPersonalCamera() {
        let e = CombinedCamera.createFromState(SceneObject.PERSONAL_CAMERA_ID, {
            ...CameraInstanceDefault.defaultData,
            name: "Personal Camera"
        });
        return e.enableHelper = !1, e.objectHelper.visible = !1, delete e.isEntity, this.registerObjectCreatedInLegacy(e), e
    }

    traverseEntity(e) {
        for (let t of this.children) Tn(t) && t.traverseEntity(e)
    }
    updateFog(e, t) {
        this.enableFog = e.enabled, this.fogUseBGColor = e.useBackgroundColor, e.useBackgroundColor ? this.backupFog.color.set(this.bgColor) : this.backupFog.color = packageColor(e.color, t), this.backupFog.near = e.near, this.backupFog.far = e.far
    }
    updateAmbientLight(e, t) {
        setAmbientLight(this.ambientLight, e, t);
        e.groundColor !== void 0 && (this.ambientLight.groundColor = packageColor(e.groundColor, t));
        e.enabled !== void 0 && (this.ambientLight.visible = e.enabled)
    }
    switchActiveCamera(e) {
        this.activeCamera !== this.personalCamera && (this.activeCamera.enableHelper = !0), this.activeCamera = e, e.enableHelper = !1
    }
    setBackgroundColor(e) {
        this.bgColor = e, this.alpha = e.a
    }
    createChildrenObjects(e, t, r) {
        for (let n of e) this.createChildObject(n.id, n.data, n.children, t, r)
    }
    registerObjectCreatedInLegacy(e) {
        this.entityByUuid[e.uuid] = e
    }
    unregisterObject(e) {
        delete this.entityByUuid[e.uuid];
        for (let t of e.children) this.unregisterObject(t)
    }
    createChildObject(e, t, r, n, s) {
        let o = createEntity(e, t, s);
        return o && (this.entityByUuid[e] = o, n.add(o), this.createChildrenObjects(r, o, s)), o
    }
    getCenter(e) {
        let t = [];
        for (let n = 0, s = e.length; n < s; ++n) {
            let {
                id: o,
                recursive: a
            } = e[n], l = this.find(o), c = a ? l.recursiveBBox : l.singleBBox;
            t.push(...c.vertices)
        }
        let r = new Box3;
        return r.setFromPoints(t), r.getCenter(SA), SA
    }
    copyMatrixWorld(e, t) {
        if (e === null) {
            t.identity();
            return
        }
        let r = this.find(e);
        r ? t.copy(r.matrixWorld) : t.identity()
    }
    copyParentMatrixWorld(e, t) {
        var n;
        if (e === null) {
            t.identity();
            return
        }
        let r = (n = this.find(e)) == null ? void 0 : n.parent;
        r ? t.copy(r.matrixWorld) : t.identity()
    }
    traverseMaterial(e) {
        this.traverseEntity(t => {
            if (t instanceof SpecialMesh)
                if (Array.isArray(t.material))
                    for (let r = 0; r < t.material.length; r++) e(t.material[r]);
                else e(t.material)
        })
    }
    updateCanvasSize(e, t) {
        this.activeCamera.setViewplaneSize(e, t);
        let r, n;
        e >= t ? (r = t / e, n = 1) : (r = 1, n = e / t), this.traverseMaterial(s => {
            s.layersList.getLayersOfType(LayerTypeEnum.TRANSMISSION).forEach(a => {
                a.uniforms[`f${a.id}_aspectRatio`].value.x = r, a.uniforms[`f${a.id}_aspectRatio`].value.y = n
            })
        })
    }
}

SceneObject.PERSONAL_CAMERA_ID = "f23858d0-4a3b-4bd8-8173-66ed0af7f6fb-personalCamera";
