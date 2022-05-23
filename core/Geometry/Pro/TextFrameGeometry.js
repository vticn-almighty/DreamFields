import {
	PlaneGeometry
}
from "three";

export class TextFrameGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var r, n, s;
		let t = Object.assign({},
		(r = e == null ? void 0 : e.parameters) != null ? r: {
			width: 100,
			depth: 0
		},
		i.parameters);
		return {
			parameters: Object.assign(t, {
				width: Math.abs(t.width),
				height: Math.abs((n = t.height) != null ? n: t.width),
				depth: Math.abs((s = t.depth) != null ? s: 0)
			})
		}
	}
	static build(i) {
		let {
			width: e,
			height: t
		} = i.parameters,
		r = new PlaneGeometry(e, t);
		return Object.assign(r, {
			userData: {...i,
				type: "TextFrameGeometry"
			}
		})
	}
};