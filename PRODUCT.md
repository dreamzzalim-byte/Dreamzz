# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- Priorité : commerçants et indépendants de proximité (barbers, restaurants, snacks, boutiques, artisans) partout en France, qui veulent une image pro et des clients en plus, sans budget d'agence.
- Ensuite : PME et équipes de terrain qui ont besoin d'une appli métier ou d'une borne (offre « gros clients », présentée en dernier).
- Section Distributeurs (même site) : commerçants qui veulent un distributeur automatique à leur marque.

## Product Purpose
Dreamzz Labs (branche de la SAS Dreamzz) crée l'image et les outils numériques des commerces : packs design (logo, flyers, visuels réseaux, vidéo pub), sites web, applis et interfaces de borne. Le site doit amener le visiteur à demander un devis (formulaire, appel ou WhatsApp).

## Positioning
Le fondateur se déplace, vit le métier du client avec son équipe, puis construit sur mesure ; la production assistée par IA permet des prix et des délais bien en dessous des agences. Consigne : le montrer par le récit et les réalisations, sans l'écrire en slogan (« le dire sans le dire »).

## Operating Context
- Le visiteur arrive surtout depuis TikTok, Instagram, des flyers et des démarchages, majoritairement sur téléphone.
- Les demandes de devis arrivent dans Dreamzz Gestion (`https://gestion.dreamzz.fr/api/devis`, message préfixé `[LABS]`).
- Contact : 07 67 15 17 93 (appel, WhatsApp), gestion@dreamzz.fr.

## Capabilities and Constraints
- Site statique généré (`build.mjs`), servi par un Worker Cloudflare ; push sur `main` = mise en ligne, seulement avec l'accord d'Abbel.
- CSP stricte : tout est servi depuis dreamzz.fr (pas de CDN externe).
- Grille de prix : en cours de validation (plancher 99 €, prix qui montent avec les options, l'expérience 3D est une option haut de gamme). Ne pas publier de prix non validés.
- Tutoiement côté Labs ; vouvoiement côté Distributeurs.
- Jamais le mot « VAPE » ni de produit de vape dans la section Labs.

## Brand Commitments
- Nom : Dreamzz Labs. Logo : wordmark « dreamzz » avec un Z bleu clair et un Z bleu foncé, « LABS » dessous.
- Étiquette signature : carte blanche entourée de néon cyan avec une pastille ronde ZZ qui chevauche le bord gauche ; jamais d'encadrés « viseur » façon matrix.
- Prénom du fondateur : Abbel (deux b) ; pas de nom de famille dans les supports commerciaux.

## Evidence on Hand
- Réalisations montrables : le pack du barber en cours (gratuit, quand il est fini et avec son accord), L'Usine 33 (logo et story), les applis Dreamzz (borne et gestion des distributeurs) et l'appli de perchage (sans logo ni nom de l'employeur, sans vrais noms).
- Exemple fictif : Luna Barber (toujours signalé comme fictif ; images générées par IA signalées).
- Vidéo pub Dreamzz Labs (29 s) et clips associés.
- Aucun témoignage client, chiffre ou avis à inventer.

## Product Principles
1. Montrer plutôt que dire : la proximité et le sur-mesure passent par le récit et les vraies réalisations.
2. Le prix arrive en dernier, comme une information, après la valeur détaillée.
3. Chaque étape du site mène à une action claire (devis, appel, WhatsApp).
4. Honnêteté : exemples fictifs et images IA signalés, aucune preuve inventée.
5. Le téléphone d'abord : tout doit être parfait sur mobile.
