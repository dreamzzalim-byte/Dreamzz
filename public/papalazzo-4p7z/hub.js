// PapaLazzo — présentation : visionneuse du catalogue + images en grand
(() => {
  const pad = (i) => String(i).padStart(2, '0');

  // ---------- image en grand (visuels et pages du catalogue)
  const box = document.querySelector('.lightbox');
  const big = box.querySelector('img');
  const lbPrev = box.querySelector('.lb-prev');
  const lbNext = box.querySelector('.lb-next');
  let set = [], at = 0;

  function show(k) {
    at = Math.min(set.length - 1, Math.max(0, k));
    big.src = set[at].src;
    big.alt = set[at].alt;
    lbPrev.hidden = at === 0;
    lbNext.hidden = at === set.length - 1;
  }
  function open(list, k, isPage) {
    set = list; show(k);
    box.classList.toggle('is-page', !!isPage);
    document.body.classList.add('lb-open');
    if (box.showModal) box.showModal(); else box.setAttribute('open', '');
  }
  function close() { if (box.close) box.close(); else box.removeAttribute('open'); }
  box.addEventListener('close', () => document.body.classList.remove('lb-open'));
  box.querySelector('.close').addEventListener('click', close);
  lbPrev.addEventListener('click', () => show(at - 1));
  lbNext.addEventListener('click', () => show(at + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(at + 1);
    if (e.key === 'ArrowLeft') show(at - 1);
  });
  swipe(box, (d) => show(at + d));

  // balayage horizontal ; renvoie true si le geste était un balayage
  function swipe(el, fn) {
    let x0 = null, y0 = null;
    el.addEventListener('pointerdown', (e) => { x0 = e.clientX; y0 = e.clientY; delete el.dataset.swiped; });
    el.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { el.dataset.swiped = '1'; fn(dx < 0 ? 1 : -1); }
    });
    el.addEventListener('pointercancel', () => { x0 = null; });
  }

  const gal = [...document.querySelectorAll('.gallery button')];
  const galSet = gal.map((b) => ({ src: b.dataset.full, alt: b.querySelector('img').alt }));
  gal.forEach((b, k) => b.addEventListener('click', () => open(galSet, k)));

  // ---------- catalogue
  const v = document.querySelector('.viewer');
  if (!v) return;
  const n = +v.dataset.pages;
  const img = v.querySelector('.page');
  const prev = v.querySelector('.prev');
  const next = v.querySelector('.next');
  const count = v.querySelector('.count b');
  const list = v.querySelector('.thumbs');
  const stage = v.querySelector('.stage');
  const pages = Array.from({ length: n }, (_, k) => ({ src: `proposition/p${pad(k + 1)}.webp`, alt: `Proposition PapaLazzo, page ${k + 1}` }));
  let cur = 1;

  for (let i = 1; i <= n; i++) {
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" aria-label="Page ${i}"><img src="proposition/t${pad(i)}.webp" alt="" loading="lazy" width="360" height="509"></button>`;
    li.firstChild.addEventListener('click', () => go(i));
    list.appendChild(li);
  }
  const thumbs = [...list.querySelectorAll('button')];
  const preload = (i) => { if (i >= 1 && i <= n) { const p = new Image(); p.src = pages[i - 1].src; } };

  function go(i) {
    cur = Math.min(n, Math.max(1, i));
    img.src = pages[cur - 1].src;
    img.alt = pages[cur - 1].alt;
    count.textContent = pad(cur);
    prev.disabled = cur === 1;
    next.disabled = cur === n;
    thumbs.forEach((t, k) => t.setAttribute('aria-current', k + 1 === cur ? 'true' : 'false'));
    const t = thumbs[cur - 1].parentElement;
    list.scrollTo({ left: t.offsetLeft - list.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
    preload(cur + 1); preload(cur - 1);
  }

  prev.addEventListener('click', (e) => { e.stopPropagation(); go(cur - 1); });
  next.addEventListener('click', (e) => { e.stopPropagation(); go(cur + 1); });
  document.addEventListener('keydown', (e) => {
    if (box.open) return;
    const r = v.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    if (e.key === 'ArrowRight') go(cur + 1);
    if (e.key === 'ArrowLeft') go(cur - 1);
  });
  swipe(stage, (d) => go(cur + d));
  // un appui sur la page l'ouvre en plein écran
  v.querySelector('.page-btn').addEventListener('click', () => {
    if (stage.dataset.swiped) { delete stage.dataset.swiped; return; }
    open(pages, cur - 1, true);
  });

  go(1);
})();
