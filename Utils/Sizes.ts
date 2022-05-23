import EventEmitter from './EventEmitter.js'



export default class Sizes extends EventEmitter {
    width: number
    height: number
    /**
     * Constructor
     */
    constructor() {
        super()


        // Resize event
        this.resize = this.resize.bind(this)
        window.addEventListener('resize', this.resize)

        this.resize()
    }

    /**
     * Resize
     */
    resize() {

        this.width = window.innerWidth
        this.height = window.innerHeight

        this.trigger('resize')
    }
}
