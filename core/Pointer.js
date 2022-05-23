import * as THREE from 'three'
import EventEmitter from '../Utils/EventEmitter'
import _ from 'lodash'
import * as MT from 'math-toolbox'

export default class Pointer extends EventEmitter {
    constructor(camera) {
        super()

        this.camera = camera;
        this.x = 0;
        this.y = 0;
        this.isTouching = true;

        this.distance = 0;
        this.hold = new THREE.Vector2;
        this.last = new THREE.Vector2;
        this.delta = new THREE.Vector2;
        this.move = new THREE.Vector2;
        this.world = new THREE.Vector3;
        this.normalized = new THREE.Vector2;
        this._tmp = new THREE.Vector3;
        this.bind()
    }

    bind() {
        const e = window;

        e.addEventListener("touchstart", this.onStart.bind(this), {
            passive: !1
        });
        e.addEventListener("touchmove", this.onMove.bind(this), {
            passive: !1
        });
        e.addEventListener("touchend", this.onEnd.bind(this), {
            passive: !1
        });
        e.addEventListener("touchcancel", this.onEnd.bind(this), {
            passive: !1
        });
        e.addEventListener("mousedown", this.onStart.bind(this));
        e.addEventListener("mousemove", this.onMove.bind(this));
        e.addEventListener("mouseup", this.onEnd.bind(this));
        e.addEventListener("contextmenu", this.onEnd.bind(this))
        this.executeDelta = _.debounce(function () {
            this.onEnd();
        }, 500)

    }

    convertEvent(e) {
        const t = {
            x: 0,
            y: 0
        };

        return e ? e.windowsPointer ? e : (e.touches || e.changedTouches ? e.touches.length ?
            (t.x = e.touches[0].clientX, t.y = e.touches[0].clientY) :
            (t.x = e.changedTouches[0].clientX, t.y = e.changedTouches[0].clientY) :
            (t.x = e.clientX, t.y = e.clientY), t.x = MT.clamp(0, innerWidth, t.x),
            t.y = MT.clamp(0, innerHeight, t.y), t) : t
    }
    onStart(e) {
        const t = this.convertEvent(e);
        this.isTouching = true, this.x = t.x,
            this.y = t.y, this.hold.set(t.x, t.y),
            this.last.set(t.x, t.y), this.delta.set(0, 0),
            this.move.set(0, 0), this.normalized.x = this.x / innerWidth * 2 - 1,
            this.normalized.y = -this.y / innerHeight * 2 + 1,
            this.distance = 0
    }
    onMove(e) {
        const t = this.convertEvent(e);
        this.isTouching && (this.move.x = t.x - this.hold.x, this.move.y = t.y - this.hold.y);
        this.x = t.x;
        this.y = t.y;
        this.delta.x = t.x - this.last.x;
        this.delta.y = t.y - this.last.y;
        this.last.set(this.x, this.y);
        this.distance += this.delta.length();
        this.normalized.x = this.x / innerWidth * 2 - 1;
        this.normalized.y = -this.y / innerHeight * 2 + 1;
        this._tmp.x = this.normalized.x, this._tmp.y = this.normalized.y;
        this._tmp.z = .5, this._tmp.unproject(this.camera);
        const n = this._tmp.sub(this.camera.position).normalize(),
            s = -this.camera.position.z / n.z;
        this.world.copy(this.camera.position).add(n.multiplyScalar(s));
        this.trigger('pointerMove')
        this.executeDelta()

    }
    onEnd() {
        this.isTouching = false;
        this.move.set(0, 0);
        this.delta.set(0, 0);

    }
};