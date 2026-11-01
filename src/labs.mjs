// Carrefour (/) et page Dreamzz Labs (/labs) de dreamzz.fr
import { SITE, LABS, makeLink } from './site.mjs';

// Étiquette signature Dreamzz Labs : carte blanche, néon cyan, pastille ZZ qui chevauche
const tag = (label, cls = '', style = '') => `<span class="ztag ${cls}"${style ? ` style="${style}"` : ''}><i aria-hidden="true"><img src="img/labs/zz.webp" alt="" width="40" height="34"></i><b>${label}</b></span>`;

const picV = (name, alt) => `<img src="img/labs/${name}-v-480.webp" srcset="img/labs/${name}-v-480.webp 480w, img/labs/${name}-v-720.webp 720w" sizes="(max-width: 1080px) 50vw, 290px" alt="${alt}" width="480" height="853" loading="lazy">`;
const pic = (name, alt, w = [600, 900], sizes = '(max-width: 900px) 100vw, 400px', eager = false) =>
  `<img src="img/labs/${name}-${w[0]}.webp" srcset="img/labs/${name}-${w[0]}.webp ${w[0]}w, img/labs/${name}-${w[1]}.webp ${w[1]}w" sizes="${sizes}" alt="${alt}" width="${w[0]}" height="${Math.round(w[0] * 1.25)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;

const PACKS = [
  { id: 'essentiel', name: 'Essentiel', price: '249', delay: '3 jours', items: ['3 visuels réseaux', 'Photo de profil', 'Logo', 'Bannière'] },
  { id: 'reseaux', name: 'Réseaux', price: '449', delay: '7 jours', top: true, items: ['Tout le pack Essentiel', 'Flyer', '6 stories', 'Carte de visite'] },
  { id: 'lancement', name: 'Lancement', price: '790', delay: '10 jours', items: ['Tout le pack Réseaux', 'Vidéo pub 15 s', 'Charte graphique', 'Lens Snap'] },
];


// Parcours « Du terrain à l'écran » : un film qui avance au scroll, une fiche par arrêt.
// t = seconde du film où la caméra se pose ; side = côté libre de l'image (ordinateur) ; x = cadrage téléphone (0 à 100).
const STOPS = [
  { id: 'route', t: 0, side: 'l', x: 50 },
  { id: 'barber', t: 3.1, side: 'l', x: 62 },
  { id: 'atelier', t: 6.6, side: 'r', x: 70 },
  { id: 'bistrot', t: 10.2, side: 'l', x: 60 },
  { id: 'chantier', t: 13.8, side: 'l', x: 52 },
  { id: 'aerien', t: 17.4, side: 'l', x: 50 },
];
const IDS = ['', 'packs', 'applis', 'site', 'terrain', 'au-mois'];
const at = (i) => `${IDS[i] ? `id="${IDS[i]}" ` : ''}data-stop="${i}" data-t="${STOPS[i].t}" data-side="${STOPS[i].side}" data-x="${STOPS[i].x}"`;
const price = (n, u = '') => `<b class="sq-p">${n} €${u}</b>`;

const STEPS = [
  ['On écoute ton projet', '15 min au téléphone ou sur WhatsApp : ton idée, ton style, ton budget.'],
  ['Les pistes', '4 pistes de logo. Tu choisis ta préférée.'],
  ['Retouches', '2 tours de modifs inclus.'],
  ['Tu reçois tout', 'Fichiers prêts à poster et à imprimer.'],
];

const CASES = [
  ['Déjà un logo ?', 'On part du tien.'],
  ['Juste un flyer ?', 'On fait juste le flyer.'],
  ['Budget serré ?', 'On adapte le pack.'],
  ['Une idée précise ?', 'On suit ta vision.'],
];

const FAQ = [
  ['Mon projet ne rentre dans aucun pack ?', 'On compose un pack sur mesure, au prix de ton projet.'],
  ['J’ai déjà un logo, je fais quoi ?', 'On part de ton logo et on construit le reste du pack autour.'],
  ['Combien de temps ça prend ?', '3 jours pour l’Essentiel, 7 jours pour Réseaux, 10 jours pour Lancement, à partir de notre premier échange.'],
  ['Comment je paie ?', '50 % à la commande, 50 % à la livraison.'],
  ['Et si le rendu ne me plaît pas ?', 'Chaque pack inclut 2 tours de modifs.'],
  ['Je reçois quels fichiers ?', 'Des fichiers haute définition, prêts à poster sur les réseaux et à imprimer.'],
  ['Vous travaillez où ?', 'Partout en France, à distance : téléphone, WhatsApp et e-mail.'],
  ['Les fichiers sont à moi ?', 'Oui. Une fois le pack réglé, tu les utilises librement pour ton commerce.'],
];

const NEEDS = [['essentiel', 'Pack Essentiel'], ['reseaux', 'Pack Réseaux'], ['lancement', 'Pack Lancement'], ['site', 'Site web'], ['appli', 'Appli'], ['borne', 'Borne'], ['terrain', 'Appli terrain'], ['suivi', 'Suivi au mois'], ['mesure', 'Sur mesure'], ['nsp', 'Je ne sais pas encore']];
const ACTIVITIES = ['Restaurant, snack', 'Coiffure, barber', 'Beauté, esthétique', 'Boutique', 'Artisan, BTP', 'Service, profession libérale', 'Autre'];

// ---------------- Carrefour ----------------
export function hubPage(mode) {
  const L = makeLink(mode);
  return {
    file: 'index.html', slug: '', section: 'hub', og: 'og-hub.jpg',
    title: mode === 'preview' ? 'dreamzz.fr' : 'Dreamzz · Distributeurs automatiques et studio Labs',
    description: 'Dreamzz : distributeurs automatiques à la marque des commerçants, et Dreamzz Labs, packs design, sites et applis pour les commerces.',
    jsonld: `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Organization', '@id': SITE.url + '/#org', name: 'Dreamzz', legalName: 'SAS Dreamzz', url: SITE.url,
      logo: SITE.url + '/img/icon-512.png', email: SITE.email, telephone: '+33 7 67 15 17 93',
      address: { '@type': 'PostalAddress', addressLocality: 'Estillac', postalCode: '47310', addressCountry: 'FR' },
    })}</script>\n`,
    body: `
<section class="doors">
  <h1 class="sr">Dreamzz : distributeurs automatiques et studio Labs</h1>
  <a class="door door-l" href="${L('labs')}">
    <img src="img/labs/hub-1000.webp" srcset="img/labs/hub-640.webp 640w, img/labs/hub-1000.webp 1000w" sizes="(max-width: 900px) 100vw, 50vw" alt="" width="1000" height="1250" fetchpriority="high">
    <span class="door-in">
      <img class="door-logo" src="img/labs/labs-logo-sm.webp" alt="dreamzz labs" width="130" height="34">
      <span class="door-k">Studio design &amp; digital</span>
      <span class="door-h">Ton commerce, <em>on s’occupe de tout.</em></span>
      <span class="door-p">Packs design, sites, applis, bornes. Dès 99 €.</span>
      <span class="btn">Découvrir Dreamzz Labs</span>
    </span>
  </a>
  <a class="door door-d" href="${L('distributeurs')}">
    <img src="img/facade-900.webp" srcset="img/facade-900.webp 900w, img/facade-1600.webp 1536w" sizes="(max-width: 900px) 100vw, 50vw" alt="" width="900" height="600">
    <span class="door-in">
      <img class="door-logo" src="img/logo.webp" alt="dreamzz vape" width="124" height="36">
      <span class="door-k">Distributeurs automatiques</span>
      <span class="door-h">Vendez 24h/24. <em>Même rideau baissé.</em></span>
      <span class="door-p">Un distributeur mural à la marque de votre magasin.</span>
      <span class="btn">Découvrir les distributeurs</span>
    </span>
  </a>
</section>`,
  };
}

// ---------------- Dreamzz Labs ----------------
export function labsPage(mode) {
  const L = makeLink(mode);
  const wa = LABS.wa + '?text=' + encodeURIComponent('Bonjour, je veux un devis Dreamzz Labs.');
  return {
    file: 'labs.html', slug: 'labs', section: 'labs', og: 'og-labs.jpg',
    title: 'Dreamzz Labs · Packs design, sites et applis pour les commerces',
    description: 'Packs design dès 249 € HT, sites web dès 99 € HT, applis dès 990 € HT, bornes et applis terrain. Sur mesure, devis gratuit.',
    jsonld: `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': SITE.url + '/labs#labs', name: 'Dreamzz Labs',
      parentOrganization: { '@id': SITE.url + '/#org' }, url: SITE.url + '/labs', image: SITE.url + '/img/og-labs.jpg',
      telephone: '+33 7 67 15 17 93', email: SITE.email, areaServed: 'FR',
      address: { '@type': 'PostalAddress', addressLocality: 'Estillac', postalCode: '47310', addressCountry: 'FR' },
      makesOffer: PACKS.map((p) => ({ '@type': 'Offer', name: 'Pack design ' + p.name, price: p.price, priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price, priceCurrency: 'EUR', valueAddedTaxIncluded: false } })),
    })}</script>
<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    })}</script>\n`,
    body: `
<section class="sq" id="parcours" aria-label="Nos offres, du terrain à l’écran">
  <div class="sq-stage">
    <video class="sq-video" muted playsinline preload="auto" poster="img/labs/parcours/arret-0.webp" data-src="img/labs/parcours/parcours" aria-hidden="true"></video>
    <div class="sq-shade"></div>
    <ol class="sq-dots" aria-hidden="true">${STOPS.map(() => '<li></li>').join('')}</ol>
    <p class="sq-hint" aria-hidden="true">Fais défiler</p>
    <p class="sq-ia">Images générées par IA.</p>
  </div>
  <div class="sq-steps">
    <div class="sq-step" ${at(0)}><div class="sq-pin"><article class="sq-card sq-intro">
      <p class="kicker">Dreamzz Labs</p>
      <h1>Du terrain <span class="accent">à l’écran.</span></h1>
      <p class="lead">Design, sites, applis et bornes, pour les commerces et les équipes. Sur mesure.</p>
      <div class="btns"><a class="btn" href="#devis">Devis gratuit</a><a class="btn btn-ghost" href="${wa}" rel="noopener">WhatsApp</a></div>
    </article></div></div>
    <div class="sq-step" ${at(1)}><div class="sq-pin"><article class="sq-card">
      ${tag('PACKS DESIGN', 'xs sq-tag')}
      <h2>Toute ton image, d’un coup.</h2>
      <ul class="sq-list">${PACKS.map((p) => `
        <li class="${p.top ? 'is-top' : ''}"><span><b>${p.name}</b><small>${p.items.filter((i) => !i.startsWith('Tout')).join(' · ')}</small></span>${price(p.price)}</li>`).join('')}
      </ul>
      <p class="sq-note">À la carte dès 99 € · Prix HT · 2 tours de modifs inclus</p>
      <a class="btn" href="#devis" data-need="reseaux">Choisir mon pack</a>
    </article></div></div>
    <div class="sq-step" ${at(2)}><div class="sq-pin"><article class="sq-card">
      ${tag('APPLIS ET BORNES', 'xs sq-tag')}
      <h2>Ta borne, ton appli, ta gestion.</h2>
      <ul class="sq-list">
        <li><span><b>Appli métier</b><small>Stock, planning, rapports, sur téléphone</small></span><span class="sq-from">dès ${price('990')}</span></li>
        <li><span><b>Borne à ta marque</b><small>Écran de la borne et appli de gestion</small></span>${price('599')}</li>
      </ul>
      <p class="sq-note">Borne aussi en formule à 39,99 €/mois · Prix HT</p>
      <a class="btn" href="#devis" data-need="appli">Parler de mon projet</a>
    </article></div></div>
    <div class="sq-step" ${at(3)}><div class="sq-pin"><article class="sq-card">
      ${tag('SITE WEB', 'xs sq-tag')}
      <h2>En ligne en 72 h.</h2>
      <ul class="sq-list">
        <li><span><b>Site Express</b><small>1 page, domaine à ton nom</small></span><span class="sq-from">${price('99')} <small>+ 19 €/mois</small></span></li>
      </ul>
      <p class="sq-note">Options : pages, réservation, fiche Google, animations · Prix HT</p>
      <a class="btn" href="#devis" data-need="site">Lancer mon site</a>
    </article></div></div>
    <div class="sq-step" ${at(4)}><div class="sq-pin"><article class="sq-card">
      ${tag('APPLIS TERRAIN', 'xs sq-tag')}
      <h2>Pensé pour le terrain.</h2>
      <p class="lead">Rapports, plannings, signatures. Ça marche de nuit, sans réseau, avec des gants.</p>
      <p class="sq-note">Exemple : une appli de perchage ferroviaire, utilisée chaque nuit. Sur devis.</p>
      <a class="btn" href="#devis" data-need="terrain">Parler de mon équipe</a>
    </article></div></div>
    <div class="sq-step" ${at(5)}><div class="sq-pin"><article class="sq-card">
      ${tag('AU MOIS', 'xs sq-tag')}
      <h2>On reste à côté de toi.</h2>
      <ul class="sq-list">
        <li><span><b>Réseaux</b><small>4 posts par mois, visuels inclus</small></span>${price('149', '/mois')}</li>
        <li><span><b>Entretien du site</b><small>Mises à jour, petites modifs avec Plus</small></span><span class="sq-from">${price('19', '/mois')} <small>ou 39 €</small></span></li>
      </ul>
      <p class="sq-note">Sans engagement · Prix HT</p>
      <div class="btns"><a class="btn" href="#devis" data-need="suivi">Devis gratuit</a><a class="btn btn-ghost" href="tel:${SITE.telHref}">${SITE.tel}</a></div>
    </article></div></div>
  </div>
</section>

<section class="lx-sec lx-alt" id="exemple">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Exemple de pack</p><h2>Un pack, toute ton image</h2><p class="lead">Du logo à l’enseigne, de la story à la vidéo pub : tout est pensé ensemble.</p></div></div>
    <div class="lx-gal">
      <figure>${picV('studio', 'Création du logo Luna Barber sur écran, au studio')}${tag('LOGO', 'xs')}</figure>
      <figure>${picV('facade', 'Enseigne lumineuse Luna Barber sur la façade, de nuit')}${tag('ENSEIGNE', 'xs')}</figure>
      <figure>${picV('story', 'Story Instagram Luna Barber sur un téléphone, avec bouton de réservation')}${tag('STORY', 'xs')}</figure>
      <figure class="lx-video">
        <video src="img/labs/pub.mp4" poster="img/labs/pub-poster.webp" muted loop playsinline preload="none" width="540" height="960" aria-label="Vidéo pub Dreamzz Labs"></video>
        <button class="lx-play" type="button" aria-label="Lire la vidéo avec le son"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></button>
        ${tag('VIDÉO PUB', 'xs')}
      </figure>
    </div>
    <p class="note lx-after">Luna Barber est un commerce fictif créé pour la démonstration. Images générées par IA.</p>
  </div>
</section>

<section class="lx-sec lx-alt" id="methode">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Méthode</p><h2>Ton pack en 4 étapes</h2></div></div>
    <ol class="lx-steps">${STEPS.map(([h, p], i) => `
      <li><b>${i + 1}</b><h3>${h}</h3><p>${p}</p></li>`).join('')}
    </ol>
    <div class="lx-facts">
      <div><span>Délai</span><strong>3 à 10 jours</strong></div>
      <div><span>Paiement</span><strong>50 % · 50 %</strong></div>
      <div><span>Où</span><strong>Partout en France</strong></div>
    </div>
  </div>
</section>

<section class="lx-sec" id="faq">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Questions</p><h2>Les questions qu’on nous pose</h2></div></div>
    <div class="faq">${FAQ.map(([q, a]) => `
      <details><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="light sec lx-devis" id="devis">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Devis gratuit</p><h2>Parle-nous de ton projet</h2><p class="lead">Réponse sous 24 h. Ou appelle directement.</p></div></div>
    <div class="form-grid">
      <form class="form" id="devis-form" action="${SITE.devisApi}" method="post" novalidate data-labs="1"${mode === 'preview' ? ' data-preview="1"' : ''}>
        <div class="field"><label for="l-commerce">Ton commerce</label><input id="l-commerce" name="commerce" required maxlength="120" autocomplete="organization" placeholder="Nom du commerce ou du projet"></div>
        <div class="field"><label for="l-act">Activité</label>
          <select id="l-act" name="activite">${ACTIVITIES.map((a) => `<option${a === 'Autre' ? ' selected' : ''}>${a}</option>`).join('')}</select></div>
        <div class="field"><label for="l-ville">Ville</label><input id="l-ville" name="ville" required maxlength="80" autocomplete="address-level2"></div>
        <div class="field"><label for="l-nom">Ton nom</label><input id="l-nom" name="nom" required maxlength="80" autocomplete="name"></div>
        <div class="field"><label for="l-tel">Téléphone</label><input id="l-tel" name="tel" type="tel" required maxlength="30" autocomplete="tel" pattern="[0-9 +.\\(\\)\\-]{9,30}"></div>
        <div class="field"><label for="l-email">E-mail <span class="opt">(facultatif)</span></label><input id="l-email" name="email" type="email" maxlength="120" autocomplete="email"></div>
        <fieldset class="field full"><legend>Ton besoin</legend><div class="choices">${NEEDS.map(([v, t]) => `<label><input type="checkbox" name="besoin" value="${v}"> ${t}</label>`).join('')}</div></fieldset>
        <div class="field full"><label for="l-msg">Message <span class="opt">(facultatif)</span></label><textarea id="l-msg" name="precisions" maxlength="1200" placeholder="Ton projet, ton style, ton budget, une date…"></textarea></div>
        <div class="hp" aria-hidden="true"><label for="l-site">Site web</label><input id="l-site" name="site" tabindex="-1" autocomplete="off"></div>
        <p class="legal">Tes coordonnées servent uniquement à te recontacter pour ce devis. <a href="${L('confidentialite')}">Confidentialité</a></p>
        <div class="form-actions"><button class="btn" type="submit">Envoyer ma demande</button><p class="form-msg" role="status" aria-live="polite"></p></div>
      </form>
      <aside class="side">
        <div class="card"><p class="note">Par téléphone</p><a class="big" href="tel:${SITE.telHref}">${SITE.tel}</a></div>
        <div class="card"><p class="note">Sur WhatsApp</p><a class="link" href="${wa}" rel="noopener">Écrire sur WhatsApp</a></div>
        <div class="card"><p class="note">Par e-mail</p><a class="link" href="mailto:${SITE.email}">${SITE.email}</a></div>
      </aside>
    </div>
  </div>
</section>`,
  };
}
