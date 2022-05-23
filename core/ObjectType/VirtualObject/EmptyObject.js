import { Group, } from 'three'
import { EmptyObjectHelper } from '../../Helper'
import { HelperWrapper } from '../../Wrapper'
import { Object3DWrapper } from '../../Wrapper'


class EmptyObject extends HelperWrapper(Object3DWrapper(Group), EmptyObjectHelper) {
    constructor() {
        super(...arguments);
        this.objectType = "EmptyObject"
    }
    static createFromState(e, t) {
        let r = new EmptyObject().fromState(t);
        return r.uuid = e, r.enableHelper = !0, r.objectHelper.update(), r
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "EmptyObject", t
    }
};

export { EmptyObject }