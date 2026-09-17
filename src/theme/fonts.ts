/**
 * Font candidates. All files live in /public/fonts/ – no external requests.
 * To add a font: drop the .woff2 file into /public/fonts/ and add ONE entry below.
 * `roles` decides in which dev-switcher dropdown(s) the font appears.
 * Browsers only download a font file when the font is actually used on the page.
 */
export type FontRole = 'heading' | 'body' | 'mono' | 'logo';

export interface FontFile {
  file: string;
  /** Single weight ("400") or variable range ("300 700") */
  weight: string;
  style?: 'normal' | 'italic';
}

export interface FontDef {
  /** CSS font-family name */
  name: string;
  roles: FontRole[];
  /** Fallback stack appended after the font */
  fallback: string;
  files: FontFile[];
}

const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const MONO = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, 'Liberation Mono', monospace";

export const fonts: FontDef[] = [
  {
    name: 'Space Grotesk',
    roles: ['heading'],
    fallback: SANS,
    files: [{ file: 'space-grotesk-latin-wght-normal.woff2', weight: '300 700' }],
  },
  {
    name: 'Inter',
    roles: ['heading', 'body'],
    fallback: SANS,
    files: [
      { file: 'inter-latin-wght-normal.woff2', weight: '100 900' },
      { file: 'inter-latin-wght-italic.woff2', weight: '100 900', style: 'italic' },
    ],
  },
  {
    name: 'IBM Plex Sans',
    roles: ['heading', 'body'],
    fallback: SANS,
    files: [
      { file: 'ibm-plex-sans-latin-wght-normal.woff2', weight: '100 700' },
      { file: 'ibm-plex-sans-latin-wght-italic.woff2', weight: '100 700', style: 'italic' },
    ],
  },
  {
    name: 'Zen Dots',
    roles: ['heading', 'logo'],
    fallback: SANS,
    files: [{ file: 'zen-dots-latin-400-normal.woff2', weight: '400' }],
  },
  {
    name: 'Source Sans 3',
    roles: ['body'],
    fallback: SANS,
    files: [
      { file: 'source-sans-3-latin-wght-normal.woff2', weight: '200 900' },
      { file: 'source-sans-3-latin-wght-italic.woff2', weight: '200 900', style: 'italic' },
    ],
  },
  {
    name: 'JetBrains Mono',
    roles: ['mono'],
    fallback: MONO,
    files: [{ file: 'jetbrains-mono-latin-wght-normal.woff2', weight: '100 800' }],
  },
  {
    name: 'IBM Plex Mono',
    roles: ['mono'],
    fallback: MONO,
    files: [
      { file: 'ibm-plex-mono-latin-400-normal.woff2', weight: '400' },
      { file: 'ibm-plex-mono-latin-500-normal.woff2', weight: '500' },
    ],
  },
];

export function fontStack(name: string): string {
  const def = fonts.find((f) => f.name === name);
  return def ? `'${def.name}', ${def.fallback}` : SANS;
}
