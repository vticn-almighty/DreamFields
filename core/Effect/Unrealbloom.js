import * as THREE from 'three'

var f = [1, .8, .6, .4, .2],
    m = [3, 5, 7, 9, 11];
import Triangle from '../../Utils/Triangle'

export default class {
    constructor(renderer, t = { strength: 0.9, radius: 0.8, lowvarying: false, mode: 1 }) {
        this.renderer = renderer;
        this.power = 1;
        this.lowvarying = t.lowvarying;
        this.scene = new THREE.Scene;
        this.scene.autoUpdate = false;
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.strength = t.strength;
        this.radius = t.radius;
        this.mode = t.mode;
        this.resolution = new THREE.Vector2(1, 1);
        this.renderTargetsHorizontal = [];
        this.renderTargetsVertical = [];
        this.nMips = 5;
        var o = 1, l = 1;
        var i = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat,
            depthBuffer: false,
            stencilBuffer: false,
            generateMipMaps: false
        }
        for (var n = 0; n < this.nMips; n++) {
            var r = new THREE.WebGLRenderTarget(o, l, i);
            r.texture.name = "UnrealBloomPass.h" + n;
            r.texture.generateMipmaps = !1;
            this.renderTargetsHorizontal.push(r);
            r.texture.name = "UnrealBloomPass.v" + n;
            r.texture.generateMipmaps = !1;
            this.renderTargetsVertical.push(r);
            o = Math.round(o / 2);
            l = Math.round(l / 2);
        }
        this.separableBlurMaterials = [];
        var o = Math.round(this.resolution.x / 2),
            l = Math.round(this.resolution.y / 2);
        for (n = 0; n < this.nMips; n++) {
            this.separableBlurMaterials.push(this.getSeperableBlurMaterial(m[n]));
            o = Math.round(o / 2);
            l = Math.round(l / 2);
        }

        this.compositeMaterial = this.getCompositeMaterial(this.nMips);

        this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture;
        this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture;
        this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture;
        this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture;
        this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture;
        this.compositeMaterial.needsUpdate = !0;
        this.output = this.renderTargetsHorizontal[0];
        this.options = {
            strength: {
                value: t.strength,
                min: 0,
                max: 5,
                step: .01
            },
            radius: {
                value: t.radius,
                min: 0,
                max: 5,
                step: .01
            },
            power: {
                value: 1,
                min: 0,
                max: 1,
                step: .01
            }
        }
    }

    resize(resolution) {
        var n = Math.round(resolution.x), i = Math.round(resolution.y);
        for (let r = 0; r < this.nMips; r++) {

            this.renderTargetsHorizontal[r].setSize(n, i);
            this.renderTargetsVertical[r].setSize(n, i);
            this.separableBlurMaterials[r].uniforms.invSize.value.set(1 / n, 1 / i);
            if (2 > 1) {
                n = Math.round(n / 2.5), i = Math.round(i / 2.5)
            } else {
                n = Math.round(n / 2), i = Math.round(i / 2)
            }
        }
    }

    render(input, output) {
        var t = this.renderer.autoClear;
        this.renderer.autoClear = false;
        var n = input;
        if (null == this.quad) {
            this.quad = new THREE.Mesh(new Triangle, this.separableBlurMaterials[0]);
            this.quad.frustumCulled = false;
            this.quad.matrixAutoUpdate = false;
            this.scene.add(this.quad)
        }

        for (var i = 0; i < this.nMips; i++) {

            this.quad.material = this.separableBlurMaterials[i];
            this.separableBlurMaterials[i].uniforms.colorTexture.value = n.texture;
            this.separableBlurMaterials[i].uniforms.direction.value.set(1, 0);
            this.renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
            this.renderer.render(this.scene, this.camera);
            this.separableBlurMaterials[i].uniforms.colorTexture.value = this.renderTargetsHorizontal[i].texture;
            this.separableBlurMaterials[i].uniforms.direction.value.set(0, 1);
            this.renderer.setRenderTarget(this.renderTargetsVertical[i]);
            this.renderer.render(this.scene, this.camera);
            n = this.renderTargetsHorizontal[i];
        }
        this.quad.material = this.compositeMaterial;
        this.compositeMaterial.uniforms.bloomStrength.value = this.options.strength.value * this.options.power.value;
        this.compositeMaterial.uniforms.bloomRadius.value = 2 * (this.options.radius.value * this.options.power.value);

        if (this.mode === 1) {
            this.renderer.setRenderTarget(this.renderTargetsHorizontal[0]);
        } else if (this.mode === 2) {
            this.renderer.setRenderTarget(null);
        } else if (this.mode === 3) {
            this.renderer.setRenderTarget(output);
        }

        this.renderer.render(this.scene, this.camera);
        this.renderer.autoClear = t

    }

    getSeperableBlurMaterial(e) {
        var t = {
            KERNEL_RADIUS: e,
            SIGMA: e
        };
        return e >= 5 && (t.KERNEL_RADIUS_5 = ""),
            e >= 7 && (t.KERNEL_RADIUS_7 = ""),
            e >= 9 && (t.KERNEL_RADIUS_9 = ""),
            e >= 11 && (t.KERNEL_RADIUS_11 = ""),
            new THREE.ShaderMaterial({
                side: 0,
                defines: t,
                depthTest: !1,
                depthWrite: !1,
                uniforms: {
                    colorTexture: {
                        value: null
                    },
                    invSize: {
                        value: new THREE.Vector2(.5, .5)
                    },
                    direction: {
                        value: new THREE.Vector2(.5, .5)
                    }
                },
                vertexShader: this.lowvarying ? /*glsl*/`
                #define GLSLIFY 1
                varying vec2 vUv;
                void main() {
                    vUv = vec2(0.5)+(position.xy)*0.5;
                    gl_Position = vec4( position.xy, 0.0,  1.0 );
                }
            ` : /*glsl*/`
            #define GLSLIFY 1
            // 3, 5, 7, 9, 11

            varying vec2 vUv;
            uniform vec2 direction;
            uniform vec2 invSize;
            varying vec2 offsetMin[KERNEL_RADIUS];
            varying vec2 offsetMax[KERNEL_RADIUS];

            float gaussianPdf(in float x, in float sigma) {
                // return  exp(-x*x)/(2.0*sigma*sigma);
                return 0.39894 * exp( -0.5 * x * x/(sigma * sigma))/sigma;

            }

            varying float weightSum_0;

            void main() {

                float fSigma 	= float(SIGMA);
                float weightSum = gaussianPdf(0.0, fSigma);

                weightSum_0 = weightSum;

                vUv = vec2(0.5)+(position.xy)*0.5;
                gl_Position = vec4( position.xy, 0.0,  1.0 );

                float x = 0.0;
                vec2 dd = vec2(0.0);

                x = 1.0;
                dd = direction * invSize * x;
                offsetMin[0] = vUv - dd;
                offsetMax[0] = vUv + dd;

                x = 2.0;
                dd = direction * invSize * x;
                offsetMin[1] = vUv - dd;
                offsetMax[1] = vUv + dd;

                x = 3.0;
                dd = direction * invSize * x;
                offsetMin[2] = vUv - dd;
                offsetMax[2] = vUv + dd;

                #ifdef KERNEL_RADIUS_5

                    x = 4.0;
                    dd = direction * invSize * x;
                    offsetMin[3] = vUv - dd;
                    offsetMax[3] = vUv + dd;

                    x = 5.0;
                    dd = direction * invSize * x;
                    offsetMin[4] = vUv - dd;
                    offsetMax[4] = vUv + dd;

                #endif

                #ifdef KERNEL_RADIUS_7

                    x = 6.0;
                    dd = direction * invSize * x;
                    offsetMin[5] = vUv - dd;
                    offsetMax[5] = vUv + dd;

                    x = 7.0;
                    dd = direction * invSize * x;
                    offsetMin[6] = vUv - dd;
                    offsetMax[6] = vUv + dd;

                #endif

                #ifdef KERNEL_RADIUS_9

                    x = 8.0;
                    dd = direction * invSize * x;
                    offsetMin[7] = vUv - dd;
                    offsetMax[7] = vUv + dd;

                    x = 9.0;
                    dd = direction * invSize * x;
                    offsetMin[8] = vUv - dd;
                    offsetMax[8] = vUv + dd;

                #endif

                #ifdef KERNEL_RADIUS_11

                    x = 10.0;
                    dd = direction * invSize * x;
                    offsetMin[9] = vUv - dd;
                    offsetMax[9] = vUv + dd;

                    x = 11.0;
                    dd = direction * invSize * x;
                    offsetMin[10] = vUv - dd;
                    offsetMax[10] = vUv + dd;

                #endif

            }
            `,
                fragmentShader: this.lowvarying ? /*glsl*/`
                #define GLSLIFY 1
                #include <common>
                varying vec2 vUv;
                uniform sampler2D colorTexture;
                uniform vec2 texSize;
                uniform vec2 direction;
                uniform vec2 invSize;
    
                float gaussianPdf(in float d, in float sigma) {
    
                    float invSigmaQx2 = .5 / (sigma * sigma);
                    return exp( -dot(d , d) * invSigmaQx2 ) * invSigmaQx2;
                }
    
                void main() {
                    
                    float fSigma = float(SIGMA);
                    float weightSum = gaussianPdf(0.0, fSigma);
                    vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
                    for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
                        float x = float(i);
                        float w = gaussianPdf(x, fSigma);
                        vec2 uvOffset = direction * invSize * x;
                        vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
                        vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
                    }
                    gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
                }
                ` : /*glsl*/`
                #define GLSLIFY 1
    
                varying vec2 vUv;
                uniform sampler2D colorTexture;
    
                varying float weightSum_0;
    
                varying vec2 offsetMin[KERNEL_RADIUS];
                varying vec2 offsetMax[KERNEL_RADIUS];
    
                float gaussianPdf(in float d, in float sigma) {
    
                    float invSigmaQx2 = .5 / (sigma * sigma);
    
                    return exp( -dot(d , d) * invSigmaQx2 ) * invSigmaQx2;
                }
                void main() {
    
                    float fSigma 	= float(SIGMA);
                    float weightSum = weightSum_0;
                    vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
    
                    float x = 0.0;
                    float w = 0.0;
    
                    vec3 sample1 = vec3(0.0);
                    vec3 sample2 = vec3(0.0);
    
                    x = 1.0;
                    w = gaussianPdf(x, fSigma);
                    sample1 = texture2D( colorTexture, offsetMax[0]).rgb;
                    sample2 = texture2D( colorTexture, offsetMin[0]).rgb;
                    diffuseSum += (sample1 + sample2) * w;
                    weightSum += 2.0 * w;
    
                    x = 2.0;
                    w = gaussianPdf(x, fSigma);
                    sample1 = texture2D( colorTexture, offsetMax[1]).rgb;
                    sample2 = texture2D( colorTexture, offsetMin[1]).rgb;
                    diffuseSum += (sample1 + sample2) * w;
                    weightSum += 2.0 * w;
    
                    x = 3.0;
                    w = gaussianPdf(x, fSigma);
                    sample1 = texture2D( colorTexture, offsetMax[2]).rgb;
                    sample2 = texture2D( colorTexture, offsetMin[2]).rgb;
                    diffuseSum += (sample1 + sample2) * w;
                    weightSum += 2.0 * w;
    
                    #ifdef KERNEL_RADIUS_5
    
                        x = 4.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[3]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[3]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                        x = 5.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[4]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[4]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                    #endif
    
                    #ifdef KERNEL_RADIUS_7
    
                        x = 6.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[5]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[5]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                        x = 7.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[6]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[6]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                    #endif
    
                    #ifdef KERNEL_RADIUS_9
    
                        x = 8.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[7]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[7]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                        x = 9.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[8]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[8]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                    #endif
    
                    #ifdef KERNEL_RADIUS_11
    
                        x = 10.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[9]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[9]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                        x = 11.0;
                        w = gaussianPdf(x, fSigma);
                        sample1 = texture2D( colorTexture, offsetMax[10]).rgb;
                        sample2 = texture2D( colorTexture, offsetMin[10]).rgb;
                        diffuseSum += (sample1 + sample2) * w;
                        weightSum += 2.0 * w;
    
                    #endif
    
                    gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
                }
                `
            })
    }

    getCompositeMaterial(e) {
        return new THREE.ShaderMaterial({
            side: 0,
            depthTest: false,
            depthWrite: false,
            defines: {
                BLOOM_FACTOR_0: "" + f[0].toFixed(1),
                BLOOM_FACTOR_1: "" + f[1].toFixed(1),
                BLOOM_FACTOR_2: "" + f[2].toFixed(1),
                BLOOM_FACTOR_3: "" + f[3].toFixed(1),
                BLOOM_FACTOR_4: "" + f[4].toFixed(1)
            },
            uniforms: {
                blurTexture1: {
                    value: null
                },
                blurTexture2: {
                    value: null
                },
                blurTexture3: {
                    value: null
                },
                blurTexture4: {
                    value: null
                },
                blurTexture5: {
                    value: null
                },
                bloomStrength: {
                    value: 1
                },
                bloomRadius: {
                    value: 0
                }
            },
            vertexShader: /*glsl*/`
            #define GLSLIFY 1
            varying vec2 vUv;

            uniform float bloomRadius;

            float lerpBloomFactor(float factor) { 
                float mirrorFactor = 1.2 - factor;
                return mix(factor, mirrorFactor, bloomRadius);
            }

            varying float V_BLOOM_FACTOR_0;
            varying float V_BLOOM_FACTOR_1;
            varying float V_BLOOM_FACTOR_2;
            varying float V_BLOOM_FACTOR_3;
            varying float V_BLOOM_FACTOR_4;

            void main() {

                V_BLOOM_FACTOR_0 = lerpBloomFactor(BLOOM_FACTOR_0);

                V_BLOOM_FACTOR_1 = lerpBloomFactor(BLOOM_FACTOR_1);

                V_BLOOM_FACTOR_2 = lerpBloomFactor(BLOOM_FACTOR_2);

                V_BLOOM_FACTOR_3 = lerpBloomFactor(BLOOM_FACTOR_3);

                V_BLOOM_FACTOR_4 = lerpBloomFactor(BLOOM_FACTOR_4);

                vUv = vec2(0.5)+(position.xy)*0.5;
                
                gl_Position = vec4( position.xy, 0.0,  1.0 );
            }
            `,
            fragmentShader: /*glsl*/`
            #define GLSLIFY 1
            varying vec2 vUv;
            uniform sampler2D blurTexture1;
            uniform sampler2D blurTexture2;
            uniform sampler2D blurTexture3;
            uniform sampler2D blurTexture4;
            uniform sampler2D blurTexture5;

            varying float V_BLOOM_FACTOR_0;
            varying float V_BLOOM_FACTOR_1;
            varying float V_BLOOM_FACTOR_2;
            varying float V_BLOOM_FACTOR_3;
            varying float V_BLOOM_FACTOR_4;

            uniform float bloomStrength;

            void main() {	

                vec4 total = 
                    V_BLOOM_FACTOR_0 * texture2D(blurTexture1, vUv) + 
                    V_BLOOM_FACTOR_1 * texture2D(blurTexture2, vUv) + 
                    V_BLOOM_FACTOR_2 * texture2D(blurTexture3, vUv) + 
                    V_BLOOM_FACTOR_3 * texture2D(blurTexture4, vUv) +
                    V_BLOOM_FACTOR_4 * texture2D(blurTexture5, vUv) ;

                gl_FragColor = bloomStrength * total;
            }
            `
        })
    }

    dispose() {
        for (var e = 0; e < this.renderTargetsHorizontal.length(); e++) {
            this.renderTargetsHorizontal[e].dispose()
            this.renderTargetsHorizontal[e] = null
        }

        for (; e < this.renderTargetsVertical.length(); e++) {
            this.renderTargetsVertical[e].dispose(),
                this.renderTargetsVertical[e] = null
        }
    }
}