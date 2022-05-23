
import { GradientTypeEnum } from '../../Enum'
import { Function } from './Function';
import NodeTemp from '../NodeTemp'

class Depth extends NodeTemp {
    constructor(e, t, r, n, s, o, a, l, c, u, h, d) {
        super("v3");
        this.nodeType = "Depth";
        this.gradientType = e;
        this.smooth = t;
        this.near = r;
        this.far = n;
        this.isVector = s;
        this.isWorldSpace = o;
        this.origin = a;
        this.direction = l;
        this.colors = c;
        this.steps = u;
        this.num = h;
        this.alpha = d;
        this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        let r = `g${this.uuid.toString().replace(/-/g, "")}`,
            n = new Function(/*glsl*/`vec3 ${r}_sdepth(float near, float far, vec3 origin, vec3 direction, vec4 colors[${r}_MAX_COLORS], float steps[10], float alpha, out float calpha) {
           vec4 color = colors[0];
           #ifdef ${r}_IS_VECTOR
               #ifdef ${r}_LINEAR
                   #ifdef ${r}_WORLDSPACE
                   float depth = vectorLinearWorldSpaceDepth(direction, origin, near, far);
                   #else
                   float depth = vectorLinearObjectSpaceDepth(direction, origin, near, far);
                   #endif
               #else
                   #ifdef ${r}_WORLDSPACE
                       float depth = vectorSphericalWorldSpaceDepth(origin, near, far);
                   #else
                       float depth = vectorSphericalObjectSpaceDepth(origin, near, far);
                   #endif
               #endif
           #else
               float dist = length(vWPosition - cameraPosition);
               float depth = ( dist - near ) / ( far - near );
           #endif


          float p;
          #ifdef ${r}_SMOOTH
            for ( int i = 1; i < ${r}_MAX_COLORS; i++ ) {
                    p = clamp( ( depth - steps[i-1] ) / ( steps[i] - steps[i-1] ), 0.0, 1.0 );
                    color = mix(color, colors[i], smoothstep(0.0, 1.0, p));
                }
          #else
            for ( int i = 1; i < ${r}_MAX_COLORS; i++ ) {
               p = clamp(( depth - steps[i - 1] ) / ( steps[i] - steps[i - 1] ), 0.0, 1.0);
               color = mix(color, colors[i], p);
             }
          #endif

           float lalpha = alpha * color.a;
           calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );

           accumAlpha += ( 1.0 - accumAlpha ) * lalpha;
           return color.rgb;
        }`, [Depth.Nodes.vectorLinearWorldSpaceDepth, Depth.Nodes.vectorLinearObjectSpaceDepth, Depth.Nodes.vectorSphericalObjectSpaceDepth, Depth.Nodes.vectorSphericalWorldSpaceDepth]);
        if (e.isShader("fragment")) {
            e.define(`${r}_MAX_COLORS`, this.num.value + 1);
            this.smooth.value && e.define(`${r}_SMOOTH`);
            this.isVector.value > .5 && e.define(`${r}_IS_VECTOR`);
            this.gradientType.value === GradientTypeEnum.Linear && e.define(`${r}_LINEAR`);
            this.isWorldSpace.value > .5 && e.define(`${r}_WORLDSPACE`);
            e.require("worldPosition");
            e.addFragmentVariable(this.calpha, "float");
            let s = e.include(n),
                o = [];
            return o.push(this.near.build(e, "f")), o.push(this.far.build(e, "f")), o.push(this.origin.build(e, "v3")), o.push(this.direction.build(e, "v3")), o.push(this.colors.build(e, "v4[]")), o.push(this.steps.build(e, "f[]")), o.push(this.alpha.build(e, "f")), o.push(this.calpha), e.format(s + "(" + o.join(",") + ")", this.getType(e), t)
        } else return console.warn("DepthNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.gradientType = e.gradientType.clone(), this.smooth = e.smooth.clone(), this.near = e.near.clone(), this.far = e.far.clone(), this.isVector = e.isVector.clone(), this.isWorldSpace = e.isWorldSpace.clone(), this.origin = e.origin.clone(), this.direction = e.direction.clone(), this.colors = e.colors.clone(), this.steps = e.steps.clone(), this.alpha = e.alpha.clone(), this.calpha = e.calpha, this
    }
}

Depth.Nodes = function () {
    let e = new Function(/*glsl*/`float vectorLinearWorldSpaceDepth(vec3 direction, vec3 origin, float near, float far) {
               vec3 n = normalize(direction);
               float dist = (n.x*(vWPosition.x - origin.x) + n.y*(vWPosition.y - origin.y) + n.z*(vWPosition.z - origin.z));
               return ( dist - near ) / ( far - near );
            }`),
        t = new Function(/*glsl*/`float vectorLinearObjectSpaceDepth(vec3 direction, vec3 origin, float near, float far) {
               vec3 n = normalize(direction);
               float dist = (n.x*(position.x - origin.x) + n.y*(position.y - origin.y) + n.z*(position.z - origin.z));
               return ( dist - near ) / ( far - near );
            }`),
        r = new Function(/*glsl*/`
            float vectorSphericalWorldSpaceDepth(vec3 origin, float near, float far) {
               float dist = length(vWPosition - origin);
               return ( dist - near ) / ( far - near );
            }
        `),
        n = new Function(/*glsl*/`float vectorSphericalObjectSpaceDepth(vec3 origin, float near, float far) {
               float dist = length(position - origin);
               return ( dist - near ) / ( far - near );
            }`);
    return {
        vectorLinearWorldSpaceDepth: e,
        vectorLinearObjectSpaceDepth: t,
        vectorSphericalWorldSpaceDepth: r,
        vectorSphericalObjectSpaceDepth: n
    }
}();

export { Depth }