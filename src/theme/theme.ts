/**
 * Accent variants. `color` is used for fills, lines and large elements,
 * `text` for accent-coloured running text (≥ 4.5:1 contrast on the background),
 * `on` for text placed on an accent fill. All pairs checked against WCAG AA.
 */
export const accents = {
  brand: {
    label: 'Brand orange #FF4A1C',
    light: { color: '#FF4A1C', text: '#C2300A', on: '#000000' },
    dark: { color: '#FF4A1C', text: '#FF6A45', on: '#000000' },
  },
  deep: {
    label: 'Dark orange #D63A0F',
    light: { color: '#D63A0F', text: '#B02E08', on: '#FFFFFF' },
    dark: { color: '#E8491C', text: '#FF7A55', on: '#000000' },
  },
  neutral: {
    label: 'Neutral grey #4A4A4A',
    light: { color: '#4A4A4A', text: '#4A4A4A', on: '#FFFFFF' },
    dark: { color: '#D1D1D1', text: '#D1D1D1', on: '#000000' },
  },
} as const;

export type AccentKey = keyof typeof accents;

export interface ThemeConfig {
  /** Font names from src/theme/fonts.ts */
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  mode: 'light' | 'dark';
  accent: AccentKey;
  /** Set the hero tagline in the logo font (Zen Dots) instead of the heading font */
  taglineLogoFont: boolean;
}

/**
 * Active theme. Pick a combination with the dev-only design switcher
 * (`npm run dev`, panel bottom right), press "Copy config" and replace the block below.
 */
export const theme: ThemeConfig = {
  headingFont: 'Space Grotesk',
  bodyFont: 'Inter',
  monoFont: 'JetBrains Mono',
  mode: 'light',
  accent: 'brand',
  taglineLogoFont: false,
};
