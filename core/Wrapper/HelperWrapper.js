import _ from 'lodash'
import { packageColor } from '../Tool'
let xs = i => "objectHelper" in i
let Tn = i => "isEntity" in i

export function HelperWrapper(i, e) {
    return class extends i {
        constructor() {
            super(...arguments);
            this.objectHelper = new e(this);
            this.enableHelper = !1
        }
        set visibility(r) {
            this.visible = r, this.setHelperVisibility(r), this.setHelperChildrenVisibility(r)
        }
        get visibility() {
            return this.visible
        }
        get geometryHelper() {
            return e.geometryHelper
        }
        setHelperVisibility(r) {
            this.objectHelper.visible = r
        }
        setHelperChildrenVisibility(r) {
            for (let n of this.children) Tn(n) && n.traverseEntity(s => {
                xs(s) && s.visible && (s.objectHelper.visible = r)
            })
        }
        raycast(r, n) {
            this.objectHelper.raycast(r, n)
        }
        copy(r, n = !0) {
            return super.copy(r, n), r.enableHelper !== void 0 && (this.enableHelper = r.enableHelper), r.objectHelper !== void 0 && (this.objectHelper.visible = r.objectHelper.visible), this
        }
        toJSON(r) {
            let n = super.toJSON(r),
                s = n.object;
            return s.enableHelper = this.enableHelper, n
        }
        fromJSON(r) {
            return super.fromJSON(r), r.enableHelper !== void 0 && (this.enableHelper = !0), this
        }
        fromLightState(r, n) {
            if (this.objectType === "LightDirectional" || this.objectType === "LightPoint" || this.objectType === "LightSpot") {
                let s = this;
                r.color !== void 0 && (s.color = packageColor(r.color, n)), r.intensity !== void 0 && (s.intensity = r.intensity), r.depth !== void 0 && (s.shadow.camera.far = r.depth, s.shadow.needsUpdate = !0), r.shadows !== void 0 && (this.castShadow = r.shadows), r.helper !== void 0 && (this.enableHelper = r.helper, s.gizmos.shadowmap.visible = r.helper)
            }
            return this
        }
    };
}
