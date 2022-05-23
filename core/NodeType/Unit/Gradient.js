import { Function } from './Function';
import NodeTemp from '../NodeTemp'

class Gradient extends NodeTemp {
    constructor(e, t, r, n, s, o, a, l) {
        super("v3");
        this.nodeType = "Gradient";
        this.gradientType = e, this.smooth = t, this.colors = r, this.steps = n, this.offset = s, this.morph = o, this.angle = a, this.alpha = l, this.calpha = `g${this.uuid.toString().replace(/-/g, "")}_calpha`
    }
    generate(e, t) {
        if (e.isShader("fragment")) {
            e.define("GRAD_MAX", 10), e.require("uv"), e.requires.uv = [!0], e.addFragmentVariable(this.calpha, "float");
            let r = e.include(Gradient.Nodes.gradient),
                n = [];
            return n.push(this.gradientType.build(e, "i")), n.push(this.smooth.build(e, "b")), n.push(this.colors.build(e, "v4[]")), n.push(this.steps.build(e, "f[]")), n.push(this.offset.build(e, "v2")), n.push(this.morph.build(e, "v2")), n.push(this.angle.build(e, "f")), n.push(this.alpha.build(e, "f")), n.push(this.calpha), e.format(r + "(" + n.join(",") + ")", this.getType(e), t)
        } else return console.warn("GradientNode is not compatible with " + e.shader + " shader."), e.format("vec3( 0.0 )", this.getType(e), t)
    }
    copy(e) {
        return super.copy(e), this.gradientType = e.gradientType.clone(), this.smooth = e.smooth.clone(), this.colors = e.colors.clone(), this.steps = e.steps.clone(), this.offset = e.offset.clone(), this.morph = e.morph.clone(), this.angle = e.angle.clone(), this.alpha = e.alpha.clone(), this.calpha = e.calpha, this
    }
}

Gradient.Nodes = function () {
    return {
        gradient: new Function(/*glsl*/`vec3 gradient(int gradientType, bool smoothed, vec4 colors[GRAD_MAX], float steps[GRAD_MAX], vec2 offset, vec2 morph, float angle, float alpha, out float calpha) {
				vec4 color = colors[0];
				vec2 m = morph / vUv.xy;
				vec2 rot = vec2( 0.5 + m.x, m.y );
				vec2 dt = vec2(
					cos( angle ) * rot.x - sin( angle ) * rot.y,
					sin( angle ) * rot.x + cos( angle ) * rot.y
				);
				vec2 pt = ( vUv - 0.5 + offset ) / 2.0 + dt / 2.0;
				float t = dot( pt, dt ) / dot( dt, dt );
				if ( gradientType == 1 ) {
					t = distance (
						( vUv + morph ) * 3.0,
						( vUv + offset ) + 1.0
					) + angle;
				} else if ( gradientType == 2 ) {
					float polar = atan(
						vUv.x + morph.x - 0.5 + offset.x,
						vUv.y + morph.y - 0.5 + offset.y
					) * -1.0;
					t = fract( ( angle / PI / -2.0 ) + 0.5 * ( polar / PI ) );
				}

				float p;
				if (smoothed) {
					for ( int i = 1; i < GRAD_MAX; i++ ) {
						p = clamp( ( t - steps[i-1] ) / ( steps[i] - steps[i-1] ), 0.0, 1.0 );
						color = mix(color, colors[i], smoothstep(0.0, 1.0, p));
					}

				} else {
					for ( int i = 1; i < GRAD_MAX; i++ ) {
						p = clamp( ( t - steps[i-1] ) / ( steps[i] - steps[i-1] ), 0.0, 1.0 );
						color = mix(color, colors[i], p);
					}
				}

				float lalpha = alpha * color.a;
				calpha =  lalpha / clamp( lalpha + accumAlpha, 0.00001, 1.0 );
				accumAlpha += ( 1.0 - accumAlpha ) * lalpha;

				return color.xyz;
			}`)
    }
}();

export { Gradient }