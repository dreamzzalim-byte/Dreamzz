// Gabarit commun du site dreamzz.fr : réglages, en-tête, pied de page, icônes.

export const SITE = {
  url: 'https://dreamzz.fr',
  name: 'Dreamzz',
  tel: '07 67 15 17 93',
  telHref: '+33767151793',
  email: 'gestion@dreamzz.fr',
  devisApi: 'https://gestion.dreamzz.fr/api/devis',
  // Location financière : laisser null tant qu'aucun loueur n'a donné son accord.
  // Exemple : { mois: 89, duree: 60 }  → « dès 89 € HT/mois sur 60 mois »
  leasing: null,
};

export const PAGES = [
  { slug: 'distributeur', label: 'Le distributeur' },
  { slug: 'votre-marque', label: 'Votre marque' },
  { slug: 'offres', label: 'Offres' },
  { slug: 'pour-qui', label: 'Pour qui' },
  { slug: 'faq', label: 'FAQ' },
];

// Lien interne : propre en ligne (/offres), fichier en aperçu (offres.html)
export function makeLink(mode) {
  return (slug, hash = '') => {
    const h = hash ? '#' + hash : '';
    if (mode === 'preview') return (slug === '' ? 'index.html' : slug.split('?')[0] + '.html' + (slug.includes('?') ? '?' + slug.split('?')[1] : '')) + h;
    return (slug === '' ? '/' : '/' + slug) + h;
  };
}

const svg = (paths, stroke = 'currentColor') => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
export const ICON = {
  moon: (c) => svg('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', c),
  id: (c) => svg('<rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="9" cy="11" r="2"/><path d="M6.5 16c.5-1.3 1.4-2 2.5-2s2 .7 2.5 2M14 10h4M14 13.5h3"/>', c),
  brand: (c) => svg('<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z"/><path d="M8 10h8M8 14h5"/>', c),
  euro: (c) => svg('<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5a4.5 4.5 0 1 0 0 7M7 10.5h6M7 13.5h6"/>', c),
  phone: (c) => svg('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>', c),
  bell: (c) => svg('<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>', c),
  card: (c) => svg('<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>', c),
  qr: (c) => svg('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2"/>', c),
  check: (c) => svg('<path d="M4 12.5l5 5L20 6.5"/>', c),
  plug: (c) => svg('<path d="M9 3v5M15 3v5M7 8h10v4a5 5 0 0 1-10 0zM12 17v4"/>', c),
  wifi: (c) => svg('<path d="M3.5 9a12.5 12.5 0 0 1 17 0M6.5 12.5a8 8 0 0 1 11 0M9.5 16a3.5 3.5 0 0 1 5 0"/><circle cx="12" cy="19" r="1"/>', c),
  wall: (c) => svg('<rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 9h18M3 14h18M9 4v5M15 9v5M9 14v6"/>', c),
  chart: (c) => svg('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', c),
  box: (c) => svg('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>', c),
  file: (c) => svg('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>', c),
  heart: (c) => svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>', c),
  menu: () => svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
};

// Typographie française dans le texte (hors balises, scripts et styles)
export function typo(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/).map((seg) => {
    if (seg.startsWith('<')) return seg;
    let s = seg.replace(/ ([?!:;»])/g, ' $1').replace(/« /g, '« ').replace(/ €/g, ' €').replace(/ %/g, ' %');
    let prev;
    do { prev = s; s = s.replace(/(\d) (\d{3})(?!\d)/g, '$1 $2'); } while (s !== prev);
    return s;
  }).join('');
}

export function layout(opts) {
  const html = page(opts);
  // en ligne : chemins absolus (la page 404 peut s'afficher à n'importe quelle adresse)
  return opts.mode === 'preview' ? html : html.replace(/(src|href|srcset)="(img|css|js|fonts)\//g, '$1="/$2/').replace(/, (img)\//g, ', /$1/');
}

function page({ mode, slug, title, description, body, jsonld = '', noindex = false }) {
  const L = makeLink(mode);
  const canon = SITE.url + (slug === '' ? '/' : '/' + slug);
  const navLinks = PAGES.map((p) => `<a href="${L(p.slug)}"${p.slug === slug ? ' aria-current="page"' : ''}>${p.label}</a>`).join('\n      ');
  return typo(`<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canon}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta name="theme-color" content="#06071A">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">
<meta property="og:site_name" content="Dreamzz">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${SITE.url}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="48x48" href="img/favicon-48.png">
<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
<link rel="preload" href="fonts/big-shoulders-display-latin-900-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/barlow-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/site.css">
${jsonld}</head>
<body>
<a class="skip" href="#contenu">Aller au contenu</a>
<header class="top">
  <div class="wrap">
    <a class="logo" href="${L('')}" aria-label="Dreamzz, accueil"><img src="img/logo.webp" alt="dreamzz vape" width="124" height="36"></a>
    <nav class="nav" id="nav" aria-label="Menu principal">
      ${navLinks}
      <a class="btn btn-nav" href="${L('devis')}">Demander un devis</a>
    </nav>
    <a class="btn" href="${L('devis')}">Demander un devis</a>
    <button class="burger" type="button" aria-controls="nav" aria-expanded="false" aria-label="Menu">${ICON.menu()}</button>
  </div>
</header>
<main id="contenu">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <img src="img/logo.webp" alt="dreamzz vape" width="117" height="34" loading="lazy">
        <p>Distributeurs automatiques de vape à la marque des commerçants.</p>
      </div>
      <div>
        <h3>Le site</h3>
        <ul>
          ${PAGES.map((p) => `<li><a href="${L(p.slug)}">${p.label}</a></li>`).join('\n          ')}
          <li><a href="${L('devis')}">Demander un devis</a></li>
        </ul>
      </div>
      <div>
        <h3>Contact</h3>
        <ul>
          <li><a href="tel:${SITE.telHref}">${SITE.tel}</a></li>
          <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
          <li>SAS Dreamzz · Lot-et-Garonne</li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© 2026 Dreamzz · <a href="${L('mentions-legales')}">Mentions légales</a> · <a href="${L('confidentialite')}">Confidentialité</a></span>
      <span>Vente de produits du vapotage interdite aux mineurs.</span>
    </div>
  </div>
</footer>
<script src="js/site.js" defer></script>
</body>
</html>
`);
}
