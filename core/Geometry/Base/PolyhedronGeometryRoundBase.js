import {
	PolyhedronGeometryRound
}
from './GeometryBase'

export class DodecahedronGeometryBase extends PolyhedronGeometryRound {
	constructor(e = 1, t = .2, r = 4) {
		let n = (1 + Math.sqrt(5)) / 2,
		s = 1 / n,
		o = [ - 1, -1, -1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 0, -s, -n, 0, -s, n, 0, s, -n, 0, s, n, -s, -n, 0, -s, n, 0, s, -n, 0, s, n, 0, -n, 0, -s, n, 0, -s, -n, 0, s, n, 0, s],
		a = [3, 11, 7, 3, 7, 15, 3, 15, 13, 7, 19, 17, 7, 17, 6, 7, 6, 15, 17, 4, 8, 17, 8, 10, 17, 10, 6, 8, 0, 16, 8, 16, 2, 8, 2, 10, 0, 12, 1, 0, 1, 18, 0, 18, 16, 6, 10, 2, 6, 2, 13, 6, 13, 15, 2, 16, 18, 2, 18, 3, 2, 3, 13, 18, 1, 9, 18, 9, 11, 18, 11, 3, 4, 14, 12, 4, 12, 0, 4, 0, 8, 11, 9, 5, 11, 5, 19, 11, 19, 7, 19, 5, 14, 19, 14, 4, 19, 4, 17, 1, 12, 14, 1, 14, 5, 1, 5, 9],
		l = "DodecahedronGeometry";
		super(o, a, l, e, t, r);
		this.type = l
	}
	static fromJSON(e) {
		return new DodecahedronGeometryBase(e.radius, e.corner, e.cornerSides)
	}
}

export class IcosahedronGeometryBase extends PolyhedronGeometryRound {
	constructor(e = 1, t = .2, r = 4) {
		let n = (1 + Math.sqrt(5)) / 2,
		s = [ - 1, n, 0, 1, n, 0, -1, -n, 0, 1, -n, 0, 0, -1, n, 0, 1, n, 0, -1, -n, 0, 1, -n, n, 0, -1, n, 0, 1, -n, 0, -1, -n, 0, 1],
		o = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1],
		a = "IcosahedronGeometry";
		super(s, o, a, e, t, r);
		this.type = a
	}
	static fromJSON(e) {
		return new IcosahedronGeometryBase(e.radius, e.corner, e.cornerSides)
	}
}