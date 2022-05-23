import * as THREE from 'three'

import Loader from './Utils/Loader'
import EventEmitter from './Utils/EventEmitter'



export class Resources extends EventEmitter {
    constructor() {
        super()

        this.loader = new Loader()
        this.items = {}

        this.loader.on('fileEnd', (_resource, _data) => {
            this.items[_resource.name] = _data

            // Texture
            if (_resource.type === 'texture') {
                const texture = new THREE.Texture(_data)
                texture.needsUpdate = true

                this.items[`${_resource.name}Texture`] = texture
            }

            //todo 触发资源加载事件
            // console.log([this.loader.loaded / this.loader.toLoad]);
            this.trigger('progress', [this.loader.loaded / this.loader.toLoad])
        })

        this.loader.on('end', () => {
            //todo 触发资源加载完成
            this.trigger('loadReady')
        })
    }
}
