import { Color, Float32BufferAttribute, LineBasicMaterial, LineSegments, BufferGeometry, Camera } from 'three'
import { setPosition } from './Tool'

let ri = new Camera;

export default class CameraHelper extends LineSegments {
    constructor(e) {

        let t = new BufferGeometry,
            r = new LineBasicMaterial({
                color: 16777215,
                vertexColors: !0,
                toneMapped: !1
            }),
            n = [],
            s = [],
            o = {},
            a = new Color(15711266),
            l = new Color(15711266),
            c = new Color(2857471);

        super(t, r);



        u("n1", "n2", a), u("n2", "n4", a), u("n4", "n3", a), u("n3", "n1", a);
        u("f1", "f2", a), u("f2", "f4", a), u("f4", "f3", a), u("f3", "f1", a);
        u("n1", "f1", a), u("n2", "f2", a), u("n3", "f3", a), u("n4", "f4", a);
        u("p", "n1", l), u("p", "n2", l), u("p", "n3", l), u("p", "n4", l);
        u("u1", "u2", c), u("u2", "u3", c), u("u3", "u1", c);

        function u(d, f, p) {
            h(d, p), h(f, p)
        }

        function h(d, f) {
            n.push(0, 0, 0), s.push(f.r, f.g, f.b), o[d] === void 0 && (o[d] = []), o[d].push(n.length / 3 - 1)
        }
        t.setAttribute("position", new Float32BufferAttribute(n, 3));
        t.setAttribute("color", new Float32BufferAttribute(s, 3));
        this.type = "CameraHelper";
        this.camera = e;
        this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix()
        this.matrix = e.matrixWorld;
        this.matrixAutoUpdate = !1;
        this.pointMap = o;
        this.update()
    }
    update() {
        let e = this.geometry,
            t = this.pointMap,
            r = !0;
        ri.projectionMatrixInverse.elements = [.5112609807824982, -0, -0, -0, -0, .41421356237309503, -0, -0, -0, -0, -0, -.099999, -0, -0, -1.0000000000000002, .100001];
        let n = 1,
            s = 1,
            o = r ? .8 : 1e-4;
        setPosition("n1", t, e, ri, -n, -s, o);
        setPosition("n2", t, e, ri, n, -s, o);
        setPosition("n3", t, e, ri, -n, s, o);
        setPosition("n4", t, e, ri, n, s, o);
        let a = o;
        setPosition("f1", t, e, ri, -n, -s, a);
        setPosition("f2", t, e, ri, n, -s, a);
        setPosition("f3", t, e, ri, -n, s, a);
        setPosition("f4", t, e, ri, n, s, a);
        let l = a,
            c = .5;
        setPosition("u1", t, e, ri, n * .7 * c, s * 1.1, l);
        setPosition("u2", t, e, ri, -n * .7 * c, s * 1.1, l);
        setPosition("u3", t, e, ri, 0, s * (1.1 + .9 * c), l);
        e.getAttribute("position").needsUpdate = !0
    }
    dispose() {
        this.geometry.dispose(), this.material.dispose()
    }
};



