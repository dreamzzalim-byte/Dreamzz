// Parcours Labs : le film avance en continu avec le scroll, les étiquettes de chaque offre défilent par-dessus.
(() => {
  const sec = document.querySelector('.sq');
  if (!sec) return;
  const video = sec.querySelector('.sq-video');
  const steps = [...sec.querySelectorAll('.sq-step')];
  const dots = [...sec.querySelectorAll('.sq-dots li')];
  const hint = sec.querySelector('.sq-hint');
  const T = steps.map((s) => parseFloat(s.dataset.t) || 0);
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = matchMedia('(max-width: 760px)');
  const base = video.dataset.src;
  let target = 0, shown = 0, active = -1, ready = false;

  sec.classList.add('sq-on');

  // Repères : position de scroll où les étiquettes de chaque arrêt passent au milieu de l'écran.
  // Entre deux repères, le film avance en continu, sans pause.
  let A = [];
  function measure() {
    const top = sec.getBoundingClientRect().top + scrollY;
    A = steps.map((s, k) => {
      if (k === 0) return 0;
      const say = s.querySelector('.sq-say') || s;
      const r = say.getBoundingClientRect();
      return Math.max(0, r.top + scrollY - top + r.height / 2 - innerHeight / 2);
    });
    onScroll();
  }

  function where() {
    const y = Math.max(0, -sec.getBoundingClientRect().top);
    let i = 0;
    while (i < A.length - 1 && y >= A[i + 1]) i++;
    const f = i < A.length - 1 ? (y - A[i]) / (A[i + 1] - A[i] || 1) : 0;
    return { i, f: Math.min(1, Math.max(0, f)) };
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    if (calm || !ready) video.poster = `img/labs/parcours/arret-${i}.webp`;
  }

  function onScroll() {
    if (!A.length) return;
    const { i, f } = where();
    target = i < T.length - 1 ? T[i] + (T[i + 1] - T[i]) * f : T[i];
    setActive(f > 0.5 && i < steps.length - 1 ? i + 1 : i);
    if (hint && scrollY > 40) hint.classList.add('off');
  }

  function tick() {
    if (ready) {
      shown += (target - shown) * 0.18;
      if (Math.abs(target - shown) < 0.004) shown = target;
      if (!video.seeking && Math.abs(video.currentTime - shown) > 1 / 60) video.currentTime = shown;
    }
    requestAnimationFrame(tick);
  }

  function load() {
    if (calm) return;
    const ext = video.canPlayType('video/webm; codecs="vp9"') ? 'webm' : 'mp4';
    const file = `${base}-${phone.matches ? 'tel' : 'pc'}.${ext}`;
    if (video.getAttribute('src') === file) return;
    ready = false;
    video.src = file;
    video.load();
    video.addEventListener('loadeddata', () => { ready = true; video.pause(); video.currentTime = shown = target; sec.classList.add('sq-ready'); }, { once: true });
  }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', measure);
  phone.addEventListener('change', load);
  measure();
  load();
  requestAnimationFrame(tick);
})();
