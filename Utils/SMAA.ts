import * as THREE from 'three';
import edgeDetectionVert from '../Shader/vertexShader/smaa_edgeDetection';
import edgeDetectionFrag from '../Shader/fragmentShader/smaa_edgeDetection';
import blendingWeightCalculationVert from '../Shader/vertexShader/smaa_blendingWeightCalculation';
import blendingWeightCalculationFrag from '../Shader/fragmentShader/smaa_blendingWeightCalculation';
import neiborhoodBlendingVert from '../Shader/vertexShader/smaa_neiborhoodBlending';
import neiborhoodBlendingFrag from '../Shader/fragmentShader/smaa_neiborhoodBlending';
import area from '../assets/smaa/smaa-area'
import search from '../assets/smaa/smaa-search'
import { Uniforms, UniformsLib } from './Uniforms';
import { PostProcessing } from '../PostProcessing';



export declare interface SMAAParam {
    renderer: THREE.WebGLRenderer,
    renderToScreen?: boolean,
}


export default class SMAA {

    private renderer: THREE.WebGLRenderer;

    //parameters
    private bloomResolutionRatio: number;
    private bloomRenderCount: number;
    private brightness: number;

    //uniforms

    //textures
    private inputTextures: Uniforms;

    //postprocessing
    private smaaEdgePP: PostProcessing;
    private smaaCalcWeighttPP: PostProcessing;
    private smaaBlendingPP: PostProcessing;

    private renderTargets: {
        [keys: string]: THREE.WebGLRenderTarget
    };
    renderToScreen: boolean;
    commonUniforms: {};
    smaaCommonUni: Uniforms;

    constructor(param: SMAAParam) {

        this.renderer = param.renderer;
        this.renderToScreen = param.renderToScreen === undefined ? true : param.renderToScreen;


        this.commonUniforms = {

        }
        /*------------------------
            RenderTargets
        ------------------------*/
        this.renderTargets = {
            // rt1: new THREE.WebGLRenderTarget(0, 0, {
            //     stencilBuffer: false,
            //     generateMipmaps: false,
            //     depthBuffer: true,
            //     minFilter: THREE.LinearFilter,
            //     magFilter: THREE.LinearFilter
            // }),
            rt1: new THREE.WebGLRenderTarget(0, 0, {
                depthBuffer: false,
                stencilBuffer: false,
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            }),
            rt2: new THREE.WebGLRenderTarget(0, 0, {
                depthBuffer: false,
                stencilBuffer: false,
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter
            }),
        };



        /*------------------------
            InputTextures
        ------------------------*/
        this.inputTextures = {
            areaTex: {
                value: null
            },
            searchTex: {
                value: null
            },
            envMap: {
                value: null
            }
        };

        let loader = new THREE.TextureLoader();
        loader.load(area, (tex) => {

            tex.minFilter = THREE.LinearFilter;
            tex.generateMipmaps = false;
            tex.format = THREE.RGBAFormat;
            tex.flipY = false;
            this.inputTextures.areaTex.value = tex;

        });

        loader.load(search, (tex) => {

            tex.minFilter = THREE.NearestFilter;
            tex.magFilter = THREE.NearestFilter;
            tex.generateMipmaps = false;
            tex.flipY = false;
            this.inputTextures.searchTex.value = tex;

        });


        /*------------------------
            SMAA
        ------------------------*/

        let defines = {
            "mad(a, b, c)": "(a * b + c)",
            "SMAA_THRESHOLD": "0.1",
            "SMAA_LOCAL_CONTRAST_ADAPTATION_FACTOR": "2.0",
            "SMAA_MAX_SEARCH_STEPS": "8",
            "SMAA_AREATEX_MAX_DISTANCE": "16",
            "SMAA_SEARCHTEX_SIZE": "vec2(66.0, 33.0)",
            "SMAA_AREATEX_PIXEL_SIZE": "( 1.0 / vec2( 160.0, 560.0 ) )",
            "SMAA_AREATEX_SUBTEX_SIZE": "( 1.0 / 7.0 )",
            "SMAA_SEARCHTEX_SELECT(sample)": "sample.g",
            "SMAA_AREATEX_SELECT(sample)": "sample.rg",
        };

        this.smaaCommonUni = UniformsLib.mergeUniforms({
            SMAA_RT_METRICS: {
                value: new THREE.Vector4()
            }
        }, this.commonUniforms);

        this.smaaEdgePP = new PostProcessing(this.renderer,
            {
                vertexShader: edgeDetectionVert,
                fragmentShader: edgeDetectionFrag,
                uniforms: UniformsLib.mergeUniforms({
                }, this.smaaCommonUni),
                defines: defines
            }
        );

        this.smaaCalcWeighttPP = new PostProcessing(this.renderer,
            {
                vertexShader: blendingWeightCalculationVert,
                fragmentShader: blendingWeightCalculationFrag,
                uniforms: UniformsLib.mergeUniforms({
                    areaTex: this.inputTextures.areaTex,
                    searchTex: this.inputTextures.searchTex,
                }, this.smaaCommonUni),
                defines: defines,
            }
        );

        this.smaaBlendingPP = new PostProcessing(this.renderer,
            {
                vertexShader: neiborhoodBlendingVert,
                fragmentShader: neiborhoodBlendingFrag,
                uniforms: UniformsLib.mergeUniforms({
                }, this.smaaCommonUni),
                defines: defines
            }
        );

        /*------------------------
            Composite
        ------------------------*/

    }

    public render(inputRenderTarget: THREE.WebGLRenderTarget, outputRenderTarget?: THREE.WebGLRenderTarget) {

        /*------------------------
            Scene
        ------------------------*/
        // if(!inputRenderTarget){

        //     let renderTargetMem = this.renderer.getRenderTarget();
        //     this.renderer.setRenderTarget(this.renderTargets.rt1);
        //     this.renderer.render(scene, camera);
        //     this.renderer.setRenderTarget(renderTargetMem);
        // }

        /*------------------------
            SMAA
        ------------------------*/

        if (!this.renderToScreen && !outputRenderTarget) {
    		console.log( "%c dreamfield: " + 'No output renderer specified', 'padding: 5px 10px ;background-color: #eb285f; color: white;font-size:11px' );
        }

        this.smaaEdgePP.render({
            sceneTex: inputRenderTarget.texture,
        }, this.renderTargets.rt1);

        this.smaaCalcWeighttPP.render({
            backbuffer: this.renderTargets.rt1.texture,
        }, this.renderTargets.rt2);

        this.smaaBlendingPP.render({
            sceneTex: inputRenderTarget.texture,
            backbuffer: this.renderTargets.rt2.texture,
        }, this.renderToScreen ? null : outputRenderTarget);



    }

    public resize(pixelWindowSize: THREE.Vector2) {

        this.smaaCommonUni.SMAA_RT_METRICS.value.set(1 / pixelWindowSize.x, 1 / pixelWindowSize.y, pixelWindowSize.x, pixelWindowSize.y);

        this.renderTargets.rt1.setSize(pixelWindowSize.x, pixelWindowSize.y);
        this.renderTargets.rt2.setSize(pixelWindowSize.x, pixelWindowSize.y);
        // this.renderTargets.rt3.setSize(pixelWindowSize.x, pixelWindowSize.y);
    }

}
