import {
	VectorGeometry
}
from './VectorGeometry';
import ShapeWrap from '../../ShapeWrap'

export class StarGeometry {
	static create(i) {
		return this.build(this.normalizeInputs(i))
	}
	static normalizeInputs(i, e) {
		var n, s, o, a;
		let t = Object.assign({},
		(n = e == null ? void 0 : e.parameters) != null ? n: {
			width: 100,
			depth: 0,
			innerRadiusPercent: 38.19,
			spikes: 5,
			cornerRadius: 0,
			angle: 360,
			extrudeDepth: 0,
			extrudeBevelSize: 0,
			extrudeBevelSegments: 1
		},
		i.parameters);
		return {
			shape: i.shape && i.shape instanceof ShapeWrap ? i.shape: new ShapeWrap,
			parameters: Object.assign(t, {
				surfaceMaxCount: ((s = t.surfaceMaxCount) != null ? s: t.cornerRadius > 0) ? 1e3: 100,
				width: Math.abs(t.width),
				height: Math.abs((o = t.height) != null ? o: t.width),
				depth: Math.abs(t.depth !== void 0 && t.depth === 0 && t.extrudeDepth > 0 ? t.extrudeDepth: (a = t.depth) != null ? a: 0)
			})
		}
	}
	static build(i) {
		let {
			width: e,
			height: t,
			innerRadiusPercent: r,
			spikes: n,
			cornerRadius: s,
			angle: o,
			depth: a,
			extrudeBevelSize: l,
			extrudeBevelSegments: c,
			surfaceMaxCount: u
		} = i.parameters,
		h = i.shape,
		d = e * .5,
		f = t * .5,
		p = 0,
		g = 0,
		x = o * Math.PI / 360 / n,
		y = Math.PI / 2 * 3 * -1,
		m = d * r / 100,
		v = f * r / 100;
		if (n == 3 && r == 50) {
			x = 2 * Math.PI / n;
			for (let b = 0; b < n; b++) {
				let T = x * b,
				_ = p + Math.sin(T) * d,
				S = g + Math.cos(T) * f;
				h.addPoint(h.createPoint(_, S))
			}
		} else for (let b = 0; b < n; b++) {
			let T = p + Math.cos(y) * d,
			_ = g + Math.sin(y) * f;
			h.addPoint(h.createPoint(T, _)),
			y += x,
			T = p + Math.cos(y) * m,
			_ = g + Math.sin(y) * v,
			b <= n,
			h.addPoint(h.createPoint(T, _)),
			y += x
		}
		h.isClosed = !0;
		for (let b = 0, T = h.points.length; b < T; b++) h.points[b].roundness = s;
		h.roundness = s,
		h.update();
		let w = VectorGeometry.create({
			shape: h,
			parameters: {
				surfaceMaxCount: u,
				roundness: s,
				depth: a,
				extrudeBevelSize: l,
				extrudeBevelSegments: c
			}
		});
		return Object.assign(w, {
			userData: {...i,
				type: "StarGeometry"
			}
		})
	}
};