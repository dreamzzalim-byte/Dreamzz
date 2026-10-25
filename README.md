# dreamzz.fr

Site vitrine statique des distributeurs Dreamzz, servi par le Worker Cloudflare `dreamzz` (fichiers de `public/`).

- Modifier les textes : `src/pages.mjs` · gabarit et réglages : `src/site.mjs` · styles : `public/css/site.css`
- Regénérer : `node build.mjs` (écrit `public/`), puis committer `src/` et `public/`
- Aperçu local : `npx wrangler dev`
- Location financière : renseigner `SITE.leasing` dans `src/site.mjs` (bloc masqué tant que `null`)
- Formulaire de devis : envoie à `https://gestion.dreamzz.fr/api/devis` (Dreamzz Gestion)
- Push sur `main` = mise en ligne
