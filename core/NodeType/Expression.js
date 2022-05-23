import { Function } from '../nodeType/Unit'
export default class Expression extends Function {
    constructor(e = "", t, r, n, s) {
        super(e, s, n, r, t);
        this.nodeType = "Expression"
    }
};