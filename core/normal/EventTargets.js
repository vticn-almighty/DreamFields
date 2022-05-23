import { EventTypeEnum } from '../Enum'
import { platformCheck } from '../Tool'
export default class EventTargets {
    constructor(e) {
        this.eventState = e;
        this.targets = []
    }
    get type() {
        return this.eventState.type
    }
    get key() {
        return this.eventState.type === EventTypeEnum.KEY_DOWN || this.eventState.type === EventTypeEnum.KEY_UP ? this.eventState.key : null
    }
    get url() {
        return this.eventState.type === EventTypeEnum.KEY_DOWN || this.eventState.type === EventTypeEnum.KEY_UP || this.eventState.type === EventTypeEnum.MOUSE_DOWN || this.eventState.type === EventTypeEnum.MOUSE_UP ? this.eventState.url : null
    }
    get steps() {
        return this.eventState.type === EventTypeEnum.SCROLL ? this.eventState.steps : null
    }
    get distance() {
        return this.eventState.type === EventTypeEnum.LOOK_AT ? this.eventState.distance : null
    }
    dispatchReverse() {
        var e;
        for (let t = 0, r = this.targets.length; t < r; ++t) {
            let n = this.targets[t];
            n.state !== void 0 && n.object !== void 0 && ((e = n.object.interaction) == null || e.reverse(n))
        }
    }
    dispatch(e) {
        var t, r;
        this.url !== void 0 && (this.type === EventTypeEnum.MOUSE_DOWN || this.type === EventTypeEnum.MOUSE_UP || this.type === EventTypeEnum.KEY_DOWN || this.type === EventTypeEnum.KEY_UP) && (platformCheck() ? window.location.assign(this.url) : window.open(this.url, "_blank"));
        for (let n = 0, s = this.targets.length; n < s; ++n) {
            let o = this.targets[n];
            o.state !== void 0 && o.object !== void 0 && (this.type === EventTypeEnum.SCROLL ? (t = o.object.interaction) == null || t.seek(o, e, this.steps) : (r = o.object.interaction) == null || r.play(o))
        }
    }
};
