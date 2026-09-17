import en from './en.json';
import de from './de.json';

export const languages = { en: 'EN', de: 'DE' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';
export const langs = Object.keys(languages) as Lang[];

const dictionaries: Record<Lang, unknown> = { en, de };

export function isLang(value: string | undefined): value is Lang {
  return !!value && value in languages;
}

function lookup(dict: unknown, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined),
      dict,
    );
  return typeof value === 'string' ? value : undefined;
}

/**
 * Returns a translate function for a language. Missing keys fall back to English,
 * then to the key itself, so a page never breaks. `{name}` tokens are replaced from `vars`.
 */
export function useTranslations(lang: Lang) {
  return function t(key: string, vars: Record<string, string | number> = {}): string {
    const raw = lookup(dictionaries[lang], key) ?? lookup(dictionaries[defaultLang], key) ?? key;
    return raw.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
  };
}

/** Prefix a site-relative path with the configured base path. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Equivalent pages per language – used by the navigation, the EN | DE switch and hreflang links.
 * To localise a German URL (e.g. /de/projekt/), change it here AND rename the page file.
 */
export const routes = {
  home: { en: '/en/', de: '/de/' },
  project: { en: '/en/project/', de: '/de/project/' },
  technology: { en: '/en/technology/', de: '/de/technology/' },
  progress: { en: '/en/progress/', de: '/de/progress/' },
  team: { en: '/en/team/', de: '/de/team/' },
  partners: { en: '/en/partners/', de: '/de/partners/' },
  contact: { en: '/en/contact/', de: '/de/contact/' },
  imprint: { en: '/en/imprint/', de: '/de/impressum/' },
} satisfies Record<string, Record<Lang, string>>;

export type RouteKey = keyof typeof routes;

/** Pages in the main navigation, in order */
export const navRoutes = ['project', 'technology', 'progress', 'team', 'partners', 'contact'] as const satisfies RouteKey[];

export function routeFor(key: RouteKey, lang: Lang): string {
  return withBase(routes[key][lang]);
}

/** getStaticPaths() result for pages that exist in every language */
export function langPaths() {
  return langs.map((lang) => ({ params: { lang } }));
}
