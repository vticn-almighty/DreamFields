import {
    StandardNodeMaterial,
    BasicNodeMaterial,
    LambertNodeMaterial,
    ToonNodeMaterial,
    PhongNodeMaterial
} from './LightingMaterial'
import LayerStack from './normal/LayerStack';

export class Physical extends StandardNodeMaterial {
    constructor(e, t, r) {
        super(t, e);
        this.userData.type = "PhysicalMaterial";
        this.userData.category = "Physical";
        this.userData.layers = r != null ? r : this._getLayerStack(e == null ? void 0 : e.map)
    }
    get layersList() {
        return this.userData.layers
    }
    set layersList(e) {
        this.userData.layers = e
    }
    equals(e) {
        return this.userData.type === e.userData.type && this.userData.layers.uuid == e.userData.layers.uuid
    }
    copy(e) {
        if (e.userData.layers !== void 0 && e.userData.layers instanceof LayerStack) {
            let t = e.userData.layers,
                r = e.fragment;
            super.copy(e);
            let n = r.clone();
            this.fragment = n, this.vertex = n;
            let s = t.clone(this);
            this.userData.layers = s, n.shadingAlpha.value = r.shadingAlpha.value, n.shadingBlend.value = r.shadingBlend.value
        } else super.copy(e);
        return this
    }
    static fromJSON(e, t, r) {
        let n = r.getNode(t.vertex),
            s = new Physical(void 0, n);
        return s.fromJSON(t, r), s
    }
    dispose() {
        super.dispose()
    }
};


export class Basic extends BasicNodeMaterial {
    constructor(e, t, r) {
        super(t, e);
        this.userData.type = "BasicMaterial",
            this.userData.category = "Basic",
            this.userData.layers = r != null ? r : this._getLayerStack(e == null ? void 0 : e.map)
    }
    get layersList() {
        return this.userData.layers
    }
    set layersList(e) {
        this.userData.layers = e
    }
    equals(e) {
        return this.userData.type === e.userData.type && this.userData.layers.uuid == e.userData.layers.uuid
    }
    copy(e) {
        if (e.userData.layers !== void 0 && e.userData.layers instanceof LayerStack) {
            let t = e.userData.layers,
                r = e.fragment;
            super.copy(e);
            let n = r.clone();
            this.fragment = n, this.vertex = n;
            let s = t.clone(this);
            this.userData.layers = s
        } else super.copy(e);
        return this
    }
    static fromJSON(e, t, r) {
        let n = r.getNode(t.vertex),
            s = new Basic(void 0, n);
        return s.fromJSON(t, r), s
    }
    static fromMaterial(e) {
        let t = new Basic(e.map ? {
            map: e.map
        } : {}),
            r = t.fragment;
        return r.color.value.copy(e.color), r.alpha.value = e.opacity, t
    }
    dispose() {
        super.dispose()
    }
};


export class Lambert extends LambertNodeMaterial {
    constructor(e, t, r) {
        super(t, e);
        this.userData.type = "LambertMaterial", 
        this.userData.category = "Lambert", this.userData.layers = r != null ? r : this._getLayerStack(e == null ? void 0 : e.map)
    }
    get layersList() {
        return this.userData.layers
    }
    set layersList(e) {
        this.userData.layers = e
    }
    equals(e) {
        return this.userData.type === e.userData.type && this.userData.layers.uuid == e.userData.layers.uuid
    }
    copy(e) {
        if (e.userData.layers !== void 0 && e.userData.layers instanceof LayerStack) {
            let t = e.userData.layers,
                r = e.fragment;
            super.copy(e);
            let n = r.clone();
            this.fragment = n, this.vertex = n;
            let s = t.clone(this);
            this.userData.layers = s, n.shadingAlpha.value = r.shadingAlpha.value, n.shadingBlend.value = r.shadingBlend.value
        } else super.copy(e);
        return this
    }
    static fromJSON(e, t, r) {
        let n = r.getNode(t.vertex),
            s = new Lambert(void 0, n);
        return s.fromJSON(t, r), s
    }
    dispose() {
        super.dispose()
    }
};

export class Toon extends ToonNodeMaterial {
    constructor(e, t, r) {
        super(t, e);
        this.userData.type = "ToonMaterial", this.userData.category = "Toon", this.userData.layers = r != null ? r : this._getLayerStack(e == null ? void 0 : e.map)
    }
    get layersList() {
        return this.userData.layers
    }
    set layersList(e) {
        this.userData.layers = e
    }
    equals(e) {
        return this.userData.type === e.userData.type && this.userData.layers.uuid == e.userData.layers.uuid
    }
    copy(e) {
        if (e.userData.layers !== void 0 && e.userData.layers instanceof LayerStack) {
            let t = e.userData.layers,
                r = e.fragment;
            super.copy(e);
            let n = r.clone();
            this.fragment = n, this.vertex = n;
            let s = t.clone(this);
            this.userData.layers = s, n.shadingAlpha.value = r.shadingAlpha.value, n.shadingBlend.value = r.shadingBlend.value
        } else super.copy(e);
        return this
    }
    static fromJSON(e, t, r) {
        let n = r.getNode(t.vertex),
            s = new Toon(void 0, n);
        return s.fromJSON(t, r), s
    }
    dispose() {
        super.dispose()
    }
};


export class Phong extends PhongNodeMaterial {
    constructor(e, t, r) {
        super(t, e);
        this.userData.type = "PhongMaterial", this.userData.category = "Phong", this.userData.layers = r != null ? r : this._getLayerStack(e == null ? void 0 : e.map)
    }
    get layersList() {
        return this.userData.layers
    }
    set layersList(e) {
        this.userData.layers = e
    }
    equals(e) {
        return this.userData.type === e.userData.type && this.userData.layers.uuid == e.userData.layers.uuid
    }
    copy(e) {
        if (e.userData.layers !== void 0 && e.userData.layers instanceof LayerStack) {
            let t = e.userData.layers,
                r = e.fragment;
            super.copy(e);
            let n = r.clone();
            this.fragment = n, this.vertex = n;
            let s = t.clone(this);
            this.userData.layers = s, n.shadingAlpha.value = r.shadingAlpha.value, n.shadingBlend.value = r.shadingBlend.value
        } else super.copy(e);
        return this
    }
    static fromJSON(e, t, r) {
        let n = r.getNode(t.vertex),
            s = new Phong(void 0, n);
        return s.fromJSON(t, r), s
    }
    static fromMaterial(e) {
        let t = new Phong(e.map ? {
            map: e.map
        } : {}),
            r = t.fragment;
        return r.color.value.copy(e.color), r.alpha.value = e.opacity, t
    }
    dispose() {
        super.dispose()
    }
};