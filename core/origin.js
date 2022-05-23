
import { Vector3Tool, MeshOtherDefault, FontDefault, CameraDefault } from './Tool'
import { LayerList } from './DataShell/Array'

export const protoDefault = {
    defaultData: {
        states: new LayerList,
        events: new LayerList,
        visible: !0,
        raycastLock: !1,
        ...Vector3Tool.identity
    }
}

export const EmptyDefault = {
    defaultData: {
        type: "Empty",
        ...protoDefault.defaultData
    }
}

export const MeshDefault = {
    defaultData: {
        type: "Mesh",
        ...protoDefault.defaultData,
        ...MeshOtherDefault.defaultData
    }
}

export const TextFrameDefault = {
    defaultData: {
        type: "TextFrame",
        ...protoDefault.defaultData,
        ...FontDefault.defaultData
    }
}

export const CameraInstanceDefault = {
    defaultData: {
        ...protoDefault.defaultData,
        ...Vector3Tool.identity,
        ...CameraDefault.defaultData
    }
}


