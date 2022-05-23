import {
	CylinderGeometry as Proto
}
from 'three';
import {
	RoundedCylinderBufferGeometry
}
from '../Base/GeometryBase'

export class CylinderGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var o, a, l, c, u;
		let t = Object.assign({},
		(o = e == null ? void 0 : e.parameters) != null ? o: {
			width: 100,
			radialSegments: 64,
			heightSegments: 1,
			openEnded: !1,
			thetaStart: 0,
			thetaLength: 360,
			cornerRadius: 0,
			cornerSegments: 8,
			hollow: 0
		},
		i.parameters),
		r = t.width / 2,
		n = (a = t.radiusTop) != null ? a: r,
		s = (l = t.radiusBottom) != null ? l: r;
		return n === s ? (n = r, s = r) : n > s ? (n = r, s = s * r / n) : (n = n * r / s, s = r),
		{
			parameters: Object.assign(t, {
				width: Math.abs(t.width),
				height: Math.abs((c = t.height) != null ? c: t.width),
				depth: Math.abs((u = t.depth) != null ? u: t.width),
				radiusTop: n,
				radiusBottom: s
			})
		}
	}
	static build(i) {
		let {
			width: e,
			depth: t,
			height: r,
			radialSegments: n,
			heightSegments: s,
			openEnded: o,
			thetaStart: a,
			thetaLength: l,
			radiusTop: c,
			radiusBottom: u,
			cornerRadius: h,
			cornerSegments: d,
			hollow: f
		} = i.parameters,
		p;
		h || f ? p = new RoundedCylinderBufferGeometry(c, u, r, n, s, o, a, l * Math.PI / 180, h, h, d, f) : p = new Proto(c, u, r, n, s, o, a, l * Math.PI / 180),
		p.scale(1, 1, t / e);
		return Object.assign(p, {
			userData: {...i,
				type: "CylinderGeometry"
			}
		})
	}
};