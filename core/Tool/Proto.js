
import _ from 'lodash'
import { LayerList } from '../DataShell/Array'
import { AxisEnum } from '../Enum'
import { Color } from 'three'


export const CameraTool = new class {
    constructor() {
        this.all = ["PerspectiveCamera", "OrthographicCamera"];
    }
    is(r) {
        return this.all.includes(r)
    }
}


export const CameraDefault = new class {
    constructor() {
        this.DefaultUp = [0, 1, 0];
        this.DefaultTargetOffset = 1e3;
        this.defaultData = {
            far: 5e5,
            type: "OrthographicCamera",
            perspective: {
                near: 5,
                fov: 45,
                zoom: 1
            },
            orthographic: {
                near: -5e5,
                zoom: 1
            },
            up: this.DefaultUp,
            isUpVectorFlipped: !1,
            targetOffset: this.DefaultTargetOffset
        };

        this.getZoom = (s) => {
            return s.type === "PerspectiveCamera" ? s.perspective.zoom : s.orthographic.zoom
        }
    }
}

export const NormalMathTool = new class {
    constructor() { }

    isEqual(s, o) {
        return s[0] === o[0] && s[1] === o[1] && s[2] === o[2]
    }


    add(s, o) {
        return [s[0] + o[0], s[1] + o[1], s[2] + o[2]]
    }


    sub(s, o) {
        return [s[0] - o[0], s[1] - o[1], s[2] - o[2]]
    }

    lerp(s, o, a) {
        return [s[0] + (o[0] - s[0]) * a, s[1] + (o[1] - s[1]) * a, s[2] + (o[2] - s[2]) * a]
    }
}



export const MatrixTool = new class {
    constructor() {
        this.identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

    }

    isEqual(o, a) {
        for (let l = 0; l < 16; l++)
            if (o[l] !== a[l]) return !1;
        return !0
    }

    simplify(o) {
        return o != null ? o : this.identity
    }

    applyMatrix4(o, a) {
        let l = a.slice(0);
        for (var c = 0, u = a.length; c < u; c += 3) {
            let h = 1 / (o[3] * a[c] + o[7] * a[c + 1] + o[11] * a[c + 2] + o[15]);
            l[c] = (o[0] * a[c] + o[4] * a[c + 1] + o[8] * a[c + 2] + o[12]) * h, l[c + 1] = (o[1] * a[c] + o[5] * a[c + 1] + o[9] * a[c + 2] + o[13]) * h, l[c + 2] = (o[2] * a[c] + o[6] * a[c + 1] + o[10] * a[c + 2] + o[14]) * h
        }
        return l
    }

    applyMatrix3Components(o, a) {
        let l = a.slice(0);
        for (var c = 0, u = a.length; c < u; c += 3) l[c] = o[0] * a[c] + o[4] * a[c + 1] + o[8] * a[c + 2], l[c + 1] = o[1] * a[c] + o[5] * a[c + 1] + o[9] * a[c + 2], l[c + 2] = o[2] * a[c] + o[6] * a[c + 1] + o[10] * a[c + 2];
        return l
    }
}

export const ColorTool = new class {
    constructor() {

        this.white = {
            r: 1,
            g: 1,
            b: 1
        }
        this.red = {
            r: 1,
            g: 0,
            b: 0
        }
        this.black = {
            r: 0,
            g: 0,
            b: 0
        };
    }

    getHex(t) {
        return new Color(t.x, t.y, t.z).getHex()
    }


    toRgb255a1(c) {
        return {
            r: Math.round(c.r * 255),
            g: Math.round(c.g * 255),
            b: Math.round(c.b * 255),
            a: 1
        }
    }
    clone(c) {
        return {
            r: c.r,
            g: c.g,
            b: c.b
        }
    }

    fromHex(c) {
        return c = Math.floor(c), {
            r: (c >> 16 & 255) / 255,
            g: (c >> 8 & 255) / 255,
            b: (c & 255) / 255
        }
    }

    equals(c, u) {
        return c.r === u.r && c.g === u.g && c.b === u.b
    }

    lerp(c, u, h) {
        return {
            r: c.r + (u.r - c.r) * h,
            g: c.g + (u.g - c.g) * h,
            b: c.b + (u.b - c.b) * h
        }
    }
}

export const TranslateColorTool = new class {
    constructor() {
        this.white = {
            ...ColorTool.white,
            a: 1
        };

    }

    from0to1(o) {
        return {
            r: o[0],
            g: o[1],
            b: o[2],
            a: o[3]
        }
    }

    fromHexAndA(o, a) {
        return {
            ...ColorTool.fromHex(o),
            a
        }
    }

    toRgb255a1(o) {
        return {
            r: Math.round(o.r * 255),
            g: Math.round(o.g * 255),
            b: Math.round(o.b * 255),
            a: o.a
        }
    }

    equals(o, a) {
        return ColorTool.equals(o, a) && o.a === a.a
    }
}
export const InitVector3Tool = new class {
    constructor() {
        this.identity = {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }
    }
}


export const SpringDefault = new class {
    constructor() {
        this.defaultData = {
            mass: 1,
            stiffness: 80,
            damping: 10,
            velocity: 0
        }
    }
}


export const ControlsDefault = new class {
    constructor() {

        this.defaultData = {
            control1: [.5, .05],
            control2: [.1, .3]
        }
    }
}
export const ClonerDefault = new class {
    constructor() {
        this.defaultData = (t, r = .1) => {
            return {
                type: "radial",
                hideBase: !1,
                count: 3,
                radial: {
                    radius: Math.max(t[0], t[1]) * 2,
                    start: 0,
                    end: 360,
                    alignment: !1,
                    axis: AxisEnum.y,
                    scale: [0, 0, 0],
                    rotation: [0, 0, 0],
                    position: [0, 0, 0]
                },
                linear: {
                    scale: [0, 0, 0],
                    rotation: [0, 0, 0],
                    position: [t[0] + t[0] * r, 0, 0]
                },
                grid: {
                    count: [2, 2, 2],
                    size: t.map(n => n * (1 + r)),
                    useCenter: !0
                }
            }
        }
    }
}


export const LightDefault = new class {
    constructor() { }
    defaultData(r) {
        function e(r) {
            if (r === "PointLight") return {
                type: r,
                color: TranslateColorTool.white,
                intensity: 1,
                distance: 2e3,
                decay: 1,
                shadows: !0,
                shadowResolution: 1024,
                shadowRadius: 1,
                depth: 2500,
                helper: !0
            };
            if (r === "SpotLight") return {
                type: r,
                color: TranslateColorTool.white,
                intensity: 1,
                distance: 2e3,
                decay: 1,
                shadows: !0,
                penumbra: 0,
                angle: 30 / 180 * Math.PI,
                depth: 2500,
                helper: !0
            };
            if (r === "DirectionalLight") return {
                type: r,
                color: TranslateColorTool.white,
                intensity: 1,
                shadows: !0,
                size: 2500,
                depth: 2500,
                helper: !0
            };
            throw new Error("not implemented")
        }
        return e(r)
    }
}


export const ShadowDefault = new class {
    constructor() {
        this.defaultData = {
            castShadow: !0,
            receiveShadow: !0
        };
    }

    equals(r, n) {
        return r.castShadow === n.castShadow && r.receiveShadow === n.receiveShadow
    }
}



export const OtherDefault = new class {
    constructor() {
        this.defaultData = {
            flatShading: !1,
            wireframe: !1,
            side: 0
        };
    }
    equals(r, n) {
        return r.flatShading === n.flatShading && r.side === n.side && r.wireframe === n.wireframe
    }
}

export const MeshOtherDefault = new class {
    constructor() {
        this.defaultData = {
            ...OtherDefault.defaultData,
            ...ShadowDefault.defaultData,
            cloner: null
        }
    }
}

export const FontDefault = new class {
    constructor() {
        this.defaultData = {
            width: 100,
            height: 100,
            horizontalAlign: 1,
            verticalAlign: 1,
            fontSize: 16,
            lineHeight: 1.5,
            letterSpacing: 1,
            text: "",
            textTransform: 1,
            color: TranslateColorTool.fromHexAndA(6974058, 1),
            alpha: 1,
            font: "roboto_regular"
        }
    }
}

export const LayerDefault = new class {
    constructor() {

        function e(n) {
            switch (n) {
                case "basic":
                    return {
                        type: "light", category: "basic", alpha: 1, visible: !0, mode: 0
                    };
                case "phong":
                    return {
                        category: "phong", specular: {
                            r: .2,
                            g: .2,
                            b: .2
                        }, shininess: 10, type: "light", alpha: 1, visible: !0, mode: 0
                    };
                case "toon":
                    return {
                        category: "toon", specular: {
                            r: .2,
                            g: .2,
                            b: .2
                        }, shininess: 10, type: "light", alpha: 1, visible: !0, mode: 0
                    };
                case "lambert":
                    return {
                        category: "lambert", emissive: {
                            r: .2,
                            g: .2,
                            b: .2,
                            a: 1
                        }, type: "light", alpha: 1, visible: !0, mode: 0
                    };
                case "physical":
                    return {
                        category: "physical", roughness: .2, metalness: .2, reflectivity: .2, type: "light", alpha: 1, visible: !0, mode: 0
                    }
            }
        }

        function t(n) {
            switch (n) {
                case "texture":
                    return {
                        alpha: 1, visible: !0, size: [128, 128], mode: 0, axis: AxisEnum.x, type: "texture", projection: 0, texture: {
                            image: "image_0",
                            wrapping: 1001,
                            repeat: [1, 1],
                            offset: [0, 0]
                        }, crop: !0
                    };
                case "color":
                    return {
                        type: "color", alpha: 1, visible: !0, mode: 0, color: ColorTool.fromHex(4737101)
                    };
                case "depth":
                    return {
                        type: "depth", alpha: 1, visible: !0, mode: 0, gradientType: 1, smooth: !1, isVector: !0, isWorldSpace: !1, origin: [0, 0, 0], direction: [1, 0, 0], colors: [
                            [1, 1, 1, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1],
                            [0, 0, 0, 1]
                        ], steps: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1], num: 2, near: 50, far: 200
                    };
                case "normal":
                    return {
                        type: "normal", alpha: 1, visible: !0, mode: 0, cnormal: [1, 1, 1]
                    };
                case "gradient":
                    return {
                        type: "gradient", alpha: 1, visible: !0, mode: 0, gradientType: 0, smooth: !1, colors: [
                            [0, 0, 0, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1],
                            [1, 1, 1, 1]
                        ], steps: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1], num: 2, angle: 0, offset: [0, 0], morph: [0, 0]
                    };
                case "noise":
                    return {
                        type: "noise", alpha: 1, visible: !0, mode: 0, size: [100, 100, 100], noiseType: 0, scale: 1, move: 1,
                        colorA: {
                            ...ColorTool.fromHex(6710886),
                            a: 1
                        }, colorB: {
                            ...ColorTool.fromHex(6710886),
                            a: 1
                        }, colorC: {
                            ...ColorTool.fromHex(16777215),
                            a: 1
                        }, colorD: {
                            ...ColorTool.fromHex(16777215),
                            a: 1
                        }, distortion: [1, 1], fA: [1.7, 9.2], fB: [8.3, 2.8]
                    };
                case "fresnel":
                    return {
                        type: "fresnel", alpha: 1, visible: !0, mode: 0, color: Oi.fromHexAndA(16777215, 1), bias: .1, scale: 1, intensity: 2, factor: 1
                    };
                case "rainbow":
                    return {
                        type: "rainbow", alpha: 1, visible: !0, mode: 0, filmThickness: 30, movement: 0, wavelengths: [0, 0, 0], noiseStrength: 0, noiseScale: 1, offset: [0, 0, 0]
                    };
                case "matcap":
                    return {
                        type: "matcap", alpha: 1, visible: !0, mode: 0, texture: {
                            image: "matcap_0",
                            wrapping: 1001,
                            repeat: [1, 1],
                            offset: [0, 0]
                        }
                    };
                case "transmission":
                    return {
                        type: "transmission", alpha: 1, visible: !0, mode: 0, thickness: 10, ior: 1.5, roughness: 1
                    };
                case "displace":
                    return {
                        type: "displace", displacementType: "noise", noiseType: 0, scale: 10, movement: 1, offset: [0, 0, 0], intensity: 8, visible: !0
                    }
            }
        }

        this.defaultData = (n, s) => {
            return n === "light" && s ? e(s) : t(n)
        }

    }


}


export const LayerTool = new class {
    constructor() { }
    isMergable(l) {
        return !l.layers.some(u => {
            if (u.data.type === "texture" && u.data.projection !== 0 || u.data.type === "depth" && !u.data.isWorldSpace || u.data.type === "noise" || u.data.type === "displace") return !0
        }) && !this.isTransparent(l)
    }

    getHash(l) {
        let c = "";
        return l.layers.forEach(u => {
            Object.entries(u.data).forEach(([h, d]) => {
                c += `${h}${d}`, Array.isArray(d) ? d.forEach(f => c += `${f}`) : typeof d == "object" ? Object.values(d).forEach(f => {
                    typeof f == "number" ? c += `${f.toFixed(4)}` : c += `${f}`
                }) : c += `${d}`
            })
        }), c
    }

    isTransparent(l) {
        let c = 0;
        for (let u of l.layers) "alpha" in u.data && u.data.type !== "light" && u.data.type !== "fresnel" && (c += (1 - c) * u.data.alpha);
        return c < 1
    }

    defaultEmptyData() {
        return {
            layers: new LayerList
        }
    }

    defaultData(l = "layer1", c = "layer2") {
        return this.defaultTwoLayerData("phong", l, c)
    }

    defaultTwoLayerData(l, c = "layer1", u = "layer2") {
        let h = new LayerList;
        return h.push({
            fi: 0,
            data: LayerDefault.defaultData("light", l),
            id: c
        }), h.push({
            fi: 1,
            data: LayerDefault.defaultData("color"),
            id: u
        }), {
            layers: h
        }
    }

    defaultTwoLayerTextureData(l, c = "basic", u = "layer1", h = "layer2") {
        let d = LayerDefault.defaultData("texture");
        Object.assign(d.texture, {
            image: l
        });
        let f = new LayerList;
        return f.push({
            fi: 0,
            data: d,
            id: u
        }), f.push({
            fi: 1,
            data: LayerDefault.defaultData("light", c),
            id: h
        }), {
            layers: f
        }
    }
}


export const ShapeTool = new class {
    constructor() { }

    defaultData() {
        return {
            points: new LayerList,
            roundness: 0,
            shapeHoles: [],
            isClosed: !1
        }
    }

    isOverlappingExistingPoint(n, s) {
        let {
            points: o
        } = s;
        if (o) {
            for (let a of o)
                if (a.data.position[0] === n[0] && a.data.position[1] === n[1]) return !0
        }
        return !1
    }
    isStraightLine(n, s) {
        let o = n.controlNext,
            a = s.controlPrevious;
        return n.position[0] === o.position[0] && n.position[1] === o.position[1] && s.position[0] === a.position[0] && s.position[1] === a.position[1]
    }
}

export const ParametricMeshTool = new class {
    constructor() { }
    is2DParametricMesh(t) {
        return t === "PolygonGeometry" || t === "RectangleGeometry" || t === "StarGeometry" || t === "TriangleGeometry" || t === "EllipseGeometry"
    }
}

export const Vector3Tool = new class {
    constructor() {
        this.identity = {
            ...InitVector3Tool.identity,
            hiddenMatrix: MatrixTool.identity
        };
    }

    fromObject(s) {
        return {
            position: s.position,
            rotation: s.rotation,
            scale: s.scale,
            hiddenMatrix: s.hiddenMatrix
        }
    }
    merge(s, o) {
        return {
            position: (o == null ? void 0 : o.position) || s.position,
            rotation: (o == null ? void 0 : o.rotation) || s.rotation,
            scale: (o == null ? void 0 : o.scale) || s.scale,
            hiddenMatrix: (o == null ? void 0 : o.hiddenMatrix) || s.hiddenMatrix
        }
    }

    diff(s, o) {
        return {
            position: NormalMathTool.isEqual(s.position, o.position) ? null : o.position,
            rotation: NormalMathTool.isEqual(s.rotation, o.rotation) ? null : o.rotation,
            scale: NormalMathTool.isEqual(s.scale, o.scale) ? null : o.scale,
            hiddenMatrix: MatrixTool.isEqual(s.hiddenMatrix, o.hiddenMatrix) ? null : o.hiddenMatrix
        }
    }
}
