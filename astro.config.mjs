// @ts-check
import { defineConfig } from 'astro/config';

// PLACEHOLDER – subdomain requested with ETH, pending. Change it here only;
// every absolute URL (canonical, hreflang, Open Graph) is derived from `site`.
const SITE_URL = 'https://akribis.ethz.ch';

export default defineConfig({
  site: SITE_URL,
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
