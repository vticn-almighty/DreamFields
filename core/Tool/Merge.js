import _ from 'lodash'
import { Mesh } from 'three'
import SpecialMesh from '../SpecialMesh'
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils'
import { LayerTool } from './Proto'



// merge
function YG(i) {
    let e;
    if (!!i.index)
        for (let t = 0; t < i.index.array.length; t += 3) e = i.index.array[t], i.index.array[t] = i.index.array[t + 2], i.index.array[t + 2] = e
}


// merge

export function hx(i) {
    return i === "SubdivObject" || i === "NonParametric" ? i : "Mesh"
}


// merge
export function JG(i, e) {
    let t = {};
    return i.traverseEntity(r => {
        var c;
        if (r.type !== "Mesh" || !("material" in r) || !r.visible || !(r instanceof SpecialMesh) || Array.isArray(r.material) || r && r.interaction && r.interaction.states.length > 0) return;
        let n = r.parent;
        for (; n;) {
            if (n instanceof SpecialMesh && n.interaction && n.interaction.states.length > 1) return;
            n = n.parent
        }
        let s = r.material.uuid,
            o = e.shared.materials[s];
        if (o) {
            if (!LayerTool.isMergable(o)) return
        } else {
            let u = (c = e.scene.objects.get(r.uuid)) == null ? void 0 : c.data;
            if (u && "material" in u && typeof u.material != "string") {
                if (!LayerTool.isMergable(u.material)) return;
                s = LayerTool.getHash(u.material)
            }
        }
        t[s] || (t[s] = {});
        let l = t[s][hx(r.ObjectType)];
        if (l) {
            if (l.push(r), r.cloner)
                for (let u of r.cloner.children) l.push(u)
        } else if (t[s][hx(r.ObjectType)] = [r], r.cloner)
            for (let u of r.cloner.children) t[s][hx(r.ObjectType)].push(u)
    }), t
}

// merge
export function QG(i) {
    let e = 0;
    return Object.values(i).forEach(t => {
        Object.values(t).forEach(r => {
            let n = r.length;
            n > e && (e = n)
        })
    }), e
}

// merge
function mergeGeometries(i, e) {

    let t = JG(e, i),
        r = QG(t),
        n = new Array(r),
        s = 0,
        o = new Array(r),
        a = 0,
        l = new Array(r),
        c = 0,
        u = new Array(r),
        h = 0;
    for (let d of Object.values(t))
        for (let f of Object.values(d)) {
            if (a = 0, c = 0, f.forEach(g => {
                g instanceof SpecialMesh && (o[a++] = g.geometry.clone(), l[c++] = g)
            }), c < 2) continue;
            for (let g = 0; g < c; g++) l[g].updateWorldMatrix(!0, !1), o[g].applyMatrix4(l[g].matrixWorld), l[g].matrixWorld.determinant() < 0 && YG(o[g]);
            let p = mergeBufferGeometries(o.slice(0, a), !1);
            if (p) {
                let g;
                switch (f[0].ObjectType) {
                    case "SubdivObject": {
                        console.warn("Turning subdiv object into mesh"), g = new Mesh(p, l[0].material);
                        break
                    }
                    default: {
                        g = new Mesh(p, l[0].material);
                        break
                    }
                }
                g.castShadow = l[0].castShadow, g.receiveShadow = l[0].receiveShadow, e.add(g);
                let x = y => {
                    h = 0;
                    for (let m of y) m.children && x(m.children), m instanceof SpecialMesh && (Array.isArray(m.material) || t[m.material.uuid] && t[m.material.uuid][m.ObjectType] && t[m.material.uuid][m.ObjectType].length > 1 || (u[h++] = m));
                    for (let m = 0; m < h; m++) e.attach(u[m])
                };
                for (let y = 0; y < c; y++) {
                    let m = l[y];
                    x(m.children), n[s++] = m
                }
            }
        }
    for (let d = 0; d < s; d++) n[d].removeFromParent()
}

export { mergeGeometries }