

import { Uint32BufferAttribute } from "three";
function KO(i, e) {
    let t = i;
    t = Math.min(t, 3 - Math.ceil(Math.log(e / 172e3) / Math.log(4)))
    return Math.max(t, 0)
}
export default class Tool {
    static build(i, e, t, r, n) {
        let s, o, a;
        if (i === void 0) s = Tool.allocate(n, t), Xe.set_destination_refinement_level(s, 0), o = Tool.buildLevel(s, !0, r);
        else if (i.positionWASM !== void 0) {
            e && e !== 0 && (Xe.free_bvh(e), Xe.free_subdivision_surface(e));
            try {
                s = Tool.allocate(n, void 0, i)
            } catch (l) {
                console.error(l, i), s = Tool.allocate(n, void 0, {
                    positionWASM: y1,
                    indexWASM: x1,
                    verticesPerFaceWASM: v1
                })
            }
            Xe.set_destination_refinement_level(s, 0), o = Tool.buildLevel(s, !0, r)
        } else s = e;
        if (i !== void 0 && i.subdivisions !== void 0) {
            let l = KO(i.subdivisions, i.positionWASM.length);
            Xe.set_destination_refinement_level(s, l), l > 0 ? a = Tool.buildLevel(s, !1, r) : a = null
        }
        return {
            subdivPointer: s,
            originalGeometry: o,
            subdividedGeometry: a
        }
    }
    static allocate(i, e, t) {
        var b;
        let r, n, s, o = [],
            a = [];
        if (t) t.positionWASM && t.positionWASM.length > 0 ? (r = t.positionWASM, n = t.indexWASM, s = t.verticesPerFaceWASM) : (r = y1, n = x1, s = v1);
        else {
            e.deleteAttribute("normal"), e.deleteAttribute("uv");
            let T = vM(e);
            r = T.attributes.position.array;
            let _ = T.getIndex().array,
                S = _.length;
            switch (e.userData.type === "TorusGeometry" && (e == null ? void 0 : e.userData.parameters.arc) === Math.PI * 2 && (e.userData.type = "ClosedTorusGeometry"), e.userData.type) {
                case "ClosedTorusGeometry":
                case "PlaneGeometry":
                case "TorusKnotGeometry":
                case "CubeGeometry":
                    n = new Uint32Array(S / 3 * 2), s = new Uint8Array(S / 6).fill(4);
                    for (let F = 0, k = 0; F < S; F += 6) n[k++] = _[F], n[k++] = _[F + 1], n[k++] = _[F + 4], n[k++] = _[F + 5];
                    break;
                case "TorusGeometry":
                case "SphereGeometry":
                case "HelixGeometry":
                case "CylinderGeometry":
                case "ConeGeometry":
                    let N, C, M;
                    if (e.userData.type === "SphereGeometry") C = e.parameters.heightSegments, N = e.parameters.widthSegments, e.parameters.thetaLength !== Math.PI && (M = !0);
                    else if (e.userData.type === "CylinderGeometry") C = e.parameters.heightSegments + 2, N = e.parameters.radialSegments;
                    else if (e.userData.type === "ConeGeometry") C = e.parameters.heightSegments + 1, N = e.parameters.radialSegments;
                    else if (e.userData.type === "TorusGeometry") {
                        let F = e.userData.parameters;
                        C = Math.ceil(F.tubularSegments * F.arc / (2 * Math.PI)) + 2, N = F.radialSegments
                    } else {
                        let {
                            pathSegments: F,
                            segments: k,
                            revolutions: W
                        } = e.userData.parameters;
                        C = Math.ceil(k * W) + 2, N = F
                    }
                    M ? (n = new Uint32Array(1 * N * 3 + (C - 1) * N * 4), s = new Uint8Array(1 * N + (C - 1) * N)) : (n = new Uint32Array(2 * N * 3 + (C - 2) * N * 4), s = new Uint8Array(2 * N + (C - 2) * N));
                    let E = 0,
                        D = 0,
                        O = 0;
                    if (e.userData.type === "SphereGeometry" || e.userData.type === "HelixGeometry" || e.userData.type === "TorusGeometry") {
                        for (; D < 3 * N;) n[D++] = _[E++], n[D++] = _[E++], n[D++] = _[E++], s[O++] = 3;
                        let F = M ? n.length : 3 * N + 4 * (C - 2) * N;
                        for (; D < F; E += 6) n[D++] = _[E], n[D++] = _[E + 1], n[D++] = _[E + 4], n[D++] = _[E + 5], s[O++] = 4
                    } else
                        for (; D < 4 * (C - 2) * N; E += 6) n[D++] = _[E], n[D++] = _[E + 1], n[D++] = _[E + 4], n[D++] = _[E + 5], s[O++] = 4;
                    for (; D < n.length;) n[D++] = _[E++], n[D++] = _[E++], n[D++] = _[E++], s[O++] = 3;
                    break;
                default:
                    n = _, s = new Uint8Array(S / 3).fill(3);
                    break
            }
        }
        let l = r.length,
            c = n.length,
            u = s.length,
            h = r.length + o.length + a.length,
            d = n.length + s.length,
            f = h * Float32Array.BYTES_PER_ELEMENT + d * Uint32Array.BYTES_PER_ELEMENT,
            p = h * Float32Array.BYTES_PER_ELEMENT,
            g = d * Uint32Array.BYTES_PER_ELEMENT,
            x = Xe._malloc(f),
            y = new Float32Array(Xe.HEAPF32.buffer, x, h),
            m = new Uint32Array(Xe.HEAPU32.buffer, x + p, d);
        y.set(r, 0), y.set(o, r.length), y.set(a, r.length + o.length), m.set(n, 0), m.set(s, n.length);
        let v;
        ((b = t == null ? void 0 : t.scaleBaked) == null ? void 0 : b.some(T => T !== 1)) && (v = new Matrix4().makeScale(...t.scaleBaked)), i && (v ? v.premultiply(i) : v = i);
        let w = v ? Xe.alloc_subdivision_surface2(x, l, x + p, c, x + p + n.length * Uint32Array.BYTES_PER_ELEMENT, u, v.elements) : Xe.alloc_subdivision_surface(x, l, x + p, c, x + p + n.length * Uint32Array.BYTES_PER_ELEMENT, u);
        return Xe._free(x), w
    }
    static buildLevel(i, e, t, r, n) {
        let s = n ? Xe.get_mesh_data2(i, e ? Xe.Level.CONTROL : Xe.Level.REFINED, t != null ? t : !e, n.elements) : Xe.get_mesh_data(i, e ? Xe.Level.CONTROL : Xe.Level.REFINED, t != null ? t : !e),
            o = 8,
            a = Xe.HEAPU32.subarray(s >> 2, (s >> 2) + o),
            l = a.subarray(4, 4 + 4),
            c = 0,
            u = Xe.HEAPU32[a[c] >> 2],
            h = Xe.HEAPF32.subarray(u >> 2, (u >> 2) + l[c]);
        c++;
        let d = Xe.HEAPU32[a[c] >> 2],
            f = Xe.HEAPF32.subarray(d >> 2, (d >> 2) + l[c]);
        c++;
        let p = Xe.HEAPU32[a[c] >> 2],
            g = Xe.HEAPU32.subarray(p >> 2, (p >> 2) + l[c]);
        c++;
        let x = Xe.HEAPU32[a[c] >> 2],
            y = Xe.HEAPU32.subarray(x >> 2, (x >> 2) + l[c]);
        if (c++, r === void 0) {
            let m = new BufferGeometry;
            if (m.setIndex(new Uint32BufferAttribute(y, 1)), m.setAttribute("position", new Float32BufferAttribute(h, 3)), m.setAttribute("normal", new Float32BufferAttribute(f, 3)), e) {
                m.setAttribute("faceMap", new Uint32BufferAttribute(g, 1));
                let v = new Float32Array(f.length / 3 * 4).fill(0);
                m.setAttribute("color", new BufferAttribute(v, 4))
            }
            return Xe.free_mesh_data(s), m.userData.type = "SubdivGeometry", m
        }
        r.getAttribute("position").copyArray(h), r.getAttribute("normal").copyArray(f), r.attributes.position.needsUpdate = !0, r.attributes.normal.needsUpdate = !0, Xe.free_mesh_data(s)
    }
    static buildControlCageWireframe(i, e, t) {
        let r = Xe.get_wireframe_data_for_base_level(i),
            n = 4,
            s = Xe.HEAPU32.subarray(r >> 2, (r >> 2) + n),
            o = s.subarray(2, 2 + 2),
            a = 0,
            l = Xe.HEAPU32[s[a] >> 2],
            c = Xe.HEAPF32.subarray(l >> 2, (l >> 2) + o[a]);
        a++;
        let u = Xe.HEAPU32[s[a] >> 2],
            h = Xe.HEAPU32.subarray(u >> 2, (u >> 2) + o[a]);
        if (e === void 0) {
            let d = new BufferGeometry;
            d.setAttribute("position", new Float32BufferAttribute(c, 3));
            let f = new Float32Array(c.length);
            for (let p = 0, g = c.length; p < g;) f[p++] = t.r, f[p++] = t.g, f[p++] = t.b;
            return d.setAttribute("color", new BufferAttribute(f, 3)), d.setIndex(new Uint32BufferAttribute(h, 1)), Xe.free_wireframe_data_for_base_level(r), d
        }
        e.getAttribute("position").copyArray(c), e.attributes.position.needsUpdate = !0, Xe.free_wireframe_data_for_base_level(r)
    }
    static updateCollabMesh(i, e, t) {
        e || Xe.set_destination_refinement_level(i, 1);
        let r = t ? Xe.get_topological_data2(i, e ? Xe.Level.CONTROL : Xe.Level.REFINED, t.elements) : Xe.get_topological_data(i, e ? Xe.Level.CONTROL : Xe.Level.REFINED),
            n = 6,
            s = Xe.HEAPU32.subarray(r >> 2, (r >> 2) + n),
            o = s.subarray(3, 3 + 3),
            a = 0,
            l = Xe.HEAPU32[s[a] >> 2],
            c = new Float32Array(Xe.HEAPF32.subarray(l >> 2, (l >> 2) + o[a]));
        a++;
        let u = Xe.HEAPU32[s[a] >> 2],
            h = new Uint32Array(Xe.HEAPU32.subarray(u >> 2, (u >> 2) + o[a]));
        a++;
        let d = Xe.HEAPU32[s[a] >> 2],
            f = new Uint8Array(Xe.HEAPU32.subarray(d >> 2, (d >> 2) + o[a]));
        return Xe.free_topological_data(r), {
            positions: c,
            indices: h,
            verticesPerFace: f
        }
    }
};
