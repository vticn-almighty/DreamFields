
import { Plane, Vector3 } from 'three'
import { EventTypeEnum } from '../Enum'
import { EmptyObject } from '../ObjectType/VirtualObject';
import RaycasterWrap from '../RaycasterWrap'
const Tn = i => "isEntity" in i;

export default class Event {
    constructor(e, t, r, n) {
        this.isEnable = !1;
        this.splineEvents = {};
        this._enableEvent = {};
        this._map = {};
        this._prevAncestors = [];
        this._raycaster = new RaycasterWrap;
        this._intersection = new Vector3;
        this._plane = new Plane;
        this._normal = new Vector3;
        this._position = new Vector3;
        this._onMouseDown = e => {
            this._raycaster.setFromCamera(this._getPointer(e.clientX, e.clientY), this._camera), this._handleMouseDownEvent()
        };
        this._onMouseUp = e => {
            this._raycaster.setFromCamera(this._getPointer(e.clientX, e.clientY), this._camera), this._handleMouseUpEvent()
        };
        this._onMouseMove = e => {
            this._raycaster.setFromCamera(this._getPointer(e.clientX, e.clientY), this._camera), this._camera.getWorldDirection(this._normal), this._normal.negate(), this._handleMouseHoverEvent(), this._handleLookAtEvent(), this._handleFollowEvent()
        };
        this._onWheel = e => {
            this._handleWheelEvent(e)
        };
        this._onTouchStart = e => {
            e.touches.length === 1 && (this._raycaster.setFromCamera(this._getPointer(e.touches[0].clientX, e.touches[0].clientY), this._camera), this._camera.getWorldDirection(this._normal), this._normal.negate(), this._handleMouseDownEvent(), this._handleMouseHoverEvent(), this._handleLookAtEvent(), this._handleFollowEvent())
        };
        this._onTouchEnd = () => {
            this._handleMouseUpEvent(), this._handleMouseHoverEvent(!0)
        };
        this._onTouchMove = e => {
            e.touches.length === 1 && (this._raycaster.setFromCamera(this._getPointer(e.touches[0].clientX, e.touches[0].clientY), this._camera), this._camera.getWorldDirection(this._normal), this._normal.negate(), this._handleMouseHoverEvent(), this._handleLookAtEvent(), this._handleFollowEvent())
        };
        this._onKeyDown = e => {
            this._handleKeyDownEvent(e.key)
        };
        this._onKeyUp = e => {
            this._handleKeyUpEvent(e.key)
        };
        this._domElement = e, this._scene = t, this._camera = r, this._app = n
    }
    activate() {
        this.isEnable = !0, this._scene.traverseEntity(e => {
            if (e.interaction !== void 0) {
                e.interaction.start();
                for (let t of e.interaction.events) {
                    let r = t.type;
                    this._addCustomEvent(r, e), this._enableEvent[r] = !0, (r === EventTypeEnum.KEY_DOWN || r === EventTypeEnum.KEY_UP || r === EventTypeEnum.START || r === EventTypeEnum.LOOK_AT || r === EventTypeEnum.FOLLOW || r === EventTypeEnum.SCROLL) && (this._map[r] === void 0 && (this._map[r] = []), this._map[r].push(e))
                }
            }
        }), this._enableEvent[EventTypeEnum.START] !== void 0 && this._handleStartEvent(), this._enableEvent[EventTypeEnum.MOUSE_DOWN] !== void 0 && (this._domElement.addEventListener("pointerdown", this._onMouseDown, !1), this._domElement.addEventListener("touchstart", this._onTouchStart, !1)), this._enableEvent[EventTypeEnum.MOUSE_UP] !== void 0 && (this._domElement.addEventListener("pointerup", this._onMouseUp, !1), this._domElement.addEventListener("touchend", this._onTouchEnd, !1)), (this._enableEvent[EventTypeEnum.MOUSE_HOVER] !== void 0 || this._enableEvent[EventTypeEnum.LOOK_AT] !== void 0 || this._enableEvent[EventTypeEnum.FOLLOW] !== void 0) && (this._domElement.addEventListener("pointermove", this._onMouseMove, !1), this._domElement.addEventListener("touchstart", this._onTouchStart, !1), this._domElement.addEventListener("touchend", this._onTouchEnd, !1), this._domElement.addEventListener("touchmove", this._onTouchMove, !1)), this._enableEvent[EventTypeEnum.KEY_DOWN] !== void 0 && document.addEventListener("keydown", this._onKeyDown, !1), this._enableEvent[EventTypeEnum.KEY_UP] !== void 0 && document.addEventListener("keyup", this._onKeyUp, !1), this._enableEvent[EventTypeEnum.SCROLL] !== void 0 && this._domElement.addEventListener("wheel", this._onWheel, !1)
    }
    deactivate() {
        this._scene.traverseEntity(e => {
            e.interaction !== void 0 && (e.interaction.end(), e.interaction.cache = void 0)
        }), this._domElement.removeEventListener("pointerdown", this._onMouseDown), this._domElement.removeEventListener("pointerup", this._onMouseUp), this._domElement.removeEventListener("pointermove", this._onMouseMove), this._domElement.removeEventListener("touchstart", this._onTouchStart), this._domElement.removeEventListener("touchend", this._onTouchEnd), this._domElement.removeEventListener("touchmove", this._onTouchMove), this._domElement.removeEventListener("wheel", this._onWheel), document.removeEventListener("keydown", this._onKeyDown), document.removeEventListener("keyup", this._onKeyUp), this._enableEvent = {}, this._map = {}, this.isEnable = !1
    }
    reset() {
        this._scene.traverseEntity(e => {
            var t;
            (t = e.interaction) == null || t.start()
        }), this._handleStartEvent()
    }
    _getPointer(e, t) {
        let r = this._domElement.getBoundingClientRect();
        return {
            x: (e - r.left) / r.width * 2 - 1,
            y: -((t - r.top) / r.height) * 2 + 1
        }
    }
    _handleStartEvent() {
        var e;
        (e = this._map[EventTypeEnum.START]) == null || e.forEach(t => {
            var r;
            (r = t.interactionCache.start) == null || r.dispatch()
        })
    }
    _handleWheelEvent(e) {
        var t;
        (t = this._map[EventTypeEnum.SCROLL]) == null || t.forEach(r => {
            var n;
            this._dispatchDOMCustomEvent("scroll", r.uuid), (n = r.interactionCache.scroll) == null || n.dispatch(e.deltaY > 0 ? 1 : -1)
        })
    }
    _handleMouseDownEvent() {
        var t;
        let e = this._raycastMesh(this._raycaster);
        for (let r = 0, n = e.length; r < n; ++r) {
            let s = e[r].object;
            if (this._dispatchDOMCustomEvent("mouseDown", s.uuid), (t = s.interactionCache.mouseDown) == null || t.dispatch(), s.traverseAncestors(o => {
                var a;
                o instanceof EmptyObject && (this._dispatchDOMCustomEvent("mouseDown", o.uuid), (a = o.interactionCache.mouseDown) == null || a.dispatch())
            }), !s.interactionCache.follow) break
        }
    }
    _handleMouseUpEvent() {
        var t;
        let e = this._raycastMesh(this._raycaster);
        for (let r = 0, n = e.length; r < n; ++r) {
            let s = e[r].object;
            if (this._dispatchDOMCustomEvent("mouseUp", s.uuid), (t = s.interactionCache.mouseUp) == null || t.dispatch(), s.traverseAncestors(o => {
                var a;
                o instanceof EmptyObject && (this._dispatchDOMCustomEvent("mouseUp", o.uuid), (a = o.interactionCache.mouseUp) == null || a.dispatch())
            }), !s.interactionCache.follow) break
        }
    }
    _handleMouseHoverEvent(e = !1) {
        var t, r;
        if (this._enableEvent[EventTypeEnum.MOUSE_HOVER] !== void 0) {
            let n;
            if (!e) {
                let o = this._raycastMesh(this._raycaster).find(a => !a.object.interactionCache.follow);
                n = o ? o.object : void 0
            }
            if (this._prevObject !== n) {
                this._prevObject !== void 0 && ((t = this._prevObject.interactionCache.mouseHover) == null || t.dispatchReverse()), n !== void 0 && (this._dispatchDOMCustomEvent("mouseHover", n.uuid), (r = n.interactionCache.mouseHover) == null || r.dispatch());
                let s = [];
                n == null || n.traverseAncestors(l => {
                    l instanceof EmptyObject && l.interactionCache.mouseHover && s.push(l)
                }), this._prevAncestors.filter(l => {
                    var c;
                    return s.includes(l) ? !1 : ((c = l.interactionCache.mouseHover) == null || c.dispatchReverse(), !0)
                });
                let o = s.filter(l => {
                    var c;
                    return this._prevAncestors.includes(l) ? !1 : ((c = l.interactionCache.mouseHover) == null || c.dispatch(), !0)
                }),
                    a = this._prevAncestors.filter(l => s.includes(l));
                this._prevAncestors = [...a, ...o]
            }
            this._prevObject = n
        }
    }
    _handleLookAtEvent() {
        var e;
        (e = this._map[EventTypeEnum.LOOK_AT]) == null || e.forEach(t => {
            var n, s;
            let r = (n = t.interactionCache.lookAt) == null ? void 0 : n.distance;
            this._dispatchDOMCustomEvent("lookAt", t.uuid), r !== void 0 && (this._plane.set(this._normal, -r), this._raycaster.ray.intersectPlane(this._plane, this._intersection), (s = t.interaction) == null || s.lookAt(this._intersection))
        }), this._app.requestRender()
    }
    _handleFollowEvent() {
        var e;
        (e = this._map[EventTypeEnum.FOLLOW]) == null || e.forEach(t => {
            var r;
            this._dispatchDOMCustomEvent("follow", t.uuid), this._plane.setFromNormalAndCoplanarPoint(this._normal, t.getWorldPosition(this._position)), this._raycaster.ray.intersectPlane(this._plane, this._intersection), (r = t.interaction) == null || r.follow(this._intersection)
        }), this._app.requestRender()
    }
    _handleKeyDownEvent(e) {
        var t;
        (t = this._map[EventTypeEnum.KEY_DOWN]) == null || t.forEach(r => {
            var s;
            let n = (s = r.interactionCache.keyDown) == null ? void 0 : s.find(o => o.key === e);
            this._dispatchDOMCustomEvent("keyDown", r.uuid), n == null || n.dispatch()
        })
    }
    _handleKeyUpEvent(e) {
        var t;
        (t = this._map[EventTypeEnum.KEY_UP]) == null || t.forEach(r => {
            var s;
            let n = (s = r.interactionCache.keyUp) == null ? void 0 : s.find(o => o.key === e);
            this._dispatchDOMCustomEvent("keyUp", r.uuid), n == null || n.dispatch()
        })
    }
    _raycastMesh(e) {
        let t = [],
            r = n => {
                for (let s of n.children) Tn(s) && !s.raycastLock && s.visible && (W1(s) && e.intersectObject(s, !1, t), r(s))
            };
        return r(this._scene), t
    }
    _addCustomEvent(e, t) {
        let r = (() => {
            switch (e) {
                case 0:
                    return "mouseDown";
                case 1:
                    return "mouseUp";
                case 2:
                    return "mouseHover";
                case 5:
                    return "keyDown";
                case 6:
                    return "keyUp";
                case 7:
                    return "start";
                case 9:
                    return "lookAt";
                case 10:
                    return "follow";
                case 11:
                    return "scroll"
            }
        })();
        if (r) {
            let n = new CustomEvent(r, {
                bubbles: !0
            });
            Object.defineProperty(n, "target", {
                writable: !1,
                value: {
                    id: t.uuid,
                    name: t.name
                }
            }), this.splineEvents[r] ? this.splineEvents[r][t.uuid] = n : this.splineEvents[r] = {
                [t.uuid]: n
            }
        }
    }
    _dispatchDOMCustomEvent(e, t) {
        var n;
        let r = (n = this.splineEvents[e]) == null ? void 0 : n[t];
        r && this._domElement.dispatchEvent(r)
    }
};