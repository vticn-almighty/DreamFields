


import FBO from '../FBO'
import * as THREE from 'three'
export default class GlitchFBO {
    constructor({
        uvwind,
        trail,
        renderer,
    }) {
        this.renderer = renderer
        this.uniforms = {
            uWind: {
                value: uvwind
            },
            uTime: {
                value: 0
            },
            uTrail: {
                value: trail
            }
        }
        this.instance = new FBO({
            width: 1024,
            height: 1024,
            name: "Glitch FBO",
            shader:/*glsl*/ `
                precision highp float;
                #define GLSLIFY 1
                uniform float uTime;
        
                uniform sampler2D texture;
        
                uniform sampler2D uWind;
        
                uniform sampler2D uTrail;
        
                void main(){
                    
                    float pixelHeight=1./RESOLUTION.y;
                    
                    float pixelWidth=1./RESOLUTION.x;
                    
                    vec2 uv=gl_FragCoord.xy/RESOLUTION.xy;
                    
                    vec4 current=texture2D(texture,uv);
                    
                    vec4 wind=texture2D(uWind,uv);
                    
                    vec4 trail=texture2D(uTrail,uv);
                    
                    // Initial set - todo, set initial data!
                    
                    if(current.a<=.9){
                        
                        current=vec4(uv,0.,1.);
                    }
                    
                    // current.z = 0.0; // speed
                    
                    // if (current.x < wind.x) {
                        
                        //   current.z += wind.x - current.x;
                        
                        //   current.x += 0.05 * pow(current.z, 2.0);
                        
                    // }
                    
                    if(current.y<wind.y){
                        
                        current.z=wind.y-current.y;
                        
                        current.y+=.05*pow(current.z,2.);
                        
                    }
                    
                    float t=trail.r*.1;
                    
                    // t += trail.r * trail.a;
                    
                    float x=(uv.x*2.)+uTime*.20;
                    
                    float noise=(sin(x)+sin(2.2*x+5.52)+sin(2.9*x+.93)+sin(4.6*x+8.94))/4.;
                    
                    noise*=.3;
                    
                    // t=mix(t,t+noise,.1);
                    
                    t=clamp(t,0.,1.);
                    
                    current.xy=mix(current.xy,uv,t);
                    
                    gl_FragColor=current;
                }
            `,
            uniforms: this.uniforms
        }, this.renderer);

    }

    onRaf(e) {
        this.uniforms.uTime.value += e;
        this.instance.update()
    }

    onResize(resolution) {
    }

}