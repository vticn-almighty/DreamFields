
import { UUIDSource } from './DataShell/UUIDSource'
import { ObjectList, LayerList } from './DataShell/Array'
import _ from 'lodash'
function RebuildFromJSON(tar) {
    let objTar = {}
    try {
        objTar = _.isString(tar) ? JSON.parse(tar) : tar;
    } catch (error) {
        throw new Error('not a conforming object structure');
    }


    let frames = objTar.frames;
    let framesyi = new UUIDSource();

    for (const key in frames) {
        framesyi[key] = frames[key];
    }
    objTar.frames = framesyi;

    let shared_colors = objTar.shared.colors;
    let shared_colorsyi = new UUIDSource();

    for (const key in shared_colors) {
        shared_colorsyi[key] = shared_colors[key];
    }
    objTar.shared.colors = shared_colorsyi;
    let shared_images = objTar.shared.colors;
    let shared_imagesyi = new UUIDSource();

    for (const key in shared_images) {
        shared_imagesyi[key] = shared_images[key];
    }
    objTar.shared.images = shared_imagesyi;


    let shared_materials = objTar.shared.materials;
    let shared_materialsyi = new UUIDSource();

    for (const key in shared_materials) {
        shared_materialsyi[key] = shared_materials[key];
    }


    objTar.shared.materials = shared_materialsyi;

    let scene_objects = objTar.scene.objects;
    let scene_objectsyi = new ObjectList(...scene_objects);
    objTar.scene.objects = scene_objectsyi;

    for (const id in objTar.shared.materials) {
        objTar.shared.materials[id].layers = new LayerList(...objTar.shared.materials[id].layers)
    }


    // todo rebuild 32Array from default Array
    objTar.scene.objects.traverse((a, b) => {
        if (b.geometry && b.geometry.data) {
            let data = b.geometry.data;
            data.index.array = new Uint32Array(Object.values(data.index.array))
            data.attributes.normal.array = new Float32Array(Object.values(data.attributes.normal.array))
            data.attributes.position.array = new Float32Array(Object.values(data.attributes.position.array))

        }
    })
    return objTar;
}


export { RebuildFromJSON }