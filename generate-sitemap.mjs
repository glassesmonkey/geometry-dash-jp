import { writeFileSync } from "fs";
import { globby } from "globby";
import prettier from "prettier";

const BASE_URL = "https://flux1.one";

const DOMAIN_CONFIG = {
  en: BASE_URL,
  ar: `${BASE_URL}/ar`,
  "pt-BR": `${BASE_URL}/pt-BR`,
  fr: `${BASE_URL}/fr`,
  es: `${BASE_URL}/es`,
  "zh-Hant": `${BASE_URL}/zh-Hant`,
  de: `${BASE_URL}/de`,
  ja: `${BASE_URL}/ja`,
  ko: `${BASE_URL}/ko`,
  it: `${BASE_URL}/it`
};
async function generate() {
  const sitemapFiles = [];

  for (const [lang, domain] of Object.entries(DOMAIN_CONFIG)) {
    const pages = await globby([
      `.next/server/pages${lang === 'en' ? '' : '/' + lang}/**/*.html`,
      `!.next/server/pages${lang === 'en' ? '' : '/' + lang}/**/404.html`,
      `!.next/server/pages${lang === 'en' ? '' : '/' + lang}/**/500.html`,
      `!.next/server/pages${lang === 'en' ? '' : '/' + lang}/**/[*.html`
    ]);

    const urls = new Set();
    urls.add(domain);

    pages.forEach(page => {
      const route = page
        .replace(`.next/server/pages${lang === 'en' ? '' : '/' + lang}`, "")
        .replace(".html", "")
        .replace(/\/index$/, "");

      if (route) {
        urls.add(`${domain}${route}`);
      }
    });



    const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${[...urls].map(url => `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>
      `).join('')}
    </urlset>
    `;

    try {
      const formatted = await prettier.format(sitemap, {
        parser: "html",
      });

      const sitemapFileName = `sitemap-${lang}.xml`;
      writeFileSync(`public/${sitemapFileName}`, formatted);
      console.log(`Generated sitemap for ${lang}: public/${sitemapFileName}`);
      sitemapFiles.push(sitemapFileName);
    } catch (error) {
      console.error(`Error generating sitemap for ${lang}:`, error);
    }
  }

  // Generate sitemap index file
  const sitemapIndex = `
  <?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${sitemapFiles.map(file => `
      <sitemap>
        <loc>${BASE_URL}/${file}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </sitemap>
    `).join('')}
  </sitemapindex>
  `;

  try {
    const formattedIndex = await prettier.format(sitemapIndex, {
      parser: "html",
    });

    writeFileSync('public/sitemap.xml', formattedIndex);
    console.log('Generated sitemap index: public/sitemap.xml');
  } catch (error) {
    console.error('Error generating sitemap index:', error);
  }
}

generate().catch(console.error);