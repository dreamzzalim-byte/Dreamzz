// KISWA — scène 3D temps réel (three.js). Tout est procédural : aucune image externe.
import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, PlaneGeometry,
  BufferGeometry, Float32BufferAttribute, ShaderMaterial, WebGLRenderTarget,
  Vector2, Vector3, RepeatWrapping, LinearMipmapLinearFilter, LinearFilter, DoubleSide,
  CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation
} from '../vendor/three.module.min.js';
import * as S from './shaders.js';
import { KMARK, markFields } from './kmark.js';

const DEG = Math.PI / 180;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const srgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
};
const lin = (hex, k = 1) => new Vector3(...srgb(hex).map((c) => Math.pow(c, 2.2) * k));

// Géométrie du monde (mètres)
const CORNER = { x: 2.6, z: 2.6 };          // angle de la dalle, là où le sol est montré en coupe
const STEP = [0, 0.22, 0.44, 0.66];          // retrait de chaque couche à l'angle
const SLAB = 0.12;                           // épaisseur de dalle visible
const RES_W = 0.036;                         // largeur du ménisque
const FAR = 34;
const YAW = 35 * DEG;

export function createScene({ canvas, reduced = false, colors, mark = KMARK }) {
  // téléphone / tablette : moins de pixels à calculer (la résine reste nette, le rendu devient fluide)
  const mobile = window.matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 820;
  const renderer = new WebGLRenderer({
    canvas, antialias: !mobile && (window.devicePixelRatio || 1) < 2, alpha: false, stencil: false,
    powerPreference: 'high-performance'
  });
  if (!renderer.capabilities.isWebGL2) throw new Error('WebGL2 indisponible');
  const fogHex = '#101011';
  renderer.setClearColor(fogHex, 1);
  renderer.autoClear = true;

  let dprCap = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2);
  let dprLocked = false;
  let W = 1, H = 1, aspect = 1;

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.05, 90);

  // --- Studio ---------------------------------------------------------------------
  // Sources de l'éclairage diffus (position, part de lumière, teinte). Les reflets, eux,
  // viennent d'un environnement sans bord net (voir studioEnv dans shaders.js).
  const lights = [
    { c: [-2.6, 2.3, -4.2], share: 0.44, tint: [1.03, 1.0, 0.95] },
    { c: [-4.6, 1.4, -1.2], share: 0.10, tint: [0.98, 1.0, 1.03] },
    { c: [0.9, 3.4, 1.4], share: 0.08, tint: [1, 1, 1] },
    { c: [0.6, 1.9, 4.3], share: 0.10, tint: [1, 1, 1] }
  ];
  const AMB = 0.28;
  const sb = { C: [], Wt: [], T: [] };
  for (const l of lights) {
    const C = new Vector3(...l.c);
    const L0 = C.clone().normalize();
    sb.C.push(C);
    sb.Wt.push(new Vector3(0, l.share / Math.max(L0.y, 0.05), C.lengthSq()));
    sb.T.push(new Vector3(...l.tint));
  }
  const WASH = [1.30, 1.20, 1.05], LOBE = [1.0, 0.93, 0.82];
  const glowAz = 30 * DEG;

  const common = {
    uSbC: { value: sb.C }, uSbW: { value: sb.Wt }, uSbT: { value: sb.T },
    uWash: { value: new Vector3(...WASH) }, uLobe: { value: new Vector3() },
    uGlowAz: { value: new Vector2(-Math.sin(glowAz), -Math.cos(glowAz)) },
    uLobeEl: { value: Math.sin(17 * DEG) },
    uFrontDir: { value: new Vector3(0.12, 0.50, 1.0).normalize() }, uFront: { value: 5.5 },
    uAmb: { value: AMB },
    uFogCol: { value: lin(fogHex) }, uFogStart: { value: 3.4 }, uFogDen: { value: 0.21 },
    uTime: { value: 0 }
  };
  const palette = {
    uColBlack: { value: lin(colors.noir) },
    uColGold: { value: lin(colors.or) },
    uColCopper: { value: lin(colors.cuivre) },
    uColMet: { value: lin(colors.metallisee) },
    uColMono: { value: lin(colors.monochrome) }
  };
  const rimCols = [
    lin(colors.noir, 2.0), lin(colors.metallisee, 0.55), new Vector3(0.14, 0.14, 0.145), lin(colors.monochrome)
  ];

  // --- Textures cuites au démarrage ----------------------------------------------
  const TEX = mobile ? 512 : 1024;
  const maxAniso = Math.min(mobile ? 4 : 8, renderer.capabilities.getMaxAnisotropy());
  const makeRT = () => {
    const rt = new WebGLRenderTarget(TEX, TEX, { depthBuffer: false });
    const t = rt.texture;
    t.wrapS = t.wrapT = RepeatWrapping;
    t.minFilter = LinearMipmapLinearFilter; t.magFilter = LinearFilter;
    t.generateMipmaps = true; t.anisotropy = maxAniso;
    return rt;
  };
  const rt = { conA: makeRT(), conB: makeRT(), metA: makeRT(), metB: makeRT(), flake: makeRT() };

  function bake() {
    const quad = new Mesh(new PlaneGeometry(2, 2));
    const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const sc = new Scene(); sc.add(quad);
    const pass = (frag, uniforms, target) => {
      const m = new ShaderMaterial({ vertexShader: S.BAKE_VERT, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false });
      quad.material = m;
      renderer.setRenderTarget(target);
      renderer.render(sc, cam);
      m.dispose();
    };
    const texel = { value: 1 / TEX };
    pass(S.BAKE_CONCRETE_A, { uBaseCol: { value: new Vector3(...srgb(colors.beton)) } }, rt.conA);
    pass(S.BAKE_CONCRETE_B, { tSrc: { value: rt.conA.texture }, uTexel: texel }, rt.conB);
    pass(S.BAKE_METAL_A, {}, rt.metA);
    pass(S.BAKE_METAL_B, { tSrc: { value: rt.metA.texture }, uTexel: texel }, rt.metB);
    pass(S.BAKE_FLAKES, { uBaseCol: { value: new Vector3(...srgb(colors.flakes)) } }, rt.flake);
    renderer.setRenderTarget(null);
    quad.geometry.dispose();
  }
  bake();

  // --- Géométries ------------------------------------------------------------------
  function sheet(xmax, zmax, { top = true, sides = true } = {}) {
    const x0 = -FAR, z0 = -FAR, p = [], n = [], idx = [];
    const quad = (v, nn) => {
      const b = p.length / 3;
      for (const q of v) { p.push(...q); n.push(...nn); }
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    };
    if (top) quad([[x0, 1, z0], [x0, 1, zmax], [xmax, 1, zmax], [xmax, 1, z0]], [0, 1, 0]);
    if (sides) {
      quad([[xmax, 0, z0], [xmax, 1, z0], [xmax, 1, zmax], [xmax, 0, zmax]], [1, 0, 0]);
      quad([[x0, 0, zmax], [xmax, 0, zmax], [xmax, 1, zmax], [x0, 1, zmax]], [0, 0, 1]);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(p, 3));
    g.setAttribute('normal', new Float32BufferAttribute(n, 3));
    g.setIndex(idx);
    return g;
  }

  function ribbon() {
    const xs = [], dense = 2.45, step = 0.0125;
    const left = []; let x = -dense, s = step;
    while (x > -18) { s *= 1.34; x -= s; left.push(x); }
    xs.push(...left.reverse());
    const nd = Math.round(2 * dense / step);
    for (let i = 0; i <= nd; i++) xs.push(-dense + i * step);
    x = dense; s = step;
    while (x < 4) { s *= 1.34; x += s; xs.push(x); }
    const ds = [0, .004, .012, .03, .06, .10, .15, .21, .28, .36, .45, .55, .66, .78, .89, 1.0, 1.25, 1.6, 2.1, 2.9, 4.2, 6.5]
      .map((v) => v * RES_W).concat([0.3, 0.6, 1.1, 2, 3.5, 6, 10, 18, 42]);
    const nx = xs.length, ny = ds.length, p = new Float32Array(nx * ny * 3), idx = [];
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const o = (j * nx + i) * 3; p[o] = xs[i]; p[o + 1] = ds[j]; p[o + 2] = 0;
    }
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = j * nx + i, b = a + 1, c = a + nx, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new Float32BufferAttribute(p, 3));
    g.setIndex(idx);
    return g;
  }

  // --- Matériaux ---------------------------------------------------------------------
  const concreteUniforms = (mode) => ({
    ...common,
    tConA: { value: rt.conA.texture }, tConB: { value: rt.conB.texture },
    uMode: { value: mode }, uBaseA: { value: 0 }, uSeedA: { value: 0.37 }, uT: { value: 0.018 },
    uFrontOn: { value: mode ? 0 : 1 }, uUpper: { value: new Vector2(0, 0) }, uGap: { value: 0 }, uUpperOn: { value: 0 }
  });
  const matConcrete = new ShaderMaterial({ vertexShader: S.WORLD_VERT, fragmentShader: S.CONCRETE_FRAG, uniforms: concreteUniforms(0) });
  const matPrimer = new ShaderMaterial({ vertexShader: S.WORLD_VERT, fragmentShader: S.CONCRETE_FRAG, uniforms: concreteUniforms(1) });

  const sectionMat = (kind) => new ShaderMaterial({
    vertexShader: S.WORLD_VERT, fragmentShader: S.SECTION_FRAG, side: DoubleSide,
    uniforms: {
      ...common, uKind: { value: kind }, uY0: { value: 0 }, uH: { value: 1 },
      uColBlack: palette.uColBlack, uColGold: palette.uColGold, uColCopper: palette.uColCopper,
      uConcrete: { value: new Vector3(...srgb(colors.beton)) }
    }
  });
  const matSec = [sectionMat(0), sectionMat(1), sectionMat(2), sectionMat(3)];

  const resinMat = (isB) => new ShaderMaterial({
    vertexShader: S.RESIN_VERT, fragmentShader: S.RESIN_FRAG, side: DoubleSide,
    uniforms: {
      ...common, ...palette,
      tMetA: { value: rt.metA.texture }, tMetB: { value: rt.metB.texture }, tFlake: { value: rt.flake.texture },
      uBase: { value: 0 }, uSeed: { value: isB ? 1.91 : 0.37 }, uY: { value: 0 }, uT: { value: 0.018 }, uW: { value: RES_W },
      uDecay: { value: isB ? 1 : 0 },
      uLimitBase: { value: 0 }, uLimitSeed: { value: 0.37 }, uLimitOn: { value: isB ? 1 : 0 },
      uFinish: { value: 0 },
      uClip: { value: new Vector2(CORNER.x - STEP[2], CORNER.z - STEP[2]) },
      uCoat: { value: new Vector2(CORNER.x - STEP[3], CORNER.z - STEP[3]) },
      uSatin: { value: 0 },
      uBounce: { value: new Vector3(0.02, 0.02, 0.02) },
      uPourOn: { value: 0 }, uBaseB: { value: 0 }, uSeedB: { value: 1.91 }, uTB: { value: 0.018 },
      uRimCol: { value: new Vector3() }
    }
  });
  const matA = resinMat(false), matB = resinMat(true);

  const matCoat = new ShaderMaterial({
    vertexShader: S.WORLD_VERT, fragmentShader: S.COAT_FRAG, transparent: true, depthWrite: false,
    blending: CustomBlending, blendEquation: AddEquation, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor,
    uniforms: { ...common, uCoatOn: { value: 0 } }
  });
  const matGround = new ShaderMaterial({
    vertexShader: S.WORLD_VERT, fragmentShader: S.GROUND_FRAG,
    uniforms: { ...common, uCorner: { value: new Vector2(CORNER.x, CORNER.z) } }
  });

  // --- Maillages ----------------------------------------------------------------------
  const add = (geo, mat, order) => {
    const m = new Mesh(geo, mat); m.frustumCulled = false; m.renderOrder = order; scene.add(m); return m;
  };
  const rib = ribbon();
  const meshB = add(rib, matB, 0); meshB.visible = false;
  const meshA = add(rib, matA, 1);
  const ex = (i) => [CORNER.x - STEP[i], CORNER.z - STEP[i]];
  const resinSides = add(sheet(...ex(2), { top: false }), matSec[2], 2);
  const coatSides = add(sheet(...ex(3), { top: false }), matSec[3], 2);
  const primerTop = add(sheet(...ex(1), { sides: false }), matPrimer, 3);
  const primerSides = add(sheet(...ex(1), { top: false }), matSec[1], 3);
  const slabTop = add(sheet(...ex(0), { sides: false }), matConcrete, 4);
  const slabSides = add(sheet(...ex(0), { top: false }), matSec[0], 4);
  slabTop.scale.y = slabSides.scale.y = SLAB; slabTop.position.y = slabSides.position.y = -SLAB;
  matSec[0].uniforms.uY0.value = -SLAB; matSec[0].uniforms.uH.value = SLAB;
  const groundGeo = new PlaneGeometry(2 * FAR + 40, 2 * FAR + 40); groundGeo.rotateX(-Math.PI / 2);
  const ground = add(groundGeo, matGround, 5); ground.position.y = -SLAB;
  const coatTop = add(sheet(...ex(3), { sides: false }), matCoat, 10); coatTop.visible = false;
  // fond : cube centré sur la caméra, dessiné après les surfaces opaques
  const skyGeo = new BufferGeometry();
  skyGeo.setAttribute('position', new Float32BufferAttribute([-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1], 3));
  skyGeo.setIndex([0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 3, 2, 6, 3, 6, 7, 0, 3, 7, 0, 7, 4, 1, 5, 6, 1, 6, 2]);
  const sky = add(skyGeo, new ShaderMaterial({ vertexShader: S.SKY_VERT, fragmentShader: S.SKY_FRAG, side: DoubleSide, depthWrite: false, uniforms: { ...common } }), 6);
  sky.scale.setScalar(45);

  let slow = 0;                    // images lentes consécutives (voir watchPerf)

  // --- Signe K à l'ouverture ------------------------------------------------------------
  // Trois temps : le fût en béton se lève, la résine part de la ligne et forme les bras, la ligne d'or s'allume,
  // puis un reflet traverse le signe. Le K démarre quand ses champs sont calculés et son shader compilé.
  const K = { mesh: null, u: null, fields: null, state: 'off', t: reduced ? 99 : 0, size: 0.4, end: 6.3, rmax: 0.8, hold: false };
  const K_TIME = { fut: [0.45, 1.45], balayage: [0.55, 1.95], coulee: [1.30, 3.80], ligne: [3.55, 4.65], reflet: [4.70, 6.20] };
  function markTexture() {
    const f = K.fields;
    const Tex = rt.conA.texture.constructor;                 // classe Texture de three (non exportée par ce build)
    const tex = new Tex({ data: f.data, width: f.n, height: f.n });
    if (!tex.isTexture || tex.isRenderTargetTexture || !tex.image || tex.image.data !== f.data) throw new Error('Texture indisponible');
    tex.isDataTexture = true;
    tex.format = 1023; tex.type = 1016;                      // RGBAFormat, HalfFloatType
    tex.magFilter = tex.minFilter = LinearFilter;
    tex.generateMipmaps = false; tex.flipY = false; tex.unpackAlignment = 1;
    tex.needsUpdate = true;
    return tex;
  }
  function buildMark(f) {
    K.fields = f;
    K.rmax = f.reach + 0.035;                                // la résine finit de remplir les bras juste avant l'or
    const mat = new ShaderMaterial({
      vertexShader: S.WORLD_VERT, fragmentShader: S.K_FRAG, transparent: true, depthWrite: false,
      blending: CustomBlending, blendEquation: AddEquation, blendSrc: OneFactor, blendDst: OneMinusSrcAlphaFactor,
      uniforms: {
        ...common, ...palette,
        tMetA: { value: rt.metA.texture }, tMetB: { value: rt.metB.texture }, tFlake: { value: rt.flake.texture },
        tConA: { value: rt.conA.texture }, tConB: { value: rt.conB.texture }, tK: { value: markTexture() },
        uKR: { value: new Vector2(Math.cos(YAW), -Math.sin(YAW)) },
        uKS: { value: K.size }, uKSpan: { value: f.span }, uKTex: { value: 1 / f.n },
        uKHalf: { value: f.half }, uKLine: { value: new Vector2(f.lineTop, f.lineBottom) },
        uKPh: { value: new Vector3(0, 0, 0) }, uKRad: { value: f.half }, uKWob: { value: 0 },
        uKSw: { value: 0 }, uKSheen: { value: 0 },
        uBaseA: { value: 0 }, uSeedA: { value: 0.37 }, uT: { value: 0.018 },
        uBounce: { value: new Vector3(0.30, 0.29, 0.275) }
      }
    });
    const g = new PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
    const mesh = new Mesh(g, mat);
    mesh.frustumCulled = false; mesh.renderOrder = 9; mesh.position.y = 0.0007; mesh.visible = false;
    K.u = mat.uniforms;
    const ready = () => {
      if (K.state !== 'calc') return;
      scene.add(mesh); K.mesh = mesh; K.state = 'ready'; slow = 0; needs = true;
    };
    // compilation en tâche de fond quand le navigateur le permet (sinon : au premier rendu)
    if (typeof renderer.compileAsync === 'function') {
      scene.add(mesh);
      renderer.compileAsync(mesh, camera, scene).then(ready, ready);
      scene.remove(mesh);
    } else ready();
  }
  if (mark) {
    K.state = 'calc';
    setTimeout(() => {
      markFields(mark, mobile ? { n: 448 } : undefined).then(buildMark).catch(() => { K.state = 'off'; K.mesh = null; });   // sans le signe, la page reste complète
    }, 60);
  }

  // --- Caméra : poses clés le long du récit ------------------------------------------
  let keys = [];
  let heroExtent = 1;
  function buildKeys() {
    const portrait = clamp((1.15 - aspect) / 0.45, 0, 1);       // 1 = téléphone, 0 = écran large
    const fov = lerp(36, 46, portrait);
    camera.fov = fov; camera.aspect = aspect; camera.updateProjectionMatrix();
    const th = Math.tan(fov * DEG / 2);
    const visH = lerp(clamp(2.3 / aspect, 1.0, 1.5), 1.75, portrait);
    const d0 = visH / (2 * th);
    const visW = visH * aspect;
    heroExtent = Math.cos(YAW) * visH / 2 + Math.sin(YAW) * visW / 2;
    K.size = Math.min(visW * 0.56, visH * 0.36);              // largeur du signe K, en mètres
    const P = (a, b) => lerp(a, b, portrait);
    const cx = CORNER.x, cz = CORNER.z;
    // décalage latéral de la cible à l'angle (place pour les étiquettes à droite, sur téléphone)
    const sx = P(0.0, 0.16);
    const ct = (y) => [cx - 0.40 + sx * 0.707, y, cz - 0.40 - sx * 0.707];
    keys = [
      { u: 0.00, t: [0, 0, 0], yaw: 35, el: 90, d: d0 },
      { u: 0.50, t: [0, 0, 0], yaw: 35, el: 90, d: d0 * 0.95 },
      { u: 1.00, t: [-0.05, 0, -0.10], yaw: 35, el: 62, d: d0 * 0.93 },
      { u: 1.55, t: [-0.10, 0, -0.25], yaw: 35, el: 32, d: P(1.9, 2.3) },
      { u: 2.00, t: [-0.15, 0, -0.30], yaw: 39, el: 29, d: P(1.9, 2.3) },
      { u: 2.42, t: ct(0.02), yaw: 45, el: 30, d: P(2.2, 2.3) },
      { u: 2.66, t: ct(0.24), yaw: 48, el: 25, d: P(2.6, 2.9) },
      { u: 2.84, t: ct(0.24), yaw: 43, el: 25, d: P(2.6, 2.9) },
      { u: 3.00, t: ct(0.04), yaw: 42, el: 29, d: P(2.3, 2.4) },
      { u: 3.92, t: [-0.10, 0, -0.60], yaw: 35, el: 27, d: 2.4 },
      { u: 4.00, t: [-0.10, 0, -0.60], yaw: 35, el: 27, d: 2.4 },
      { u: 4.60, t: [-0.20, 0, -0.80], yaw: 35, el: 22, d: 2.35 },
      { u: 5.00, t: [-0.25, 0, -0.90], yaw: 35, el: 19, d: 2.3 },
      { u: 5.75, t: [-0.30, 0, -1.00], yaw: 35, el: P(4.5, 6.5), d: 2.1 },
      { u: 6.00, t: [-0.30, 0, -1.05], yaw: 35, el: P(4, 6), d: 2.05 }
    ];
  }

  const pose = { t: [0, 0, 0], yaw: 35, el: 90, d: 2 };
  const vT = new Vector3();
  function applyPose(u) {
    let i = 0;
    while (i < keys.length - 2 && u > keys[i + 1].u) i++;
    const a = keys[i], b = keys[i + 1];
    const t = smooth(a.u, b.u, u);
    for (let k = 0; k < 3; k++) pose.t[k] = lerp(a.t[k], b.t[k], t);
    pose.yaw = lerp(a.yaw, b.yaw, t); pose.el = lerp(a.el, b.el, t); pose.d = lerp(a.d, b.d, t);
    const yaw = pose.yaw * DEG, el = pose.el * DEG;
    const vx = -Math.sin(yaw), vz = -Math.cos(yaw);
    const ce = Math.cos(el), se = Math.sin(el);
    vT.set(pose.t[0], pose.t[1], pose.t[2]);
    camera.position.set(vT.x - vx * pose.d * ce, vT.y + pose.d * se, vT.z - vz * pose.d * ce);
    camera.up.set(vx * se, ce, vz * se);
    camera.lookAt(vT);
    camera.updateMatrixWorld();
  }

  // --- État -----------------------------------------------------------------------------
  const HERO_END = 3.3;
  let finishA = 0, target = 0;
  const pour = { on: false, u: 0, finish: 0, n: 0, from: -6.0, to: 3.7, dur: 3.8 };
  let time = 0, intro = reduced ? 1 : 0, lastSig = '', needs = true, explode = 0, lastU = 0;
  const tmp = new Vector3();
  const anchors = [0, 1, 2, 3].map(() => ({ x: 0, y: 0, on: false }));
  const layerY = [-SLAB / 2, 0, 0, 0];

  function heroBase(p, introE) {
    const start = -heroExtent + 0.14 - (1 - introE) * 0.34 + 0.035 * (1 - Math.exp(-time / 9)) * (reduced ? 0 : 1);
    const cover = heroExtent + 0.46;
    if (p < 0.58) return lerp(start, cover, p / 0.58);
    return lerp(cover, HERO_END, smooth(0.58, 0.94, p));
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
    if (!w || !h) return;
    W = w; H = h; aspect = w / h;
    renderer.setPixelRatio(dprCap);
    renderer.setSize(w, h, false);
    buildKeys();
    needs = true;
  }

  function setTargetFinish(f, instant) {
    target = f;
    if (instant || reduced) {
      if (finishA !== f || pour.on) { finishA = f; pour.on = false; needs = true; }
    }
  }

  // moyenne glissante du temps de rendu, pour réduire la définition si nécessaire
  function watchPerf(dt) {
    if (dprLocked || dprCap <= 1) return;
    if (K.state === 'calc' || (K.state === 'ready' && K.t < K.end)) { slow = 0; return; }   // l'ouverture ne compte pas
    slow = dt > 0.030 ? slow + 1 : Math.max(0, slow - 2);
    if (slow > 45) { dprCap = Math.max(1, dprCap - 0.5); slow = 0; resize(); }
  }

  function frame(u, dt, force) {
    time += dt;
    if (!reduced && intro < 1) { intro = Math.min(1, intro + dt / 2.6); needs = true; }
    if (K.mesh && !K.hold && K.t < K.end) { K.t = Math.min(K.t + dt, K.end); needs = true; }
    const introE = 1 - Math.pow(1 - intro, 3);

    // coulées de changement de finition
    if (!pour.on && target !== finishA) {
      pour.on = true; pour.u = 0; pour.finish = target; pour.n++;
      matB.uniforms.uSeed.value = 1.91 + pour.n * 0.731;
    }
    if (pour.on) {
      pour.u += dt / pour.dur;
      if (pour.u >= 1) { pour.on = false; finishA = pour.finish; }
      needs = true;
    }

    const p0 = clamp(u, 0, 1), c = clamp(u - 2, 0, 1);
    explode = smooth(0.46, 0.66, c) * (1 - smooth(0.82, 0.97, c));
    const base = heroBase(p0, introE);
    const frontOn = base < HERO_END - 0.02;

    const sig = [u.toFixed(5), W, H, finishA, frontOn && !reduced ? Math.floor(time * 30) : 0].join('|');
    if (sig !== lastSig) { needs = true; lastSig = sig; }
    if (!needs && !force) return false;
    needs = false; lastU = u;

    applyPose(u);
    common.uTime.value = reduced ? 0 : time;
    // la lueur d'horizon se fait discrète pendant les chiffres, puis monte pour la scène finale ;
    // la grande boîte douce n'éclaire que les finitions et la coupe
    const wash = lerp(1, 0.18, smooth(3.2, 3.9, u)) + 0.82 * smooth(5.3, 5.75, u);
    const lobe = smooth(1.3, 1.55, u) * (1 - 0.45 * smooth(2.0, 2.4, u)) * (1 - smooth(3.2, 3.9, u));
    common.uWash.value.set(WASH[0] * wash, WASH[1] * wash, WASH[2] * wash);
    common.uLobe.value.set(LOBE[0] * lobe, LOBE[1] * lobe, LOBE[2] * lobe);
    sky.position.copy(camera.position);

    // couches
    const e = explode;
    const tPr = lerp(0.006, 0.014, e), tRe = lerp(0.022, 0.030, e), tFi = lerp(0.004, 0.012, e);
    const yPr = 0.14 * e, yRe = 0.32 * e, yFi = yRe + tRe + 0.18 * e;
    const layered = !frontOn;
    primerTop.visible = primerSides.visible = resinSides.visible = coatSides.visible = layered;
    primerTop.position.y = primerSides.position.y = yPr; primerTop.scale.y = primerSides.scale.y = tPr;
    resinSides.position.y = yRe; resinSides.scale.y = tRe;
    coatSides.position.y = coatTop.position.y = yFi; coatSides.scale.y = coatTop.scale.y = tFi;
    const coatOn = smooth(0.0, 0.12, e);
    coatTop.visible = coatOn > 0.001;
    matCoat.uniforms.uCoatOn.value = coatOn;
    matSec[1].uniforms.uY0.value = yPr; matSec[1].uniforms.uH.value = tPr;
    matSec[2].uniforms.uY0.value = yRe; matSec[2].uniforms.uH.value = tRe;
    matSec[3].uniforms.uY0.value = yFi; matSec[3].uniforms.uH.value = tFi;
    layerY[1] = yPr + tPr / 2; layerY[2] = yRe + tRe / 2; layerY[3] = yFi + tFi / 2;

    const cu = matConcrete.uniforms;
    cu.uBaseA.value = base; cu.uT.value = tRe; cu.uFrontOn.value = frontOn ? 1 : 0;
    cu.uUpperOn.value = layered ? 1 : 0; cu.uUpper.value.set(...ex(1)); cu.uGap.value = yPr;
    const pu = matPrimer.uniforms;
    pu.uUpperOn.value = 1; pu.uUpper.value.set(...ex(2)); pu.uGap.value = Math.max(yRe - yPr - tPr, 0);

    const a = matA.uniforms;
    a.uBase.value = base; a.uY.value = yRe; a.uT.value = tRe; a.uFinish.value = finishA; a.uSatin.value = coatOn;
    if (frontOn) a.uBounce.value.set(0.30, 0.29, 0.275); else a.uBounce.value.set(0.02, 0.02, 0.02);
    const b = matB.uniforms;
    meshB.visible = pour.on;
    a.uPourOn.value = pour.on ? 1 : 0;
    if (pour.on) {
      const t = pour.u, k = 0.45 * t + 0.55 * t * t * (3 - 2 * t);
      const pb = lerp(pour.from, pour.to, k);
      b.uBase.value = pb; b.uY.value = yRe + tRe; b.uT.value = 0.020; b.uFinish.value = pour.finish; b.uSatin.value = coatOn;
      b.uLimitBase.value = base;
      a.uBaseB.value = pb; a.uSeedB.value = b.uSeed.value; a.uTB.value = 0.020;
      a.uRimCol.value.copy(rimCols[pour.finish]);
    }

    if (K.mesh) {
      const ku = K.u, reach = K.size * K.fields.span * 0.75;
      K.mesh.visible = frontOn && base - 0.45 < reach;
      if (K.mesh.visible) {
        const ph = (r) => clamp((K.t - r[0]) / (r[1] - r[0]), 0, 1);
        const pf = ph(K_TIME.fut), pp = ph(K_TIME.coulee), pg = ph(K_TIME.ligne);
        ku.uKPh.value.set(1 - Math.pow(1 - pf, 3), pp, pg * pg * (3 - 2 * pg));
        ku.uKRad.value = lerp(K.fields.half, K.rmax, 1 - Math.pow(1 - pp, 1.7));
        ku.uKWob.value = 0.022 * smooth(0, 0.08, pp) * (1 - smooth(0.72, 1, pp));
        ku.uKSw.value = ph(K_TIME.balayage);
        ku.uKSheen.value = ph(K_TIME.reflet);
        ku.uKS.value = K.size;
        ku.uBaseA.value = base; ku.uT.value = tRe;
        const s = K.size * K.fields.span * 1.45;
        K.mesh.scale.set(s, 1, s);
      }
    }

    renderer.render(scene, camera);

    // ancrages des étiquettes de la coupe
    for (let i = 0; i < 4; i++) {
      tmp.set(CORNER.x - STEP[i], layerY[i], CORNER.z - STEP[i]).project(camera);
      anchors[i].x = (tmp.x * 0.5 + 0.5) * W; anchors[i].y = (-tmp.y * 0.5 + 0.5) * H;
      anchors[i].on = tmp.z < 1 && tmp.z > -1;
    }
    return true;
  }

  function settle() {
    intro = 1; time = Math.max(time, 60); K.t = 99;
    if (pour.on || target !== finishA) { finishA = target; pour.on = false; }
    pour.dur = 3.8;
    needs = true;
  }

  canvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); });
  canvas.addEventListener('webglcontextrestored', () => {
    bake();
    if (K.u) K.u.tK.value.needsUpdate = true;
    needs = true;
  });

  resize();

  // compile les shaders un par un (une image entre chaque) pour que l'ouverture ne fige pas l'écran
  function warm(onStep) {
    const list = [];
    scene.traverse((o) => { if (o.isMesh) list.push(o); });
    let i = 0;
    return new Promise((done) => {
      const step = () => {
        if (i >= list.length) { onStep && onStep(1); done(); return; }
        const o = list[i++], vis = o.visible;
        o.visible = true;
        try { renderer.compile(o, camera, scene); } catch (e) { /* compilé au premier rendu */ }
        o.visible = vis;
        onStep && onStep(i / list.length);
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  return {
    warm,
    frame, resize, setTargetFinish, settle, watchPerf, anchors,
    get explode() { return explode; },
    get busy() { return pour.on || intro < 1 || K.state === 'calc' || (K.state === 'ready' && K.t < K.end); },
    invalidate() { needs = true; },
    // utilisé par les scripts de vérification uniquement (aucun accès global dans la page)
    debug: {
      lockDpr(v) { dprLocked = true; dprCap = v; resize(); },
      markAt(t) { K.t = t; K.hold = true; needs = true; },
      get markState() { return K.state; },
      pourAt(v) { if (target !== finishA) { pour.on = true; pour.finish = target; pour.u = v; pour.dur = 1e9; needs = true; } }
    }
  };
}
