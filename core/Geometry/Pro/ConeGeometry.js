import {
	ConeGeometry as Proto
}
from 'three';
import {
	RoundedCylinderBufferGeometry
}
from '../Base/GeometryBase'

export class ConeGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var r, n, s;
		let t = Object.assign({},
		(r = e == null ? void 0 : e.parameters) != null ? r: {
			width: 100,
			radialSegments: 32,
			heightSegments: 8,
			openEnded: !1,
			thetaStart: 0,
			thetaLength: 360,
			cornerRadiusTop: 0,
			cornerRadiusBottom: 0,
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
			depth: t,
			height: r,
			radialSegments: n,
			heightSegments: s,
			openEnded: o,
			thetaStart: a,
			thetaLength: l,
			cornerRadiusTop: c,
			cornerRadiusBottom: u,
			cornerSegments: h
		} = i.parameters,
		d;
		c > 0 || u > 0 || l < 360 ? d = new RoundedCylinderBufferGeometry(0, e / 2, r, n, s, o, a, l * Math.PI / 180, c, u, h, 0, !0) : d = new Proto(e / 2, r, n, s, o),
		d.scale(1, 1, t / e);

		return Object.assign(d, {
			userData: {...i,
				type: "ConeGeometry"
			}
		})
	}
};