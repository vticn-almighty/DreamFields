
import { LineBasicMaterial, BufferGeometry, Vector3, Raycaster, Line } from 'three'
import _ from 'lodash'

export default class RaycasterWrap extends Raycaster {
    constructor() {
        super();
        this.layers.enable(3)
    }
    setFromCamera(e, t) {
        t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, -1).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : t.isPerspectiveCamera ? (this.ray.origin.set(e.x, e.y, -1).unproject(t), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : console.error("Raycaster: Unsupported camera type.")
    }
    intersectVisibleObjects(e, t = !0, r = []) {
        return e.forEach(n => {
            n.visible && this.intersectObject(n, t, r)
        }), r
    }
    createRaycastLineHelper() {
        let e = new LineBasicMaterial({
            color: 65280,
            linewidth: 10
        }),
            t = new Vector3(this.ray.origin.x, this.ray.origin.y, this.ray.origin.z),
            r = new Vector3(this.ray.direction.x, this.ray.direction.y, this.ray.direction.z),
            n = this.camera.far - this.camera.near,
            s = new Vector3().addVectors(t, r.multiplyScalar(n)),
            o = new BufferGeometry;
        return o.setFromPoints([t, s]), new Line(o, e)
    }
};