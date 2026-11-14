// KISWA — shaders GLSL (tout est procédural : aucune image externe)

export const COMMON = /* glsl */ `
#define NSB 4
uniform vec3 uSbC[NSB];
uniform vec3 uSbW[NSB];
uniform vec3 uSbT[NSB];
uniform vec3 uWash;
uniform vec3 uLobe;
uniform vec2 uGlowAz;
uniform float uLobeEl;
uniform vec3 uFrontDir;
uniform float uFront;
uniform float uAmb;
uniform vec3 uFogCol;
uniform float uFogStart;
uniform float uFogDen;
uniform float uTime;

float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec3 hash32(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*f*(f*(f*6.-15.)+10.);
  return mix(mix(hash12(i), hash12(i+vec2(1.,0.)), u.x),
             mix(hash12(i+vec2(0.,1.)), hash12(i+vec2(1.,1.)), u.x), u.y);
}

// Ligne de front de la coulée : z = f(x). La résine couvre z < f(x).
float frontZ(float x, float base, float seed){
  float ev = base * 0.55 + seed * 3.7;
  float a = vnoise(vec2(x*1.05 + seed*11.3, ev)) - .5;
  float b = vnoise(vec2(x*2.9 + seed*5.1 + 7., ev*1.7 + 3.)) - .5;
  float c = vnoise(vec2(x*7.7 + seed*2.3 + 13., ev*2.6 + 9.)) - .5;
  float bx = x - 0.15;
  float bow = 0.085 * min(bx*bx, 2.2);
  return base + 0.40*a + 0.17*b + 0.045*c - bow;
}

// Profil du bord (ménisque) : hauteur de résine à la distance d derrière le front.
float resinH(float d, float T, float W, float decay){
  float s = clamp(d / W, 0., 1.);
  float q = 1. - s;
  float p = sqrt(max(1. - q*q*abs(q), 0.));
  float lip = 0.08 * exp(-pow((d - 1.9*W) / (1.5*W), 2.));
  float h = T * (p + lip);
  h *= mix(1., 0.07, smoothstep(0.35, 2.2, d) * decay);
  return h;
}

vec3 toLin(vec3 c){ return pow(c, vec3(2.2)); }

vec3 tonemap(vec3 c){
  c = max(c, 0.);
  vec3 x = max(c - 0.72, 0.);
  return min(c, 0.72) + 0.28 * (1. - exp(-x * (1./0.28)));
}
vec3 display(vec3 c){ return pow(tonemap(c), vec3(1./2.2)); }

// Studio : pièce sombre, lumière diffuse sans aucun bord net.
//  - uWash : lueur chaude au ras de l'horizon (visible surtout en angle rasant, via le fresnel)
//  - uLobe : grande boîte à lumière très douce, basse, en partie hors cadre
//  - uFront : lumière d'accroche, côté avant, vue seulement par le bord incliné de la coulée
float azGlow(vec3 d){
  vec2 h = d.xz * inversesqrt(max(dot(d.xz, d.xz), 1e-6));
  float c = dot(h, uGlowAz) * 0.5 + 0.5;
  return 0.26 + 0.74 * c * c * c;
}
vec3 studioEnv(vec3 P, vec3 R, float soft, vec3 bounce){
  float up = R.y;
  float e = max(up, 0.);
  vec2 h = R.xz * inversesqrt(max(dot(R.xz, R.xz), 1e-6));
  float az = azGlow(R);
  vec3 col = vec3(0.010, 0.010, 0.011);
  // la lueur culmine juste sous l'horizon et se fond dans la ligne d'horizon (pas d'arête)
  col += uWash * az * (0.85 * exp(-e / (0.085 + soft)) * (1. - 0.9 * exp(-e / 0.020)) + 0.15 * exp(-e / 0.42));
  float le = (up - uLobeEl) / (0.115 + soft);
  col += uLobe * exp(-0.5 * le * le) * exp(-(1. - dot(h, uGlowAz)) / 0.10);
  col += vec3(uFront) * exp(-(1. - dot(R, uFrontDir)) / 0.035);
  return mix(bounce, col, smoothstep(-0.08, 0.05, up));
}

// fond du studio : noir, avec une lueur très basse sur la ligne d'horizon
vec3 skyCol(vec3 d){
  return uFogCol + uWash * 0.085 * exp(-abs(d.y) / 0.030) * azGlow(d);
}

// Éclairage diffus : mêmes boîtes, normalisé pour valoir 1 à l'origine, normale vers le haut.
vec3 studioDiffuse(vec3 P, vec3 N){
  vec3 sum = vec3(uAmb);
  for (int i = 0; i < NSB; i++){
    vec3 L = uSbC[i] - P;
    float d2 = dot(L, L);
    L *= inversesqrt(d2);
    float g = max(dot(N, L), 0.) * min(uSbW[i].z / d2, 2.5);
    sum += uSbW[i].y * g * uSbT[i];
  }
  return sum;
}

vec3 applyFog(vec3 col, vec3 P){
  float dist = length(cameraPosition - P);
  float f = 1. - exp(-pow(max(dist - uFogStart, 0.) * uFogDen, 2.));
  return mix(col, skyCol((P - cameraPosition) / dist), f);
}
`;

// ---------------------------------------------------------------------------
// Cuisson des textures (une fois, au démarrage)
// ---------------------------------------------------------------------------

export const BAKE_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }
`;

const BAKE_NOISE = /* glsl */ `
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
vec3 hash32(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yzz) * p3.zyx);
}
vec2 pgrad(vec2 i, vec2 per, float seed){
  float a = hash12(mod(i, per) + seed * vec2(37., 17.)) * 6.2831853;
  return vec2(cos(a), sin(a));
}
// bruit de gradient périodique, ~[0,1]
float pnoise(vec2 p, vec2 per, float seed){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*f*(f*(f*6.-15.)+10.);
  float a = dot(pgrad(i, per, seed), f);
  float b = dot(pgrad(i + vec2(1.,0.), per, seed), f - vec2(1.,0.));
  float c = dot(pgrad(i + vec2(0.,1.), per, seed), f - vec2(0.,1.));
  float d = dot(pgrad(i + vec2(1.,1.), per, seed), f - vec2(1.,1.));
  return 0.5 + 0.72 * mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float pfbm(vec2 uv, float per, float seed){
  float s = 0., a = 0.5, n = 0.;
  for (int o = 0; o < 6; o++){
    s += a * pnoise(uv * per, vec2(per), seed + float(o));
    n += a; a *= 0.5; per *= 2.;
  }
  return s / n;
}
float pfbmN(vec2 uv, float per, float seed, int oct){
  float s = 0., a = 0.5, n = 0.;
  for (int o = 0; o < oct; o++){
    s += a * pnoise(uv * per, vec2(per), seed + float(o));
    n += a; a *= 0.5; per *= 2.;
  }
  return s / n;
}
float pfbm3(vec2 uv, float per, float seed){
  float s = 0., a = 0.5, n = 0.;
  for (int o = 0; o < 3; o++){
    s += a * pnoise(uv * per, vec2(per), seed + float(o));
    n += a; a *= 0.5; per *= 2.;
  }
  return s / n;
}
`;

// Béton — passe 1 : rgb = albédo (sRGB), a = hauteur
export const BAKE_CONCRETE_A = /* glsl */ `
varying vec2 vUv;
uniform vec3 uBaseCol;
${BAKE_NOISE}
float pores(vec2 uv, float cells, float prob, float rmin, float rmax, float seed){
  vec2 g = uv * cells; vec2 id = floor(g); float m = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 c = id + vec2(float(i), float(j));
    vec2 cw = mod(c, cells) + seed;
    vec3 r = hash32(cw);
    if (r.z < prob){
      vec2 o = c + 0.2 + 0.6 * r.xy;
      float rad = mix(rmin, rmax, pow(hash12(cw + 5.3), 2.5)) * cells;
      vec2 dv = g - o;
      float ang = r.x * 6.2831;
      dv = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * dv;
      dv *= vec2(1., 0.72 + 0.5 * r.y);
      float wob = 1. + 0.25 * sin(atan(dv.y, dv.x) * 3. + r.z * 40.);
      float dd = length(dv) / (rad * wob);
      m = max(m, 1. - smoothstep(0.55, 1.0, dd));
    }
  }
  return m;
}
// granulats affleurant sous la peau de ciment : (masque, ton)
vec2 aggr(vec2 uv, float cells, float prob, float seed){
  vec2 g = uv * cells; vec2 id = floor(g); vec2 res = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 c = id + vec2(float(i), float(j));
    vec2 cw = mod(c, cells) + seed;
    vec3 r = hash32(cw);
    if (r.z < prob){
      vec2 dv = g - (c + 0.25 + 0.5 * r.xy);
      float ang = r.y * 6.2831;
      dv = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * dv;
      dv *= vec2(1., 0.62 + 0.6 * r.x);
      float rad = 0.15 + 0.23 * hash12(cw + 1.7);
      float wob = 1. + 0.20 * sin(atan(dv.y, dv.x) * 4. + r.x * 30.);
      float m = 1. - smoothstep(0.72, 1.0, length(dv) / (rad * wob));
      if (m > res.x) res = vec2(m, hash12(cw + 9.3));
    }
  }
  return res;
}
void main(){
  vec2 uv = vUv;
  vec2 w = vec2(pfbm3(uv, 2., 11.), pfbm3(uv, 2., 23.)) - 0.5;
  float cloud = pfbm(uv + 0.22 * w, 3., 1.);
  float cloud2 = pfbm(uv + 0.10 * w, 9., 31.);
  float grain = pfbm3(uv, 150., 3.);
  float fine = pnoise(uv * 512., vec2(512.), 7.);
  float streak = pnoise(vec2(uv.x * 5. + w.y * 3., uv.y * 70.), vec2(5., 70.), 13.);
  float streak2 = pnoise(vec2(uv.x * 110., uv.y * 9. + w.x * 2.), vec2(110., 9.), 17.);
  float stain = smoothstep(0.56, 0.70, pfbm(uv + 0.15 * w + 0.31, 2., 41.));
  float light = smoothstep(0.60, 0.78, pfbm(uv - 0.2 * w + 0.57, 4., 53.));
  float clus = 0.35 + 1.4 * smoothstep(0.36, 0.70, pfbm3(uv + 0.1 * w, 5., 61.));
  float p1 = pores(uv, 150., 0.34 * clus, 0.0004, 0.0011, 1.);
  float p2 = pores(uv, 44., 0.22 * clus, 0.0009, 0.0024, 2.);
  float p3 = pores(uv, 11., 0.17 * clus, 0.0020, 0.0046, 3.);
  float pore = max(p1 * 0.8, max(p2 * 0.95, p3));
  vec2 a1 = aggr(uv, 64., 0.24, 5.);
  vec2 a2 = aggr(uv + 0.43, 140., 0.34, 9.);
  float agg = a1.x * (a1.y - 0.55) * 0.20 + a2.x * (a2.y - 0.5) * 0.16;
  vec3 sp = hash32(floor(uv * 1024.) + 3.);
  float speck = (sp.x < 0.085 ? -0.05 - 0.13 * sp.y : 0.) + (sp.x > 0.955 ? 0.08 * sp.z : 0.);

  float tone = 1.0
    + 0.080 * (cloud - 0.5) * 2.
    + 0.050 * (cloud2 - 0.5) * 2.
    + 0.095 * (grain - 0.5) * 2.
    + 0.075 * (fine - 0.5) * 2.
    + 0.030 * (streak - 0.5) * 2.
    + 0.022 * (streak2 - 0.5) * 2.
    - 0.040 * stain
    + 0.020 * light
    + agg
    + speck * 0.7;
  vec3 tint = mix(vec3(1.012, 1.0, 0.982), vec3(0.990, 1.0, 1.012), cloud2);
  vec3 lin = pow(uBaseCol, vec3(2.2)) * tone * tint;
  lin *= 1. - 0.72 * pore;
  lin = mix(lin, lin * vec3(0.93, 0.90, 0.86), stain * 0.5);

  float h = 0.5 + 0.36 * (grain - 0.5) + 0.16 * (fine - 0.5) + 0.10 * (cloud2 - 0.5)
          + 0.05 * (streak - 0.5) - 0.55 * pore + speck * 0.2 + (a1.x + a2.x * 0.6) * 0.035;
  gl_FragColor = vec4(pow(clamp(lin, 0., 1.), vec3(1./2.2)), clamp(h, 0., 1.));
}
`;

// Béton — passe 2 : rg = normale, b = cavité, a = modulation très large
export const BAKE_CONCRETE_B = /* glsl */ `
varying vec2 vUv;
uniform sampler2D tSrc;
uniform float uTexel;
${BAKE_NOISE}
void main(){
  float e = uTexel;
  float hl = texture2D(tSrc, vUv - vec2(e, 0.)).a;
  float hr = texture2D(tSrc, vUv + vec2(e, 0.)).a;
  float hd = texture2D(tSrc, vUv - vec2(0., e)).a;
  float hu = texture2D(tSrc, vUv + vec2(0., e)).a;
  float hc = texture2D(tSrc, vUv).a;
  float avg = 0.;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++)
    avg += texture2D(tSrc, vUv + vec2(float(i), float(j)) * e * 1.5).a;
  avg /= 25.;
  float cav = clamp(1. + (hc - avg) * 2.6, 0., 1.);
  vec2 n = vec2(hl - hr, hd - hu) * 2.2;
  float macro = pfbm(vUv, 2., 77.);
  gl_FragColor = vec4(clamp(n * 0.5 + 0.5, 0., 1.), cav, macro);
}
`;

// Métallisée — passe 1 : r = champ principal, g = champ secondaire, b = filaments, a = marbrure fine
export const BAKE_METAL_A = /* glsl */ `
varying vec2 vUv;
${BAKE_NOISE}
void main(){
  vec2 p = vUv;
  vec2 q = vec2(pfbm(p, 2., 1.), pfbm(p, 2., 9.)) - 0.5;
  vec2 r = vec2(pfbm(p + 0.95 * q, 3., 3.), pfbm(p + 0.95 * q, 3., 15.)) - 0.5;
  vec2 pw = p + 1.25 * r + 0.25 * q;
  float f = pfbmN(pw, 2., 5., 3);
  f = smoothstep(0.28, 0.72, f);
  float g = pfbm(p + 0.8 * r - 0.4 * q, 4., 21.);
  g = smoothstep(0.28, 0.72, g);
  float v1 = pfbm(pw + 0.07 * q, 3., 33.);
  float ridge = 1. - abs(2. * v1 - 1.);
  float veins = pow(ridge, 8.);
  float v2 = pfbm(pw + 0.35, 7., 47.);
  float ridge2 = 1. - abs(2. * v2 - 1.);
  veins = max(veins, pow(ridge2, 14.) * 0.6);
  float cells = fract(f * 4. + g * 1.5);
  float lace = smoothstep(0.93, 1.0, cells) + smoothstep(0.05, 0.0, cells);
  veins = max(veins, lace * 0.45 * smoothstep(0.25, 0.65, g));
  float marb = pfbm(pw * 2.0 + r, 12., 61.);
  gl_FragColor = vec4(f, g, clamp(veins, 0., 1.), marb);
}
`;

// Métallisée — passe 2 : rg = gradient du champ principal, ba = gradient de la marbrure
export const BAKE_METAL_B = /* glsl */ `
varying vec2 vUv;
uniform sampler2D tSrc;
uniform float uTexel;
${BAKE_NOISE}
void main(){
  float e = uTexel * 2.5;
  float l = texture2D(tSrc, vUv - vec2(e, 0.)).r;
  float r = texture2D(tSrc, vUv + vec2(e, 0.)).r;
  float d = texture2D(tSrc, vUv - vec2(0., e)).r;
  float u = texture2D(tSrc, vUv + vec2(0., e)).r;
  vec2 g1 = vec2(r - l, u - d) * 6.;
  vec2 w = vec2(pfbm3(vUv, 3., 5.), pfbm3(vUv, 3., 19.)) - 0.5;
  float marb = pfbm(vUv + 0.5 * w, 14., 61.);
  gl_FragColor = vec4(clamp(g1 * 0.5 + 0.5, 0., 1.), marb, 1.);
}
`;

// Flakes : rgb = albédo (sRGB), a = identifiant d'éclat (inclinaison)
export const BAKE_FLAKES = /* glsl */ `
varying vec2 vUv;
uniform vec3 uBaseCol;
${BAKE_NOISE}
vec3 chipColor(float h){
  if (h < 0.20) return vec3(0.93, 0.92, 0.89);
  if (h < 0.38) return vec3(0.73, 0.73, 0.72);
  if (h < 0.55) return vec3(0.47, 0.48, 0.49);
  if (h < 0.70) return vec3(0.20, 0.21, 0.22);
  if (h < 0.82) return vec3(0.055, 0.055, 0.06);
  if (h < 0.92) return vec3(0.78, 0.70, 0.58);
  if (h < 0.97) return vec3(0.557, 0.322, 0.188);
  return vec3(0.784, 0.655, 0.412);
}
// renvoie (masque, identifiant, distance au bord)
vec3 chips(vec2 uv, float cells, float seed, float density){
  vec2 g = uv * cells; vec2 ip = floor(g); vec2 fp = fract(g);
  vec2 mg = vec2(0.), mr = vec2(0.); float md = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
    vec2 b = vec2(float(i), float(j));
    vec2 o = hash22(mod(ip + b, cells) + seed);
    vec2 r = b + o - fp;
    float d = dot(r, r);
    if (d < md){ md = d; mr = r; mg = b; }
  }
  float bd = 8.;
  for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++){
    vec2 b = mg + vec2(float(i), float(j));
    vec2 o = hash22(mod(ip + b, cells) + seed);
    vec2 r = b + o - fp;
    if (dot(mr - r, mr - r) > 0.00001)
      bd = min(bd, dot(0.5 * (mr + r), normalize(r - mr)));
  }
  vec2 id = mod(ip + mg, cells) + seed;
  float h = hash12(id + 0.71);
  float present = step(h, density);
  float gap = 0.03 + 0.20 * hash12(id + 2.9);
  float m = smoothstep(gap, gap + 0.035, bd) * present;
  return vec3(m, hash12(id + 9.1), bd);
}
void main(){
  vec2 uv = vUv;
  vec3 col = uBaseCol * (0.92 + 0.16 * pfbm3(uv, 6., 3.));
  float tilt = 0.5;
  vec3 c0 = chips(uv, 96., 3., 0.80);
  col = mix(col, chipColor(c0.y), c0.x); tilt = mix(tilt, hash12(vec2(c0.y * 91., 3.)), c0.x);
  vec3 c1 = chips(uv + 0.37, 58., 11., 0.66);
  col = mix(col, chipColor(fract(c1.y * 7.31)), c1.x); tilt = mix(tilt, hash12(vec2(c1.y * 57., 5.)), c1.x);
  vec3 c2 = chips(uv + 0.71, 34., 23., 0.46);
  col = mix(col, chipColor(fract(c2.y * 3.77)), c2.x); tilt = mix(tilt, hash12(vec2(c2.y * 33., 7.)), c2.x);
  vec3 c3 = chips(uv + 0.13, 21., 37., 0.22);
  col = mix(col, chipColor(fract(c3.y * 5.13)), c3.x); tilt = mix(tilt, hash12(vec2(c3.y * 21., 9.)), c3.x);
  gl_FragColor = vec4(clamp(col, 0., 1.), tilt);
}
`;

// ---------------------------------------------------------------------------
// Béton (dalle) — sert aussi pour le primaire (uMode = 1)
// ---------------------------------------------------------------------------

export const WORLD_VERT = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;

export const CONCRETE_FRAG = /* glsl */ `
varying vec3 vWorld;
uniform sampler2D tConA;
uniform sampler2D tConB;
uniform float uMode;
uniform float uBaseA;
uniform float uSeedA;
uniform float uT;
uniform float uFrontOn;
uniform vec2 uUpper;
uniform float uGap;
uniform float uUpperOn;
${COMMON}
void main(){
  vec3 P = vWorld;
  vec2 uv = P.xz;
  vec4 A = texture2D(tConA, uv);
  vec4 B = texture2D(tConB, uv);
  vec2 uv2 = mat2(0.819, -0.574, 0.574, 0.819) * uv * 0.157 + 0.37;
  float macro = texture2D(tConB, uv2).a;
  float dist = length(cameraPosition - P);
  float nearK = 1. - smoothstep(1.2, 4.0, dist);
  vec2 dn = (texture2D(tConB, uv * 3.7 + 0.5).rg - 0.5) * nearK;
  vec3 dA = texture2D(tConA, uv * 3.7 + 0.5).rgb;

  vec3 alb = toLin(A.rgb);
  alb *= 1. + 0.07 * (macro - 0.5);
  alb *= 1. + 0.5 * nearK * (dA.g - 0.82);

  vec2 n2 = (B.rg - 0.5) * 1.5 + dn * 0.6;
  vec3 N = normalize(vec3(n2.x, 1., n2.y));
  vec3 li = studioDiffuse(P, N);
  vec3 col = alb * li * mix(1., B.b, 0.55);

  if (uMode > 0.5){
    // primaire : béton imprégné, plus sombre, satiné
    col = alb * vec3(0.50, 0.455, 0.40) * li;
    vec3 V = normalize(cameraPosition - P);
    vec3 Ns = normalize(vec3(n2.x * 0.25, 1., n2.y * 0.25));
    float F = 0.04 + 0.96 * pow(1. - max(dot(Ns, V), 0.), 5.);
    vec3 R = reflect(-V, Ns);
    col = col * (1. - F) + studioEnv(P, R, 0.10, vec3(0.02)) * F * 0.55;
  }

  if (uFrontOn > 0.5){
    float fa = frontZ(P.x, uBaseA, uSeedA);
    float fp = (frontZ(P.x + 0.012, uBaseA, uSeedA) - fa) / 0.012;
    float ahead = max((P.z - fa) * inversesqrt(1. + fp * fp), 0.);
    float ao = 1. - 0.66 * exp(-ahead / (0.45 * uT));
    float castSh = 1. - 0.46 * pow(1. - smoothstep(0., 2.6 * uT, ahead), 1.6);
    float wet = 1. - 0.10 * exp(-ahead / 0.0035);
    float farSh = 1. - 0.06 * exp(-ahead / 0.09);
    col *= ao * castSh * wet * farSh;
  }
  if (uUpperOn > 0.5){
    float di = min(uUpper.x - P.x, uUpper.y - P.z);
    float pen = max(uGap * 1.5, 0.012);
    col *= 1. - 0.78 * smoothstep(-0.004, pen, di);
  }
  col = applyFog(col, P);
  gl_FragColor = vec4(display(col), 1.);
}
`;

// ---------------------------------------------------------------------------
// Résine (ruban verrouillé sur le front de coulée)
// ---------------------------------------------------------------------------

export const RESIN_VERT = /* glsl */ `
uniform float uBase;
uniform float uSeed;
uniform float uY;
uniform float uT;
uniform float uW;
uniform float uDecay;
uniform float uLimitBase;
uniform float uLimitSeed;
uniform float uLimitOn;
varying vec3 vWorld;
varying float vD;
varying vec2 vGrad;
${COMMON}
float fr(float x){
  float f = frontZ(x, uBase, uSeed);
  if (uLimitOn > 0.5) f = min(f, frontZ(x, uLimitBase, uLimitSeed) - 0.03);
  return f;
}
void main(){
  float x = position.x;
  float d = position.y;
  float f0 = fr(x);
  float e = 0.012;
  float fp = (fr(x + e) - fr(x - e)) / (2. * e);
  float k = sqrt(1. + fp * fp);
  float z = f0 - d * k;
  float h = resinH(d, uT, uW, uDecay);
  vec3 w = vec3(x, uY + h - 0.0004, z);
  vWorld = w;
  vD = d;
  vGrad = vec2(fp, -1.) / k;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`;

export const RESIN_FUNCS = /* glsl */ `
uniform sampler2D tMetA;
uniform sampler2D tMetB;
uniform sampler2D tFlake;
uniform vec3 uColBlack;
uniform vec3 uColGold;
uniform vec3 uColCopper;
uniform vec3 uColMet;
uniform vec3 uColMono;
float gFoot;

vec2 ripple(vec2 p, float t){
  vec2 w = vec2(0.);
  w += vec2(0.80, 0.60) * cos(dot(p, vec2(0.80, 0.60)) * 13. + t * 0.31 + 0.3);
  w += vec2(-0.45, 0.89) * cos(dot(p, vec2(-0.45, 0.89)) * 21. - t * 0.23 + 1.7) * 0.7;
  w += vec2(0.96, -0.28) * cos(dot(p, vec2(0.96, -0.28)) * 34. + t * 0.17 + 4.1) * 0.45;
  w += vec2(0.20, 0.98) * cos(dot(p, vec2(0.20, 0.98)) * 55. - t * 0.11 + 2.6) * 0.25;
  return w;
}

// pigments nacrés : lobe diffus (kd) + lobe spéculaire (ks) orientés par l'écoulement
vec3 metalLight(vec3 P, vec3 Np, vec3 V, float shin, float kd, float ks){
  vec3 sum = vec3(0.);
  for (int i = 0; i < NSB; i++){
    vec3 L = uSbC[i] - P;
    float d2 = dot(L, L);
    L *= inversesqrt(d2);
    vec3 H = normalize(L + V);
    float w = uSbW[i].y * min(uSbW[i].z / d2, 2.5);
    sum += uSbT[i] * w * (kd * max(dot(Np, L), 0.) + ks * pow(max(dot(Np, H), 0.), shin));
  }
  return sum;
}

float sparkle(vec3 P, vec3 N, vec3 V, float cell, float seed){
  vec2 g = P.xz / cell + seed;
  vec2 id = floor(g);
  vec2 f = fract(g) - 0.5;
  vec3 r = hash32(id);
  float dd = length(f - (r.xy - 0.5) * 0.55);
  float size = 0.16 + 0.22 * r.z;
  vec3 fn = normalize(N + vec3(r.x - 0.5, 0., r.y - 0.5) * 1.1);
  float s = 0.;
  for (int i = 0; i < 2; i++){
    vec3 H = normalize(normalize(uSbC[i] - P) + V);
    s += pow(max(dot(fn, H), 0.), 140.);
  }
  float fade = 1. - smoothstep(cell * 0.45, cell * 1.3, gFoot);
  return smoothstep(size, size * 0.35, dd) * s * fade * step(0.45, r.z);
}

// couleur « sous la surface » d'une finition (0 noir bronze, 1 métallisée, 2 flakes, 3 monochrome)
vec3 finishColor(float fin, vec3 P, vec3 N, vec3 V){
  vec2 par = V.xz / max(V.y, 0.30);
  vec3 under;
  if (fin < 0.5){
    vec2 u1 = (P.xz - par * 0.003) / 1.9;
    vec4 m1 = texture2D(tMetA, u1);
    vec4 g1 = texture2D(tMetB, u1, 1.0);
    vec4 m2 = texture2D(tMetA, (P.xz - par * 0.013) / 1.3 + 0.37);
    float river = smoothstep(0.50, 0.86, m1.g);
    float veins = smoothstep(0.55, 0.95, m1.b) * (0.14 + 0.86 * river);
    float veins2 = smoothstep(0.62, 0.97, m2.b) * river * 0.28;
    float smoke = river * smoothstep(0.45, 1.0, m1.r);
    vec3 Np = normalize(N + vec3(g1.r - 0.5, 0., g1.g - 0.5) * 0.7);
    vec3 ml = metalLight(P, Np, V, 14., 0.45, 0.9);
    vec3 gold = mix(uColCopper * 1.2, uColGold * 1.05, smoothstep(0.3, 0.8, m1.a));
    float amt = veins + veins2 + smoke * smoke * 0.045;
    under = uColBlack + gold * (0.26 + 1.7 * ml) * amt;
    under += gold * sparkle(P, N, V, 0.0021, 3.) * amt * 4.;
  } else if (fin < 1.5){
    // pigments métalliques en suspension, étirés dans le sens de la coulée
    mat2 rot = mat2(0.906, -0.423, 0.423, 0.906);
    vec2 q = rot * P.xz;
    vec2 qp = rot * par;
    vec2 u1 = (q - qp * 0.002) * vec2(1. / 2.4, 1. / 1.05) + 0.5;
    vec4 m1 = texture2D(tMetA, u1);
    vec4 g1 = texture2D(tMetB, u1, 0.5);
    vec4 m2 = texture2D(tMetA, (q - qp * 0.012) * vec2(1. / 3.9, 1. / 1.7) + 0.11, 0.5);
    float dens = m1.r * 0.58 + (m1.a - 0.5) * 0.62 + (m2.r - 0.5) * 0.26 + (g1.b - 0.5) * 0.22;
    dens = smoothstep(0.16, 0.90, dens);
    float hue = m1.g * 0.65 + m2.g * 0.35;
    vec3 metal = mix(uColCopper, uColMet, smoothstep(0.15, 0.62, hue));
    metal = mix(metal, uColGold, smoothstep(0.66, 0.98, hue) * 0.42);
    metal *= vec3(0.95, 0.99, 1.06);
    vec3 deepC = uColCopper * 0.075;
    vec3 c = mix(deepC, metal, pow(dens, 1.4));
    c = mix(c, vec3(0.62, 0.52, 0.40), smoothstep(0.4, 1.0, m1.b) * 0.20 * dens);
    c *= 1. - 0.34 * smoothstep(0.3, 1.0, m2.b);
    vec2 gw = (vec2(g1.r, g1.g) - 0.5) * vec2(0.45, 1.0) * rot;
    vec3 Np = normalize(N + vec3(gw.x, 0., gw.y) * 1.0);
    vec3 Ns = normalize(N + vec3(gw.x, 0., gw.y) * 2.1);
    vec3 ml = metalLight(P, Np, V, 7., 0.45, 0.75);
    vec3 nacre = metalLight(P, Ns, V, 42., 0., 1.0);
    under = c * (0.27 + 0.82 * ml) + vec3(0.80, 0.70, 0.56) * nacre * dens * (0.30 + 0.70 * m1.a);
    float sp = sparkle(P, N, V, 0.0019, 1.) + 0.6 * sparkle(P, N, V, 0.0034, 7.);
    under += vec3(0.88, 0.80, 0.66) * sp * 1.6 * (0.3 + 0.7 * dens);
  } else if (fin < 2.5){
    vec4 fl = texture2D(tFlake, (P.xz - par * 0.0012) / 0.46);
    float th = fl.a * 37.7;
    vec3 Nc = normalize(N + vec3(cos(th), 0., sin(th)) * 0.16);
    vec3 alb = toLin(fl.rgb);
    under = alb * studioDiffuse(P, Nc) * 0.96;
  } else {
    under = uColMono * 0.92 * studioDiffuse(P, N);
  }
  return under;
}
`;

export const RESIN_FRAG = /* glsl */ `
varying vec3 vWorld;
varying float vD;
varying vec2 vGrad;
uniform float uFinish;
uniform float uT;
uniform float uW;
uniform float uDecay;
uniform vec2 uClip;
uniform vec2 uCoat;
uniform float uSatin;
uniform vec3 uBounce;
uniform float uPourOn;
uniform float uBaseB;
uniform float uSeedB;
uniform float uTB;
uniform vec3 uRimCol;
${COMMON}
${RESIN_FUNCS}
void main(){
  vec3 P = vWorld;
  if (P.x > uClip.x || P.z > uClip.y) discard;
  float d = vD;
  float h0 = resinH(d, uT, uW, uDecay);
  float h1 = resinH(d + 0.0004, uT, uW, uDecay);
  float hp = (h1 - h0) / 0.0004;
  vec3 N = normalize(vec3(-hp * vGrad.x, 1., -hp * vGrad.y));
  float flow = exp(-d / 0.30);
  vec2 rp = ripple(P.xz, uTime) * (0.0050 + 0.016 * flow);
  N = normalize(N + vec3(rp.x, 0., rp.y));

  vec3 V = normalize(cameraPosition - P);
  float NdV = max(dot(N, V), 0.);
  gFoot = length(fwidth(vWorld.xz));
  vec3 under = finishColor(uFinish, P, N, V);

  // bord : la matière s'amincit, léger assombrissement au pied du ménisque
  float foot = smoothstep(0., uW * 0.9, d);
  under *= mix(0.55, 1., foot);

  // zone sans couche de finition (marche de la coupe) : satinée
  float satin = max(uSatin, step(uCoat.x, P.x));
  satin = max(satin, step(uCoat.y, P.z));

  vec3 R = reflect(-V, N);
  vec3 refl = studioEnv(P, R, mix(0.0, 0.075, satin), uBounce * (1. - foot * 0.7));
  float F = 0.045 + 0.955 * pow(1. - NdV, 5.);
  F *= mix(1., 0.62, satin);

  if (uPourOn > 0.5){
    float fb = frontZ(P.x, uBaseB, uSeedB);
    float fpb = (frontZ(P.x + 0.012, uBaseB, uSeedB) - fb) / 0.012;
    float kb = inversesqrt(1. + fpb * fpb);
    float ahead = (P.z - fb) * kb;
    if (ahead > -0.02 && ahead < 0.6){
      float a = max(ahead, 0.);
      vec2 nf = vec2(-fpb, 1.) * kb;
      float toward = -dot(R.xz, nf);
      if (toward > 0.0005){
        float hit = a * R.y / toward;
        float m = 1. - smoothstep(uTB * 0.82, uTB * 1.02, hit);
        float band = hit / uTB;
        vec3 Pr = P + R * (a / toward);
        vec3 Vr = normalize(cameraPosition * vec3(1., -1., 1.) - Pr);
        vec3 Nr = normalize(vec3(nf.x * (1. - band), 0.35 + band, nf.y * (1. - band)));
        vec3 rimUnder = uRimCol * studioDiffuse(Pr, Nr) * (0.45 + 0.55 * band);
        vec3 Rr = reflect(-Vr, Nr);
        float Fr = 0.045 + 0.955 * pow(1. - max(dot(Nr, Vr), 0.), 5.);
        vec3 rim = rimUnder * (1. - Fr) + studioEnv(Pr, Rr, 0.02, uColBlack) * Fr;
        refl = mix(refl, rim, m);
      }
      under *= 1. - 0.55 * exp(-a / (0.5 * uTB));
    }
  }

  vec3 col = under * (1. - F) + refl * F;
  col = applyFog(col, P);
  gl_FragColor = vec4(display(col), 1.);
}
`;

// ---------------------------------------------------------------------------
// Tranches des couches (vue en coupe)
// ---------------------------------------------------------------------------

export const SECTION_FRAG = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
uniform float uKind;
uniform float uY0;
uniform float uH;
uniform vec3 uColBlack;
uniform vec3 uColGold;
uniform vec3 uColCopper;
uniform vec3 uConcrete;
${COMMON}
void main(){
  vec3 P = vWorld;
  vec3 N = normalize(vN);
  float along = abs(N.x) > 0.5 ? P.z : P.x;
  float v = clamp((P.y - uY0) / max(uH, 0.0001), 0., 1.);
  vec3 li = studioDiffuse(P, N) * 0.9 + 0.25;
  vec3 V = normalize(cameraPosition - P);
  vec3 R = reflect(-V, N);
  float F = 0.045 + 0.955 * pow(1. - max(dot(N, V), 0.), 5.);
  vec3 col;
  if (uKind < 0.5){
    // béton en tranche : granulats noyés dans la pâte de ciment
    vec2 g = vec2(along, P.y) / 0.0105;
    vec2 ip = floor(g), fp = fract(g);
    float md = 8., md2 = 8.; vec2 mid = vec2(0.);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++){
      vec2 b = vec2(float(i), float(j));
      vec2 o = hash22(ip + b);
      float dd = length(b + o - fp);
      if (dd < md){ md2 = md; md = dd; mid = ip + b; } else if (dd < md2){ md2 = dd; }
    }
    float rnd = hash12(mid + 3.1);
    float stone = smoothstep(0.06, 0.14, md2 - md) * step(0.42, rnd) * smoothstep(0.50 + 0.2 * rnd, 0.30 + 0.2 * rnd, md);
    float gn = vnoise(vec2(along, P.y) * 220.) - 0.5;
    vec3 paste = toLin(uConcrete) * (0.74 + 0.16 * gn);
    vec3 stoneCol = toLin(mix(vec3(0.56, 0.55, 0.53), vec3(0.80, 0.78, 0.75), hash12(mid + 7.7)));
    stoneCol = mix(stoneCol, toLin(vec3(0.50, 0.45, 0.40)), step(0.90, rnd));
    col = mix(paste, stoneCol * (0.92 + 0.2 * gn), stone);
    col *= li * (0.74 + 0.26 * smoothstep(0., 0.35, v));
    col *= 1. - 0.25 * smoothstep(0.975, 1., v);
  } else if (uKind < 1.5){
    col = toLin(vec3(0.62, 0.50, 0.33)) * li * (0.75 + 0.25 * v);
    col = col * (1. - F) + studioEnv(P, R, 0.10, vec3(0.02)) * F * 0.6;
  } else if (uKind < 2.5){
    float lay = 0.5 + 0.5 * sin(v * 9. + vnoise(vec2(along * 9., 2.)) * 5.);
    col = uColBlack + mix(uColCopper, uColGold, lay) * 0.05 * (0.4 + 0.6 * lay) * li;
    col = col * (1. - F) + studioEnv(P, R, 0.03, vec3(0.02)) * F;
  } else {
    vec3 glass = vec3(0.60, 0.66, 0.63) * (0.32 + 0.5 * v);
    col = glass * li * 0.8;
    col = col * (1. - F) + studioEnv(P, R, 0.0, vec3(0.02)) * F;
  }
  col = applyFog(col, P);
  gl_FragColor = vec4(display(col), 1.);
}
`;

// Couche de finition : film transparent, miroir
export const COAT_FRAG = /* glsl */ `
varying vec3 vWorld;
uniform float uCoatOn;
${COMMON}
void main(){
  vec3 P = vWorld;
  vec2 w = vec2(0.80, 0.60) * cos(dot(P.xz, vec2(0.80, 0.60)) * 13. + 0.3)
         + vec2(-0.45, 0.89) * cos(dot(P.xz, vec2(-0.45, 0.89)) * 21. + 1.7) * 0.7;
  vec3 N = normalize(vec3(w.x * 0.003, 1., w.y * 0.003));
  vec3 V = normalize(cameraPosition - P);
  vec3 R = reflect(-V, N);
  float F = 0.045 + 0.955 * pow(1. - max(dot(N, V), 0.), 5.);
  vec3 refl = studioEnv(P, R, 0.0, vec3(0.02)) * F;
  float dist = length(cameraPosition - P);
  float fog = exp(-pow(max(dist - uFogStart, 0.) * uFogDen, 2.));
  float a = clamp(F * 0.9 + 0.035, 0., 1.) * uCoatOn * fog;
  gl_FragColor = vec4(display(refl) * uCoatOn * fog, a);
}
`;

// Sol du studio, sous la dalle
export const GROUND_FRAG = /* glsl */ `
varying vec3 vWorld;
uniform vec2 uCorner;
${COMMON}
void main(){
  vec3 P = vWorld;
  vec3 col = vec3(0.020, 0.020, 0.021) * studioDiffuse(P, vec3(0., 1., 0.));
  float dOut = length(max(vec2(P.x - uCorner.x, P.z - uCorner.y), 0.));
  col *= 1. - 0.8 * exp(-dOut / 0.16);
  col = applyFog(col, P);
  gl_FragColor = vec4(display(col), 1.);
}
`;

// Fond : cube centré sur la caméra
export const SKY_VERT = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = position;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
}
`;
export const SKY_FRAG = /* glsl */ `
varying vec3 vDir;
${COMMON}
void main(){
  gl_FragColor = vec4(display(skyCol(normalize(vDir))), 1.);
}
`;

// ---------------------------------------------------------------------------
// Signe K à l'ouverture : fût en béton, résine qui forme les bras, ligne d'or
// (décalque posé sur la dalle ; la grande coulée le recouvre au défilement)
// ---------------------------------------------------------------------------

export const K_FRAG = /* glsl */ `
varying vec3 vWorld;
uniform sampler2D tK;
uniform sampler2D tConA;
uniform sampler2D tConB;
uniform vec2 uKR;
uniform float uKS;
uniform float uKSpan;
uniform float uKTex;
uniform float uKHalf;
uniform vec2 uKLine;
uniform vec3 uKPh;
uniform float uKRad;
uniform float uKWob;
uniform float uKSw;
uniform float uKSheen;
uniform float uBaseA;
uniform float uSeedA;
uniform float uT;
uniform vec3 uBounce;
${COMMON}
${RESIN_FUNCS}
const float K_TF = 0.0060;   // hauteur du fût (m)
const float K_BF = 0.0034;   // chanfrein du fût
const float K_TR = 0.0075;   // épaisseur de la résine
const float K_WR = 0.0135;   // largeur du ménisque
const float K_TG = 0.0030;   // bombé de la ligne
vec3 fld(vec2 uv){ return texture2D(tK, uv).rgb; }
void over(inout vec4 acc, vec3 col, float c){
  acc = vec4(acc.rgb * (1. - c) + col * c, acc.a * (1. - c) + c);
}
void main(){
  vec3 P = vWorld;
  // dérivées et coordonnées de texture avant tout discard ou branchement
  gFoot = length(fwidth(P.xz));
  float aa = max(gFoot, 1e-5) * 0.75;
  float m3 = 3. * max(gFoot, 1e-5);        // marge : les pixels voisins prennent la même branche
  vec2 cuv = mat2(0.7986, 0.6018, -0.6018, 0.7986) * P.xz * 2.35 + vec2(0.13, 0.71);
  vec4 cA = texture2D(tConA, cuv);
  vec4 cB = texture2D(tConB, cuv);

  vec2 er = uKR, ed = vec2(-uKR.y, uKR.x);
  vec2 k = vec2(dot(P.xz, er), dot(P.xz, ed)) / uKS;
  vec2 uv = k / uKSpan + 0.5;
  if (uv.x < 0.006 || uv.y < 0.006 || uv.x > 0.994 || uv.y > 0.994) discard;
  vec3 S = fld(uv);
  if (min(S.r, min(S.g, S.b)) > 0.0565) discard;          // loin du signe : rien à dessiner

  // la grande coulée recouvre le signe
  float fa = frontZ(P.x, uBaseA, uSeedA);
  float fp = (frontZ(P.x + 0.012, uBaseA, uSeedA) - fa) / 0.012;
  float ahead = (P.z - fa) * inversesqrt(1. + fp * fp);
  if (ahead < -m3) discard;
  float cover = smoothstep(0., 0.003, ahead);
  float ah = max(ahead, 0.);
  float fsh = (1. - 0.66 * exp(-ah / (0.45 * uT)))
            * (1. - 0.46 * pow(1. - smoothstep(0., 2.6 * uT, ah), 1.6))
            * (1. - 0.10 * exp(-ah / 0.0035)) * (1. - 0.06 * exp(-ah / 0.09));

  float e = 1.5 * uKTex;
  vec3 Sx = fld(uv + vec2(e, 0.)) - fld(uv - vec2(e, 0.));
  vec3 Sy = fld(uv + vec2(0., e)) - fld(uv - vec2(0., e));
  float gs = 1. / (2. * e * uKSpan);
  vec2 gF = (Sx.r * er + Sy.r * ed) * gs;
  vec2 gB = (Sx.g * er + Sy.g * ed) * gs;
  vec2 gL = (Sx.b * er + Sy.b * ed) * gs;
  float sF = S.r * uKS, sB = S.g * uKS, sL = S.b * uKS;
  vec3 V = normalize(cameraPosition - P);
  float pF = uKPh.x, pP = uKPh.y, pG = uKPh.z;
  vec2 L0 = normalize(uSbC[0].xz - P.xz);                 // direction de la lumière principale, au sol

  // --- fût : bloc de béton brut qui se lève ---
  float cF = (1. - smoothstep(-aa, aa, sF)) * step(0.0005, pF);
  float HT = K_TF * pF;
  vec3 colF = vec3(0.);
  if (sF < m3 && pF > 0.0005){
    float t = clamp(-sF / K_BF, 0., 1.);
    float hF = HT * t * t * (3. - 2. * t);
    float hp = HT * 6. * t * (1. - t) / K_BF;
    vec2 n2 = (cB.rg - 0.5) * 2.4;
    vec3 N = normalize(vec3(hp * gF.x + n2.x, 1., hp * gF.y + n2.y));
    // grain du béton sans ses taches de couleur : on garde la luminance, à peine teintée
    vec3 a0 = toLin(cA.rgb);
    float lum = dot(a0, vec3(0.2126, 0.7152, 0.0722));
    vec3 alb = mix(vec3(lum), a0, 0.25) * mix(vec3(1.), vec3(0.56, 0.556, 0.548), pF);
    colF = alb * studioDiffuse(P + vec3(0., hF, 0.), N) * mix(1., cB.b, 0.75);
    // arête du chanfrein prise par la lumière
    vec2 gFn = gF * inversesqrt(max(dot(gF, gF), 1e-8));
    float edge = pow(4. * t * (1. - t), 2.) * (1. - t * 0.3);
    colF += vec3(0.95, 0.93, 0.89) * 0.16 * edge * max(dot(-gFn, -L0) * 0.5 + 0.5, 0.) * pF;
    // lumière rasante qui balaie le fût pendant qu'il se lève
    float sw = dot(k, vec2(0.62, 0.78));
    float band = exp(-pow((sw - mix(-0.62, 0.30, uKSw)) / 0.075, 2.)) * sin(3.14159 * uKSw);
    colF += alb * band * 0.85;
  }

  // --- résine : part de la ligne et forme les deux bras ---
  float onR = step(0.0005, pP);
  float wob = (vnoise(P.xz * 13. + 3.7) - .5) * 2. + (vnoise(P.xz * 29. + 9.1) - .5) * 0.45;
  float dFront = (uKRad + wob * uKWob - S.b - uKHalf) * uKS;
  float dR = min(-sB, dFront);
  vec2 gR = (-sB < dFront) ? -gB : -gL;
  float cR = smoothstep(-aa, aa, dR) * onR;
  vec3 colR = vec3(0.);
  if (dR > -m3 && pP > 0.0005){
    float d = max(dR, 0.);
    float h0 = resinH(d, K_TR, K_WR, 0.);
    float hp = (resinH(d + 0.0003, K_TR, K_WR, 0.) - h0) / 0.0003;
    vec3 N = normalize(vec3(-hp * gR.x, 1., -hp * gR.y));
    float flow = (1. - smoothstep(0.85, 1., pP)) * exp(-max(dFront, 0.) / 0.05);
    vec2 rp = ripple(P.xz, uTime) * (0.0030 + 0.012 * flow);
    N = normalize(N + vec3(rp.x, 0., rp.y));
    vec3 Pr = P + vec3(0., h0, 0.);
    vec3 under = mix(uColBlack, finishColor(0., Pr, N, V), 0.07);   // noir profond, le bronze à peine
    float foot = smoothstep(0., K_WR * 0.9, d);
    under *= mix(0.55, 1., foot);
    vec3 R = reflect(-V, N);
    vec3 refl = studioEnv(Pr, R, 0., uBounce * (1. - foot * 0.7));
    float F = 0.045 + 0.955 * pow(1. - max(dot(N, V), 0.), 5.);
    colR = under * (1. - F) + refl * F;
    // surface miroir : reflet très doux d'une grande source, déformé par les ondulations
    vec2 kr = k + rp * 2.5;
    float soft = smoothstep(-0.55, 0.65, dot(kr, vec2(-0.47, -0.88)));
    colR += vec3(0.86, 0.85, 0.83) * 0.030 * soft * soft * foot;
    // reflet final qui traverse le signe, une fois
    float sh = exp(-pow((dot(kr, vec2(0.80, -0.60)) - mix(-0.85, 0.85, uKSheen)) / 0.11, 2.)) * sin(3.14159 * uKSheen);
    colR += vec3(0.92, 0.90, 0.86) * 0.075 * sh * foot;
  }

  // --- ligne de coulée : filet d'or poli qui s'allume du haut vers le bas ---
  float wM = uKHalf * uKS;
  float yT = (k.y - uKLine.x) / (uKLine.y - uKLine.x);
  float aY = aa / (uKS * (uKLine.y - uKLine.x));
  float head = mix(-0.14, 1.16, pG);
  // le filet remplit exactement l'espace entre le fût et les bras, coupé net à ses deux extrémités
  float gap = (1. - smoothstep(-aa, aa, sL - 0.12 * wM)) * smoothstep(-aa, aa, sF) * smoothstep(-aa, aa, sB);
  float ends = smoothstep(-aY, aY, yT) * (1. - smoothstep(1. - aY, 1. + aY, yT));
  float cG = gap * ends * (1. - smoothstep(head - 0.03, head, yT)) * step(0.0005, pG);
  vec3 colG = vec3(0.);
  if (sL < 0.12 * wM + m3 && pG > 0.0005){
    float x = clamp(1. + sL / wM, 0., 0.985);
    float hp = K_TG * x * inversesqrt(1. - x * x) / wM;
    vec3 N = normalize(vec3(hp * gL.x, 1., hp * gL.y));
    vec3 diff = metalLight(P, N, V, 1., 1., 0.);
    vec3 spec = metalLight(P, N, V, 150., 0., 1.);
    vec3 R = reflect(-V, N);
    float F = 0.55 + 0.45 * pow(1. - max(dot(N, V), 0.), 5.);
    vec3 body = mix(uColCopper, uColGold, 0.78);
    colG = body * 0.62 * diff
         + uColGold * vec3(1.12, 0.98, 0.72) * spec * 2.2
         + uColGold * studioEnv(P, R, 0.03, uBounce) * F * 0.9;
    // l'éclat qui descend le long du filet pendant qu'il s'allume
    float glint = exp(-pow((yT - head + 0.05) / 0.05, 2.)) * (1. - smoothstep(0.90, 1., pG));
    colG += vec3(1.0, 0.80, 0.46) * glint * 1.1;
    float sh = exp(-pow((dot(k, vec2(0.80, -0.60)) - mix(-0.85, 0.85, uKSheen)) / 0.08, 2.)) * sin(3.14159 * uKSheen);
    colG += vec3(1.0, 0.84, 0.52) * sh * 0.55;
  }

  // --- ombres sur la dalle ---
  float f = 1.;
  float outF = max(sF, 0.);
  float gF1 = smoothstep(0., 0.25, pF);
  f *= 1. - gF1 * 0.52 * exp(-outF / (0.5 * HT + 1e-5));
  f *= 1. - gF1 * 0.26 * pow(1. - smoothstep(0., 2.4 * HT + 1e-5, outF), 1.6);
  float outR = max(-dR, 0.);
  float gR1 = smoothstep(0., 0.05, pP) * onR;
  f *= 1. - gR1 * 0.62 * exp(-outR / (0.45 * K_TR));
  f *= 1. - gR1 * 0.40 * pow(1. - smoothstep(0., 2.6 * K_TR, outR), 1.6);
  f *= 1. - gR1 * 0.10 * exp(-outR / 0.0035);
  // ombres portées, à l'opposé de la lumière principale : celle du fût s'allonge pendant qu'il se lève
  vec2 dk = vec2(dot(L0, er), dot(L0, ed)) / (uKS * uKSpan);
  vec3 S1 = fld(uv + dk * (0.0165 * pF));
  vec3 S2 = fld(uv + dk * 0.0085);
  float inF1 = (1. - smoothstep(-0.004, 0.004, S1.r * uKS)) * gF1;
  float inR1 = smoothstep(-0.0035, 0.0035, min(-S2.g * uKS, (uKRad - S2.b - uKHalf) * uKS)) * gR1;
  f *= 1. - max(0.34 * inF1 * smoothstep(0., 0.003, outF), 0.28 * inR1 * smoothstep(0., 0.003, outR));

  vec4 acc = vec4(0., 0., 0., 1. - pow(clamp(f, 0., 1.), 1. / 2.2));
  over(acc, display(applyFog(colF * fsh, P)), cF);
  over(acc, display(applyFog(colG * fsh, P)), cG);
  over(acc, display(applyFog(colR * fsh, P)), cR);
  gl_FragColor = acc * cover;
}
`;
