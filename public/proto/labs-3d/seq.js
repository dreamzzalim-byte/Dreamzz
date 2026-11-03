// Séquences 3D pré-calculées défilées au scroll, avec légendes reliées par un trait (une par section .seq).
(() => {
  const NS = 'http://www.w3.org/2000/svg', FOND = [192, 189, 186];
  const sections = [...document.querySelectorAll('.seq')];
  const etats = sections.map((sec) => {
    const N = +sec.dataset.n, dir = sec.dataset.dir, LEG = JSON.parse(sec.querySelector('script[type="application/json"]').textContent);
    const scene = sec.querySelector('.scene'), cv = sec.querySelector('canvas'), g = cv.getContext('2d'), svg = sec.querySelector('svg');
    const imgs = new Array(N); const S = { sec, N, dir, LEG, scene, cv, g, svg, imgs, cur: 0, cible: 0, last: -1, P: null, box: {}, W: 0, H: 0, R: 1, charge: false };
    fetch(dir + 'legendes.json').then((r) => r.json()).then((p) => { S.P = p; S.last = -1; });
    LEG.forEach((L) => {
      L.el = document.createElement('div'); L.el.className = 'leg'; L.el.innerHTML = `<b>${L.t}</b><span>${L.s}</span>`; scene.appendChild(L.el);
      L.halo = document.createElementNS(NS, 'polyline'); L.trait = document.createElementNS(NS, 'polyline'); L.pt = document.createElementNS(NS, 'circle');
      L.halo.setAttribute('fill', 'none'); L.halo.setAttribute('stroke', 'rgba(255,255,255,.7)'); L.halo.setAttribute('stroke-width', '3.5');
      L.trait.setAttribute('fill', 'none'); L.trait.setAttribute('stroke', '#14161c'); L.trait.setAttribute('stroke-width', '1.5');
      L.pt.setAttribute('r', '5'); L.pt.setAttribute('fill', '#3fb6ef'); L.pt.setAttribute('stroke', '#fff'); L.pt.setAttribute('stroke-width', '2');
      svg.append(L.halo, L.trait, L.pt);
    });
    return S;
  });
  function charger(S) {
    if (S.charge) return; S.charge = true;
    const load = (k) => { if (S.imgs[k]) return; const im = new Image(); im.decoding = 'async'; im.src = S.dir + String(k).padStart(3, '0') + '.webp'; im.onload = () => { S.last = -1; }; S.imgs[k] = im; };
    for (let k = 0; k < S.N; k += 6) load(k); for (let k = 0; k < S.N; k++) load(k);
  }
  const ok = (S, k) => S.imgs[k] && S.imgs[k].complete && S.imgs[k].naturalWidth;
  const proche = (S, k) => { for (let d = 0; d < S.N; d++) { if (ok(S, k - d)) return k - d; if (ok(S, k + d)) return k + d; } return -1; };
  function taille(S) {
    S.R = Math.min(devicePixelRatio || 1, 2); S.W = S.cv.clientWidth; S.H = S.cv.clientHeight;
    S.cv.width = Math.round(S.W * S.R); S.cv.height = Math.round(S.H * S.R);
    const iw = 9, ih = 16, s = Math.min(S.W / iw, S.H / ih);   // image entière (fond uni = raccord invisible)
    S.box = { w: iw * s, h: ih * s }; S.box.x = (S.W - S.box.w) / 2; S.box.y = (S.H - S.box.h) / 2; S.last = -1;
  }
  const fondu = (f, de, a, m = 6) => Math.max(0, Math.min(1, de <= 0 ? 1 : (f - de) / m, (a - f) / m));
  function legendes(S, f) {
    if (!S.P) return;
    const a = Math.floor(f), b = Math.min(S.N - 1, a + 1), t = f - a, m = Math.max(16, S.W * 0.04);
    let pileH = 0, pileB = 0;
    S.LEG.forEach((L) => {
      const A = S.P[a] && S.P[a][L.id], B = S.P[b] && S.P[b][L.id];
      if (!A || !B) { L.o = 0; } else {
        L.x = S.box.x + (A[0] + (B[0] - A[0]) * t) * S.box.w; L.y = S.box.y + (A[1] + (B[1] - A[1]) * t) * S.box.h;
        L.o = fondu(f, L.de, L.a) * Math.max(0, Math.min(1, ((A[2] + (B[2] - A[2]) * t) - 0.1) / 0.2));
      }
      const v = L.o > 0.01;
      L.el.style.opacity = v ? L.o : 0; [L.halo, L.trait, L.pt].forEach((e) => e.setAttribute('opacity', v ? L.o : 0));
      if (!v) return;
      const gw = L.el.offsetWidth, gh = L.el.offsetHeight, haut = L.y > S.H * 0.55;
      const lx = Math.max(m, Math.min(S.W - m - gw, L.x - gw / 2 + (L.dx || 0)));
      const ly = haut ? S.H * 0.24 + pileH : S.H - gh - 96 - pileB;
      if (haut) pileH += gh + 8; else pileB += gh + 8;
      L.el.style.left = lx + 'px'; L.el.style.top = ly + 'px';
      const bx = Math.max(lx + 14, Math.min(lx + gw - 14, L.x)), by = haut ? ly + gh : ly;
      const pts = `${bx},${by} ${bx},${(by + L.y) / 2} ${L.x},${L.y}`;
      L.halo.setAttribute('points', pts); L.trait.setAttribute('points', pts); L.pt.setAttribute('cx', L.x); L.pt.setAttribute('cy', L.y);
    });
  }
  function peindre(S, im, al) { S.g.globalAlpha = al; S.g.drawImage(im, S.box.x * S.R, S.box.y * S.R, S.box.w * S.R, S.box.h * S.R); S.g.globalAlpha = 1; }
  function dessiner(S, f) {
    const a = Math.floor(f), b = Math.min(S.N - 1, a + 1), t = f - a, ia = proche(S, a);
    if (ia < 0) return;
    S.g.fillStyle = `rgb(${FOND})`; S.g.fillRect(0, 0, S.cv.width, S.cv.height);
    peindre(S, S.imgs[ia], 1); if (t > 0.01 && ok(S, b) && b !== ia) peindre(S, S.imgs[b], t);
    if (S.box.x > 1) for (const [x0, x1] of [[S.box.x, S.box.x + S.box.w * 0.16], [S.box.x + S.box.w, S.box.x + S.box.w * 0.84]]) {
      const gr = S.g.createLinearGradient(x0 * S.R, 0, x1 * S.R, 0); gr.addColorStop(0, `rgb(${FOND})`); gr.addColorStop(1, `rgba(${FOND},0)`);
      S.g.fillStyle = gr; S.g.fillRect(Math.min(x0, x1) * S.R, 0, S.box.w * 0.16 * S.R, S.cv.height);
    }
    legendes(S, f);
  }
  function scroll() {
    etats.forEach((S) => {
      const r = S.sec.getBoundingClientRect(), span = S.sec.offsetHeight - innerHeight;
      if (r.top < innerHeight * 2 && r.bottom > -innerHeight) charger(S);
      S.cible = Math.min(1, Math.max(0, -r.top / span)) * (S.N - 1);
    });
    const ind = document.querySelector('.indice'); if (ind) ind.classList.toggle('off', scrollY > 40);
  }
  function boucle() {
    etats.forEach((S) => {
      S.cur += (S.cible - S.cur) * 0.14; if (Math.abs(S.cible - S.cur) < 0.003) S.cur = S.cible;
      const cle = Math.round(S.cur * 200) + (S.P ? 1 : 0) * 1e6;
      if (cle !== S.last) { dessiner(S, S.cur); S.last = cle; }
    });
    requestAnimationFrame(boucle);
  }
  addEventListener('resize', () => { etats.forEach(taille); scroll(); }); addEventListener('scroll', scroll, { passive: true });
  etats.forEach(taille); scroll(); requestAnimationFrame(boucle);
})();
