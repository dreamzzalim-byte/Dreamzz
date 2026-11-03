// Tour 3D de la borne : images pré-calculées défilées au scroll + légendes reliées par un trait.
(async () => {
  const N = 200, SRC = (k) => 'img/' + String(k).padStart(3, '0') + '.webp';
  const LEG = [
    { id: 'ecran', de: 18, a: 56, t: 'Écran tactile', s: 'Les goûts, les photos et le prix, modifiables à distance' },
    { id: 'id', de: 66, a: 100, t: "Lecteur de carte d'identité", s: "Contrôle de l'âge à chaque achat" },
    { id: 'paiement', de: 102, a: 134, t: 'Paiement sans contact', s: 'Carte, téléphone ou montre' },
    { id: 'trappe', de: 140, a: 170, t: 'Trappe de retrait', s: 'Le produit tombe ici' },
    { id: 'led', de: 176, a: 214, t: 'Éclairage LED', s: 'Un halo visible de loin, la nuit' },
  ];
  const P = await fetch('img/legendes.json').then((r) => r.json());
  const tour = document.querySelector('.tour'), cv = document.querySelector('canvas'), g = cv.getContext('2d');
  const svg = document.querySelector('svg.traits'), scene = document.querySelector('.scene'), indice = document.querySelector('.indice');
  const titres = [...document.querySelectorAll('.titre')];
  const NS = 'http://www.w3.org/2000/svg', FOND = 'rgb(12,13,18)';
  LEG.forEach((L) => {
    L.el = document.createElement('div'); L.el.className = 'leg'; L.el.innerHTML = `<b>${L.t}</b><span>${L.s}</span>`; scene.appendChild(L.el);
    L.halo = document.createElementNS(NS, 'polyline'); L.trait = document.createElementNS(NS, 'polyline'); L.pt = document.createElementNS(NS, 'circle');
    L.halo.setAttribute('fill', 'none'); L.halo.setAttribute('stroke', 'rgba(255,255,255,.55)'); L.halo.setAttribute('stroke-width', '3.5');
    L.trait.setAttribute('fill', 'none'); L.trait.setAttribute('stroke', '#0d0d0f'); L.trait.setAttribute('stroke-width', '1.5');
    L.pt.setAttribute('r', '5'); L.pt.setAttribute('fill', '#fff'); L.pt.setAttribute('stroke', '#0d0d0f'); L.pt.setAttribute('stroke-width', '2');
    svg.append(L.halo, L.trait, L.pt);
  });
  const imgs = new Array(N);
  const load = (k) => { if (imgs[k]) return; const im = new Image(); im.decoding = 'async'; im.src = SRC(k); im.onload = () => { last = -1; }; imgs[k] = im; };
  for (let k = 0; k < N; k += 8) load(k); for (let k = 0; k < N; k += 2) load(k); for (let k = 0; k < N; k++) load(k);
  const ok = (k) => imgs[k] && imgs[k].complete && imgs[k].naturalWidth;
  const proche = (k) => { for (let d = 0; d < N; d++) { if (ok(k - d)) return k - d; if (ok(k + d)) return k + d; } return -1; };
  let cur = 0, cible = 0, last = -1, W = 0, H = 0, R = 1, box = { x: 0, y: 0, w: 1, h: 1 };
  function taille() {
    R = Math.min(devicePixelRatio || 1, 2); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * R); cv.height = Math.round(H * R);
    const iw = 576, ih = 1024, large = W / H > 0.75;
    const s = large ? Math.min(W / iw, H / ih) : Math.max(W / iw, H / ih);   // PC : image entière (fond identique) ; téléphone : plein écran
    box = { w: iw * s, h: ih * s }; box.x = (W - box.w) / 2; box.y = (H - box.h) / 2; last = -1;
  }
  function peindre(im, a) { g.globalAlpha = a; g.drawImage(im, box.x * R, box.y * R, box.w * R, box.h * R); g.globalAlpha = 1; }
  const pos = (f, id) => {
    const a = Math.floor(f), b = Math.min(N - 1, a + 1), t = f - a, A = P[a][id], B = P[b][id];
    return [box.x + (A[0] + (B[0] - A[0]) * t) * box.w, box.y + (A[1] + (B[1] - A[1]) * t) * box.h, A[2] + (B[2] - A[2]) * t];
  };
  const fondu = (f, de, a, m = 7) => Math.max(0, Math.min(1, de <= 0 ? 1 : (f - de) / m, (a - f) / m));
  function legendes(f) {
    const vis = [];
    LEG.forEach((L) => {
      const [x, y, face] = pos(f, L.id);
      const o = fondu(f, L.de, L.a) * Math.max(0, Math.min(1, (face - 0.15) / 0.2));
      L.o = o; L.x = x; L.y = y; L.cote = x < W / 2 ? 'g' : 'd';
      if (o > 0.01) vis.push(L);
    });
    for (const cote of ['g', 'd']) {   // empile les étiquettes d'un même côté sans chevauchement
      const l = vis.filter((L) => L.cote === cote).sort((p, q) => p.y - q.y); let bas = 76;
      l.forEach((L) => { L.ly = Math.max(L.y - 60, bas); bas = L.ly + L.el.offsetHeight + 10; });
    }
    const m = Math.max(16, W * 0.04);
    LEG.forEach((L) => {
      const v = L.o > 0.01;
      L.el.style.opacity = v ? L.o : 0; [L.halo, L.trait, L.pt].forEach((e) => e.setAttribute('opacity', v ? L.o : 0));
      if (!v) return;
      if (W < 700) {   // téléphone : étiquette en haut ou en bas de l'écran, trait vertical jusqu'au point
        const gw = L.el.offsetWidth, gh = L.el.offsetHeight, haut = L.y < H * 0.5;
        const lx = Math.max(m, Math.min(W - m - gw, L.x - gw / 2)), ly = haut ? 84 : H - gh - 92;
        L.el.classList.remove('d'); L.el.style.left = lx + 'px'; L.el.style.top = ly + 'px';
        const bx = Math.max(lx + 14, Math.min(lx + gw - 14, L.x)), by = haut ? ly + gh : ly;
        const pts = `${bx},${by} ${bx},${(by + L.y) / 2} ${L.x},${L.y}`;
        L.halo.setAttribute('points', pts); L.trait.setAttribute('points', pts);
        L.pt.setAttribute('cx', L.x); L.pt.setAttribute('cy', L.y);
        return;
      }
      const gw = Math.min(L.el.offsetWidth, W * 0.46);
      const lx = L.cote === 'g' ? m : W - m - gw, bout = L.cote === 'g' ? lx + gw : lx, ty = L.ly + 18;
      L.el.classList.toggle('d', L.cote === 'd');
      L.el.style.left = lx + 'px'; L.el.style.top = L.ly + 'px';
      const coude = L.cote === 'g' ? Math.min(L.x - 24, bout + 30) : Math.max(L.x + 24, bout - 30);
      const pts = `${bout},${ty} ${coude},${ty} ${L.x},${L.y}`;
      L.halo.setAttribute('points', pts); L.trait.setAttribute('points', pts);
      L.pt.setAttribute('cx', L.x); L.pt.setAttribute('cy', L.y);
    });
    titres.forEach((T) => { T.style.opacity = fondu(f, +T.dataset.de, +T.dataset.a + (T.dataset.a == 199 ? 30 : 0), 5); });
  }
  function dessiner(f) {
    const a = Math.floor(f), b = Math.min(N - 1, a + 1), t = f - a, ia = proche(a);
    if (ia < 0) return;
    g.clearRect(0, 0, cv.width, cv.height); peindre(imgs[ia], 1);
    if (t > 0.01 && ok(b) && b !== ia) peindre(imgs[b], t);
    if (box.x > 1) {   // image entière sur PC : on fond ses bords gauche/droite dans le fond du studio
      const f = box.w * 0.16, X = box.x * R, Wd = box.w * R, F = f * R;
      for (const [x0, x1] of [[X, X + F], [X + Wd, X + Wd - F]]) {
        const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, FOND); gr.addColorStop(1, 'rgba(12,13,18,0)');
        g.fillStyle = gr; g.fillRect(Math.min(x0, x1), 0, F, cv.height);
      }
    }
    legendes(f);
  }
  function scroll() {
    const r = tour.getBoundingClientRect(), span = tour.offsetHeight - innerHeight;
    cible = Math.min(1, Math.max(0, -r.top / span)) * (N - 1);
    indice.classList.toggle('off', cible > 2);
  }
  function boucle() {
    cur += (cible - cur) * 0.14; if (Math.abs(cible - cur) < 0.003) cur = cible;
    const cle = Math.round(cur * 200);
    if (cle !== last) { dessiner(cur); last = cle; }
    requestAnimationFrame(boucle);
  }
  indice.addEventListener('click', () => scrollBy({ top: innerHeight * 0.8, behavior: 'smooth' }));
  addEventListener('resize', () => { taille(); scroll(); }); addEventListener('scroll', scroll, { passive: true });
  taille(); scroll(); requestAnimationFrame(boucle);
})();
