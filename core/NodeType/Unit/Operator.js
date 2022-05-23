import { OperatorEnum } from '../../Enum'
import NodeTemp from '../NodeTemp'
import Node from '../Node'

class Operator extends NodeTemp {
    constructor(e = new Node, t = new Node, r = OperatorEnum.ADD) {
        super();
        this.nodeType = "Operator";
        this.type = e.type, this.a = e, this.b = t, this.op = r
    }
    getType(e) {
        let t = this.a.getType(e),
            r = this.b.getType(e);
        return e.isTypeMatrix(t) ? "v4" : e.getTypeLength(r) > e.getTypeLength(t) ? r : t
    }
    generate(e, t) {
        let r = this.getType(e);
        this.type = r;
        let n = this.a.build(e, r),
            s = this.b.build(e, r);
        return e.format("( " + n + " " + this.op + " " + s + " )", r, t)
    }
    copy(e) {
        return super.copy(e), this.a.copy(e.a), this.b.copy(e.b), this.op = e.op, this
    }
}

Operator.ADD = OperatorEnum.ADD, Operator.SUB = OperatorEnum.SUB;
Operator.MUL = OperatorEnum.MUL, Operator.DIV = OperatorEnum.DIV;


export { Operator }