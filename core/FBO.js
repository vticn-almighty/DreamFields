import * as THREE from 'three'
import Triangle from '../Utils/Triangle';

function a(e, t) {
    var n = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
        var i = Object.getOwnPropertySymbols(e);
        t && (i = i.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable
        })), n.push.apply(n, i)
    }
    return n
}

function l(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n, e
} (() => {
    // const e = s.getContext();
    // !!e.getExtension("OES_texture_float") && e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)
})();
const u = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;


export default class c {
    constructor({
        width: e,
        height: t,
        data: n,
        name: o,
        shader: u,
        texture: c,
        uniforms: h = {},
        rtOptions: d = {},
        debug: m = !1
    }) {
        this.options = arguments[0];
        this.renderer = arguments[1];
        this.camera = new THREE.Camera, this.scene = new THREE.Scene;
        this.index = 0, this.copyData = !0;
        this.texture = c || new THREE.DataTexture(n || new Float32Array(e * t * 4), e, t, THREE.RGBAFormat, THREE.FloatType);
        this.texture.needsUpdate = !0;
        this.rt = [this.createRT(), this.createRT()];
        this.material = new THREE.RawShaderMaterial({
            name: o || "FBO",
            defines: {
                RESOLUTION: `vec2(${e.toFixed(1)}, ${t.toFixed(1)})`
            },
            uniforms: function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? a(Object(n), !0).forEach(function (t) {
                        l(e, t, n[t])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : a(Object(n)).forEach(function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
                    })
                }
                return e
            }({}, h, {
                texture: {
                    value: this.texture
                }
            }),
            vertexShader: "\n        precision highp float;\n        attribute vec3 position;\n\n        void main() {\n          gl_Position = vec4(position, 1.0);\n        }\n      ",
            fragmentShader: u || "\n        precision highp float;\n        uniform sampler2D texture;\n\n        void main() {\n          vec2 uv = gl_FragCoord.xy / RESOLUTION.xy;\n          gl_FragColor = texture2D(texture, uv);\n        }\n      "
        })
        console.log(Triangle);
        this.mesh = new THREE.Mesh(new Triangle, this.material)
        this.mesh.frustumCulled = !1
        this.scene.add(this.mesh)
    }

    createRT() {
        return new THREE.WebGLRenderTarget(this.options.width, this.options.height, Object.assign({
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            stencilBuffer: !1,
            depthBuffer: !1,
            depthWrite: !1,
            depthTest: !1,
            type: u
        }, this.options.rtOptions))
    }
    get target() {
        return this.rt[this.index].texture
    }
    get targetRT() {
        return this.rt[this.index]
    }
    get uniforms() {
        return this.material.uniforms
    }
    resize(e, t) {
        this.material.defines.RESOLUTION = `vec2(${e.toFixed(1)}, ${t.toFixed(1)})`, this.options.width = e, this.options.height = t, this.rt.forEach(n => {
            n.setSize(e, t)
        })
    }
    update(e = !0) {
        const t = 0 === this.index ? 1 : 0,
            n = this.rt[this.index],
            i = this.rt[t];
        this.material.uniforms.texture.value = this.copyData ? this.texture : n.texture;
        const s = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(i);
        this.renderer.render(this.scene, this.camera);
        e && this.renderer.setRenderTarget(s);
        this.index = t;
        this.copyData = !1
    }
}
