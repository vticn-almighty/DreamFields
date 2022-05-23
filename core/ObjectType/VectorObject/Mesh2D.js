



import Resize from '../../normal/Resize'

import { VideoTexture } from 'three'

import SpecialMesh from '../../SpecialMesh'
import { LayerTypeEnum } from '../../Enum'
import { Basic } from '../../Lighting'
import { RectangleGeometry } from '../../Geometry'



class Mesh2D extends SpecialMesh {
    constructor(e, t = new Basic) {
        super(e, t);
        this.objectType = "Mesh2D";
        this.castShadow = !0, this.receiveShadow = !0
    }
    updateGeometry(e) {
        super.updateGeometry(e);
        this.material.userData.layers && Resize.resizeTextureLayers(this.geometry.userData.parameters.width, this.geometry.userData.parameters.height, this.material)
    }
    resizeGeometry(e, t) {
        super.resizeGeometry(e, t, 0);
        this.material.userData.layers && Resize.resizeTextureLayers(this.geometry.userData.parameters.width, this.geometry.userData.parameters.height, this.material)
    }
    toJSON(e) {
        let t = super.toJSON(e);
        return t.object.ObjectType = "Mesh2D", t
    }
    clone() {
        let e = super.clone();
        return e.updateGeometry({}), e
    }
    static fromTexture(e) {
        let t, r;
        if (e instanceof VideoTexture) {
            let o = e.image;
            t = o.videoWidth * .5, r = o.videoHeight * .5
        } else {
            let o = e.image;
            t = o.width * .5, r = o.height * .5
        }
        let n = RectangleGeometry.create({
            parameters: {
                width: t,
                height: r
            }
        }),
            s = new Basic;
        return s.layersList.changeLayer(0, {
            type: LayerTypeEnum.TEXTURE,
            texture: e
        }), s.layersList.moveLayer(0, 1), s.dispose(), new Mesh2D(n, s)
    }
};


export { Mesh2D }