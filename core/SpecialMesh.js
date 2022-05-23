import { Mesh } from "three";
import { Object3DWrapper } from './Wrapper'
import Cloner from './Cloner'
import { Geometries } from './Geometry'
import { GeometryTool } from './Tool'

export default class SpecialMesh extends Object3DWrapper(Mesh) {
    constructor(e, t) {
        super(e, t);
        this.isAbstractMesh = !0;
        Array.isArray(t) && (this.selectedMaterial = 0, e.groups.length === 0 && e.addGroup(0, e.getAttribute("position").count, 0))
    }
    get cloner() {
        return this._cloner
    }
    set cloner(e) {
        this._cloner && this.remove(this._cloner), e && this.add(e), this._cloner = e
    }
    getSelectedMaterial(e) {
        return Array.isArray(this.material) ? (this.selectedMaterial === void 0 && (this.selectedMaterial = e != null ? e : 0), this.material[e != null ? e : this.selectedMaterial]) : this.material
    }
    setSelectedMaterial(e, t) {
        Array.isArray(this.material) ? (this.selectedMaterial === void 0 && (this.selectedMaterial = t != null ? t : 0), t = t != null ? t : this.selectedMaterial, this.material[t].dispose(), this.material[t] = e) : (this.material.dispose(), this.material = e)
    }
    updateGeometry(e) {
        let t = this.geometry,
            r = Geometries[t.userData.type],
            n = this.objectType === "NonParametric" ? Object.assign({}, t.userData, {
                geometry: t
            }) : t.userData,
            s = r.build(r.normalizeInputs(e, n)),
            o = t.uuid;
        if (this.geometry.dispose(), this.geometry = s, this.geometry.uuid = o, this.geometry.computeBoundingSphere(), this.cloner)
            for (let a of this.cloner.children) a.geometry = this.geometry
    }
    resizeGeometry(e, t, r) {
        GeometryTool.resizeGeometry(this.geometry, {
            width: e,
            height: t,
            depth: r
        })
    }
    shallowClone(e) {
        return new this.constructor(this.geometry, this.material).shallowCopy(this, e)
    }
    clone(e) {
        let t = this.objectType === "NonParametric" ? Object.assign({}, this.geometry.userData, {
            geometry: this.geometry.clone()
        }) : this.geometry.userData,
            r = ru(t),
            n = Array.isArray(this.material) ? this.material.map(s => s.clone()) : this.material.clone();
        return new this.constructor(r, n).copy(this, e)
    }
    copy(e, t = !0) {
        return super.copy(e, t), e.cloner && (this.cloner = new Cloner(e, e.cloner.parameters), this.add(this.cloner)), this
    }
    // toJSON(e) {
    //     let t = super.toJSON(e),
    //         r = t.object;
    //     if (r.geometry = H1(e.geometries, this.geometry, this.material), Array.isArray(this.material)) {
    //         let n = [];
    //         for (let s = 0, o = this.material.length; s < o; s++) n.push(ty(e.materials, this.material[s], e));
    //         r.material = n
    //     } else r.material = ty(e.materials, this.material, e);
    //     return t
    // }
    // fromJSON(e) {
    //     return super.fromJSON(e), e.selectedMaterial !== void 0 && (this.selectedMaterial = e.selectedMaterial), this
    // }
    setFromClonerState(e) {
        e === null ? this.cloner = void 0 : (this.cloner === void 0 && (this.cloner = new Cloner(this)), this.cloner.fromClonerState(e))
    }
    fromState(e, t) {
        var r, n;
        return super.fromState(e), e.type === "Mesh" && (this.setFromClonerState(e.cloner), this.castShadow = (r = e.castShadow) != null ? r : !0, this.receiveShadow = (n = e.receiveShadow) != null ? n : !0), this
    }
};
