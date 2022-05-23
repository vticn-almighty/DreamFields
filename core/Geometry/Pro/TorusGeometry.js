import {
	HeShapeGeometry as Proto
}
from '../../Geometry/Base/GeometryBase'

function jO(i, e, t, r, n, s, o, a, l, c, u) { [e, t] = [t, e];
	o = e / 2;
	n /= 2 * Math.PI;
	n == 1 && (c = 0);
	return new Proto(!0, i, e, t, r, n, s, o, a, l, c, u)
}

export class TorusGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var o, a, l;
		let t = Object.assign({},
		(o = e == null ? void 0 : e.parameters) != null ? o: {
			width: 100,
			radialSegments: 32,
			tubularSegments: 64,
			arc: Math.PI * 2,
			cornerRadius: 30,
			cornerSegments: 8
		},
		i.parameters),
		r = Math.abs(t.width),
		n = Math.abs((a = t.height) != null ? a: t.width),
		s = Math.abs((l = t.depth) != null ? l: t.width * .25);
		return {
			parameters: Object.assign(t, {
				width: r,
				height: n,
				depth: s
			})
		}
	}
	static build(i) {
		let {
			width: e,
			height: t,
			depth: r,
			radialSegments: n,
			tubularSegments: s,
			arc: o,
			cornerRadius: a,
			cornerSegments: l
		} = i.parameters,
		c = jO(e, t, r, e * .5, o, s, 0, 0, n, a, l);
		return c.scale(1, t / e, 1),
		Object.assign(c, {
			userData: {...i,
				type: "TorusGeometry"
			}
		})
	}
};