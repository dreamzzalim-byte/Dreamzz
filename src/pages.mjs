// Contenu des pages de dreamzz.fr
import { SITE, ICON, makeLink } from './site.mjs';

const PINK = '#C2185B', VIOLET = '#5B3FD0', TEAL = '#139C86';
const PINK_D = '#FF5CA4', VIOLET_D = '#A98BFF', TEAL_D = '#2ED3B7';

const FAQ = [
  ['La vente est-elle légale ?', 'Oui. La machine vend des produits du vapotage autorisés, comme les puffs rechargeables. La vente aux mineurs est interdite : la carte d’identité est contrôlée à chaque achat.'],
  ['Qui remplit la machine ?', 'Vous. Vous achetez vos produits chez votre fournisseur habituel et vous fixez vos prix.'],
  ['Combien rapporte un distributeur ?', 'Tout dépend de l’emplacement. Exemple : 3 ventes par jour à 19,90 €, c’est environ 1 790 € de ventes par mois. Exemple indicatif, non garanti.'],
  ['Que se passe-t-il si un produit ne tombe pas ?', 'Le capteur de chute le détecte. Vous recevez une alerte sur votre téléphone et vous remboursez le client depuis l’appli.'],
  ['Faut-il une connexion Internet ?', 'Oui. La machine se connecte au Wi-Fi du commerce pour les paiements, les ventes en direct et les alertes.'],
  ['Combien consomme la machine ?', 'Environ 10 à 15 € d’électricité par mois.'],
  ['Où installez-vous ?', 'En France métropolitaine, en façade ou à l’intérieur du commerce.'],
  ['Quel est le délai ?', 'Le délai de livraison est confirmé sur le devis.'],
  ['Comment se passe le paiement ?', '2 000 € HT à la commande, le solde à la livraison, par virement ou carte bancaire.'],
  ['Je n’ai pas de logo. C’est un problème ?', 'Non. Avec le pack marque, on crée votre logo et l’interface à votre nom.'],
  ['Puis-je voir une machine en fonctionnement ?', 'Oui. Notre propre distributeur tourne déjà avec cette interface. Démo en visio sur demande.'],
];
const faqHtml = (items) => `<div class="faq">${items.map(([q, a]) => `
  <details><summary>${q}</summary><p>${a}</p></details>`).join('')}
</div>`;
const faqLd = (items) => `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
})}</script>\n`;

const STEPS = [
  ['borne-1', 'Le client choisit', 'Écran tactile, vos produits en photo, vos prix.', 'Écran d’accueil de la borne : choix du produit'],
  ['borne-2', 'Il montre sa carte d’identité', 'Lue à chaque achat. Rien n’est enregistré.', 'Écran du contrôle d’âge par carte d’identité'],
  ['borne-3', 'Il paie', 'Carte sans contact, Apple Pay ou Google Pay.', 'Écran de paiement par carte ou QR code'],
  ['borne-4', 'Le produit tombe', 'Dans la trappe. Reçu disponible par QR code.', 'Écran de fin d’achat avec reçu par QR code'],
];
const stepsHtml = () => `<ol class="steps">${STEPS.map(([img, h, p, alt], i) => `
  <li class="step">
    <div class="screen"><img src="img/${img}.webp" alt="${alt}" width="540" height="960" loading="lazy"></div>
    <b>${i + 1}</b><h3>${h}</h3><p>${p}</p>
  </li>`).join('')}
</ol>`;

const APP = [
  ['live', 'Ventes en direct', 'Le chiffre du jour et chaque vente, en temps réel.'],
  ['stock', 'Stock par emplacement', 'Ce qui reste dans chaque colonne de la machine.'],
  ['ventes', 'Chiffres et export', 'Jours, heures, produits. Export Excel pour le comptable.'],
  ['alertes', 'Alertes', 'Produit non sorti, stock bas, machine hors ligne.'],
];
const phonesHtml = () => `<ul class="phones">${APP.map(([img, h, p]) => `
  <li class="phone">
    <figure><img src="img/app-${img}.webp" alt="Appli de gestion : ${h.toLowerCase()}" width="390" height="844" loading="lazy"></figure>
    <h3>${h}</h3><p>${p}</p>
  </li>`).join('')}
</ul>`;

const TYPES = [
  ['Boutiques de vape', 'Des ventes la nuit et le dimanche, boutique fermée.'],
  ['Tabacs-presse', 'La vape en libre-service, le comptoir libéré.'],
  ['Épiceries de nuit', 'Un rayon vape sans vendeur dédié.'],
  ['Stations de lavage', 'Un revenu en plus sur un site ouvert jour et nuit.'],
  ['Bars et snacks', 'Une vente en plus, sans personnel en plus.'],
];
const tilesHtml = () => `<div class="tiles">${TYPES.map(([h, p]) => `
  <div class="tile"><h3>${h}</h3><p>${p}</p></div>`).join('')}
</div>`;

function offersHtml(L, detailed) {
  const lease = SITE.leasing ? `
  <div class="lease">
    <div><p class="tag" style="font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--violet-ink)">Location financière</p><b>Dès ${SITE.leasing.mois} € HT/mois</b></div>
    <p class="note">Pack marque sur ${SITE.leasing.duree} mois. Sous réserve d’acceptation du dossier par notre partenaire financier.</p>
  </div>` : '';
  const list = (items) => detailed ? `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
  return `<div class="offers">
  <article class="offer main">
    <span class="badge">Conseillé</span>
    <span class="tag">Pack marque</span>
    <span class="price">3 990 €</span><span class="ht">HT, une seule fois</span>
    <p>Machine, interface à votre marque, appli de gestion, installation, 3 mois de support.</p>
    ${list(['Distributeur mural', 'Interface créée à votre marque', 'Logo créé si vous n’en avez pas', 'Appli de gestion sur téléphone', 'Installation et mise en service', '3 mois de support'])}
    <div class="cta"><a class="btn" href="${L('devis?offre=pack')}">Demander un devis</a></div>
  </article>
  <article class="offer loc">
    <span class="tag">Machine + logiciel en location</span>
    <span class="price">3 500 €</span><span class="plus">+ 49 €/mois</span><span class="ht">HT</span>
    <p>La même interface à votre marque, avec le logiciel en abonnement mensuel.</p>
    ${list(['Distributeur mural', 'Interface créée à votre marque', 'Appli de gestion sur téléphone', 'Installation en option : 190 € HT'])}
    <div class="cta"><a class="btn btn-ghost" href="${L('devis?offre=location')}">Demander un devis</a></div>
  </article>
  <article class="offer">
    <span class="tag">Machine seule</span>
    <span class="price">3 500 €</span><span class="ht">HT</span>
    <p>Avec le logiciel du fabricant. Installation en option : 190 €.</p>
    ${list(['Distributeur mural', 'Logiciel du fabricant', 'Installation en option : 190 € HT', 'Passage au pack marque possible'])}
    <div class="cta"><a class="btn btn-ghost" href="${L('devis?offre=machine')}">Demander un devis</a></div>
  </article>
</div>${lease}`;
}

function ctaBand(L) {
  return `<section class="cta-band">
  <div class="wrap">
    <div>
      <h2>Un emplacement en tête ?</h2>
      <p>Devis gratuit. Réponse sous 24 h.</p>
    </div>
    <div class="btns">
      <a class="btn" href="${L('devis')}">Demander un devis</a>
      <a class="btn btn-ghost" href="tel:${SITE.telHref}">${SITE.tel}</a>
    </div>
  </div>
</section>`;
}

const facade = (eager, sizes = '(max-width: 900px) 100vw, 560px') => `<img src="img/facade-900.webp" srcset="img/facade-900.webp 900w, img/facade-1600.webp 1536w" sizes="${sizes}" alt="Distributeur Dreamzz posé sur la façade d’un commerce, écran allumé" width="900" height="600"${eager ? ' fetchpriority="high"' : ' loading="lazy"'}>`;

export function pages(mode) {
  const L = makeLink(mode);
  const out = [];

  // ---------------- Accueil ----------------
  out.push({
    file: 'index.html', slug: '',
    title: 'Dreamzz · Distributeur de vape à la marque de votre magasin',
    description: 'Distributeur automatique de vape mural, en façade ou en boutique, avec le nom et le logo de votre magasin à l’écran. Contrôle d’âge, paiement par carte, appli de gestion. Toutes les ventes sont pour vous.',
    jsonld: `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': SITE.url + '/#org', name: 'Dreamzz', legalName: 'SAS Dreamzz', url: SITE.url, logo: SITE.url + '/img/icon-512.png', email: SITE.email, telephone: '+33 7 67 15 17 93', address: { '@type': 'PostalAddress', addressLocality: 'Estillac', postalCode: '47310', addressCountry: 'FR' } },
        { '@type': 'Product', name: 'Distributeur de vape Dreamzz · Pack marque', image: SITE.url + '/img/og.jpg', brand: { '@id': SITE.url + '/#org' }, description: 'Distributeur automatique de vape mural avec interface à la marque du commerçant, contrôle d’âge par carte d’identité, paiement par carte et appli de gestion.', offers: { '@type': 'Offer', price: '3990', priceCurrency: 'EUR', priceSpecification: { '@type': 'UnitPriceSpecification', price: '3990', priceCurrency: 'EUR', valueAddedTaxIncluded: false }, seller: { '@id': SITE.url + '/#org' }, url: SITE.url + '/offres', availability: 'https://schema.org/InStock' } },
      ],
    })}</script>\n` + faqLd(FAQ.slice(0, 4)),
    body: `
<section class="dark hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel hero-grid">
    <div>
      <p class="kicker">Distributeur de vape · à votre marque</p>
      <h1>Vendez 24h/24. <span class="accent">Même rideau baissé.</span></h1>
      <p class="lead">Un distributeur mural en façade ou en boutique, avec le nom et le logo de votre magasin à l’écran. Toutes les ventes sont pour vous.</p>
      <div class="btns">
        <a class="btn" href="${L('devis')}">Demander un devis</a>
        <a class="btn btn-ghost" href="${L('offres')}">Voir les offres</a>
      </div>
      <ul class="dots"><li>Contrôle d’âge à chaque achat</li><li>Paiement par carte</li><li>Appli de gestion sur téléphone</li></ul>
    </div>
    <div class="hero-photo">${facade(true)}</div>
  </div>
</section>

<section class="light sec" id="fonctionnement">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Comment ça marche</p><h2>Quatre écrans, trente secondes</h2></div></div>
    ${stepsHtml()}
  </div>
</section>

<section class="dark sec">
  <div class="glow glow-violet" style="left:-300px;right:auto"></div>
  <div class="wrap rel split">
    <div>
      <p class="kicker">Votre marque</p>
      <h2>Le client voit votre enseigne, <span class="accent">pas la nôtre.</span></h2>
      <ul class="ticks">
        <li><b>Votre nom et votre logo</b> à l’écran</li>
        <li><b>Vos couleurs</b> et vos produits en photo</li>
        <li><b>Pas de logo ?</b> On le crée.</li>
      </ul>
      <div class="btns" style="margin-top:32px"><a class="btn btn-ghost" href="${L('votre-marque')}">Votre interface</a></div>
    </div>
    <div class="borne-big"><div class="screen" style="border-color:#23243a"><img src="img/borne-1.webp" alt="Interface de la borne à la marque du magasin" width="540" height="960" loading="lazy"></div></div>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">L’appli de gestion</p><h2>Votre machine dans la poche</h2></div><a class="link" href="${L('votre-marque', 'appli')}">Toute l’appli</a></div>
    ${phonesHtml()}
  </div>
</section>

<section class="white sec" id="offres">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Offres</p><h2>Trois offres, un prix clair</h2></div><p class="note">Prix HT · 2 000 € à la commande, le solde à la livraison</p></div>
    ${offersHtml(L, false)}
  </div>
</section>

<section class="dark sec">
  <div class="glow glow-pink" style="left:auto;right:-320px"></div>
  <div class="wrap rel">
    <div class="head"><div><p class="kicker">Pour qui</p><h2>Pour les commerces de proximité</h2><p class="lead">En façade pour vendre jour et nuit, ou à l’intérieur pour libérer le comptoir.</p></div><a class="link" href="${L('pour-qui')}">Voir en détail</a></div>
    ${tilesHtml()}
  </div>
</section>

<section class="light sec-sm">
  <div class="wrap">
    <div class="proof">
      <div>
        <h2>Notre machine tourne déjà</h2>
        <p>Notre propre distributeur fonctionne avec cette interface et cette appli. Démo en visio sur demande.</p>
      </div>
      <a class="btn" href="${L('devis')}">Demander une démo</a>
    </div>
  </div>
</section>

<section class="light sec" style="padding-top:24px">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Questions</p><h2>Les questions qu’on nous pose</h2></div><a class="link" href="${L('faq')}">Toutes les questions</a></div>
    ${faqHtml(FAQ.slice(0, 4))}
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- Le distributeur ----------------
  out.push({
    file: 'distributeur.html', slug: 'distributeur',
    title: 'Le distributeur de vape mural · Dreamzz',
    description: 'Distributeur de vape mural : écran tactile, lecteur de carte d’identité, paiement sans contact, capteur de chute, reçu par QR code. En façade ou en boutique.',
    body: `
<section class="dark page-hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel page-hero-grid">
    <div>
      <p class="kicker">Le distributeur</p>
      <h1>Un vendeur 24h/24 <span class="accent">sur votre mur.</span></h1>
      <p class="lead">Mural, en façade ou en boutique. Le client choisit, montre sa carte d’identité, paie et récupère son produit.</p>
      <div class="btns" style="margin-top:30px"><a class="btn" href="${L('devis')}">Demander un devis</a></div>
    </div>
    <div class="hero-photo">${facade(true)}</div>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Le parcours client</p><h2>Quatre écrans, trente secondes</h2></div></div>
    ${stepsHtml()}
    <p class="note" style="margin-top:28px">Un souci ? Le client scanne le QR code de l’écran et vous appelle.</p>
  </div>
</section>

<section class="white sec">
  <div class="wrap split top">
    <div>
      <p class="kicker">Équipement</p>
      <h2>Ce qu’il y a dans la machine</h2>
    </div>
    <table class="specs">
      <tr><th>Format</th><td>Distributeur mural</td></tr>
      <tr><th>Écran</th><td>Tactile, vertical</td></tr>
      <tr><th>Capacité</th><td>8 emplacements · jusqu’à 40 produits</td></tr>
      <tr><th>Contrôle d’âge</th><td>Lecteur de carte d’identité</td></tr>
      <tr><th>Paiement</th><td>Carte sans contact · Apple Pay · Google Pay</td></tr>
      <tr><th>Distribution</th><td>Trappe avec capteur de chute</td></tr>
      <tr><th>Reçu</th><td>Par QR code</td></tr>
      <tr><th>Connexion</th><td>Wi-Fi</td></tr>
    </table>
  </div>
</section>

<section class="dark sec">
  <div class="glow glow-violet"></div>
  <div class="wrap rel">
    <div class="head"><div><p class="kicker">Sécurité</p><h2>Une vente encadrée</h2></div></div>
    <div class="g3">
      <div class="card"><div class="ico t">${ICON.id(TEAL_D)}</div><h3>18+ à chaque achat</h3><p>Sans carte d’identité majeure, rien ne sort.</p></div>
      <div class="card"><div class="ico">${ICON.bell(PINK_D)}</div><h3>Produit non sorti</h3><p>Alerte sur votre téléphone, remboursement depuis l’appli.</p></div>
      <div class="card"><div class="ico v">${ICON.wifi(VIOLET_D)}</div><h3>Machine hors ligne</h3><p>Alerte si la machine ne donne plus de nouvelles.</p></div>
    </div>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Installation</p><h2>Ce qu’il faut chez vous</h2></div></div>
    <div class="g3">
      <div class="card"><div class="ico">${ICON.wall(PINK)}</div><h3>Un mur</h3><p>En façade ou à l’intérieur.</p></div>
      <div class="card"><div class="ico v">${ICON.plug(VIOLET)}</div><h3>Une prise électrique</h3><p>Environ 10 à 15 € d’électricité par mois.</p></div>
      <div class="card"><div class="ico t">${ICON.wifi(TEAL)}</div><h3>Le Wi-Fi</h3><p>Pour les paiements, les ventes en direct et les alertes.</p></div>
    </div>
    <p class="note" style="margin-top:24px">Installation : pose, branchement, réglages et mise en service.</p>
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- Votre marque ----------------
  out.push({
    file: 'votre-marque.html', slug: 'votre-marque',
    title: 'Une interface à votre marque + appli de gestion · Dreamzz',
    description: 'L’écran du distributeur au nom de votre magasin : logo, couleurs, produits. Et une appli de gestion : ventes en direct, stock, alertes, export Excel.',
    body: `
<section class="dark page-hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel page-hero-grid">
    <div>
      <p class="kicker">Votre marque</p>
      <h1>Votre marque. <span class="accent">Pas la nôtre.</span></h1>
      <p class="lead">Nous créons l’interface de la borne au nom de votre magasin, et vous gérez tout depuis votre téléphone.</p>
      <div class="btns" style="margin-top:30px"><a class="btn" href="${L('devis?offre=pack')}">Demander un devis</a></div>
    </div>
    <div class="borne-big"><div class="screen" style="border-color:#23243a"><img src="img/borne-1.webp" alt="Interface de la borne à la marque du magasin" width="540" height="960" fetchpriority="high"></div></div>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">L’interface</p><h2>L’écran à votre image</h2></div></div>
    <div class="g4">
      <div class="card"><div class="ico">${ICON.brand(PINK)}</div><h3>Nom et logo</h3><p>Votre enseigne en haut de chaque écran.</p></div>
      <div class="card"><div class="ico v">${ICON.heart(VIOLET)}</div><h3>Vos couleurs</h3><p>Fond, boutons et textes à votre charte.</p></div>
      <div class="card"><div class="ico t">${ICON.box(TEAL)}</div><h3>Vos produits</h3><p>En photo, avec vos prix.</p></div>
      <div class="card"><div class="ico">${ICON.check(PINK)}</div><h3>Logo créé</h3><p>Pas de logo ? On le crée.</p></div>
    </div>
  </div>
</section>

<section class="dark sec" id="appli">
  <div class="glow glow-violet"></div>
  <div class="wrap rel">
    <div class="head"><div><p class="kicker">L’appli de gestion</p><h2>Votre machine dans la poche</h2><p class="lead">Sur iPhone et Android, sans rien installer depuis un store.</p></div></div>
    ${phonesHtml()}
  </div>
</section>

<section class="white sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Dans l’appli</p><h2>Tout ce que vous suivez</h2></div></div>
    <div class="g3">
      <div class="card"><div class="ico">${ICON.chart(PINK)}</div><h3>Ventes</h3><p>Chiffre du jour, 7 jours, 30 jours. Heures et jours qui vendent.</p></div>
      <div class="card"><div class="ico v">${ICON.box(VIOLET)}</div><h3>Stock</h3><p>Chaque emplacement, chaque produit, ce qu’il reste.</p></div>
      <div class="card"><div class="ico t">${ICON.heart(TEAL)}</div><h3>Goûts demandés</h3><p>Les saveurs que vos clients réclament à la machine.</p></div>
      <div class="card"><div class="ico">${ICON.bell(PINK)}</div><h3>Alertes</h3><p>Produit non sorti, stock bas, machine hors ligne.</p></div>
      <div class="card"><div class="ico v">${ICON.file(VIOLET)}</div><h3>Export Excel</h3><p>Le détail des ventes pour votre comptable.</p></div>
      <div class="card"><div class="ico t">${ICON.phone(TEAL)}</div><h3>Plusieurs machines</h3><p>Toutes vos machines dans la même appli.</p></div>
    </div>
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- Offres ----------------
  out.push({
    file: 'offres.html', slug: 'offres',
    title: 'Offres et prix du distributeur de vape · Dreamzz',
    description: 'Pack marque 3 990 € HT, machine + logiciel en location 3 500 € HT + 49 €/mois, machine seule 3 500 € HT. Toutes les ventes sont pour vous.',
    body: `
<section class="dark page-hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel">
    <p class="kicker">Offres</p>
    <h1>Trois offres, <span class="accent">un prix clair.</span></h1>
    <p class="lead">Prix HT. Vous achetez la machine une fois : toutes les ventes sont pour vous.</p>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    ${offersHtml(L, true)}
    <div class="facts">
      <div><span>À la commande</span><strong>2 000 € HT</strong></div>
      <div><span>À la livraison</span><strong>Le solde</strong></div>
      <div><span>Paiement</span><strong>Virement ou carte</strong></div>
    </div>
  </div>
</section>

<section class="white sec">
  <div class="wrap split">
    <div>
      <p class="kicker">Exemple de ventes</p>
      <h2>≈ 1 790 € de ventes par mois</h2>
      <p class="lead" style="margin-top:18px">3 ventes par jour à 19,90 €. Vous remplissez la machine avec vos produits, la machine vend.</p>
      <p class="note" style="margin-top:14px">Exemple indicatif, non garanti. Les ventes dépendent de l’emplacement.</p>
    </div>
    <table class="specs">
      <tr><th>Ventes par jour</th><td>3</td></tr>
      <tr><th>Prix de vente</th><td>19,90 €</td></tr>
      <tr><th>Ventes par mois</th><td>≈ 1 790 €</td></tr>
      <tr><th>Électricité</th><td>≈ 10 à 15 € par mois</td></tr>
    </table>
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- Pour qui ----------------
  out.push({
    file: 'pour-qui.html', slug: 'pour-qui',
    title: 'Pour quels commerces ? · Distributeur de vape Dreamzz',
    description: 'Boutiques de vape, tabacs-presse, épiceries de nuit, stations de lavage, bars et snacks : un distributeur de vape en façade ou à l’intérieur.',
    body: `
<section class="dark page-hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel">
    <p class="kicker">Pour qui</p>
    <h1>Pour les commerces <span class="accent">de proximité.</span></h1>
    <p class="lead">Un distributeur en façade pour vendre jour et nuit, ou à l’intérieur pour libérer le comptoir.</p>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="tiles">${TYPES.map(([h, p]) => `
      <div class="tile"><h3>${h}</h3><p>${p}</p></div>`).join('')}
    </div>
  </div>
</section>

<section class="white sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Emplacement</p><h2>Façade ou intérieur</h2></div></div>
    <div class="g2">
      <div class="card"><div class="ico">${ICON.moon(PINK)}</div><h3>En façade</h3><p>Ventes 24h/24, même rideau baissé.</p></div>
      <div class="card"><div class="ico v">${ICON.card(VIOLET)}</div><h3>À l’intérieur</h3><p>Aux heures d’ouverture, sans passer par le comptoir.</p></div>
    </div>
  </div>
</section>

<section class="light sec">
  <div class="wrap">
    <div class="head"><div><p class="kicker">Ce qu’il faut</p><h2>Trois choses chez vous</h2></div></div>
    <div class="g3">
      <div class="card"><div class="ico">${ICON.wall(PINK)}</div><h3>Un mur</h3><p>En façade ou à l’intérieur.</p></div>
      <div class="card"><div class="ico v">${ICON.plug(VIOLET)}</div><h3>Une prise électrique</h3><p>Environ 10 à 15 € d’électricité par mois.</p></div>
      <div class="card"><div class="ico t">${ICON.wifi(TEAL)}</div><h3>Le Wi-Fi</h3><p>Pour les paiements et les alertes.</p></div>
    </div>
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- FAQ ----------------
  out.push({
    file: 'faq.html', slug: 'faq',
    title: 'Questions fréquentes · Distributeur de vape Dreamzz',
    description: 'Légalité, remplissage, ventes, remboursement, connexion, consommation, installation, paiement : les réponses sur le distributeur de vape Dreamzz.',
    jsonld: faqLd(FAQ),
    body: `
<section class="dark page-hero">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel">
    <p class="kicker">FAQ</p>
    <h1>Questions <span class="accent">fréquentes.</span></h1>
  </div>
</section>
<section class="light sec">
  <div class="wrap">
    ${faqHtml(FAQ)}
  </div>
</section>
${ctaBand(L)}`,
  });

  // ---------------- Devis ----------------
  const radio = (name, items) => `<div class="choices">${items.map(([v, t], i) => `<label><input type="radio" name="${name}" value="${v}"${i === items.length - 1 ? ' checked' : ''}> ${t}</label>`).join('')}</div>`;
  out.push({
    file: 'devis.html', slug: 'devis',
    title: 'Demander un devis · Distributeur de vape Dreamzz',
    description: 'Demandez votre devis pour un distributeur de vape à la marque de votre magasin. Réponse sous 24 h.',
    body: `
<section class="dark page-hero" style="padding-bottom:64px">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel">
    <p class="kicker">Devis gratuit</p>
    <h1>Demander <span class="accent">un devis.</span></h1>
    <p class="lead">Réponse sous 24 h.</p>
  </div>
</section>
<section class="light sec" style="padding-top:56px">
  <div class="wrap form-grid">
    <form class="form" id="devis" action="${SITE.devisApi}" method="post" novalidate>
      <div class="field full"><label for="f-commerce">Nom du commerce</label><input id="f-commerce" name="commerce" required maxlength="120" autocomplete="organization"></div>
      <div class="field full"><label for="f-type">Type de commerce</label>
        <select id="f-type" name="type">
          <option value="vape">Boutique de vape</option><option value="tabac">Tabac-presse</option><option value="epicerie">Épicerie de nuit</option>
          <option value="lavage">Station de lavage</option><option value="bar">Bar / snack</option><option value="autre" selected>Autre</option>
        </select></div>
      <div class="field"><label for="f-ville">Ville</label><input id="f-ville" name="ville" required maxlength="80" autocomplete="address-level2"></div>
      <div class="field"><label for="f-cp">Code postal</label><input id="f-cp" name="cp" inputmode="numeric" pattern="[0-9]{5}" maxlength="5" autocomplete="postal-code"></div>
      <div class="field"><label for="f-nom">Votre nom</label><input id="f-nom" name="nom" required maxlength="80" autocomplete="name"></div>
      <div class="field"><label for="f-tel">Téléphone</label><input id="f-tel" name="tel" type="tel" required maxlength="30" autocomplete="tel" pattern="[0-9 +.()-]{9,30}"></div>
      <div class="field full"><label for="f-email">E-mail <span class="opt">(facultatif)</span></label><input id="f-email" name="email" type="email" maxlength="120" autocomplete="email"></div>
      <fieldset class="field full"><legend>Emplacement</legend>${radio('emplacement', [['facade', 'Façade'], ['interieur', 'Intérieur'], ['nsp', 'Je ne sais pas']])}</fieldset>
      <fieldset class="field full"><legend>Offre</legend>${radio('offre', [['pack', 'Pack marque'], ['location', 'Machine + logiciel en location'], ['machine', 'Machine seule'], ['nsp', 'Je ne sais pas']])}</fieldset>
      <div class="field full"><label for="f-message">Message <span class="opt">(facultatif)</span></label><textarea id="f-message" name="message" maxlength="1500"></textarea></div>
      <div class="hp" aria-hidden="true"><label for="f-site">Site web</label><input id="f-site" name="site" tabindex="-1" autocomplete="off"></div>
      <p class="legal">Vos coordonnées servent uniquement à vous recontacter pour ce devis. <a href="${L('confidentialite')}">Confidentialité</a></p>
      <div class="form-actions"><button class="btn" type="submit">Envoyer ma demande</button><p class="form-msg" role="status" aria-live="polite"></p></div>
    </form>
    <aside class="side">
      <div class="card"><p class="note">Par téléphone</p><a class="big" href="tel:${SITE.telHref}">${SITE.tel}</a></div>
      <div class="card"><p class="note">Par e-mail</p><a class="link" href="mailto:${SITE.email}">${SITE.email}</a></div>
      <div class="card"><h3 style="margin:0 0 8px">Démo en visio</h3><p>Notre propre distributeur tourne déjà avec cette interface.</p></div>
    </aside>
  </div>
</section>`,
  });

  // ---------------- Mentions légales ----------------
  out.push({
    file: 'mentions-legales.html', slug: 'mentions-legales',
    title: 'Mentions légales · Dreamzz',
    description: 'Mentions légales du site dreamzz.fr, édité par la SAS Dreamzz.',
    body: `
<section class="light sec">
  <div class="wrap prose">
    <h1 style="font-size:clamp(44px,6vw,72px)">Mentions légales</h1>
    <h2>Éditeur</h2>
    <p>SAS Dreamzz, société par actions simplifiée au capital de 1 €</p>
    <p>Siège social : 30 chemin du Tannat, 47310 Estillac</p>
    <p>RCS Agen 941 304 446</p>
    <p>Directeur de la publication : Abbel Benouahab, président</p>
    <p>Contact : <a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="tel:${SITE.telHref}">${SITE.tel}</a></p>
    <h2>Hébergement</h2>
    <p>Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, États-Unis · cloudflare.com</p>
    <h2>Propriété intellectuelle</h2>
    <p>Les textes, visuels, logos et interfaces de ce site appartiennent à la SAS Dreamzz. Toute reproduction sans autorisation est interdite.</p>
    <h2>Produits du vapotage</h2>
    <p>La vente de produits du vapotage est interdite aux mineurs. Les distributeurs Dreamzz contrôlent la carte d’identité à chaque achat.</p>
    <h2>Prix</h2>
    <p>Les prix affichés sont hors taxes et s’adressent aux professionnels. Seul le devis signé engage les parties.</p>
  </div>
</section>`,
  });

  // ---------------- Confidentialité ----------------
  out.push({
    file: 'confidentialite.html', slug: 'confidentialite',
    title: 'Confidentialité · Dreamzz',
    description: 'Comment Dreamzz traite les données envoyées par le formulaire de devis.',
    body: `
<section class="light sec">
  <div class="wrap prose">
    <h1 style="font-size:clamp(44px,6vw,72px)">Confidentialité</h1>
    <h2>Responsable</h2>
    <p>SAS Dreamzz, 30 chemin du Tannat, 47310 Estillac · <a href="mailto:${SITE.email}">${SITE.email}</a></p>
    <h2>Données collectées</h2>
    <p>Par le formulaire de devis : nom du commerce, type de commerce, ville, code postal, nom, téléphone, e-mail, emplacement, offre et message.</p>
    <h2>Utilisation</h2>
    <p>Vous recontacter pour votre devis et suivre la relation commerciale. Aucune revente, aucune publicité ciblée.</p>
    <h2>Conservation</h2>
    <p>3 ans après le dernier contact.</p>
    <h2>Hébergement</h2>
    <p>Les données sont hébergées par Cloudflare, Inc. Un code technique dérivé de votre adresse IP sert uniquement à limiter les envois abusifs.</p>
    <h2>Cookies</h2>
    <p>Ce site ne dépose aucun cookie publicitaire ni de mesure d’audience.</p>
    <h2>Vos droits</h2>
    <p>Accès, rectification, effacement, opposition : écrivez à <a href="mailto:${SITE.email}">${SITE.email}</a>. En cas de désaccord, vous pouvez saisir la CNIL (cnil.fr).</p>
  </div>
</section>`,
  });

  // ---------------- 404 ----------------
  out.push({
    file: '404.html', slug: '404', noindex: true,
    title: 'Page introuvable · Dreamzz',
    description: 'Cette page n’existe pas.',
    body: `
<section class="dark page-hero" style="min-height:60vh;display:flex;align-items:center">
  <div class="glow glow-pink"></div><div class="glow glow-violet"></div>
  <div class="wrap rel">
    <p class="kicker">Erreur 404</p>
    <h1>Page <span class="accent">introuvable.</span></h1>
    <div class="btns" style="margin-top:32px"><a class="btn" href="${L('')}">Retour à l’accueil</a><a class="btn btn-ghost" href="${L('devis')}">Demander un devis</a></div>
  </div>
</section>`,
  });

  return out;
}
