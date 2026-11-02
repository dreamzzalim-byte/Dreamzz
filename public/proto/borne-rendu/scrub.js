// Défilement des images pré-calculées de la borne : démarre dès le premier mouvement de scroll.
(() => {
  const N = 101, SRC = (k) => 'img/' + String(k).padStart(3, '0') + '.webp';
  const sec = document.querySelector('.b3'), cv = document.querySelector('.b3-canvas'), g = cv.getContext('2d');
  const stage = document.querySelector('.b3-stage'), steps = [...document.querySelectorAll('.b3-say')];
  steps.forEach((el) => stage.appendChild(el));
  const _unused = [...document.querySelectorAll('.b3-step')], hint = document.querySelector('.b3-hint');
  const imgs = new Array(N); let cur = 0, target = 0, last = -1;
  const load = (k) => { if (imgs[k]) return; const im = new Image(); im.decoding = 'async'; im.src = SRC(k); im.onload = () => { last = -1; }; imgs[k] = im; };
  load(0); for (let k = 0; k < N; k += 10) load(k); for (let k = 0; k < N; k++) load(k);
  const ready = (k) => imgs[k] && imgs[k].complete && imgs[k].naturalWidth;
  const near = (k) => { for (let d = 0; d < N; d++) { if (ready(k - d)) return k - d; if (ready(k + d)) return k + d; } return -1; };
  function size() {
    const r = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(cv.clientWidth * r); cv.height = Math.round(cv.clientHeight * r); last = -1;
  }
  function blit(im, a) {
    const W = cv.width, H = cv.height, s = Math.max(W / im.naturalWidth, H / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.globalAlpha = a; g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); g.globalAlpha = 1;
  }
  function draw(f) {
    const a = Math.floor(f), b = Math.min(N - 1, a + 1), t = f - a;
    const ia = near(a); if (ia < 0) return;
    blit(imgs[ia], 1);
    if (t > 0.01 && ready(b) && b !== ia) blit(imgs[b], t);
  }
  function onScroll() {
    const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / span));
    target = p * (N - 1);
    const i = Math.min(steps.length - 1, Math.round(target / ((N - 1) / (steps.length - 1))));
    steps.forEach((s, j) => s.classList.toggle('on', j === i));
    hint.classList.toggle('off', p > 0.02);
  }
  function tick() {
    cur += (target - cur) * 0.2; if (Math.abs(target - cur) < 0.002) cur = target;
    const key = Math.round(cur * 100);
    if (key !== last) { draw(cur); last = key; }
    requestAnimationFrame(tick);
  }
  hint.addEventListener('click', () => scrollBy({ top: innerHeight * 0.7, behavior: 'smooth' }));
  addEventListener('resize', () => { size(); onScroll(); }); addEventListener('scroll', onScroll, { passive: true });
  size(); onScroll(); requestAnimationFrame(tick);
})();
