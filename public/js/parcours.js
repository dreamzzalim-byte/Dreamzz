// Parcours Labs : le film avance en continu avec le scroll (séquence d'images dessinée sur un canvas),
// les étiquettes de chaque offre défilent par-dessus.
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
  let kind = '', imgs = [], target = 0, shown = 0, drawn = -1, active = -1, A = [];

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
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  // ---- repères : le film passe sur l'arrêt quand les étiquettes de l'offre sont au milieu de l'écran
  function measure() {
    const top = sec.getBoundingClientRect().top + scrollY;
    A = steps.map((s, k) => {
      if (k === 0) return 0;
      const r = (s.querySelector('.sq-say') || s).getBoundingClientRect();
      return Math.max(0, r.top + scrollY - top + r.height / 2 - innerHeight / 2);
    });
    size(); onScroll();
  }
  function onScroll() {
    if (!A.length) return;
    const y = Math.max(0, -sec.getBoundingClientRect().top);
    let i = 0;
    while (i < A.length - 1 && y >= A[i + 1]) i++;
    const f = i < A.length - 1 ? Math.min(1, Math.max(0, (y - A[i]) / (A[i + 1] - A[i] || 1))) : 0;
    const a = f > 0.5 && i < steps.length - 1 ? i + 1 : i;
    target = calm ? Math.round(T[a] * FPS) : (i < T.length - 1 ? T[i] + (T[i + 1] - T[i]) * f : T[i]) * FPS;
    if (a !== active) { active = a; dots.forEach((d, k) => d.classList.toggle('on', k === a)); }
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
