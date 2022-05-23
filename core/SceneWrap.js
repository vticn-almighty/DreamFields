
import SceneObject from './ObjectType/SceneObject'
import Postprocessing from './Postprocessing'

export default class SceneWrap extends SceneObject {
    constructor(e, t) {
        super(e, t);
        this.postprocessing = new Postprocessing;
        this.initPostprocessing(e.postprocessing)
    }
    resetAfterClear(e, t) {
        super.resetAfterClear(e, t), this.initPostprocessing(e.postprocessing)
    }
    initPostprocessing(e) {
        let n = e,
            {
                enabled: t
            } = n;
        delete n.enabled;
        let r = n;
        // r = _x(n, ["enabled"]);
        for (let s of Object.entries(r)) {
            let o = s[1],
                a = this.postprocessing.effects.get(s[0]);
            if (a) {
                a.enabled = o.enabled;
                for (let [l, c] of Object.entries(o)) a[l] = c
            }
        }
        this.postprocessing.enabled = t, this.postprocessing.reinit()
    }
    dispose() {
        super.dispose(), this.postprocessing.dispose()
    }
    switchActiveCamera(e) {
        super.switchActiveCamera(e), this.postprocessing && (this.postprocessing.camera = e)
    }
};




