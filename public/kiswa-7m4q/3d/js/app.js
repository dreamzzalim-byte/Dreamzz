// KISWA — Résine . Sols . Design
// Tout le contenu éditable de la page est dans CONTENT. Une ligne de contact vide n'est pas affichée.

const CONTENT = {
  // Logo : data URI (ex. "data:image/svg+xml;base64,…" ou "data:image/png;base64,…").
  // Vide = le mot ci-dessous est composé en typographie.
  logo: '',
  marque: 'KISWA',
  baseline: 'RÉSINE . SOLS . DESIGN',
  sousLigne: 'Revêtements de sols en résine — Agen et alentours',
  zone: 'Agen et alentours',
  defiler: 'Défiler',

  finitions: {
    titre: 'Finitions',
    liste: [
      {
        onglet: 'Métallisée',
        nom: 'Résine époxy métallisée',
        repere: '#A9643A',
        lignes: [{ nombre: '31', libelle: 'teintes', codes: 'M-01 — M-31' }]
      },
      {
        onglet: 'Flakes',
        nom: 'Flakes',
        repere: '#3C3E41',
        lignes: [{ nombre: '10', libelle: 'mélanges', codes: 'F-01 — F-10' }]
      },
      {
        onglet: 'Monochrome',
        nom: 'Résine époxy monochrome',
        repere: '#74777A',
        lignes: [
          { nombre: '7', libelle: 'primaires', codes: 'P-01 — P-07' },
          { nombre: '7', libelle: 'pigments liquides', codes: 'L-01 — L-07' }
        ]
      }
    ]
  },

  coupe: {
    titre: 'Le sol en coupe',
    couches: ['Support béton préparé', 'Primaire', 'Résine', 'Finition']
  },

  savoirFaire: {
    titre: 'Savoir-faire',
    paragraphes: [
      "Chaque sol est réalisé couche après couche, avec la même exigence, de la préparation du support jusqu'aux finitions."
    ]
  },

  chiffres: [
    { nombre: '31', libelle: 'teintes métallisées' },
    { nombre: '10', libelle: 'mélanges flakes' },
    { nombre: '7', libelle: 'primaires' },
    { nombre: '7', libelle: 'pigments liquides' }
  ],

  // Coordonnées non confirmées : laisser vide tant qu'elles ne le sont pas.
  contact: {
    telephone: '',
    email: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  }
};

// Identité visuelle (catalogue « La coulée »)
const COULEURS = {
  beton: '#D5D2CD', noir: '#0C0C0D', or: '#C8A769', cuivre: '#8E5230',
  metallisee: '#A9643A', flakes: '#3C3E41', monochrome: '#74777A'
};

// ---------------------------------------------------------------------------------

const $ = (name) => document.querySelector(`[data-el="${name}"]`);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let selected = 0;          // onglet affiché dans le panneau des finitions
let choice = null;         // finition choisie par le visiteur (null = résine signature noir bronze)

// --- Construction de la page à partir de CONTENT --------------------------------------
function setMark(node) {
  node.textContent = '';
  if (CONTENT.logo) {
    const img = new Image();
    img.src = CONTENT.logo; img.alt = CONTENT.marque;
    node.appendChild(img);
  } else {
    node.textContent = CONTENT.marque;
  }
}

const swatches = [
  'linear-gradient(128deg, #2A160D 0%, #8E5230 24%, #C8A769 46%, #A9643A 63%, #5A311B 82%, #C8A769 100%)',
  'linear-gradient(160deg, #4B4D50 0%, #3C3E41 50%, #2D2F32 100%)',
  'linear-gradient(160deg, #8B8E91 0%, #74777A 45%, #5E6163 100%)'
];

function renderFinish(i) {
  const f = CONTENT.finitions.liste[i];
  const box = $('finish');
  box.textContent = '';
  box.appendChild(el('h3', null, f.nom));
  const rows = el('div', 'rows');
  for (const l of f.lignes) {
    const row = el('div', 'row');
    row.append(el('span', 'n', l.nombre), el('span', 'l', l.libelle), el('span', 'codes', l.codes));
    rows.appendChild(row);
  }
  box.appendChild(rows);
  box.setAttribute('aria-labelledby', `onglet-${i}`);
  document.querySelector('.sec-fin .pin').style.setProperty('--swatch', swatches[i] || COULEURS.noir);
}

function selectFinish(i, focus, user = true) {
  selected = i;
  if (user) choice = i;
  document.querySelectorAll('.tab').forEach((t, k) => {
    const on = k === i;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  });
  document.querySelectorAll('.bar button').forEach((b, k) => b.setAttribute('aria-pressed', choice === k ? 'true' : 'false'));
  renderFinish(i);
}

function build() {
  $('markSmall').textContent = CONTENT.marque;
  setMark($('heroMark'));
  $('heroBaseline').textContent = CONTENT.baseline;
  // coupe de ligne possible seulement après le tiret
  const sub = $('heroSub');
  const cut = CONTENT.sousLigne.indexOf('— ');
  const parts = cut > 0 ? [CONTENT.sousLigne.slice(0, cut + 1), CONTENT.sousLigne.slice(cut + 2)] : [CONTENT.sousLigne];
  parts.forEach((part, i) => { if (i) sub.append(' '); sub.appendChild(el('span', null, part)); });
  $('cue').textContent = CONTENT.defiler;

  $('finTitre').textContent = CONTENT.finitions.titre;
  const tabs = $('tabs');
  tabs.setAttribute('aria-label', CONTENT.finitions.titre);
  CONTENT.finitions.liste.forEach((f, i) => {
    const b = el('button', 'tab');
    b.type = 'button'; b.id = `onglet-${i}`;
    b.setAttribute('role', 'tab');
    b.style.setProperty('--c', f.repere);
    b.append(el('span', 'sw'), el('span', null, f.onglet));
    b.addEventListener('click', () => selectFinish(i));
    b.addEventListener('keydown', (ev) => {
      const n = CONTENT.finitions.liste.length;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); selectFinish((i + 1) % n, true); }
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); selectFinish((i + n - 1) % n, true); }
    });
    tabs.appendChild(b);
  });
  selectFinish(0, false, false);

  // sélecteur de finition, accessible à tout moment du récit (nouvelle touche sur la finition active : retour à la signature)
  const bar = el('div', 'bar');
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', CONTENT.finitions.titre);
  CONTENT.finitions.liste.forEach((f, i) => {
    const b = el('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.style.setProperty('--c', f.repere);
    b.append(el('span', 'sw'), el('span', null, f.onglet));
    b.addEventListener('click', () => {
      if (choice === i) { choice = null; selectFinish(selected, false, false); }
      else selectFinish(i);
    });
    bar.appendChild(b);
  });
  document.body.appendChild(bar);

  $('coupeTitre').textContent = CONTENT.coupe.titre;
  CONTENT.coupe.couches.forEach((c, i) => {
    const li = el('li', 'tag');
    li.append(el('span', 'num', String(i + 1).padStart(2, '0')), el('span', null, c));
    $('tags').appendChild(li);
  });

  $('savoirTitre').textContent = CONTENT.savoirFaire.titre;
  for (const p of CONTENT.savoirFaire.paragraphes) $('savoirTexte').appendChild(el('p', null, p));

  for (const c of CONTENT.chiffres) {
    const li = el('li');
    li.append(el('span', 'n', c.nombre), el('span', 'l', c.libelle));
    $('chiffres').appendChild(li);
  }

  setMark($('endMark'));
  $('endBaseline').textContent = CONTENT.baseline;
  $('endZone').textContent = CONTENT.zone;

  // contact : une ligne n'existe que si la donnée est renseignée
  const c = CONTENT.contact || {};
  const web = (v) => (/^https?:\/\//i.test(v) ? v : '');
  const lines = [
    ['Téléphone', c.telephone, c.telephone ? 'tel:' + String(c.telephone).replace(/[^\d+]/g, '') : ''],
    ['E-mail', c.email, c.email ? 'mailto:' + String(c.email).trim() : ''],
    ['Instagram', c.instagram, web(c.instagram || '')],
    ['Facebook', c.facebook, web(c.facebook || '')],
    ['LinkedIn', c.linkedin, web(c.linkedin || '')]
  ].filter((l) => l[1] && String(l[1]).trim());
  const box = $('contact');
  for (const [k, v, href] of lines) {
    const line = el('p', 'line');
    line.appendChild(el('span', 'k', k));
    const val = href ? el('a', 'v', String(v).trim()) : el('span', 'v', String(v).trim());
    if (href) { val.href = href; if (/^http/i.test(href)) { val.target = '_blank'; val.rel = 'noopener'; } }
    line.appendChild(val);
    box.appendChild(line);
  }
  box.hidden = lines.length === 0;
}

// --- Récit piloté par le défilement -----------------------------------------------------
const secs = ['ouverture', 'finitions', 'coupe', 'savoir-faire', 'chiffres', 'fin'].map((id) => document.getElementById(id));
let layout = [], vh = 1;
function measure() {
  vh = window.innerHeight;
  layout = secs.map((s) => ({ top: s.offsetTop, h: s.offsetHeight }));
}
function story(sy) {
  let u = clamp(sy / Math.max(layout[0].h - vh, 1), 0, 1);
  for (let i = 1; i < layout.length; i++) u += clamp((sy - (layout[i].top - vh)) / layout[i].h, 0, 1);
  return u;
}

const cache = new Map();
function style(node, o, y) {
  const key = o.toFixed(3) + '|' + (y || 0).toFixed(1);
  if (cache.get(node) === key) return;
  cache.set(node, key);
  node.style.opacity = o.toFixed(3);
  if (y !== undefined) node.style.transform = y > 0.05 ? `translate3d(0,${y.toFixed(1)}px,0)` : 'none';
  node.style.visibility = o < 0.004 ? 'hidden' : 'visible';
}

function start3d(scene) {
  const nodes = {
    markSmall: $('markSmall'), cue: $('cue'), heroLockup: $('heroLockup'), panel: $('panel'),
    coupeTitre: $('coupeTitre'), endLockup: $('endLockup'),
    tags: [...document.querySelectorAll('.tag')], figs: [...document.querySelectorAll('.figures li')],
    coupePin: document.querySelector('.sec-coupe .pin'), gold: secs[3], bar: document.querySelector('.bar')
  };
  let uS = 0, last = performance.now(), raf = 0, tagW = [], zoneEnd = 3.9;

  function dom(u) {
    const p0 = clamp(u, 0, 1), p1 = clamp(u - 1, 0, 1), c = clamp(u - 2, 0, 1), p4 = clamp(u - 4, 0, 1), p5 = clamp(u - 5, 0, 1);
    const out = 1 - smooth(0.0, 0.05, p0);
    style(nodes.markSmall, out); style(nodes.cue, out);
    const o = smooth(0.40, 0.55, p0);
    style(nodes.heroLockup, o, (1 - o) * 18);
    const op = smooth(0.42, 0.60, p1);
    style(nodes.panel, op, (1 - op) * 26);
    // le sélecteur s'efface tant que le panneau des finitions (qui a les mêmes onglets) est à l'écran
    const panelOn = op * (1 - smooth(0.25, 0.45, c));
    if (nodes.bar) style(nodes.bar, smooth(0.02, 0.08, p0) * (1 - panelOn));
    style(nodes.coupeTitre, smooth(0.36, 0.44, c));
    const leave = 1 - smooth(0.04, 0.30, p5);
    nodes.figs.forEach((n, i) => { const f = smooth(0.50 + i * 0.03, 0.66 + i * 0.03, p4); style(n, f * leave, (1 - f) * 20); });
    const oe = smooth(0.72, 0.92, p5);
    style(nodes.endLockup, oe, (1 - oe) * 14);
  }

  function tags(u) {
    const c = clamp(u - 2, 0, 1);
    const top = nodes.coupePin.getBoundingClientRect().top;
    const W = window.innerWidth;
    nodes.tags.forEach((n, i) => {
      const a = scene.anchors[i];
      const o = a.on ? smooth(0.44 + i * 0.012, 0.49 + i * 0.012, c) * (1 - smooth(0.975, 1.0, c)) : 0;
      n.style.opacity = o.toFixed(3);
      n.style.visibility = o < 0.004 ? 'hidden' : 'visible';
      if (o < 0.004) return;
      if (!tagW[i]) tagW[i] = n.offsetWidth;
      const x = Math.min(a.x + 38, W - tagW[i] - 10);
      const lead = Math.max(x - a.x - 8, 0);
      n.style.setProperty('--lead', lead.toFixed(1) + 'px');
      n.style.transform = `translate3d(${x.toFixed(1)}px,${(a.y - top - n.offsetHeight / 2).toFixed(1)}px,0)`;
    });
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    const target = story(window.scrollY);
    // la scène suit le défilement presque sans retard : elle s'arrête quand le visiteur s'arrête
    if (reduced || Math.abs(target - uS) < 0.0004) uS = target;
    else uS += (target - uS) * (1 - Math.exp(-dt * 18));
    dom(uS);
    // page or : quand elle remplit l'écran, la 3D est masquée (pas de rendu, changement de finition immédiat)
    const g = nodes.gold.getBoundingClientRect();
    const seen = (Math.min(g.bottom, vh) - Math.max(g.top, 0)) / vh;
    const zone = uS >= 1.35 && uS < zoneEnd;
    scene.setTargetFinish(choice !== null ? choice + 1 : (zone ? selected + 1 : 0), seen > 0.9);
    if (seen > 0.999) return;
    if (scene.frame(uS, dt)) { scene.watchPerf(dt); tags(uS); }
  }

  const relayout = () => {
    measure(); tagW = []; scene.resize();
    zoneEnd = 3.5 + 0.5 * clamp(vh / Math.max(layout[3].h, 1), 0, 1);   // milieu du passage plein écran de la page or
  };
  let rz = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(relayout); });
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(raf);
    if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(tick); }
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout).catch(() => {});

  relayout();
  uS = story(window.scrollY);
  raf = requestAnimationFrame(tick);
}

async function init() {
  build();
  const canvas = document.getElementById('scene');
  let ok = false;
  try {
    const probe = document.createElement('canvas').getContext('webgl2');
    if (probe) {
      const mod = await import('./scene.js');
      document.documentElement.classList.add('gl');
      const scene = mod.createScene({ canvas, reduced, colors: COULEURS });
      const bar = document.querySelector('.loader i');
      await scene.warm((p) => { if (bar) bar.style.transform = `scaleX(${p.toFixed(3)})`; });
      start3d(scene);
      ok = true;
    }
  } catch (err) {
    ok = false;
  }
  if (!ok) document.documentElement.classList.remove('gl');   // repli : page statique en CSS
  const loader = document.querySelector('.loader');
  if (loader) {
    requestAnimationFrame(() => requestAnimationFrame(() => loader.classList.add('done')));
    setTimeout(() => loader.remove(), 900);
  }
}

init();
