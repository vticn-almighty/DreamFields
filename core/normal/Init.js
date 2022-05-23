import SharedAssets from './SharedAssets'
import SceneWrap from '../SceneWrap'
export default class Init {
    constructor(e) {
        this.sharedAssets = new SharedAssets(e.shared);
        this.scene = new SceneWrap(e.scene, this.sharedAssets);
        this.scene.switchActiveCamera(this.scene.activeCamera)
    }
    reset(e, t) {
        this.scene.clearScene(this.sharedAssets), this.sharedAssets.reset(e.shared), this.scene.resetAfterClear(e.scene, this.sharedAssets)
    }
    dispose() {
        this.scene.dispose()
    }
};