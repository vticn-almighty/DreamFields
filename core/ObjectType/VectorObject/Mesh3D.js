

import SpecialMesh from '../../SpecialMesh'
import { Phong } from '../../Lighting'

class Mesh3D extends SpecialMesh {
    constructor(e, t = new Phong) {
        super(e, t);
        this.objectType = "Mesh3D";
        this.castShadow = !0, this.receiveShadow = !0
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "Mesh3D", t
    }
};

export { Mesh3D }