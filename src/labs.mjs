// Carrefour (/) et page Dreamzz Labs (/labs) de dreamzz.fr
import { SITE, LABS, makeLink } from './site.mjs';

// Étiquette signature Dreamzz Labs : carte blanche, néon cyan, pastille ZZ qui chevauche
const tag = (label, cls = '', style = '') => `<span class="ztag ${cls}"${style ? ` style="${style}"` : ''}><i aria-hidden="true"><img src="img/labs/zz.webp" alt="" width="40" height="34"></i><b>${label}</b></span>`;

const picV = (name, alt) => `<img src="img/labs/${name}-v-480.webp" srcset="img/labs/${name}-v-480.webp 480w, img/labs/${name}-v-720.webp 720w" sizes="(max-width: 1080px) 50vw, 290px" alt="${alt}" width="480" height="853" loading="lazy">`;
const pic = (name, alt, w = [600, 900], sizes = '(max-width: 900px) 100vw, 400px', eager = false) =>
  `<img src="img/labs/${name}-${w[0]}.webp" srcset="img/labs/${name}-${w[0]}.webp ${w[0]}w, img/labs/${name}-${w[1]}.webp ${w[1]}w" sizes="${sizes}" alt="${alt}" width="${w[0]}" height="${Math.round(w[0] * 1.25)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;

const PACKS = [
  { id: 'essentiel', name: 'Essentiel', price: '190', delay: '3 jours', items: ['Logo : 4 pistes au choix', 'Versions couleurs, blanc et noir', 'Icône pour les réseaux'] },
  { id: 'reseaux', name: 'Réseaux', price: '390', delay: '7 jours', top: true, items: ['Tout le pack Essentiel', 'Flyer', '3 visuels réseaux', 'Photo de profil', 'Bannière'] },
  { id: 'lancement', name: 'Lancement', price: '690', delay: '10 jours', items: ['Tout le pack Réseaux', 'Logo 3D', 'Vidéo pub 15 s', 'Carte de visite', 'Charte graphique'] },
];

const DIGITAL = [
  { id: 'site', img: null, name: 'Site web', price: 'dès 490 € HT', p: 'Site vitrine rapide sur téléphone, avec formulaire de devis. Exemple : ce site.' },
  { id: 'appli', img: 'terrain', alt: 'Technicien de nuit consultant une appli de chantier sur son téléphone', name: 'Appli', price: 'sur devis', p: 'Appli métier sur téléphone : suivi, planning, stock, rapports. Exemple : une appli terrain.' },
  { id: 'borne', img: 'borne', alt: 'Borne de paiement à écran tactile avec QR code, de nuit', name: 'Borne', price: 'sur devis', p: 'Interface de borne ou de distributeur à ta marque, avec son appli de gestion.' },
];

const STEPS = [
  ['On en parle', '15 min au téléphone ou sur WhatsApp.'],
  ['Les pistes', '4 pistes de logo. Tu choisis ta préférée.'],
  ['Retouches', '2 tours de modifs inclus.'],
  ['Tu reçois tout', 'Fichiers prêts à poster et à imprimer.'],
];

const FAQ = [
  ['J’ai déjà un logo, je fais quoi ?', 'On part de ton logo et on construit le reste du pack autour.'],
  ['Combien de temps ça prend ?', '3 jours pour l’Essentiel, 7 jours pour Réseaux, 10 jours pour Lancement, à partir de notre premier échange.'],
  ['Comment je paie ?', '50 % à la commande, 50 % à la livraison.'],
  ['Et si le rendu ne me plaît pas ?', 'Chaque pack inclut 2 tours de modifs.'],
  ['Je reçois quels fichiers ?', 'Des fichiers haute définition, prêts à poster sur les réseaux et à imprimer.'],
  ['Vous travaillez où ?', 'Partout en France, à distance : téléphone, WhatsApp et e-mail.'],
  ['Les fichiers sont à moi ?', 'Oui. Une fois le pack réglé, tu les utilises librement pour ton commerce.'],
];

const NEEDS = [['essentiel', 'Pack Essentiel'], ['reseaux', 'Pack Réseaux'], ['lancement', 'Pack Lancement'], ['site', 'Site web'], ['appli', 'Appli'], ['borne', 'Borne'], ['nsp', 'Je ne sais pas encore']];
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
      <span class="door-p">Packs design dès 190 €. Sites, applis, bornes.</span>
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
    description: 'Logo, flyers, visuels réseaux, vidéo pub : packs design dès 190 € HT, livrés en 3 à 10 jours. Sites web dès 490 € HT, applis et bornes sur devis. Devis gratuit.',
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
<section class="lx-hero">
  <div class="lx-glow"></div>
  <div class="wrap rel lx-hero-grid">
    <div>
      <p class="kicker">Dreamzz Labs · studio design &amp; digital</p>
      <h1>Ton commerce, <span class="accent">on s’occupe de tout.</span></h1>
      <p class="lead">Logo, flyers, visuels réseaux, vidéo pub, site web, appli. Un seul interlocuteur, des prix clairs, livré en quelques jours.</p>
      <div class="btns">
        <a class="btn" href="#devis">Devis gratuit</a>
        <a class="btn btn-ghost" href="${wa}" rel="noopener">WhatsApp</a>
      </div>
      <ul class="dots"><li>Réponse sous 24 h</li><li>2 tours de modifs inclus</li><li>Partout en France</li></ul>
    </div>
    <figure class="lx-shot">
      <div class="lx-shot-img">${pic('hero', 'Façade de nuit d’un salon de coiffure avec son enseigne, son affiche, sa borne et sa story sur téléphone', [700, 1100], '(max-width: 900px) 100vw, 520px', true)}</div>
      ${tag('LOGO', 'sm', 'left:58%;top:12%')}
      ${tag('AFFICHE', 'sm', 'left:7%;top:24%')}
      ${tag('BORNE', 'sm', 'right:2%;top:33%')}
      ${tag('SITE WEB', 'sm', 'left:27%;top:60%')}
      ${tag('STORY', 'sm', 'right:4%;top:71%')}
      <figcaption>Exemple : Luna Barber, commerce fictif. Image générée par IA.</figcaption>
    </figure>
  </div>
</section>

<section class="lx-sec lx-alt" id="packs">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Packs design</p><h2>Trois packs, un prix clair</h2></div><p class="note">Prix HT · 50 % à la commande · 2 tours de modifs inclus</p></div>
    <div class="lx-packs">${PACKS.map((p) => `
      <article class="lx-pack${p.top ? ' is-top' : ''}">
        ${p.top ? tag('RECOMMANDÉ', 'xs lx-badge') : ''}
        <h3>${p.name}</h3>
        <p class="lx-price"><b>${p.price} €</b><span>HT</span></p>
        <p class="lx-delay">Livré en ${p.delay}</p>
        <ul>${p.items.map((i) => `<li>${i}</li>`).join('')}</ul>
        <a class="btn${p.top ? '' : ' btn-ghost'}" href="#devis" data-need="${p.id}">Choisir ${p.name}</a>
      </article>`).join('')}
    </div>
    <p class="note lx-after">Déjà un logo ? On part du tien et on adapte le pack.</p>
  </div>
</section>

<section class="lx-sec" id="exemple">
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

<section class="lx-sec lx-alt" id="digital">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Sites, applis, bornes</p><h2>Les outils de ton commerce</h2></div></div>
    <div class="lx-dig">${DIGITAL.map((d) => `
      <article class="lx-card">
        <div class="lx-card-img">${d.img ? pic(d.img, d.alt, [600, 900], '(max-width: 900px) 100vw, 380px') : `<img src="img/labs/site-600.webp" srcset="img/labs/site-600.webp 600w, img/labs/site-900.webp 900w" sizes="(max-width: 900px) 100vw, 380px" alt="Le site Dreamzz Labs affiché sur ordinateur et sur téléphone" width="600" height="450" loading="lazy">`}</div>
        <div class="lx-card-txt">
          <h3>${d.name}</h3>
          <p class="lx-from">${d.price}</p>
          <p>${d.p}</p>
          <a class="link" href="#devis" data-need="${d.id}">Demander un devis</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<section class="lx-sec" id="methode">
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

<section class="lx-sec lx-alt" id="faq">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Questions</p><h2>Les questions qu’on nous pose</h2></div></div>
    <div class="faq">${FAQ.map(([q, a]) => `
      <details><summary>${q}</summary><p>${a}</p></details>`).join('')}
    </div>
  </div>
</section>

<section class="light sec lx-devis" id="devis">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Devis gratuit</p><h2>Parle-nous de ton commerce</h2><p class="lead">Réponse sous 24 h. Ou appelle directement.</p></div></div>
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
        <div class="field full"><label for="l-msg">Message <span class="opt">(facultatif)</span></label><textarea id="l-msg" name="precisions" maxlength="1200" placeholder="Ton idée, tes couleurs, une date…"></textarea></div>
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
