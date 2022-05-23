import {
	Triangle,
	BufferAttribute,
	Float32BufferAttribute,
	BufferGeometry,
	Vector2,
	Vector3,
}
from 'three';
import DBuffer from '../../normal/DBuffer';
import {
	WindingRuleEnum,
	ElementTypeEnum
}
from '../../Enum';
import _ from 'lodash';
import Tess from '../../tess';

let Bg = Math.PI / 2;

const Wg = (i, e) =>([t, r]) =>(r < t && (r += e), (i >= t ? i: i + e) <= r)

function HO(i, e, t) {
	let r = i.clone().sub(e),
	n = t.clone().sub(e);
	return r.projectOnVector(n),
	r.add(e)
}

function oo(i, e, t) {
	t.x = i.x * e.x,
	t.y = i.y,
	t.z = i.x * e.y
}

function eu(i, e, t) {
	t.x = i.x * e.x,
	t.y = i.y,
	t.z = i.x * e.y
}

function Qg(i, e, t, r, n, s) {
	let o = e.clone().sub(i),
	a = t.clone().sub(i),
	l = o.angleTo(a);
	if (o.normalize(), a.normalize(), r === n) {
		let c = o.add(a).normalize();
		s.copy(i).addScaledVector(c, r / Math.sin(l / 2))
	} else {
		let c = o.angleTo(a);
		s.copy(i),
		s.addScaledVector(o, n / Math.sin(c)),
		s.addScaledVector(a, r / Math.sin(c))
	}
}

function PM(i) {
	return new Vector2(i.y, -i.x)
}

export class RoundedCylinderBufferGeometry extends BufferGeometry {
	constructor(e, t, r, n, s, o, a, l, c, u, h, d, f = !1) {
		super();
		this.type = "RoundedCylinderBufferGeometry",
		e = e !== void 0 ? e: 1,
		t = t !== void 0 ? t: 1,
		r = r || 1,
		n = Math.floor(n) || 8,
		s = Math.floor(s) || 1,
		o = o !== void 0 ? o: !1,
		a = a !== void 0 ? a: 0,
		l = l !== void 0 ? l: Math.PI * 2,
		o && (c = 0, u = 0);
		let p = [],
		g = [],
		x = [],
		y = [],
		m = 0,
		v = r / 2,
		w = new Vector3,
		b = new Vector3;
		f && e == 0 && (e = c),
		f && t == 0 && (t = u);
		let T = new Vector2(e, v),
		_ = new Vector2(t, -v),
		S = null,
		N = null,
		C = null,
		M = null,
		E = T.clone().sub(_),
		D = 0,
		O = 0,
		F = 0;
		d > 0 && (D = Math.min(e, t) * (1 - d), O = e - D, F = t - D);
		let k = T.clone();
		k.x -= D;
		let W = Math.PI - E.angle(),
		j = E.angle(),
		Z = Math.tan(j / 2),
		U = Math.tan(W / 2),
		G = Z + U,
		R = d ? G: U,
		J = d ? G: Z;
		if (c = Math.min(c, (e - O) / R, E.length() / G), u = Math.min(u, (t - F) / J, E.length() / G), c > 0) {
			let Y = c / Z;
			S = T.clone().sub(new Vector2(Y, c)),
			d && (C = S.clone(), C.x -= D - G * c),
			T.sub(E.clone().setLength(Y))
		}
		if (u > 0) {
			let Y = u / U;
			N = _.clone().sub(new Vector2(Y, -u)),
			_.add(E.clone().setLength(Y)),
			d && (M = N.clone(), M.x -= D - G * u, k.sub(E.clone().setLength(Y)))
		}
		E = T.clone().sub(_);
		let re = E.length() < .5,
		se = [];
		for (let Y = 0; Y <= n; Y++) {
			let ee = [],
			ue = Y / n,
			q = ue * l + a,
			z = new Vector2(Math.sin(q), Math.cos(q));
			M && N ? (V(ee, ue, z, W, u, M, -1, !0), V(ee, ue, z, j, u, N, -1, !1)) : N ? (he(ee, z, N.x, 0, -1), V(ee, ue, z, j, u, N, -1, !1)) : o || he(ee, z, t, F, -1);
			let Q = PM(E).normalize();
			if (oo(Q, z, w), !re) for (let oe = 0; oe <= s; oe++) {
				let le = oe / s,
				xe = E.clone().multiplyScalar(le).add(_);
				oo(xe, z, b),
				g.push(b.x, b.y, b.z),
				x.push(w.x, w.y, w.z),
				y.push(ue, .5 + b.y / r),
				ee.push(m++)
			}
			if (C && S ? (V(ee, ue, z, W, c, S, 1, !1), V(ee, ue, z, j, c, C, 1, !0)) : S ? (V(ee, ue, z, W, c, S, 1, !1), he(ee, z, S.x, 0, 1)) : o || he(ee, z, e, O, 1), d && !re) {
				let oe = PM(E).multiplyScalar( - 1).normalize();
				oo(oe, z, w);
				for (let le = 0; le <= s; le++) {
					let xe = le / s,
					fe = E.clone().multiplyScalar( - xe).add(k);
					oo(fe, z, b),
					g.push(b.x, b.y, b.z),
					x.push(w.x, w.y, w.z),
					y.push(ue, .5 + b.y / r),
					ee.push(m++)
				}
			}
			d && !o && ee.push(ee[0]),
			se.push(ee)
		}
		for (let Y = 0; Y < se.length - 1; Y++) for (let ee = 0; ee < se[0].length - 1; ee++) {
			if (o && d && ee == s) continue;
			let ue = se[Y][ee],
			q = se[Y + 1][ee],
			z = se[Y + 1][ee + 1],
			Q = se[Y][ee + 1],
			oe = g[z * 3 + 0],
			le = g[z * 3 + 2];
			p.push(ue, q, Q),
			(oe != 0 || le != 0) && p.push(q, z, Q)
		}
		l < Math.PI * 2 && (ce( - 1, se[0], a), ce(1, se[se.length - 1], a + l)),
		this.setIndex(p),
		this.setAttribute("position", new Float32BufferAttribute(g, 3)),
		this.setAttribute("normal", new Float32BufferAttribute(x, 3)),
		this.setAttribute("uv", new Float32BufferAttribute(y, 2));

		function V(Y, ee, ue, q, z, Q, oe, le) {
			for (let xe = 0; xe < h + 1; xe++) {
				let fe = xe / h,
				ye = oe < 0 ? fe: 1 - fe;
				le && (ye -= 1),
				ye *= q;
				let Oe = new Vector2(Math.sin(ye), Math.cos(ye) * oe),
				P = Oe.clone().multiplyScalar(z).add(Q);
				oo(P, ue, b),
				g.push(b.x, b.y, b.z),
				oo(Oe, ue, w),
				x.push(w.x, w.y, w.z),
				y.push(ee, .5 + b.y / r),
				Y.push(m++)
			}
		}

		function he(Y, ee, ue, q, z) {
			let Q = new Vector3,
			oe = new Vector2,
			le = [ue, q];
			z < 0 && le.reverse();
			for (let xe of le) oe.set(xe, v * z),
			oo(oe, ee, Q),
			g.push(Q.x, Q.y, Q.z),
			x.push(0, z, 0),
			y.push(.5, .5),
			Y.push(m++)
		}

		function ce(Y, ee, ue) {
			let q = new Vector2(Math.sin(ue), Math.cos(ue)),
			z = new Vector2( - Math.cos(ue), Math.sin(ue)),
			Q = new Vector3,
			oe = Y < 0 ? (fe, ye, Oe) =>p.push(fe, ye, Oe) : (fe, ye, Oe) =>p.push(fe, Oe, ye),
			le = new Vector2((e + t + O + F) / 4, 0);
			oo(le, q, Q),
			g.push(Q.x, Q.y, Q.z),
			x.push(z.x, 0, z.y),
			y.push(.5, .5);
			let xe = m++;
			for (let fe of ee) {
				let ye = g.slice(fe * 3, fe * 3 + 3);
				g.push(...ye),
				x.push(z.x, 0, z.y);
				let Oe = y.slice(fe * 2, fe * 2 + 2);
				y.push(...Oe),
				m++
			}
			for (let fe = xe + 1; fe < m - 1; fe++) oe(xe, fe, fe + 1);
			oe(xe, m - 1, xe + 1)
		}
	}
};

export class BoxBufferGeometry extends BufferGeometry {
	constructor(e = 1, t = 1, r = 1, n = 1, s = 1, o = 1, a = 0, l = 4) {
		super();
		this.type = "BoxBufferGeometry";
		let c = this;
		n = Math.floor(n),
		s = Math.floor(s),
		o = Math.floor(o),
		l = Math.floor(l),
		a = Math.min(a, e / 2, t / 2, r / 2);
		let u = [],
		h = [],
		d = [],
		f = [],
		p = 0,
		g = 0;
		x("z", "y", "x", -1, -1, r, t, e, o, s, 0);
		x("z", "y", "x", 1, -1, r, t, -e, o, s, 1);
		x("x", "z", "y", 1, 1, e, r, t, n, o, 2);
		x("x", "z", "y", 1, -1, e, r, -t, n, o, 3);
		x("x", "y", "z", 1, -1, e, t, r, n, s, 4);
		x("x", "y", "z", -1, -1, e, t, -r, n, s, 5);
		if (a > 0) {
			y("z", "y", "x", -1, -1, 1, r, t, e, o, 0);
			y("z", "y", "x", 1, -1, -1, r, t, e, o, 1);
			y("z", "y", "x", -1, 1, -1, r, t, e, o, 1);
			y("z", "y", "x", 1, 1, 1, r, t, e, o, 0);
			y("x", "y", "z", -1, -1, -1, e, t, r, n, 0);
			y("x", "y", "z", 1, -1, 1, e, t, r, n, 1);
			y("x", "y", "z", -1, 1, 1, e, t, r, n, 0);
			y("x", "y", "z", 1, 1, -1, e, t, r, n, 1);
			y("y", "x", "z", -1, -1, 1, t, e, r, s, 0);
			y("y", "x", "z", 1, -1, -1, t, e, r, s, 1);
			y("y", "x", "z", 1, 1, 1, t, e, r, s, 1);
			y("y", "x", "z", -1, 1, -1, t, e, r, s, 0);
			m(1, 1, 1),
			m( - 1, 1, 1),
			m(1, -1, 1);
			m( - 1, -1, 1),
			m(1, 1, -1),
			m( - 1, 1, -1);
			m(1, -1, -1),
			m( - 1, -1, -1)
		}
		this.setIndex(u);
		this.setAttribute("position", new Float32BufferAttribute(h, 3));
		this.setAttribute("normal", new Float32BufferAttribute(d, 3));
		this.setAttribute("uv", new Float32BufferAttribute(f, 2));

		function x(v, w, b, T, _, S, N, C, M, E, D) {
			let O = (S - 2 * a) / M,
			F = (N - 2 * a) / E,
			k = S / 2 - a,
			W = N / 2 - a,
			j = C / 2,
			Z = M + 1,
			U = E + 1,
			G = 0,
			R = 0,
			J = new Vector3;
			for (let re = 0; re < U; re++) {
				let se = re * F - W;
				for (let V = 0; V < Z; V++) {
					let he = V * O - k;
					J[v] = he * T,
					J[w] = se * _,
					J[b] = j,
					h.push(J.x, J.y, J.z),
					J[v] = 0,
					J[w] = 0,
					J[b] = C > 0 ? 1 : -1,
					d.push(J.x, J.y, J.z),
					f.push(V / M),
					f.push(1 - re / E),
					G += 1
				}
			}
			for (let re = 0; re < E; re++) for (let se = 0; se < M; se++) {
				let V = p + se + Z * re,
				he = p + se + Z * (re + 1),
				ce = p + (se + 1) + Z * (re + 1),
				Y = p + (se + 1) + Z * re;
				u.push(V, he, Y),
				u.push(he, ce, Y),
				R += 6
			}
			c.addGroup(g, R, D),
			g += R,
			p += G
		}

		function y(v, w, b, T, _, S, N, C, M, E, D) {
			let O = (N - 2 * a) / E,
			F = N / 2 - a,
			k = C / 2 - a,
			W = M / 2,
			j = E + 1,
			Z = 0,
			U = 0,
			G = new Vector3,
			R = new Vector3;
			for (let J = 0; J < l + 1; J++) {
				let re = J / l * Bg,
				se = Math.sin(re) * a,
				V = (1 - Math.cos(re)) * a,
				he = Math.sin(re),
				ce = Math.cos(re);
				G[w] = (k + se) * _,
				G[b] = (W - V) * S,
				R[v] = 0,
				R[w] = he * Math.sign(G[w]),
				R[b] = ce * Math.sign(G[b]);
				for (let Y = 0; Y < j; Y++) {
					let ee = Y * O - F;
					G[v] = ee * T,
					h.push(G.x, G.y, G.z),
					d.push(R.x, R.y, R.z),
					f.push(Y / E),
					f.push(0),
					Z += 1
				}
			}
			for (let J = 0; J < l; J++) for (let re = 0; re < E; re++) {
				let se = p + re + j * J,
				V = p + re + j * (J + 1),
				he = p + (re + 1) + j * (J + 1),
				ce = p + (re + 1) + j * J;
				u.push(se, V, ce),
				u.push(V, he, ce),
				U += 6
			}
			c.addGroup(g, U, D),
			g += U,
			p += Z
		}

		function m(v, w, b) {
			let T = new Vector3,
			_ = new Vector3(e / 2, t / 2, r / 2);
			_.subScalar(a);
			let S = [],
			N = v * w * b > 0 ? (M, E, D) =>u.push(M, E, D) : (M, E, D) =>u.push(M, D, E);
			for (let M = 0; M <= l; M++) {
				let E = [],
				D = Bg * (1 - M / l),
				O = Math.cos(D),
				F = Math.sin(D),
				k = 0;
				for (let W = 0; W <= M; W++) {
					let j = Math.cos(k),
					Z = Math.sin(k);
					T.x = O * j,
					T.y = F,
					T.z = O * Z;
					let U = _.clone().addScaledVector(T, a);
					h.push(v * U.x, w * U.y, b * U.z),
					d.push(v * T.x, w * T.y, b * T.z),
					f.push(0, 0),
					E.push(p++),
					k += Bg / M
				}
				S.push(E)
			}
			let C = S.length - 1;
			for (let M = 0; M < C; M++) {
				let E = S[M],
				D = S[M + 1],
				O = E.length - 1;
				N(E[0], D[1], D[0]);
				for (let F = 1; F <= O; F++) N(E[F - 1], E[F], D[F]),
				N(E[F], D[F + 1], D[F])
			}
		}
	}
};

export class PolyhedronGeometryRound extends BufferGeometry {
	constructor(e = [], t = [], r = "", n = 1, s = .2, o = 4) {
		super();
		this.type = "PolyhedronGeometryRound";
		let a = [],
		l = [],
		c = [];
		u(),
		h();
		this.setAttribute("position", new Float32BufferAttribute(a, 3));
		this.setAttribute("normal", new Float32BufferAttribute(c, 3));
		this.setAttribute("uv", new Float32BufferAttribute(l, 2));
		return;

		function u() {
			var Z;
			s = Math.min(1 - 1e-5, s),
			s == 0 && (o = 0);
			let f = {
				IcosahedronGeometry: 5,
				DodecahedronGeometry: 3,
				HexahedronGeometry: 3,
				OctahedronGeometry: 4,
				TetrahedronGeometry: 3
			} [r],
			p = new Vector3,
			g = p.clone(),
			x = new Triangle,
			y = s * n,
			m = n - y,
			v = o + 1,
			w = new Vector3,
			b = (U, G) =>w.subVectors(U, G).normalize(),
			T = (U, G) =>Array(U).fill(void 0).map(G),
			_ = T(e.length / 3, (U, G) =>new Vector3().fromArray(e, G * 3).setLength(n)),
			S = [],
			N = 1e6;
			for (let U = 0; U < _.length; U++) {
				let G = _[U],
				R = [],
				J,
				re,
				se,
				V = 1e10,
				he = -1;
				for (; (he = t.indexOf(U, he + 1)) != -1;) {
					let ue = he - he % 3;
					J = t[ue + (he + 1) % 3],
					re = t[ue + (he + 2) % 3],
					se = G.distanceToSquared(_[J]),
					V = Math.min(V, se),
					R.push([J, re, se])
				}
				V += 1e-6;
				let ce = [],
				Y = 0,
				ee = R.length;
				for (let ue = 0; ue < ee; ue++) { [J, re, se] = R[Y];
					let q = ((Z = S[J]) == null ? void 0 : Z.includes(U)) == !0;
					se <= V && ce.push(J + +q * N),
					Y = R.findIndex(z =>z[0] == re)
				}
				S.push(ce)
			}
			let C = []; {
				let U = 0,
				G = 0,
				R,
				J,
				re = f == 3;
				for (let se = 0; se <= o; se++) {
					R = se * (se + 1) / 2,
					J = (se + 1) * (se + 2) / 2;
					for (let V = 0; V < o - se; V++)[U, G] = [R + V + se + 2, J + V + se + 3],
					C.push(R, J, ...re ? [G, R] : [U, J], G, U),
					[R, J] = [U, G];
					C.push(R, J, R + o + 2)
				}
			}
			let M = p.clone(),
			E = p.clone(),
			D = p.clone(),
			O = p.clone(),
			F = p.clone(),
			k = [],
			W = T(_.length, () =>T(f, () =>p.clone()));
			for (let U = 0; U < _.length; U++) {
				p.copy(_[U]).normalize(),
				M.copy(p).multiplyScalar(m);
				let G = S[U];
				for (let ce = 0; ce < G.length; ce++) {
					let Y = G[ce],
					ee = G[(ce + 1) % f];
					x.setFromPointsAndIndices(_, U, Y % N, ee % N),
					x.b.sub(x.a).setLength(1e10).add(x.a),
					x.c.sub(x.a).setLength(1e10).add(x.a),
					x.closestPointToPoint(M, W[U][ce])
				}
				let R = [],
				J = [],
				re = [],
				se = new Vector3;
				o == 0 && [...W[U]].reduce((ce, Y) =>ce.add(Y), se).multiplyScalar(1 / f);
				for (let ce = 0; ce < f; ce++) {
					let Y = [],
					ee = (ce - 1 + f) % f,
					ue = W[U][ee],
					q = W[U][ce];
					p.copy(ue).sub(M),
					g.copy(q).sub(M);
					let z = M.angleTo(p),
					Q = p.angleTo(g),
					oe = Math.cos(z) * y;
					o == 0 ? E.copy(se) : E.copy(M).setLength(m + oe),
					J.push(oe);
					let le = [E, ue, q];
					for (let xe = 0; xe < 2; xe++) {
						let fe = le[xe],
						ye = le[xe + 1];
						O.subVectors(fe, M),
						F.subVectors(ye, M),
						D.crossVectors(O, F).normalize();
						for (let Oe = 0; Oe < v; Oe++) {
							let P = [z, Q][xe] * Oe / v;
							p.copy(O).applyAxisAngle(D, P).add(M),
							R.push(p.clone()),
							xe && (b(p, M), Y.push([Oe == 0 ? fe: p.clone(), w.clone()]))
						}
						xe && (b(ye, M), Y.push([ye, w.clone()]))
					}
					re.push(Y)
				}
				k.push(re);
				let V = 2 * v,
				he = 2;
				for (let ce = 0; ce < f; ce++) {
					let Y = V * ce,
					ee = V * ((ce + 1) % f),
					ue = [R[Y]];
					for (let z = 1; z < v; z++) {
						O = R[Y + z],
						F = R[ee + z],
						ue.push(O);
						for (let Q = 1, oe = z - he + 1; Q <= oe; Q++) p.lerpVectors(O, F, Q / (oe + 1)),
						p.sub(M).setLength(J[ce]).add(M),
						ue.push(p.clone());
						ue.push(F)
					}
					for (let z = 0; z < v; z++) ue.push(R[z + v + Y]);
					ue.push(R[ee + v]);
					let q = C.map(z =>ue[z]);
					a.push(...q.map(z =>[z.x, z.y, z.z]).flat()),
					c.push(...q.map(z =>(b(z, M), [w.x, w.y, w.z])).flat())
				}
			}
			let j = [];
			for (let U = 0; U < S.length; U++) for (let G = 0; G < f; G++) {
				let R = S[U][G];
				if (R < N) {
					let J = S[R].findIndex(V =>V % N == U),
					re = k[U][G],
					se = k[R][J];
					for (let V = 0; V < v; V++) {
						let he = re[V],
						ce = se[v - V],
						Y = re[V + 1],
						ee = se[v - (V + 1)]; [he, ce, Y, Y, ce, ee].forEach(ue =>{
							a.push(ue[0].x, ue[0].y, ue[0].z),
							c.push(ue[1].x, ue[1].y, ue[1].z)
						})
					}
					j.push(re[0][0], se[v][0], re[v][0], se[0][0])
				}
			}
			for (; j.length;) {
				let U,
				G,
				R,
				J; [U, G] = j.splice(0, 2);
				let re = [U];
				for (; U != G;) re.push(G),
				R = j.indexOf(G),
				J = R % 2,
				G = j.splice(R - J, 2)[1 - J];
				w.subVectors(re[0], re[1]).cross(p.subVectors(re[0], re[2])).normalize();
				let se = w.dot(re[0]) < 0;
				se && w.negate();
				for (let V = 1; V <= re.length - 2; V++)[re[V + +se], re[V + 1 - +se], re[0]].forEach(he =>{
					a.push(he.x, he.y, he.z),
					c.push(w.x, w.y, w.z)
				})
			}
		}

		function h() {
			let d = new Vector3;
			for (let _ = 0; _ < a.length; _ += 3) {
				d.x = a[_ + 0],
				d.y = a[_ + 1],
				d.z = a[_ + 2];
				let S = b(d) / 2 / Math.PI + .5,
				N = T(d) / Math.PI + .5;
				l.push(S, 1 - N)
			}
			let f = new Vector3,
			p = new Vector3,
			g = new Vector3,
			x = new Vector3,
			y = new Vector2,
			m = new Vector2,
			v = new Vector2,
			w = (_, S, N, C) =>{
				C < 0 && _.x === 1 && (l[S] = _.x - 1),
				N.x === 0 && N.z === 0 && (l[S] = C / 2 / Math.PI + .5)
			};
			for (let _ = 0, S = 0; _ < a.length; _ += 9, S += 6) {
				f.set(a[_ + 0], a[_ + 1], a[_ + 2]),
				p.set(a[_ + 3], a[_ + 4], a[_ + 5]),
				g.set(a[_ + 6], a[_ + 7], a[_ + 8]),
				y.set(l[S + 0], l[S + 1]),
				m.set(l[S + 2], l[S + 3]),
				v.set(l[S + 4], l[S + 5]),
				x.copy(f).add(p).add(g).divideScalar(3);
				let N = b(x);
				w(y, S + 0, f, N),
				w(m, S + 2, p, N),
				w(v, S + 4, g, N)
			}
			for (let _ = 0; _ < l.length; _ += 6) {
				let S = l[_ + 0],
				N = l[_ + 2],
				C = l[_ + 4],
				M = Math.max(S, N, C),
				E = Math.min(S, N, C);
				M > .9 && E < .1 && (S < .2 && (l[_ + 0] += 1), N < .2 && (l[_ + 2] += 1), C < .2 && (l[_ + 4] += 1))
			}

			function b(_) {
				return Math.atan2(_.z, -_.x)
			}

			function T(_) {
				return Math.atan2( - _.y, Math.sqrt(_.x * _.x + _.z * _.z))
			}
		}
	}
	static fromJSON(e) {
		return new PolyhedronGeometryRound(e.vertices, e.indices, e.radius, e.corner, e.cornerSides)
	}
};

export class VoShapeGeometry extends BufferGeometry {
	constructor(e, t = 12, r = 100, n = {}) {
		super();
		this.type = "ShapeGeometry";
		this.windingRule = WindingRuleEnum.ODD;
		this.elementType = ElementTypeEnum.POLYGONS;
		this.polySize = 3;
		this.vertexSize = 2;
		this.strict = !0;
		this._drawCount = 0,
		this._shape = e,
		this._curveSegments = t,
		this._maxCount = r,
		this._maxDrawCount = r * 3,
		this._triangulationOptions = Object.assign({
			windingRule: WindingRuleEnum.ODD,
			elementType: ElementTypeEnum.POLYGONS,
			polySize: 3,
			vertexSize: 2,
			strict: !0
		},
		n),
		this._positionAttribute = new BufferAttribute(new Float32Array(r * 3), 3),
		this._normalAttribute = new BufferAttribute(new Float32Array(r * 3), 3),
		this._uvAttribute = new BufferAttribute(new Float32Array(r * 2), 2),
		this._indexAttribute = new BufferAttribute(new Uint32Array(r * 3), 1),
		this.setAttribute("position", this._positionAttribute),
		this.setAttribute("normal", this._normalAttribute),
		this.setAttribute("uv", this._uvAttribute),
		this.setIndex(this._indexAttribute),
		this.updateFromShape()
	}
	copy(e) {
		return this._drawCount = e.drawCount,
		this._maxDrawCount = e._maxDrawCount,
		this._maxCount = e.maxCount,
		super.copy(e)
	}
	get curveSegments() {
		return this._curveSegments
	}
	set curveSegments(e) {
		this._curveSegments = e,
		this.updateFromShape()
	}
	get drawCount() {
		return this._drawCount
	}
	get maxDrawCount() {
		return this._maxDrawCount
	}
	get maxCount() {
		return this._maxCount
	}
	updateFromShape() {
		let e = this._shape.extractShapePointsToFlatArray([], this._curveSegments),
		t = this._shape.shapeHoles.map(l =>l.extractShapePointsToFlatArray([], this._curveSegments)),
		r,
		n = !0,
		s = !0,
		o,
		a;
		for (let l = 0, c = e.length / 2; l < c; l++) {
			let u = l * 2,
			h = e[u + 0],
			d = e[u + 1];
			if (o !== void 0 && h !== o && (n = !1), a !== void 0 && d !== a && (s = !1), o = h, a = d, !n && !s) break
		}
		if (!n && !s && (r = Tess.tesselate({
			contours: [e, ...t],
			windingRule: this._triangulationOptions.windingRule,
			elementType: this._triangulationOptions.elementType,
			polySize: this._triangulationOptions.polySize,
			vertexSize: this._triangulationOptions.vertexSize,
			strict: this._triangulationOptions.strict
		})), this._positionAttribute.array.fill(0), this._normalAttribute.array.fill(0), this._uvAttribute.array.fill(0), this._indexAttribute.array.fill(0), this._drawCount = 0, r) {
			let l = 1 / 0,
			c = -1 / 0,
			u = 1 / 0,
			h = -1 / 0;
			for (let p = 0, g = r.vertexCount; p < g; p++) {
				let x = p * 2,
				y = r.vertices[x + 0],
				m = r.vertices[x + 1];
				y < l && (l = y),
				y > c && (c = y),
				m < u && (u = m),
				m > h && (h = m)
			}
			let d = c - l,
			f = h - u;
			for (let p = 0, g = r.vertexCount; p < g; p++) {
				let x = p * 2,
				y = r.vertices[x + 0],
				m = r.vertices[x + 1],
				v = (y - l) / d,
				w = (m - u) / f;
				this._positionAttribute.setXYZ(p, y, m, 0),
				this._normalAttribute.setXYZ(p, 0, 0, 1),
				this._uvAttribute.setXY(p, v, w)
			}
			for (let p = 0, g = r.elementCount; p < g; p++) {
				let x = p * 3,
				y = r.elements[x + 0],
				m = r.elements[x + 1],
				v = r.elements[x + 2];
				this._indexAttribute.setX(x + 0, y),
				this._indexAttribute.setX(x + 1, m),
				this._indexAttribute.setX(x + 2, v),
				this._drawCount += 3
			}
		}
		return this._positionAttribute.needsUpdate = !0,
		this._normalAttribute.needsUpdate = !0,
		this._uvAttribute.needsUpdate = !0,
		this._indexAttribute.needsUpdate = !0,
		this.setDrawRange(0, this._drawCount),
		this._drawCount > this._maxDrawCount
	}
	clone() {
		let e = new VoShapeGeometry(this._shape, this._curveSegments, this._maxCount);
		return e.userData = _.cloneDeep(this.userData),
		e
	}
};

export class RvShapeGeometry extends BufferGeometry {
	constructor(e, t, r = 0, n = 12, s = 3) {
		super();
		this.type = "ShapeGeometry";
		this.vertexCache = {};
		this._shape = e;
		this._depth = t;
		this._bevel = r;
		this._curveSegments = n;
		this._bevelSegmentsInput = s;
		r <= 0 ? (this._bevelSize = 0, this._bevelSegments = 0) : (this._bevelSize = Math.min(r, t / 2 - 1e-12), this._bevelSegments = Math.floor(s));
		let o = this._shape.extractShapePointsToFlatArray([], n),
		a = this._shape.shapeHoles.map(T =>{
			let _ = T.extractShapePointsToFlatArray([], n),
			S = [];
			for (let N = _.length - 1; N >= 1; N -= 2) {
				let C = _[N - 1],
				M = _[N - 0];
				S.push(C, M)
			}
			return S
		}),
		l = Tess.tesselate({
			windingRule: WindingRuleEnum.ODD,
			elementType: ElementTypeEnum.BOUNDARY_CONTOURS,
			vertexSize: 2,
			strict: !0,
			contours: [o]
		}),
		c = Tess.tesselate({
			windingRule: WindingRuleEnum.ODD,
			elementType: ElementTypeEnum.BOUNDARY_CONTOURS,
			vertexSize: 2,
			strict: !0,
			contours: [...a]
		});
		if (!l) throw new Error("error generating geometry");
		let u = l.elementCount;
		if (c) {
			l.elementCount += c.elementCount;
			for (let T = 0; T < c.elements.length; T++) {
				let _ = c.elements[T],
				S = T % 2 == 0 ? l.vertexCount: 0;
				l.elements.push(_ + S)
			}
			for (let T = 0; T < c.vertexIndices.length; T++) {
				let _ = c.vertexIndices[T],
				S = l.vertexCount;
				l.vertexIndices.push(_ + S)
			}
			for (let T = 0; T < c.vertices.length; T++) {
				let _ = c.vertices[T];
				l.vertices.push(_)
			}
		}
		let h = 1 / 0,
		d = -1 / 0,
		f = 1 / 0,
		p = -1 / 0;
		for (let T = 0, _ = l.vertexCount; T < _; T++) {
			let S = T * 2,
			N = l.vertices[S + 0],
			C = l.vertices[S + 1];
			N < h && (h = N),
			N > d && (d = N),
			C < f && (f = C),
			C > p && (p = C)
		}
		this._minX = h,
		this._minY = f,
		this._width = d - h,
		this._height = p - f;
		let g = l.vertexCount * 2 * (2 + this._bevelSegments);
		this._buffer = new DBuffer(g);
		let x = [],
		y = [];
		for (let T = l.elementCount - 1; T >= 0; T--) {
			let _ = T >= u,
			S = T * 2,
			N = l.elements[S + 0],
			C = l.elements[S + 1],
			M = N + C,
			E = {
				start: N,
				count: C,
				normals: [],
				continuous: [],
				concave: []
			},
			D = N,
			O = M - 1,
			F = N + 1,
			k = this._shape.roundedCurves.length;
			do {
				let U = D - N, G = l.vertices[O * 2 + 0], R = l.vertices[O * 2 + 1], J = l.vertices[D * 2 + 0], re = l.vertices[D * 2 + 1], se = l.vertices[F * 2 + 0], V = l.vertices[F * 2 + 1], he = J - G, ce = re - R, Y = Math.sqrt(he * he + ce * ce);
				he /= Y, ce /= Y;
				let ee = J - se, ue = re - V, q = Math.sqrt(ee * ee + ue * ue);
				ee /= q, ue /= q, E.normals[U * 2 + 0] = -ue, E.normals[U * 2 + 1] = ee, E.concave[U] = he * ue - ce * ee > 0;
				let z = l.vertexIndices[D];
				if (Array.isArray(z)) E.continuous[U] = !1;
				else {
					let[Q, oe] = this._shape.getCurveIndexFromVertexId(z - 1, !0);
					if (oe > 0 && oe < 1) E.continuous[U] = !0;
					else {
						let le = oe === 1 ? Q + 1 : Q - 1;
						le = (le + k) % k;
						let xe = oe === 1 ? 0 : 1,
						fe = this._shape.roundedCurves[Q].getTangent(oe),
						ye = this._shape.roundedCurves[le].getTangent(xe);
						E.continuous[U] = fe.dot(ye) > .95
					}
				}
				_ && (E.normals[U * 2 + 0] *= -1, E.normals[U * 2 + 1] *= -1), [O, D, F] = [D, F, F + 1], F >= M && (F -= C)
			} while ( F !== N + 1 );
			let W = [];
			W.push({
				bevelI: 0,
				angle: 0,
				size: 0,
				boundary: {
					vertices: l.vertices.slice(N * 2, M * 2),
					vertexCount: C,
					vertexIndices: new Array(C).fill(!0).map((U, G) =>[G, G]),
					elements: [0, C],
					elementCount: 1,
					mesh: null
				},
				reverseMap: [],
				insetPoints: l.vertices.slice(N * 2, M * 2)
			});
			for (let U = 1; U <= this._bevelSegments; U++) {
				let G = U / this._bevelSegments * Math.PI / 2,
				R = (1 - Math.cos(G)) * this._bevelSize,
				J = [],
				re = [],
				se = [],
				V = [],
				he = 0;
				for (let Y = 0; Y < C; Y++) {
					let ee = Y * 2,
					ue = (Y - 1 + C) % C * 2,
					q = l.vertices[E.start * 2 + ee + 0],
					z = l.vertices[E.start * 2 + ee + 1],
					Q = -E.normals[ue + 0] * R,
					oe = -E.normals[ue + 1] * R,
					le = -E.normals[ee + 0] * R,
					xe = -E.normals[ee + 1] * R;
					if (E.concave[Y] || !E.concave[Y] && _) {
						let fe = Math.atan2(oe, Q),
						ye = Math.atan2(xe, le);
						ye > fe && (ye -= Math.PI * 2);
						let Oe = ye - fe;
						if (E.continuous[Y] || _) {
							let P = fe + Oe / 2,
							L = Math.cos(P) * R,
							ae = Math.sin(P) * R;
							J[2 * he + 0] = q + L * (_ ? -1 : 1),
							J[2 * he + 1] = z + ae * (_ ? -1 : 1),
							V[he] = Y,
							he++
						} else {
							let P = Math.max(1, Math.floor(n / 4 * Math.abs(Oe) / Math.PI));
							for (let L = 0; L <= P; L++) {
								let ae = fe + Oe * (L / P),
								pe = Math.cos(ae) * R,
								ve = Math.sin(ae) * R;
								J[2 * he + 0] = q + pe,
								J[2 * he + 1] = z + ve,
								V[he] = Y,
								he++
							}
						}
					} else J[2 * he + 0] = q + Q,
					J[2 * he + 1] = z + oe,
					V[he] = Y,
					re[Y] = he,
					he++,
					J[2 * he + 0] = q,
					J[2 * he + 1] = z,
					V[he] = Y,
					he++,
					J[2 * he + 0] = q + le,
					J[2 * he + 1] = z + xe,
					V[he] = Y,
					se[Y] = he,
					he++
				}
				let ce = Tess.tesselate({
					windingRule: WindingRuleEnum.POSITIVE,
					elementType: ElementTypeEnum.BOUNDARY_CONTOURS,
					vertexSize: 2,
					strict: !0,
					contours: [J],
					edgeCreateCallback: Y =>{
						let ue = Y.Org.idx,
						q = V[ue],
						z = V[(ue + 1) % V.length];
						Y.idx = [q, z],
						Y.Sym.idx = [z, q]
					},
					vertexIdCallback: Y =>{
						let ee = Y.Lprev.idx;
						return [ee ? ee[1] : 0, Y.idx[0]]
					}
				});

				if (!ce) throw console.log("Error"),
				new Error(`error generating bevel geometry
				for $ {
					U
				}
				'th loop`);
                if (!ce.vertexCount) break;
                for (let Y = 0; Y < ce.vertexIndices.length; Y++) {
                    let [ee, ue] = ce.vertexIndices[Y];
                    if (ee === ue) continue;
                    let q = ue;
                    ue < ee && (q += C);
                    for (let z = ee; z < q; z++) {
                        let Q = z % C,
                            oe = (z + 1) % C;
                        if (!E.continuous[Q] || !E.continuous[oe]) {
                            ce.vertexIndices[Y] = [ee, Q], ce.vertexIndices.splice(Y + 1, 0, [oe, ue]), ce.vertices.splice((Y + 1) * 2, 0, ce.vertices[Y * 2], ce.vertices[Y * 2 + 1]);
                            break
                        }
                    }
                }
                W.push({
                    bevelI: U,
                    angle: G,
                    size: R,
                    boundary: ce,
                    reverseMap: V,
                    insetPoints: J
                })
            }
            let j = (U, G, R) => {
                let J = 0,
                    re = U.boundary.vertexIndices.length;
                for (; J < re && R(U.boundary.vertexIndices[G]);) G = (G + 1) % re, J++;
                return J
            },
                Z = x.length;
            for (let U = 1; U < W.length; U++) {
                let G = W[U - 1],
                    R = W[U],
                    J = G.boundary.vertexIndices.length,
                    re = R.boundary.vertexIndices.length;
                if (!J || !re) break;
                let se = E.concave.length,
                    V = 0,
                    he = Wg(V, C);
                for (; !G.boundary.vertexIndices.filter(he).length || !R.boundary.vertexIndices.filter(he).length;) V++, he = Wg(V, C);
                let ce = G.boundary.vertexIndices.findIndex(he),
                    Y = R.boundary.vertexIndices.findIndex(he);
                do ce = (ce + 1) % J; while (he(G.boundary.vertexIndices[ce]));
                do Y = (Y + 1) % re; while (he(R.boundary.vertexIndices[Y]));
                V = (V + 1) % C;
                let ee = V,
                    ue = this.buildBevelVert(E, G, (ce - 1 + J) % J),
                    q = this.buildBevelVert(E, R, (Y - 1 + re) % re),
                    z = ue,
                    Q = q,
                    oe, le, xe = !1;
                do {
                    he = Wg(V, C);
                    let fe = j(G, ce, he),
                        ye = j(R, Y, he),
                        Oe = xe;
                    if (xe = !1, fe && !ye) {
                        for (let P = 0; P < fe; P++) oe = this.buildBevelVert(E, G, (ce + P) % J, P / (fe - 1)), x.push(z.topN, oe.topP, Q.topN), x.push(oe.bottomP, z.bottomN, Q.bottomN), z = oe;
                        xe = !0
                    } else if (!fe && ye)
                        for (let P = 0; P < ye; P++) le = this.buildBevelVert(E, R, (Y + P) % re, P / (ye - 1)), x.push(Q.topN, z.topP, le.topP), x.push(z.bottomP, Q.bottomN, le.bottomP), Q = le;
                    else if (fe && ye)
                        if (oe = this.buildBevelVert(E, G, ce, 0), le = this.buildBevelVert(E, R, Y, 0), Oe ? (x.push(z.topN, le.topP, Q.topN), x.push(z.topN, oe.topP, le.topP), x.push(le.bottomP, z.bottomN, Q.bottomN), x.push(oe.bottomP, z.bottomN, le.bottomP)) : (x.push(z.topN, oe.topP, Q.topN), x.push(Q.topN, oe.topP, le.topP), x.push(oe.bottomP, z.bottomN, Q.bottomN), x.push(oe.bottomP, Q.bottomN, le.bottomP)), z = oe, Q = le, fe === ye)
                            for (let P = 1; P < fe; P++) oe = this.buildBevelVert(E, G, (ce + P) % J, P / (fe - 1)), le = this.buildBevelVert(E, R, (Y + P) % re, P / (ye - 1)), x.push(z.topN, oe.topP, Q.topN), x.push(Q.topN, oe.topP, le.topP), x.push(oe.bottomP, z.bottomN, Q.bottomN), x.push(oe.bottomP, Q.bottomN, le.bottomP), z = oe, Q = le;
                        else if (fe > ye) {
                            let P = fe / ye,
                                L = 0;
                            for (let ae = 1; ae < fe; ae++) oe = this.buildBevelVert(E, G, (ce + ae) % J, ae / (fe - 1)), x.push(z.topN, oe.topP, Q.topN), x.push(oe.bottomP, z.bottomN, Q.bottomN), z = oe, ae > (L + 1) * P && (L++, le = this.buildBevelVert(E, R, (Y + L) % re, L / (ye - 1)), x.push(Q.topN, oe.topP, le.topP), x.push(oe.bottomP, Q.bottomN, le.bottomP), Q = le)
                        } else {
                            let P = ye / fe,
                                L = 0;
                            for (let ae = 1; ae < ye; ae++) le = this.buildBevelVert(E, R, (Y + ae) % re, ae / (ye - 1)), x.push(Q.topN, oe.topP, le.topP), x.push(oe.bottomP, Q.bottomN, le.bottomP), Q = le, ae > (L + 1) * P && (L++, oe = this.buildBevelVert(E, G, (ce + L) % J, L / (fe - 1)), x.push(z.topN, oe.topP, Q.topN), x.push(oe.bottomP, z.bottomN, Q.bottomN), z = oe)
                        }
                    ce = (ce + fe) % J, Y = (Y + ye) % re, V = (V + 1) % se
                } while (V !== ee)
            } {
                let U = W[0];
                for (let G = 0, R = U.boundary.vertexCount; G < R; G++) {
                    let J = this.buildBevelVert(E, U, G),
                        re = this.buildBevelVert(E, U, (G + 1) % R);
                    x.push(re.topP, J.topN, J.bottomN), x.push(re.topP, J.bottomN, re.bottomP)
                }
            }
            if (_) {
                let U = [];
                for (let G = x.length - 1; G >= Z + 2; G -= 3) {
                    let R = x[G - 2],
                        J = x[G - 1],
                        re = x[G - 0];
                    U.push(re, J, R)
                }
                x.splice(Z, x.length - Z, ...U)
            }
            if (_) {
                let U = [];
                for (let G = W[W.length - 1].boundary.vertices.length - 1; G >= 1; G -= 2) {
                    let R = W[W.length - 1].boundary.vertices[G - 1],
                        J = W[W.length - 1].boundary.vertices[G - 0];
                    U.push(R, J)
                }
                y.push(U)
            }
            if (!_) {
                let U = W[W.length - 1],
                    G = Tess.tesselate({
                        windingRule: W.length > 1 ? WindingRuleEnum.POSITIVE : WindingRuleEnum.ODD,
                        elementType: ElementTypeEnum.POLYGONS,
                        vertexSize: 2,
                        strict: !0,
                        contours: [U.insetPoints, ...y]
                    });
                if (!G) throw new Error("Error generating geometry for surface");
                for (let R = 0; R < G.elementCount * 3; R += 3) {
                    let J = this.buildSurfaceVert(G, G.elements[R + 0]),
                        re = this.buildSurfaceVert(G, G.elements[R + 1]),
                        se = this.buildSurfaceVert(G, G.elements[R + 2]);
                    x.push(J.top, re.top, se.top), x.push(se.bottom, re.bottom, J.bottom)
                }
            }
            this.vertexCache = {}
        }
        this._buffer.shrink();
        let m = new BufferAttribute(Uint32Array.from(x), 1),
            v = new BufferAttribute(this._buffer.positions, 3),
            w = new BufferAttribute(this._buffer.normals, 3),
            b = new BufferAttribute(this._buffer.uvs, 2);
        v.needsUpdate = !0, w.needsUpdate = !0, b.needsUpdate = !0, m.needsUpdate = !0, this.setAttribute("position", v), this.setAttribute("normal", w), this.setAttribute("uv", b), this.setIndex(m)
    }
    buildSurfaceVert(e, t) {
        let r = t.toString();
        if (r in this.vertexCache) return this.vertexCache[r];
        let n = e.vertices[t * 2 + 0],
            s = e.vertices[t * 2 + 1],
            o = (n - this._minX) / this._width,
            a = (s - this._minY) / this._height,
            l = this._buffer.get(2),
            c = l * 3,
            u = l * 2,
            h = {
                top: l + 0,
                bottom: l + 1
            };
        return this._buffer.positions[c + 0] = n, this._buffer.positions[c + 1] = s, this._buffer.positions[c + 2] = this._depth, this._buffer.normals[c + 0] = 0, this._buffer.normals[c + 1] = 0, this._buffer.normals[c + 2] = 1, this._buffer.uvs[u + 0] = o, this._buffer.uvs[u + 1] = a, this._buffer.positions[c + 3] = n, this._buffer.positions[c + 4] = s, this._buffer.positions[c + 5] = 0, this._buffer.normals[c + 3] = 0, this._buffer.normals[c + 4] = 0, this._buffer.normals[c + 5] = -1, this._buffer.uvs[u + 2] = o, this._buffer.uvs[u + 3] = a, this.vertexCache[r] = h, h
    }
    buildBevelVert(e, t, r, n = 1) {
        let s = `${t.bevelI}:${r}`;
        if (s in this.vertexCache) return this.vertexCache[s];
        let [o, a] = t.boundary.vertexIndices[r], l, c, u, h;
        o !== a ? (c = o, l = a, h = !1, u = e.continuous[c] && e.continuous[l]) : (l = o, c = (l - 1 + e.count) % e.count, h = e.concave[l] && t.bevelI > 0, u = e.continuous[l] || h);
        let d = Math.cos(t.angle),
            f = Math.sin(t.angle),
            p = r * 2,
            g = l * 2,
            x = c * 2,
            y = t.boundary.vertices[p + 0],
            m = t.boundary.vertices[p + 1],
            v = (1 - f) * this._bevelSize,
            w = (y - this._minX) / this._width,
            b = (m - this._minY) / this._height,
            T = e.normals[g + 0],
            _ = e.normals[g + 1],
            S = e.normals[x + 0],
            N = e.normals[x + 1];
        if (h) {
            let O = S - T,
                F = N - _;
            T = T + O * (1 - n), _ = _ + F * (1 - n);
            let k = Math.sqrt(T * T + _ * _);
            T /= k, _ /= k
        }
        let C = this._buffer.get(u ? 2 : 4),
            M = C * 3,
            E = C * 2,
            D = {
                i: r,
                fi: l,
                topP: C + 0,
                topN: C + 0,
                bottomP: C + 1,
                bottomN: C + 1
            };
        return this._buffer.positions[M + 0] = y, this._buffer.positions[M + 1] = m, this._buffer.positions[M + 2] = this._depth - v, this._buffer.normals[M + 0] = T * d, this._buffer.normals[M + 1] = _ * d, this._buffer.normals[M + 2] = f, this._buffer.uvs[E + 0] = w, this._buffer.uvs[E + 1] = b, this._buffer.positions[M + 3] = y, this._buffer.positions[M + 4] = m, this._buffer.positions[M + 5] = v, this._buffer.normals[M + 3] = T * d, this._buffer.normals[M + 4] = _ * d, this._buffer.normals[M + 5] = -f, this._buffer.uvs[E + 2] = b, this._buffer.uvs[E + 3] = w, u || (C += 2, M += 6, E += 4, D.topP = C + 0, D.bottomP = C + 1, this._buffer.positions[M + 0] = y, this._buffer.positions[M + 1] = m, this._buffer.positions[M + 2] = this._depth - v, this._buffer.normals[M + 0] = S * d, this._buffer.normals[M + 1] = N * d, this._buffer.normals[M + 2] = f, this._buffer.uvs[E + 0] = w, this._buffer.uvs[E + 1] = b, this._buffer.positions[M + 3] = y, this._buffer.positions[M + 4] = m, this._buffer.positions[M + 5] = v, this._buffer.normals[M + 3] = S * d, this._buffer.normals[M + 4] = N * d, this._buffer.normals[M + 5] = -f, this._buffer.uvs[E + 2] = b, this._buffer.uvs[E + 3] = w), this.vertexCache[s] = D, D
    }
    clone() {
        let e = new RvShapeGeometry(this._shape, this._depth, this._bevel, this._curveSegments, this._bevelSegmentsInput);
        return e.userData = _.cloneDeep(this.userData), e
    }
};



export class HeShapeGeometry extends BufferGeometry {
    constructor(e = !0, t = 1, r = 1, n = 1, s = 1, o = 1, a = 1, l = 1, c = 1, u = 1, h = 1, d = 1) {
        super();
        let f = e && o === 1;
        f && (d = 0), h > 100 && (h = 100);
        let p = () => new Vector3,
            g = new Vector3,
            x = p(),
            y = p(),
            m = p(),
            v, w, b, T, _, S, N, C, M = p(),
            E = p(),
            D = p(),
            O = p(),
            F = p(),
            k = p(),
            W = p(),
            j = p(),
            Z = r - 2 * l + .001,
            U = Z / o,
            G = Math.ceil(a * o),
            R = G + 1,
            J = Z / G,
            re = -Z / 2,
            se = u + 1,
            V = 2 * Math.PI / u,
            he = Math.PI / 2 / d,
            ce = .01,
            Y = Math.min((1 - h / 100) * l, l - ce),
            ee = l - Y,
            ue = 0,
            q = 2,
            z = d * q + q,
            Q = se * z / q,
            oe = Q + se * R,
            le = se * (R + z),
            [xe, fe, ye] = [3, 3, 2].map(Ee => Array(le * Ee).fill(0)),
            Oe = [],
            P = s - l;

        function L(Ee, H) {
            let Le = Math.PI / 2;
            S = H * J, C = 2 * Math.PI * (S % U) / U + Le, S += re, N = Math.sin(C) * P, _ = Math.cos(C) * P, e ? Ee.set(_, N, S) : Ee.set(_, S, N)
        }
        L(g, -1e-10), L(x, 0), M.copy(g), L(g, 1);
        let ae = g.distanceTo(x),
            pe = ee + Y,
            ve = ae * G + 2 * pe,
            Ce = Y,
            Fe = ve - pe;
        for (let Ee = 0; Ee <= G; Ee++) {
            L(y, Ee), j.subVectors(y, M).normalize(), M.copy(y), k.copy(y).setComponent(+e + 1, 0).normalize(), W.crossVectors(j, k).normalize();
            let H = Ee === 0,
                Le = Ee === G,
                Pe = H ? 3 * Math.PI / 2 : he,
                it = H ? Ce : Fe,
                Ie = H ? se : oe,
                we = H ? 0 : le - se,
                et = j.clone().multiplyScalar(H ? -ee : ee).add(y),
                mt = j.clone().multiplyScalar(H ? -1 : 1).normalize();
            for (let Ut = 0; Ut < se; Ut++) {
                let St = Ut * V;
                if (E.addVectors(g.copy(k).multiplyScalar(l * Math.cos(St)), x.copy(W).multiplyScalar(l * Math.sin(St))), D.copy(E).normalize(), H || Le) {
                    f || (ue = we + Ut, [0, 1, 2].forEach(Gt => {
                        xe[ue * 3 + Gt] = et.getComponent(Gt), fe[ue * 3 + Gt] = mt.getComponent(Gt)
                    }), ye[ue * 2] = +Le, ye[ue * 2 + 1] = Ut / u), x.copy(D).multiplyScalar(Y), m.addVectors(y, x);
                    for (let Gt = 0; Gt < d; Gt++) {
                        let Ur = Gt * he + Pe;
                        O.addVectors(g.copy(j).multiplyScalar(ee * Math.sin(Ur)), x.copy(D).multiplyScalar(ee * Math.cos(Ur))), F.copy(O).normalize(), x.addVectors(m, O), O.normalize(), ue = Ie + Gt * se + Ut, [0, 1, 2].forEach(je => {
                            xe[ue * 3 + je] = x.getComponent(je), fe[ue * 3 + je] = F.getComponent(je)
                        });
                        let $o = +H + Math.sin(Ur);
                        ye[ue * 2] = (it + ee * $o) / ve, ye[ue * 2 + 1] = Ut / u
                    }
                }
                x.addVectors(y, E), ue = Q + Ee * se + Ut, [0, 1, 2].forEach(Gt => {
                    xe[ue * 3 + Gt] = x.getComponent(Gt), fe[ue * 3 + Gt] = D.getComponent(Gt)
                }), ye[ue * 2] = (pe + Ee * ae) / ve, ye[ue * 2 + 1] = Ut / u
            }
        }
        let de = R + 2 * d + q,
            He = 1,
            [Qe, Ue] = f ? [He, He + R - 1] : [0, de - 1];
        for (let Ee = Qe; Ee <= Ue - 1; Ee++) {
            let H = f && Ee === Ue - 1;
            for (let Le = 0; Le < se - 1; Le++) v = Ee * se + Le, w = v + 1, b = (H ? Le : v) + se, T = (H ? Le + 1 : w) + se, Ee === 0 ? Oe.push(w, T, b) : Ee === de - 2 ? Oe.push(v, w, b) : Oe.push(v, w, b, w, T, b)
        }
        this.setIndex(Oe), this.setAttribute("position", new Float32BufferAttribute(xe, 3)), this.setAttribute("normal", new Float32BufferAttribute(fe, 3)), this.setAttribute("uv", new Float32BufferAttribute(ye, 2))
    }
};



export class PyShapeGeometry extends BufferGeometry {
    constructor(e = .5, t = 1, r = 4, n = 1, s = !1, o = 0, a = 4) {
        super();
        r = Math.floor(Math.max(3, r)), n = Math.floor(n), a = Math.floor(a);
        let l = [],
            c = [],
            u = [],
            h = [],
            d = 0,
            f = t / 2,
            p = Math.PI / r,
            g = e * Math.cos(Math.PI / r),
            x = 2 * Math.PI / r,
            y = (r - 2) * Math.PI / r,
            m = Math.PI - y,
            v = new Vector3(0, -f, 0),
            w = new Vector3(0, f, 0),
            b = new Vector2(e, -f),
            T = new Vector2(g, -f),
            _ = new Vector2(0, w.y).sub(T),
            S = new Vector2(0, w.y).sub(b),
            N = new Vector2(_.y, -_.x).normalize(),
            C = new Vector2(S.y, -S.x).normalize(),
            E = e * Math.cos(Math.PI / r) * Math.tan((Math.PI - _.angle()) / 2) - 1e-8;
        o = Math.min(o, E);
        let D; {
            let U = new Vector3(N.x, N.y, 0),
                G = new Vector3(Math.cos(x) * U.x, U.y, Math.sin(x) * U.x);
            D = U.angleTo(G)
        }
        let O = o / Math.tan((Math.PI - _.angle()) / 2),
            F = o / Math.tan((Math.PI - D) / 2),
            k = new Vector3;
        if (!s) {
            c.push(v.x, v.y, v.z), u.push(0, -1, 0), h.push(0, 0);
            let U = d++,
                G = [],
                R = b.clone(),
                J = O / Math.cos(Math.PI / r);
            R.x -= J;
            for (let re = 0; re < r; re++) {
                let se = re / r * Math.PI * 2 + p,
                    V = new Vector2(Math.sin(se), Math.cos(se));
                eu(R, V, k), c.push(k.x, k.y, k.z), u.push(0, -1, 0), h.push(0, 0), G.push(d++)
            }
            for (let re = 0; re < G.length; re++) l.push(G[re], U, G[(re + 1) % G.length])
        }
        let W = []; {
            let U = new Vector3,
                G = new Vector3,
                R = new Vector3,
                J = new Vector3,
                re = new Vector3,
                se = new Vector3;
            for (let V = 0; V < r; V++) {
                let he = V / r * Math.PI * 2 + p,
                    ce = (V + .5) / r * Math.PI * 2 + p,
                    Y = (V + 1) / r * Math.PI * 2 + p,
                    ee = new Vector2(Math.sin(he), Math.cos(he)),
                    ue = new Vector2(Math.sin(ce), Math.cos(ce)),
                    q = new Vector2(Math.sin(Y), Math.cos(Y));
                eu(b, ee, G), eu(b, q, R), eu(N, ue, U), Qg(w, G, R, F, F, J), c.push(J.x, J.y, J.z), Qg(G, w, R, F, O, re), c.push(re.x, re.y, re.z), Qg(R, G, w, O, F, se), c.push(se.x, se.y, se.z), u.push(U.x, U.y, U.z), u.push(U.x, U.y, U.z), u.push(U.x, U.y, U.z), h.push(0, 0), h.push(0, 0), h.push(0, 0);
                let z = d++,
                    Q = d++,
                    oe = d++;
                if (l.push(z, Q, oe), o > 0) {
                    {
                        let fe = G.clone().add(R).multiplyScalar(.5),
                            ye = w.clone().sub(fe).normalize(),
                            P = v.clone().sub(fe).normalize().add(ye).normalize().multiplyScalar(-1),
                            L = se.clone().sub(re);
                        j(fe, L, P, _.angle())
                    }
                    let le, xe; {
                        let fe = new Vector3;
                        eu(C, q, fe);
                        let ye = se.clone().add(J).multiplyScalar(.5);
                        ye = HO(ye, R, w);
                        let Oe = se.clone().sub(J);
                        [le, xe] = j(ye, Oe, fe, D, J.y)
                    } {
                        let fe = le,
                            ye = fe.clone().setY(0).normalize(),
                            Oe = new Vector3(0, -1, 0),
                            P = ye.clone().cross(Oe);
                        Z(fe, ye, Oe, P)
                    }
                    W.concat(xe); {
                        let fe = _.angle(),
                            ye = Math.PI - fe,
                            Oe = w.clone();
                        Oe.y -= o / Math.sin(fe - Math.PI / 2);
                        let P = new Vector3,
                            L = [];
                        for (let pe = 0; pe < a; pe++) {
                            let ve = [],
                                Ce = Math.PI / 2 - ye * pe / a,
                                Fe = Math.cos(Ce),
                                de = Math.sin(Ce),
                                He = ce;
                            for (let Qe = 0; Qe <= pe; Qe++) {
                                let Ue = Math.cos(He),
                                    Ee = Math.sin(He);
                                U.x = Fe * Ee, U.y = de, U.z = Fe * Ue, P.copy(Oe).addScaledVector(U, o), c.push(P.x, P.y, P.z), u.push(U.x, U.y, U.z), h.push(0, 0), ve.push(d++), He += Math.PI * 2 / pe / r
                            }
                            L.push(ve)
                        }
                        xe.reverse(), L.push(xe);
                        let ae = L.length - 1;
                        for (let pe = 0; pe < ae; pe++) {
                            let ve = L[pe],
                                Ce = L[pe + 1],
                                Fe = ve.length - 1;
                            l.push(Ce[1], ve[0], Ce[0]);
                            for (let de = 1; de <= Fe; de++) l.push(ve[de], ve[de - 1], Ce[de]), l.push(Ce[de + 1], ve[de], Ce[de])
                        }
                    }
                }
            }
        }
        this.setIndex(l), this.setAttribute("position", new Float32BufferAttribute(c, 3)), this.setAttribute("normal", new Float32BufferAttribute(u, 3)), this.setAttribute("uv", new Float32BufferAttribute(h, 2));

        function j(U, G, R, J, re) {
            let se = -J / 2,
                V = (Math.PI - J) / 2,
                he = G.clone().normalize().cross(R);
            U.addScaledVector(R, -o / Math.sin(V));
            let ce = new Vector3,
                Y = new Vector3,
                ee = 1,
                ue = d,
                q = [];
            for (let z = 0; z <= a; z++) {
                let Q = se + z / a * J;
                Y.set(0, 0, 0), Y.addScaledVector(he, Math.sin(Q)), Y.addScaledVector(R, Math.cos(Q));
                for (let oe = 0; oe <= ee; oe++) {
                    let le = oe / ee - .5;
                    if (ce.copy(U), ce.addScaledVector(G, le), ce.addScaledVector(Y, o), re != null) {
                        let xe = Math.max(0, ce.y - re);
                        ce.addScaledVector(G, -xe / G.y)
                    }
                    c.push(ce.x, ce.y, ce.z), u.push(Y.x, Y.y, Y.z), h.push(0, 0), oe === 0 && q.push(d), d++
                }
            }
            for (let z = 0; z < a; z++)
                for (let Q = 0; Q < ee; Q++) {
                    let oe = ue + Q + (ee + 1) * z,
                        le = oe + (ee + 1),
                        xe = le + 1,
                        fe = oe + 1;
                    l.push(oe, le, fe), l.push(le, xe, fe)
                }
            return [U.clone().addScaledVector(G, .5), q]
        }

        function Z(U, G, R, J) {
            let re = Math.PI / 2,
                se = S.angle() - re,
                V = [],
                he = new Vector3,
                ce = new Vector3;
            for (let ee = 0; ee <= a; ee++) {
                let ue = [],
                    q = ee / a;
                for (let z = 0; z <= ee; z++) {
                    let oe = ((ee ? z / ee : 0) - .5) * m,
                        le = Math.cos(oe),
                        xe = Math.sin(oe),
                        fe = Math.atan(Math.tan(se) * le),
                        ye = (re + fe) * q,
                        Oe = Math.cos(ye),
                        P = Math.sin(ye);
                    he.set(0, 0, 0), he.addScaledVector(G, P * le), he.addScaledVector(R, Oe), he.addScaledVector(J, P * xe), ce.copy(U).addScaledVector(he, o), c.push(ce.x, ce.y, ce.z), u.push(he.x, he.y, he.z), h.push(0, 0), ue.push(d++)
                }
                V.push(ue)
            }
            let Y = V.length - 1;
            for (let ee = 0; ee < Y; ee++) {
                let ue = V[ee],
                    q = V[ee + 1],
                    z = ue.length - 1;
                l.push(ue[0], q[1], q[0]);
                for (let Q = 1; Q <= z; Q++) l.push(ue[Q - 1], ue[Q], q[Q]), l.push(ue[Q], q[Q + 1], q[Q])
            }
        }
    }
};
