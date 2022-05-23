import { Vector2 } from 'three'

function XG(i, e, t, r, n) {
    return (i - e) / (t - e) * (n - r) + r
}


export default class FrameView {
    constructor(e, t, r, n, s) {
        this._aspect = 1;
        this._renderer = e, this._camera = t, this._frameSize = new Vector2().copy(r), this._editorSize = new Vector2().copy(n), this._aspect = t.aspect, this._fov = s != null ? s : t.fov
    }
    set frameSize(e) {
        this._frameSize.copy(e)
    }
    updateRenderer() {
        !this._renderer || this._renderer.setSize(this._frameSize.x, this._frameSize.y)
    }
    updateViewportForImageExport() {
        if (!this._renderer || !this._camera || this._camera.cameraType !== "PerspectiveCamera") return;
        let e = this._frameSize.x,
            t = this._frameSize.y,
            r = this._editorSize.x,
            n = this._editorSize.y;
        this._aspect = e / t, this._camera.zoom *= Math.min(r / e, n / t), this._renderer.setViewport(0, 0, e, t)
    }
    updateViewport() {
        if (!this._renderer || !this._camera || this._camera.cameraType !== "PerspectiveCamera") return;
        let e = this._frameSize.x,
            t = this._frameSize.y,
            r = this._editorSize.x,
            n = this._editorSize.y,
            s = 0,
            o = 0,
            a = e,
            l = t;
        e < r && (s = (r - e) * .5, s = -s, a = r), t < n && (o = (n - t) * .5, o = -o, l = n);
        this._aspect = a / l;
        this._renderer.setViewport(s, o, a, l)
    }
    updateCamera() {
        if (!!this._camera)
            if (this._camera.cameraType === "PerspectiveCamera") {
                let e = this._frameSize.y,
                    t = this._editorSize.y,
                    r = this._fov;
                if (e > t) {
                    let n = XG(e, 1080, 2160, 1, 15) / 100;
                    r *= e / t, r *= 1 - n
                }
                this._camera.aspect = this._aspect, this._camera.fov = r, this._camera.updateProjectionMatrix()
            } else this._camera.setViewplaneSize(this._frameSize.x, this._frameSize.y)
    }
    revert() {
        let e = window.innerWidth,
            t = window.innerHeight;
        this._renderer && (this._renderer.setViewport(0, 0, e, t), this._renderer.setSize(e, t)), this._camera && (this._camera.aspect = e / t, this._camera.fov = this._fov, this._camera.setViewplaneSize(e, t), this._camera.updateProjectionMatrix())
    }
};
