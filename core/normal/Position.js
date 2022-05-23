



import { MathUtils, Vector2 } from 'three'
export default class Position {
    constructor(e) {
        this.position = new Vector2;
        this.startPosition = new Vector2;
        this.uuid = MathUtils.generateUUID();
        this.position = e.clone()
    }
    start() {
        this.reset()
    }
    reset() {
        this.startPosition.copy(this.position)
    }
    applyOffset(e) {
        this.position.copy(this.startPosition).add(e)
    }
    copy(e) {
        return this.position.copy(e.position), this.startPosition.copy(e.startPosition), this
    }
    clone() {
        return new Position(this.position).copy(this)
    }
    toJSON() {
        return [this.position.x, this.position.y]
    }
}
