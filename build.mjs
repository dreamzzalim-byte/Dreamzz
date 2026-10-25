// Génère le site dans public/ (en ligne) ou dans un dossier d'aperçu.
//   node build.mjs                 → public/ (liens propres : /offres)
//   node build.mjs --preview <dir> → <dir>/ (liens en .html, pour un aperçu hors Cloudflare)
import { writeFileSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { layout, SITE } from './src/site.mjs';
import { pages } from './src/pages.mjs';

const i = process.argv.indexOf('--preview');
const mode = i > -1 ? 'preview' : 'prod';
const out = mode === 'preview' ? process.argv[i + 1] : 'public';
if (!out) throw new Error('dossier d’aperçu manquant');
mkdirSync(out, { recursive: true });
if (mode === 'preview') for (const d of ['css', 'js', 'img', 'fonts']) cpSync(join('public', d), join(out, d), { recursive: true });

const list = pages(mode);
for (const p of list) writeFileSync(join(out, p.file), layout({ mode, ...p }));

if (mode === 'prod') {
  const day = new Date().toISOString().slice(0, 10);
  const urls = list.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITE.url}/${p.slug}</loc><lastmod>${day}</lastmod></url>`);
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
  writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
  writeFileSync(join(out, '_headers'), `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://gestion.dreamzz.fr https://cloudflareinsights.com; form-action 'self' https://gestion.dreamzz.fr; frame-ancestors 'self'; base-uri 'self'\n/css/*\n  Cache-Control: public, max-age=604800\n/js/*\n  Cache-Control: public, max-age=86400\n/img/*\n  Cache-Control: public, max-age=2592000\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n`);
}
console.log(`${list.length} pages → ${out}/ (${mode})`);
