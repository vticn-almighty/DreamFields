

import { TransitionEnum } from '../Enum'
import { ControlsDefault, SpringDefault } from '../Tool'


export default class TargetState{
    constructor(e) {
        this.targetState = e
    }
    static create(e, t) {
        var n;
        let r = new TargetState(e);
        if (e.object) {
            let s = t.find(e.object);
            if (r.object = s, s == null ? void 0 : s.interaction) {
                let o = s.interaction.states;
                r.state = e.state && (n = o.find(a => a.uuid === e.state)) != null ? n : o[0]
            }
        }
        return r
    }
    get cubicControls() {
        let e = this.targetState;
        return e.easing === TransitionEnum.CUBIC ? {
            control1: e.control1,
            control2: e.control2
        } : { ...ControlsDefault.defaultData }
    }
    get springParameters() {
        let e = this.targetState;
        return e.easing === TransitionEnum.SPRING ? e : { ...SpringDefault.defaultData }
    }
    get easing() {
        return this.targetState.easing
    }
    get duration() {
        return this.targetState.duration
    }
    get delay() {
        return this.targetState.delay
    }
    get repeat() {
        return this.targetState.repeat
    }
    get cycle() {
        return this.targetState.cycle
    }
    get rewind() {
        return this.targetState.rewind
    }
};
