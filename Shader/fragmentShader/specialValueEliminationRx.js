export default /*glsl*/ `
precision highp float;
  uniform sampler2D utexture;
  uniform vec3 uColor;
  uniform vec2 uResolution;
  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec3 color = vec3(uv, 1.0);
    color = texture2D(utexture, uv).rgb;
    // Do your cool postprocessing here
    // color.r += sin(uv.x * 50.0);
    if(distance(color,uColor)<0.005){
        discard;
    }
    gl_FragColor = vec4(color, 1.0);
  }
`