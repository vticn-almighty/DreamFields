
export default class DBuffer {
    constructor(e = 256, t = !1) {
        this.capacity = e, this.size = 0, this.debug = t, this.debug && console.log(`allocating with cap ${e}`);
        let r = e * DBuffer.eSize;
        this.buffer = new ArrayBuffer(r);
        let n = Float32Array.BYTES_PER_ELEMENT,
            s = 0;
        this.positions = new Float32Array(this.buffer, s * n, 3 * e), s += 3 * e, this.normals = new Float32Array(this.buffer, s * n, 3 * e), s += 3 * e, this.uvs = new Float32Array(this.buffer, s * n, 2 * e)
    }
    realloc(e, t = !1) {
        if (e < this.size) throw Error("cannot shrink buffer");
        if (e <= this.capacity && !t) return;
        this.debug && console.log(`resizing from ${this.capacity} \u2192 ${e}`);
        let r = e * DBuffer.eSize,
            n = new ArrayBuffer(r),
            s = Float32Array.BYTES_PER_ELEMENT,
            o = 0,
            a = new Float32Array(n, o * s, 3 * e);
        o += 3 * e;
        let l = new Float32Array(n, o * s, 3 * e);
        o += 3 * e;
        let c = new Float32Array(n, o * s, 2 * e);
        a.set(this.positions.slice(0, this.size * 3)), l.set(this.normals.slice(0, this.size * 3)), c.set(this.uvs.slice(0, this.size * 2)), this.buffer = n, this.positions = a, this.normals = l, this.uvs = c, this.capacity = e
    }
    get(e = 1) {
        let t = this.size + e;
        if (t > this.capacity) {
            let n = this.capacity;
            for (; t > n;) n *= 2;
            this.realloc(n)
        }
        let r = this.size;
        return this.size = t, r
    }
    reserve(e) {
        let t = this.size + e;
        t > this.capacity && this.realloc(t)
    }
    shrink() {
        this.debug && console.log(`shrinking ${this.capacity} \u2192 ${this.size}`), this.realloc(this.size, !0)
    }
};

DBuffer.eSize = (3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT;

