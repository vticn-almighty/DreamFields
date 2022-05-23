

import { MathUtils } from "three";


import { ox } from '../Tool'
export default class State{
    constructor(e) {
        this.objectState = e;
        this.uuid = MathUtils.generateUUID()
    }
    static create(e, t) {
        let r = new State(t);
        return r.uuid = e, r
    }
    execute(e, t) {
        ox(e, this.objectState, null, t, !0)
    }
};