
import { Mesh3D } from './VectorObject'
import { Phong } from '../Lighting'
export default class NonParametric extends Mesh3D {
    constructor(e, t = new Phong) {
        super(e, t);
        this.objectType = "NonParametric"
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "NonParametric", t
    }
};