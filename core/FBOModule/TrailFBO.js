import FBO from '../FBO'
import * as THREE from 'three'


export default class {
    constructor({ pointer, renderer }) {

        this.pointer = pointer;
        this.renderer = renderer;


        this.uniforms = {
            uRatio: {
                value: 1
            },
            uPointer: {
                value: new THREE.Vector2(0, 0)
            },
            uPrevPointer: {
                value: new THREE.Vector2
            },
            uRect: {
                value: new THREE.Vector4
            },
            uRectForce: {
                value: 0
            },
            uSpeed: {
                value: 0
            }
        }


        this.instance = new FBO({
            width: 256,
            height: 256,
            name: "trail",
            shader: /*glsl*/`
                precision highp float;
                #define GLSLIFY 1
                uniform sampler2D texture;
                uniform vec2 uPointer;
                uniform vec2 uPrevPointer;
                uniform float uSpeed;
                uniform float uRatio;


                float circle(vec2 uv,vec2 disc_center,float disc_radius,float border_size){
                    uv-=disc_center;
                    float dist=sqrt(dot(uv,uv));
                    return smoothstep(disc_radius+border_size,disc_radius-border_size,dist);
                }

                void main(){
                    vec2 uv=gl_FragCoord.xy/RESOLUTION.xy;
                    vec4 color=texture2D(texture,uv+vec2(0.,-.002));
                    // vec2 rand2 = rot2d(vec2(1.0, 0.0), rnd) * 0.1;
                    
                    vec2 center=uPointer;
                    uv.x*=uRatio;
                    center.x*=uRatio;
                    
                    color.r+=circle(uv,center,0.,.1)*uSpeed;
                    color.r=mix(color.r,0.,.009);
                    color.r=clamp(color.r,0.,1.);
                    
                    color.g=color.r*5.;
                    
                    // gl_FragColor=vec4(1.,0.,0.,1.);
                    gl_FragColor=color;
                }
            `,
            uniforms: this.uniforms,
            rtOptions: {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            }
        }, this.renderer)
        this.speed = 0
        this.pointerTarget = new THREE.Vector2
    }
    onResize(resolution) {
        this.uniforms.uRatio.value = resolution.x / resolution.y
    }
    onPointerMove({
        pointer: e
    }) {
        this.pointerTarget.set(e.x / window.innerWidth, 1 - e.y / window.innerHeight)
    }
    onRaf() {
        this.uniforms.uPrevPointer.value.copy(this.uniforms.uPointer.value);
        this.uniforms.uPointer.value.lerp(this.pointerTarget, .2);
        this.instance.update();
        const t = .005 * Math.max(Math.abs(this.pointer.delta.x), Math.abs(this.pointer.delta.y));
        this.speed += Math.min(t, .1);
        this.speed *= .9;
        this.speed = Math.min(2, this.speed)
        this.uniforms.uSpeed.value = this.speed;
    }
}