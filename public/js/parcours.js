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
  const N = parseInt(canvas.dataset.frames, 10);
  const FPS = 24;
  const T = steps.map((s) => parseFloat(s.dataset.t) || 0);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = matchMedia('(max-width: 760px)');
  let kind = '', imgs = [], target = 0, shown = 0, drawn = -1, active = -1;

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
    kind = k2; imgs = new Array(N); drawn = -1;
    const base = canvas.dataset.src + kind + '/';
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
  function size() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); drawn = -1;
  }
  function draw(k) {
    const im = imgs[k];
    const cw = canvas.width, ch = canvas.height, iw = im.naturalWidth, ih = im.naturalHeight;
    const s = Math.max(cw / iw, ch / ih);
    if (iw * s > cw * 1.06) {
      // image plus large que l'écran : on la montre en entier sur la largeur (le mot ne doit pas être coupé),
      // le haut et le bas sont remplis par la même image floutée et assombrie
      ctx.fillStyle = '#05080F'; ctx.fillRect(0, 0, cw, ch);
      if ('filter' in ctx) {
        ctx.filter = 'blur(24px) brightness(.45)';
        ctx.drawImage(im, (cw - iw * s) / 2, (ch - ih * s) / 2, iw * s, ih * s);
        ctx.filter = 'none';
      }
      const f = cw / iw, h = ih * f;
      ctx.drawImage(im, 0, (ch - h) / 2, cw, h);
    } else {
      const w = iw * s, h = ih * s;
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    }
  }

  // ---- repères : chaque étape occupe une hauteur de scroll ; le film reste posé sur l'arrêt pendant
  // la première partie (le mot en verre se lit), puis avance vers l'arrêt suivant
  const HOLD = 0.6;
  let O = [];
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
    if (hint && scrollY > 40) hint.classList.add('off');
  }

  function tick() {
    shown += (target - shown) * (calm ? 1 : 0.2);
    if (Math.abs(target - shown) < 0.05) shown = target;
    const k = nearest(Math.round(shown));
    if (k >= 0 && k !== drawn) { draw(k); drawn = k; sec.classList.add('sq-ready'); }
    requestAnimationFrame(tick);
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  phone.addEventListener('change', () => { load(); measure(); });
  load(); measure();
  requestAnimationFrame(tick);
})();
