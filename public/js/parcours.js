// Parcours « Du terrain à l'écran » : le film avance avec le scroll et se pose sur chaque fiche.
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

  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

  // Position du scroll → étape (entier) + avancée dans l'étape (0 à 1)
  function where() {
    const top = sec.getBoundingClientRect().top;
    const h = steps[0].offsetHeight || innerHeight * 2;
    const p = Math.max(0, -top / h);
    const i = Math.min(steps.length - 1, Math.floor(p));
    return { i, f: i === steps.length - 1 ? 0 : p - i };
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    dots.forEach((d, k) => d.classList.toggle('on', k === i));
    steps.forEach((s, k) => s.classList.toggle('on', k === i));
    if (calm || !ready) video.poster = `img/labs/parcours/arret-${i}.webp`;
  }

  function onScroll() {
    const { i, f } = where();
    // pause sur la fiche pendant la première moitié, trajet vers l'arrêt suivant pendant la seconde
    const m = ease(Math.min(1, Math.max(0, (f - 0.5) / 0.45)));
    target = i < T.length - 1 ? T[i] + (T[i + 1] - T[i]) * m : T[i];
    setActive(f > 0.75 && i < steps.length - 1 ? i + 1 : i);
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
  addEventListener('resize', onScroll);
  phone.addEventListener('change', load);
  onScroll();
  load();
  requestAnimationFrame(tick);
})();
