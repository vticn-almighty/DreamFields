import { BoxGeometry } from "three";

export function ProtoHelperWrapper(i) {
    var e;
    return e = class extends i {
        constructor() {
            super(...arguments);
            this.isObjectHelper = !0
        }
    }, e.geometryHelper = new BoxGeometry(30, 30, 30), e
}
