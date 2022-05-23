import {
	BoxGeometry
}
from 'three';
import {
	BoxBufferGeometry
}
from '../Base/GeometryBase'

class CubeGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var r, n, s;
		let t = Object.assign({},
		(r = e == null ? void 0 : e.parameters) != null ? r: {
			width: 100,
			widthSegments: 1,
			heightSegments: 1,
			depthSegments: 1,
			cornerRadius: 0,
			cornerSegments: 8
		},
		i.parameters);
		return {
			parameters: Object.assign(t, {
				width: Math.abs(t.width),
				height: Math.abs((n = t.height) != null ? n: t.width),
				depth: Math.abs((s = t.depth) != null ? s: t.width)
			})
		}
	}
	static build(i) {
		let {
			width: e,
			height: t,
			depth: r,
			widthSegments: n,
			heightSegments: s,
			depthSegments: o,
			cornerRadius: a,
			cornerSegments: l
		} = i.parameters,
		c;
		a == 0 ? c = new BoxGeometry(e, t, r, n, s, o) : c = new BoxBufferGeometry(e, t, r, n, s, o, a, l);
		return Object.assign(c, {
			userData: {...i,
				type: "CubeGeometry"
			}
		})
	}
}

export {
	CubeGeometry
}