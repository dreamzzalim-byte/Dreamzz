# dreamzz.fr

Site vitrine statique de Dreamzz, servi par le Worker Cloudflare `dreamzz` (fichiers de `public/`). Deux sections :
- `/` carrefour, `/labs` Dreamzz Labs (packs design, sites, applis, bornes) : `src/labs.mjs`, styles `public/css/labs.css`
- `/distributeurs` et les pages distributeur : `src/pages.mjs`

- Modifier les textes : `src/pages.mjs` · gabarit et réglages : `src/site.mjs` · styles : `public/css/site.css`
- Regénérer : `node build.mjs` (écrit `public/`), puis committer `src/` et `public/`
- Aperçu local : `npx wrangler dev`
- Location financière : renseigner `SITE.leasing` dans `src/site.mjs` (bloc masqué tant que `null`)
- Formulaires de devis : envoient à `https://gestion.dreamzz.fr/api/devis` (Dreamzz Gestion). Les demandes Labs arrivent avec un message qui commence par `[LABS]`.
- Push sur `main` = mise en ligne
