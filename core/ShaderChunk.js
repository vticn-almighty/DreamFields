import { Const, Function } from "./NodeType/Unit";



export default new class ShaderChunk {
    constructor() {
        this.assemble()
    }
    assemble() {
        this.random3 = new Function(/*glsl*/`vec3 random3(vec3 c) {
            float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
            vec3 r;
            r.z = fract(512.0*j);
            j *= .125;
            r.x = fract(512.0*j);
            j *= .125;
            r.y = fract(512.0*j);
            return r-0.5;
        }`)
        this.simplex3d = new Function(/*glsl*/`float simplex3d(vec3 p) {
            vec3 s = floor(p + dot(p, vec3(F3)));
            vec3 x = p - s + dot(s, vec3(G3));
            
            vec3 e = step(vec3(0.0), x - x.yzx);
            vec3 i1 = e*(1.0 - e.zxy);
            vec3 i2 = 1.0 - e.zxy*(1.0 - e);
               
            vec3 x1 = x - i1 + G3;
            vec3 x2 = x - i2 + 2.0*G3;
            vec3 x3 = x - 1.0 + 3.0*G3;
            
            vec4 w, d;
            
            w.x = dot(x, x);
            w.y = dot(x1, x1);
            w.z = dot(x2, x2);
            w.w = dot(x3, x3);
            
            w = max(0.6 - w, 0.0);
            
            d.x = dot(random3(s), x);
            d.y = dot(random3(s + i1), x1);
            d.z = dot(random3(s + i2), x2);
            d.w = dot(random3(s + 1.0), x3);
            
            w *= w;
            w *= w;
            d *= w;
            
            return dot(d, vec4(52.0));
       }`, [this.random3]);
        this.simplex3d.keywords.F3 = new Const(/*glsl*/`float F3 0.3333333`);
        this.simplex3d.keywords.G3 = new Const(/*glsl*/`float G3 0.1666667`);
        this.simplex3dFractal = new Function(/*glsl*/`float simplex3dFractal(vec3 m) {
           mat3 rot1 = mat3(-0.37, 0.36, 0.85,-0.14,-0.93, 0.34,0.92, 0.01,0.4);
           mat3 rot2 = mat3(-0.55,-0.39, 0.74, 0.33,-0.91,-0.24,0.77, 0.12,0.63);
           mat3 rot3 = mat3(-0.71, 0.52,-0.47,-0.08,-0.72,-0.68,-0.7,-0.45,0.56);
           return 0.5333333 * simplex3d(m * rot1)
                + 0.2666667 * simplex3d(2.0 * m * rot2)
                + 0.1333333 * simplex3d(4.0 * m * rot3)
                + 0.0666667 * simplex3d(8.0 * m);
       }`, [this.simplex3d]);
        this.permute = new Function(/*glsl*/`vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}`);
        this.taylorInvSqrt = new Function(/*glsl*/`vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}`);
        this.simplexAshima = new Function(/*glsl*/`float simplexAshima(vec3 v) {
         const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
         const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
         vec3 i  = floor(v + dot(v, C.yyy) );
         vec3 x0 =   v - i + dot(i, C.xxx) ;
         vec3 g = step(x0.yzx, x0.xyz);
         vec3 l = 1.0 - g;
         vec3 i1 = min( g.xyz, l.zxy );
         vec3 i2 = max( g.xyz, l.zxy );
         vec3 x1 = x0 - i1 + 1.0 * C.xxx;
         vec3 x2 = x0 - i2 + 2.0 * C.xxx;
         vec3 x3 = x0 - 1. + 3.0 * C.xxx;
         i = mod(i, 289.0 ); 
         vec4 p = permute( permute( permute( 
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
         float n_ = 1.0/7.0; // N=7
         vec3  ns = n_ * D.wyz - D.xzx;
         vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
         vec4 x_ = floor(j * ns.z);
         vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
         vec4 x = x_ *ns.x + ns.yyyy;
         vec4 y = y_ *ns.x + ns.yyyy;
         vec4 h = 1.0 - abs(x) - abs(y);
         vec4 b0 = vec4( x.xy, y.xy );
         vec4 b1 = vec4( x.zw, y.zw );
         vec4 s0 = floor(b0)*2.0 + 1.0;
         vec4 s1 = floor(b1)*2.0 + 1.0;
         vec4 sh = -step(h, vec4(0.0));
         vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
         vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
         vec3 p0 = vec3(a0.xy,h.x);
         vec3 p1 = vec3(a0.zw,h.y);
         vec3 p2 = vec3(a1.xy,h.z);
         vec3 p3 = vec3(a1.zw,h.w);
         vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
         p0 *= norm.x;
         p1 *= norm.y;
         p2 *= norm.z;
         p3 *= norm.w;
         vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
         m = m * m;
         return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                       dot(p2,x2), dot(p3,x3) ) );
       }`, [this.permute, this.taylorInvSqrt]);
        this.mod289 = new Function(/*glsl*/`vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}`);
        this.perm = new Function(/*glsl*/`vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}`, [this.mod289]);
        this.noise = new Function(/*glsl*/`float noise(vec3 p){
           vec3 a = floor(p);
           vec3 d = p - a;
           d = d * d * (3.0 - 2.0 * d);
           vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
           vec4 k1 = perm(b.xyxy);
           vec4 k2 = perm(k1.xyxy + b.zzww);
           vec4 c = k2 + a.zzzz;
           vec4 k3 = perm(c);
           vec4 k4 = perm(c + 1.0);
           vec4 o1 = fract(k3 * (1.0 / 41.0));
           vec4 o2 = fract(k4 * (1.0 / 41.0));
           vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
           vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
           return o4.y * d.y + o4.x * (1.0 - d.y);
       }`, [this.perm]);
        this.fbm = new Function(/*glsl*/`float fbm(vec3 x) {
           float v = 0.0;
           float a = 0.5;
           vec3 shift = vec3(100);
           for (int i = 0; i < NUM_OCTAVES; ++i) {
               v += a * noise(x);
               x = x * 2.0 + shift;
               a *= 0.5;
           }
           return v;
       }`, [this.noise]);
        this.fbm.keywords.NUM_OCTAVES = new Const(/*glsl*/`int NUM_OCTAVES 5`);
        this.fade = new Function(/*glsl*/`vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}`);
        this.perlin = new Function(/*glsl*/`float perlin(vec3 P){
         vec3 Pi0 = floor(P);
         vec3 Pi1 = Pi0 + vec3(1.0);
         Pi0 = mod(Pi0, 289.0);
         Pi1 = mod(Pi1, 289.0);
         vec3 Pf0 = fract(P);
         vec3 Pf1 = Pf0 - vec3(1.0);
         vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
         vec4 iy = vec4(Pi0.yy, Pi1.yy);
         vec4 iz0 = Pi0.zzzz;
         vec4 iz1 = Pi1.zzzz;
         vec4 ixy = permute(permute(ix) + iy);
         vec4 ixy0 = permute(ixy + iz0);
         vec4 ixy1 = permute(ixy + iz1);
         vec4 gx0 = ixy0 / 7.0;
         vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
         gx0 = fract(gx0);
         vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
         vec4 sz0 = step(gz0, vec4(0.0));
         gx0 -= sz0 * (step(0.0, gx0) - 0.5);
         gy0 -= sz0 * (step(0.0, gy0) - 0.5);
         vec4 gx1 = ixy1 / 7.0;
         vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
         gx1 = fract(gx1);
         vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
         vec4 sz1 = step(gz1, vec4(0.0));
         gx1 -= sz1 * (step(0.0, gx1) - 0.5);
         gy1 -= sz1 * (step(0.0, gy1) - 0.5);
         vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
         vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
         vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
         vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
         vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
         vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
         vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
         vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
         vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
         g000 *= norm0.x;
         g010 *= norm0.y;
         g100 *= norm0.z;
         g110 *= norm0.w;
         vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
         g001 *= norm1.x;
         g011 *= norm1.y;
         g101 *= norm1.z;
         g111 *= norm1.w;
         float n000 = dot(g000, Pf0);
         float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
         float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
         float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
         float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
         float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
         float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
         float n111 = dot(g111, Pf1);
         vec3 fade_xyz = fade(Pf0);
         vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
         vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
         float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
         return 2.2 * n_xyz;
       }`, [this.permute, this.taylorInvSqrt, this.fade]);


        this.simplex = this.simplex3d;
        this.simplexFractal = this.simplex3dFractal;

    }
}