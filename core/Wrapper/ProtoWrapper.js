import _ from 'lodash'
import { Matrix4 } from 'three'
let wl = i => "isEntity" in i

function Al(i) {
    let e = [];
    for (let t in i) {
        let r = i[t];
        delete r.metadata, e.push(r)
    }
    return e
}
function j1(i) {
    let e = [];
    for (let t in i) e.push(i[t]);
    return e
}



function ProtoWrapper(i) {
    return class extends i {
        hasEntityChild() {
            return this.children.some(t => wl(t))
        }
        isDescendantOf(t) {
            t instanceof Object3D && (t = t.uuid);
            let r = this;
            for (; r.parent;) {
                if (r.parent.uuid === t) return !0;
                r = r.parent
            }
            return !1
        }
        attach(t, r) {
            this.updateWorldMatrix(!0, !1);
            let n = new Matrix4().copy(this.matrixWorld).invert();
            return t.parent !== null && (t.parent.updateWorldMatrix(!0, !1), n.multiply(t.parent.matrixWorld)), wl(t) ? t.hiddenMatrix.premultiply(n) : t.applyMatrix4(n), t.updateWorldMatrix(!1, !1), this.add(t), r !== void 0 && (this.children.pop(), this.children.splice(r, 0, t)), this
        }
        copy(t, r = !0) {
            if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.userData = JSON.parse(JSON.stringify(t.userData)), r === !0)
                for (let n = 0; n < t.children.length; n++) {
                    let s = t.children[n];
                    this.add(s.clone())
                }
            return this
        }
        toJSON(t) {
            let r = t === void 0,
                n = {
                    object: {
                        uuid: "",
                        ObjectType: ""
                    }
                };
            t === void 0 && (t = {
                geometries: {},
                materials: {},
                textures: {},
                images: {},
                interactionStates: {},
                nodes: {}
            }, n.metadata = {
                version: 1.5,
                type: "Object",
                generator: "Object3D.toJSON"
            });
            let s = {
                uuid: this.uuid,
                ObjectType: this.type
            };
            if (this.name !== "" && (s.name = this.name), s.matrix = this.matrix.toArray(), this.castShadow === !0 && (s.castShadow = !0), this.receiveShadow === !0 && (s.receiveShadow = !0), this.visible === !1 && (s.visible = !1), this.frustumCulled === !1 && (s.frustumCulled = !1), this.renderOrder !== 0 && (s.renderOrder = this.renderOrder), s.layers = this.layers.mask, JSON.stringify(this.userData) !== "{}" && (s.userData = this.userData), this.children.length > 0) {
                s.children = [];
                for (let o of this.children) (wl(o) || o instanceof Light) && s.children.push(o.toJSON(t).object)
            }
            if (r) {
                let o = Al(t.geometries),
                    a = Al(t.materials),
                    l = Al(t.textures),
                    c = Al(t.images),
                    u = Al(t.interactionStates),
                    h = j1(t.nodes);
                o.length > 0 && (n.geometries = o), a.length > 0 && (n.materials = a), l.length > 0 && (n.textures = l), c.length > 0 && (n.images = c), u.length > 0 && (n.interactionStates = u), h.length > 0 && (n.nodes = h)
            }
            return n.object = s, n
        }
        fromJSON(t) {
            return this.uuid = t.uuid, t.name !== void 0 && (this.name = t.name), t.matrix !== void 0 ? (this.matrix.fromArray(t.matrix), t.matrixAutoUpdate !== void 0 && (this.matrixAutoUpdate = t.matrixAutoUpdate), this.matrixAutoUpdate && this.matrix.decompose(this.position, this.quaternion, this.scale)) : (t.position !== void 0 && this.position.fromArray(t.position), t.rotation !== void 0 && this.rotation.fromArray(t.rotation), t.quaternion !== void 0 && this.quaternion.fromArray(t.quaternion), t.scale !== void 0 && this.scale.fromArray(t.scale)), this.castShadow = t.castShadow !== void 0, this.receiveShadow = t.receiveShadow !== void 0, t.visible !== void 0 && (this.visible = t.visible), t.frustumCulled !== void 0 && (this.frustumCulled = t.frustumCulled), t.renderOrder !== void 0 && (this.renderOrder = t.renderOrder), t.layers !== void 0 && (this.layers.mask = t.layers), t.userData !== void 0 && (this.userData = t.userData), this
        }
    };

}

export { ProtoWrapper }