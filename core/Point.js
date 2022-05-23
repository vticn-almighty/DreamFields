
import { Vector2 } from 'three'
import Position from './normal/Position'


export class ControlPoint extends Position {
    constructor(e) {
        super(e.position);
        this.parent = e
    }
    copy(e) {
        return super.copy(e), this
    }
    clone() {
        return new ControlPoint(this.parent).copy(this)
    }
}


export class Point extends Position {
    constructor(e, t) {
        super(t);
        this.controls = [];
        this.roundness = 0;
        this.areControlsDirectionsMirrored = !0;
        this.uuid = e, this.controls.push(new ControlPoint(this), new ControlPoint(this))
    }
    static create(e, t) {
        let r = new Point(e, new Vector2(...t.position));
        return r.controls[0].position.set(...t.controlPrevious.position), r.controls[1].position.set(...t.controlNext.position), r.roundness = t.roundness, r.areControlsDirectionsMirrored = t.areControlsDirectionsMirrored, r
    }
    getOppositeControl(e) {
        let t = this.controls.indexOf(e);
        return t === 0 ? this.controls[1] : t === 1 ? this.controls[0] : null
    }
    applyOffsetToControls(e, t = 1) {
        for (let r = 0, n = this.controls.length; r < n; r++) {
            let s = this.controls[r];
            this.position.distanceTo(s.position) <= t ? s.position.copy(this.position) : s.applyOffset(e)
        }
    }
    controlsMoved() {
        return !(this.position.equals(this.controls[0].position) && this.position.equals(this.controls[1].position))
    }
    copy(e) {
        return super.copy(e), this.controls[0].copy(e.controls[0]), this.controls[1].copy(e.controls[1]), this.roundness = e.roundness, this.uuid = e.uuid, this
    }
    clone() {
        return new Point(this.uuid, this.position).copy(this)
    }
    toJSON() {
        return super.toJSON().concat(this.controls[0].toJSON(), this.controls[1].toJSON(), [this.roundness])
    }
}

