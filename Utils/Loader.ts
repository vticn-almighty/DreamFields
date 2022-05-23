import EventEmitter from './EventEmitter'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export default class Resources extends EventEmitter {
    toLoad: number
    loaded: number
    items: {}
    loaders: { extensions: string[], action: Function }[]
    /**
     * Constructor
     */
    constructor() {
        super()

        this.setLoaders()

        this.toLoad = 0
        this.loaded = 0
        this.items = {}
    }

    /**
     * Set loaders
     */
    setLoaders() {
        this.loaders = []

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png'],
            action: (_resource) => {
                const image = new Image()
                image.crossOrigin = 'Anonymous'
                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.src = _resource.source
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        dracoLoader.setDecoderConfig({ type: 'js' })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })


        // PLYLoader
        const plyLoader = new PLYLoader()

        this.loaders.push({
            extensions: ['ply'],
            action: (_resource) => {
                plyLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

        // FBX
        const fbxLoader = new FBXLoader()

        this.loaders.push({
            extensions: ['fbx'],
            action: (_resource) => {
                fbxLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })
    }

    /**
     * Load
     */
    load(_resources = []) {
        for (const _resource of _resources) {
            this.toLoad++
            const extensionMatch = _resource.source.match(/\.([a-z]+)$/)

            if (typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension))

                if (loader) {
                    loader.action(_resource)
                }
                else {
                    console.warn(`Cannot found loader for ${_resource}`)
                }
            }
            else {
                console.warn(`Cannot found extension of ${_resource}`)
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource, _data) {
        this.loaded++
        this.items[_resource.name] = _data

        this.trigger('fileEnd', [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger('end')
        }
    }
}
