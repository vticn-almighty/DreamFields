export enum AxisEnum { x = 'x', y = 'y', z = 'z' }

export enum TransitionEnum {
    "LINEAR" = 0,
    "EASE" = 1,
    "EASE_IN" = 2,
    "EASE_OUT" = 3,
    "EASE_IN_OUT" = 4,
    "CUBIC" = 5,
    "SPRING" = 6
}

export enum OpAEnum {
    "Update" = 0
}

export enum OpBEnum {

    "Add" = 1,
    "Delete" = 2,
    "Unlink" = 3
}

export enum OpCEnum {

    "Add" = 4,
    "Delete" = 5,
    "Move" = 6
}

export enum OpDEnum {

    "Add" = 7,
    "Delete" = 8,
    "Move" = 9
}

export enum LayerTypeEnum {
    "POSITION" = "position",
    "LIGHTING" = "light",
    "COLOR" = "color",
    "GRADIENT" = "gradient",
    "NORMAL" = "normal",
    "DEPTH" = "depth",
    "TEXTURE" = "texture",
    "NOISE" = "noise",
    "FRESNEL" = "fresnel",
    "RAINBOW" = "rainbow",
    "TRANSMISSION" = "transmission",
    "POINTS" = "points",
    "MATCAP" = "matcap",
    "LINES" = "lines",
    "DISPLACE" = "displace"
}
export enum LayerNodesEnum {
    "POSITION" = "position",
    "LIGHTING" = "light",
    "COLOR" = "color"
}

export enum NoiseFunctionEnum {
    "SIMPLEX" = "simplex3d",
    "SIMPLEX_FRACTAL" = "simplex3dFractal",
    "ASHIMA" = "simplexAshima",
    "FBM" = "fbm",
    "PERLIN" = "perlin"
}

export enum DisplacementTypeEnum {
    "NOISE" = "noise",
    "MAP" = "map"
}

export enum AlignTypeEnum {
    "Right" = 2,
    "Center" = 3,
    "Justify" = 4
}
export enum VerticalAlignmentEnum {

    "Top" = 1,
    "Center" = 2,
    "Bottom" = 3
}

export enum TextTransformEnum {

    "None" = 1,
    "Upper" = 2,
    "Lower" = 3
}


export enum LayerModeEnum {

    "Normal" = 0,
    "Multiply" = 1,
    "Screen" = 2,
    "Overlay" = 3
}

export enum GradientTypeEnum {

    "Linear" = 0,
    "Radial" = 1,
    "Polar" = 2
}

export enum WindingRuleEnum {

    "ODD" = 0,
    "NONZERO" = 1,
    "POSITIVE" = 2,
    "NEGATIVE" = 3,
    "ABS_GEQ_TWO" = 4
}


export enum ElementTypeEnum {

    "POLYGONS" = 0,
    "CONNECTED_POLYGONS" = 1,
    "BOUNDARY_CONTOURS" = 2
}


export enum EventTypeEnum {

    "MOUSE_DOWN" = 0,
    "MOUSE_UP" = 1,
    "MOUSE_HOVER" = 2,
    "KEY_DOWN" = 5,
    "KEY_UP" = 6,
    "START" = 7,
    "LOOK_AT" = 9,
    "FOLLOW" = 10,
    "SCROLL" = 11
}



export enum OperatorEnum {
    "ADD" = "+",
    "SUB" = "-",
    "MUL" = "*",
    "DIV" = "/"
}

export enum MathEnum {
    "RAD" = "radians",
    "DEG" = "degrees",
    "EXP" = "exp",
    "EXP2" = "exp2",
    "LOG" = "log",
    "LOG2" = "log2",
    "SQRT" = "sqrt",
    "INV_SQRT" = "inversesqrt",
    "FLOOR" = "floor",
    "CEIL" = "ceil",
    "NORMALIZE" = "normalize",
    "FRACT" = "fract",
    "SATURATE" = "saturate",
    "SIN" = "sin",
    "COS" = "cos",
    "TAN" = "tan",
    "ASIN" = "asin",
    "ACOS" = "acos",
    "ARCTAN" = "atan",
    "ABS" = "abs",
    "SIGN" = "sign",
    "LENGTH" = "length",
    "NEGATE" = "negate",
    "INVERT" = "invert",
    "MIN" = "min",
    "MAX" = "max",
    "MOD" = "mod",
    "STEP" = "step",
    "REFLECT" = "reflect",
    "DISTANCE" = "distance",
    "DOT" = "dot",
    "CROSS" = "cross",
    "POW" = "pow",
    "MIX" = "mix",
    "CLAMP" = "clamp",
    "REFRACT" = "refract",
    "SMOOTHSTEP" = "smoothstep",
    "FACEFORWARD" = "faceforward"
}


export enum SideEnum {
    Front = 0,
    Back = 1,
    Double = 2
}