// @ts-check
import { defineConfig } from 'astro/config';

// Domain and sub-path come from the environment so the same code builds for
// akribis.ethz.ch (defaults) and for a sub-path host such as GitHub Pages:
//   SITE_URL=https://paesk.github.io BASE_PATH=/Akribis_Website npm run build
// SITE_URL is the origin only (no path). Every absolute URL (canonical, hreflang,
// Open Graph) is derived from `site`, every internal link and asset from `base`.
// PLACEHOLDER default – subdomain requested with ETH, pending.
const SITE_URL = process.env.SITE_URL || 'https://akribis.ethz.ch';

// Normalise "Akribis_Website", "/Akribis_Website/" … to "/Akribis_Website"; empty → "/".
const BASE_PATH = `/${(process.env.BASE_PATH || '').replace(/^\/+|\/+$/g, '')}`;
if (/[:\\\s]/.test(BASE_PATH)) {
  // Git Bash on Windows rewrites "/Akribis_Website" to "C:/Program Files/Git/Akribis_Website"
  throw new Error(`Invalid BASE_PATH "${BASE_PATH}". In Git Bash, prefix the command with MSYS_NO_PATHCONV=1.`);
}

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      // `/` → `/en/` is handled by src/pages/index.astro (plain static redirect page)
      redirectToDefaultLocale: false,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
