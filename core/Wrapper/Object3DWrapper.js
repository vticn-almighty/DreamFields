import _ from 'lodash'
import Box3Wrap from '../Box3Wrap'
import { Matrix4 } from 'three'

import { ProtoWrapper } from '../Wrapper'
let xs = i => "objectHelper" in i
let Tn = i => "isEntity" in i
export function Object3DWrapper(i) {
    return class extends ProtoWrapper(i) {
        constructor() {
            super(...arguments);
            this.objectType = "";
            this.isEntity = !0;
            this.raycastLock = !1;
            this.scaleLock = !1;
            this.hiddenMatrix = new Matrix4;
            this._singleBBox = new Box3Wrap;
            this._recursiveBBox = new Box3Wrap;
            this.singleBBoxNeedsUpdate = !0;
            this.recursiveBBoxNeedsUpdate = !0;
            this.forceComputeSize = !1
        }
        set visibility(t) {
            this.visible = t;
            for (let r of this.children) Tn(r) && r.traverseEntity(n => {
                xs(n) && n.visible && (n.objectHelper.visible = t)
            })
        }
        get visibility() {
            return this.visible
        }
        get interactionCache() {
            var t, r, n;
            return ((t = this.interaction) == null ? void 0 : t.cache) === void 0 && ((r = this.interaction) == null || r.computeCache()), (n = this.interaction) == null ? void 0 : n.cache
        }
        get singleBBox() {
            return this.singleBBoxNeedsUpdate && (this.singleBBoxNeedsUpdate = !1, this._singleBBox.setFromObjectSize(this, !1), this._singleBBox.computeVertices(), this._singleBBox.computeEdges(), this._singleBBox.computeFaces()), this._singleBBox
        }
        get recursiveBBox() {
            return this.recursiveBBoxNeedsUpdate && (this.recursiveBBoxNeedsUpdate = !1, this._recursiveBBox.setFromObjectSize(this, !0), this._recursiveBBox.computeVertices(), this._recursiveBBox.computeEdges(), this._recursiveBBox.computeFaces()), this._recursiveBBox
        }
        resetBBoxNeedsUpdate() {
            this.singleBBoxNeedsUpdate = !0, this.recursiveBBoxNeedsUpdate = !0, this.traverseAncestors(t => {
                Tn(t) && (t.singleBBoxNeedsUpdate = !0, t.recursiveBBoxNeedsUpdate = !0)
            }), this.traverseEntity(t => {
                t.singleBBoxNeedsUpdate = !0, t.recursiveBBoxNeedsUpdate = !0
            })
        }
        traverseEntity(t) {
            t(this);
            for (let r of this.children) Tn(r) && r.traverseEntity(t)
        }
        updateMatrixWorld(t) {
            this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (this.parent === null ? this.matrixWorld.multiplyMatrices(this.hiddenMatrix, this.matrix) : (this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.hiddenMatrix), this.matrixWorld.multiplyMatrices(this.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, t = !0);
            for (let r of this.children) r.updateMatrixWorld(t)
        }
        updateWorldMatrix(t, r) {
            let n = this.parent;
            if (t && n !== null && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), this.parent === null ? this.matrixWorld.multiplyMatrices(this.hiddenMatrix, this.matrix) : (this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.hiddenMatrix), this.matrixWorld.multiplyMatrices(this.matrixWorld, this.matrix)), r)
                for (let s of this.children) s.updateWorldMatrix(!1, !0)
        }
        shallowClone(t) {
            return new this.constructor().shallowCopy(this, t)
        }
        shallowCopy(t, r = !0) {
            if (super.copy(t, !1), this.raycastLock = t.raycastLock, this.scaleLock = t.scaleLock, this.hiddenMatrix.copy(t.hiddenMatrix), r === !0)
                for (let n of t.children) Tn(n) && this.add(n.shallowClone());
            return this
        }
        clone(t) {
            return new this.constructor().copy(this, t)
        }
        copy(t, r = !0) {
            if (super.copy(t, !1), this.raycastLock = t.raycastLock, this.scaleLock = t.scaleLock, this.hiddenMatrix.copy(t.hiddenMatrix), r === !0)
                for (let n of t.children) Tn(n) && this.add(n.clone());
            return this
        }
        keepChildrenMatrixWorld() {
            let t = new Matrix4,
                r = this.matrixWorld.clone();
            this.updateWorldMatrix(!1, !1), t.copy(this.matrixWorld).invert(), t.multiply(r);
            for (let n of this.children) Tn(n) && n.hiddenMatrix.premultiply(t)
        }
        toJSON(t) {
            let r = super.toJSON(t),
                n = r.object;
            return this.raycastLock === !0 && (n.raycastLock = !0), this.scaleLock === !0 && (n.scaleLock = !0), n.hiddenMatrix = this.hiddenMatrix.toArray(), r
        }
        fromJSON(t) {
            return super.fromJSON(t), t.raycastLock !== void 0 && (this.raycastLock = t.raycastLock), t.scaleLock !== void 0 && (this.scaleLock = t.scaleLock), this.hiddenMatrix.fromArray(t.hiddenMatrix), this
        }
        fromObject3D(t) {
            let r = t.children;
            return t.children = [], Object.assign(t, {
                raycastLock: !1,
                scaleLock: !1,
                hiddenMatrix: new Matrix4
            }), this.copy(t), t.children = r, this
        }
        toObjectTransformState(t = []) {
            this.updateWorldMatrix(!0, !1);
            let r = {
                position: this.position.toArray(),
                rotation: [this.rotation.x, this.rotation.y, this.rotation.z],
                scale: this.scale.toArray(),
                hiddenMatrix: this.hiddenMatrix.toArray()
            };
            return cl(r, t)
        }
        fromObjectTransformState(t) {
            return t.position && this.position.fromArray(t.position), t.rotation && this.rotation.fromArray(t.rotation), t.scale && this.scale.fromArray(t.scale), t.hiddenMatrix && this.hiddenMatrix.fromArray(t.hiddenMatrix), this.updateMatrix(), this
        }
        toState(t = []) {
            let r = {
                name: this.name,
                visible: this.visible,
                raycastLock: this.raycastLock,
                ...this.toObjectTransformState(t)
            }
            return cl(r, t)
        }
        fromState(t, r) {
            return t.name && (this.name = t.name), t.raycastLock !== void 0 && (this.raycastLock = t.raycastLock), t.type !== "OrthographicCamera" && t.type !== "PerspectiveCamera" && (this.matrixAutoUpdate = !1), t.visible !== void 0 && (this.visibility = t.visible), this.fromObjectTransformState(t), this
        }
    };
}