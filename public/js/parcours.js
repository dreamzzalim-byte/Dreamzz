// Parcours Labs : le film avance avec le scroll (séquence d'images dessinée sur un canvas).
// Les mots et les prix sont dans les images : à chaque arrêt, le film se pose, puis repart vers le suivant.
(() => {
  const sec = document.querySelector('.sq');
  if (!sec) return;
  const canvas = sec.querySelector('.sq-film');
  const ctx = canvas.getContext('2d');
  const steps = [...sec.querySelectorAll('.sq-step')];
  const dots = [...sec.querySelectorAll('.sq-dots li')];
  const hint = sec.querySelector('.sq-hint');
  // deux films : « pc » (images 16:9 en fondus) et « tel » (film vertical Kling) ; chacun a son nombre d'images,
  // sa cadence et ses secondes d'arrêt
  const ds = canvas.dataset;
  const CFG = {
    // pc : les 6 images d'arrêt, fondues entre elles en direct (une image par arrêt, t en secondes / 2)
    pc: ds.pcStills
      ? { n: steps.length, fps: 0.5, t: steps.map((s) => parseFloat(s.dataset.t) || 0), src: ds.pcStills, blend: true }
      : { n: parseInt(ds.frames, 10), fps: 24, t: steps.map((s) => parseFloat(s.dataset.t) || 0) },
    tel: ds.telFrames
      ? { n: parseInt(ds.telFrames, 10), fps: parseFloat(ds.telFps) || 24, t: ds.telT.split(',').map(Number) }
      : null,
  };
  let N = CFG.pc.n, FPS = CFG.pc.fps, T = CFG.pc.t;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = matchMedia('(max-width: 760px)');
  let kind = '', imgs = [], target = 0, shown = 0, drawn = -1, active = -1, blend = false;

  // ---- images : arrêts d'abord, puis de plus en plus serré (1 sur 16, 8, 4, 2, 1)
  function order() {
    const seen = new Set(), list = [];
    const add = (k) => { k = Math.max(0, Math.min(N - 1, k)); if (!seen.has(k)) { seen.add(k); list.push(k); } };
    T.forEach((t) => add(Math.round(t * FPS)));
    for (const step of [16, 8, 4, 2, 1]) for (let k = 0; k < N; k += step) add(k);
    return list;
  }
  function load() {
    const k2 = phone.matches ? 'tel' : 'pc';
    if (k2 === kind) return;
    const c = CFG[k2] || CFG.pc;
    N = c.n; FPS = c.fps; T = c.t; blend = !!c.blend;
    kind = k2; imgs = new Array(N); drawn = -1; shown = target = 0;
    const base = c.src || canvas.dataset.src + kind + '/';
    const queue = calm ? T.map((t) => Math.round(t * FPS)) : order();
    const next = () => {
      if (!queue.length || kind !== k2) return;
      const k = queue.shift();
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => { if (kind === k2) { imgs[k] = im; drawn = -1; } next(); };
      im.onerror = next;
      im.src = base + String(k).padStart(3, '0') + '.webp';
    };
    for (let p = 0; p < 6; p++) next();
  }
  function nearest(k) {
    for (let d = 0; d < N; d++) {
      if (imgs[k - d]) return k - d;
      if (imgs[k + d]) return k + d;
    }
    return -1;
  }

  // ---- dessin « cover » dans le canvas
  const tiny = document.createElement('canvas'); tiny.width = 12; tiny.height = 21;
  function size() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); drawn = -1;
  }
  function draw(k, part) { // part : 'bg' (fond seul), 'fg' (image seule), rien = les deux
    const im = imgs[k];
    const cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const s = Math.max(cw / iw, ch / ih);
    if (iw * s > cw * 1.06) {
      // image plus large que l'écran : on la montre en entier sur la largeur (le mot ne doit pas être coupé),
      // le haut et le bas sont remplis par la même image en tout petit, agrandie (flou naturel, léger à calculer) et assombrie
      if (part !== 'fg') {
        tiny.getContext('2d').drawImage(im, 0, 0, tiny.width, tiny.height);
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(tiny, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
        ctx.fillStyle = 'rgba(5,8,15,.6)'; ctx.fillRect(0, 0, cw, ch);
      }
      const f = cw / iw, h = ih * f;
      if (part !== 'bg') ctx.drawImage(im, 0, (ch - h) / 2, cw, h);
    } else {
      const w = iw * s, h = ih * s;
      if (part !== 'bg') ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    }
  }

  // ---- repères : chaque étape occupe une hauteur de scroll ; le film reste posé sur l'arrêt pendant
  // la première partie (le mot en verre se lit), puis avance vers l'arrêt suivant
  const HOLD = 0.6;
  let O = [], hintT = 0;
  function measure() {
    const top = sec.getBoundingClientRect().top + scrollY;
    O = steps.map((st) => st.getBoundingClientRect().top + scrollY - top);
    size(); onScroll();
  }
  function onScroll() {
    if (!O.length) return;
    const y = Math.max(0, -sec.getBoundingClientRect().top);
    let i = 0;
    while (i < O.length - 1 && y >= O[i + 1]) i++;
    let t = T[i], a = i;
    if (i < O.length - 1) {
      const len = O[i + 1] - O[i], h = O[i] + len * HOLD;
      if (y > h) {
        const f = Math.min(1, (y - h) / (O[i + 1] - h || 1));
        t = calm ? T[f < 0.5 ? i : i + 1] : T[i] + (T[i + 1] - T[i]) * f;
        a = f < 0.5 ? i : i + 1;
      }
    }
    target = t * FPS;
    if (a !== active) { active = a; dots.forEach((el, k) => el.classList.toggle('on', k === a)); }
    if (hint) {
      // la flèche disparaît pendant le défilement et revient quand on s'arrête (sauf à la dernière offre)
      hint.classList.add('off'); clearTimeout(hintT);
      hintT = setTimeout(() => { if (active < steps.length - 1 && sec.getBoundingClientRect().bottom > innerHeight) hint.classList.remove('off'); }, 700);
    }
  }

  // fondu correct entre deux images : les deux fonds, puis les deux images
  function mix(i, a) {
    draw(i, 'bg'); ctx.globalAlpha = a; draw(i + 1, 'bg'); ctx.globalAlpha = 1;
    draw(i, 'fg'); ctx.globalAlpha = a; draw(i + 1, 'fg'); ctx.globalAlpha = 1;
  }
  function tick() {
    shown += (target - shown) * (calm ? 1 : 0.2);
    if (Math.abs(target - shown) < 0.05) shown = target;
    if (blend) {
      // fondu enchaîné entre deux arrêts (courbe douce)
      const i = Math.min(N - 1, Math.floor(shown)), f = shown - i, key = i + f.toFixed(3);
      if (imgs[i] && key !== drawn) {
        if (f > 0.001 && imgs[i + 1]) mix(i, f * f * (3 - 2 * f)); else draw(i);
        drawn = key; sec.classList.add('sq-ready');
      }
    } else {
      // entre deux images du film, on fond la suivante sur la précédente : le défilement reste fluide même lentement
      const i = Math.floor(shown), f = shown - i;
      if (imgs[i] && (f < 0.02 || imgs[i + 1])) {
        const key = i + (f < 0.02 ? 0 : f).toFixed(2);
        if (key !== drawn) {
          if (f >= 0.02) mix(i, f); else draw(i);
          drawn = key; sec.classList.add('sq-ready');
        }
      } else {
        const k = nearest(Math.round(shown));
        if (k >= 0 && k !== drawn) { draw(k); drawn = k; sec.classList.add('sq-ready'); }
      }
    }
    requestAnimationFrame(tick);
  }

  // clic sur la flèche : on descend jusqu'à l'offre suivante
  if (hint) hint.addEventListener('click', () => {
    const top = sec.getBoundingClientRect().top + scrollY;
    const n = Math.min(O.length - 1, active + 1);
    scrollTo({ top: top + O[n] + 2, behavior: calm ? 'auto' : 'smooth' });
  });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  phone.addEventListener('change', () => { load(); measure(); });
  load(); measure();
  requestAnimationFrame(tick);
})();
