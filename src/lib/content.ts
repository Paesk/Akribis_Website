import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { defaultLang, type Lang } from '../i18n/utils';
import teamJson from '../content/team.json';
import coachesJson from '../content/coaches.json';

type SectionEntry = CollectionEntry<'sections'>;
type SectionData = SectionEntry['data'];
export type SectionName = SectionData['section'];
type DataFor<N extends SectionName> = Extract<SectionData, { section: N }>;

export interface ResolvedSection<N extends SectionName> {
  entry: SectionEntry;
  data: DataFor<N>;
  /** German file missing → English content shown */
  translationMissing: boolean;
  /** German draft not yet proofread */
  needsProofreading: boolean;
}

/**
 * Loads a page section for a language. If the translation is missing,
 * the English version is returned and flagged so a "Translation TBD" marker can be shown.
 */
export async function getSection<N extends SectionName>(lang: Lang, name: N): Promise<ResolvedSection<N>> {
  const localized = await getEntry('sections', `${lang}/sections/${name}`);
  const entry = localized ?? (await getEntry('sections', `${defaultLang}/sections/${name}`));
  if (!entry) throw new Error(`Missing section content: src/content/${defaultLang}/sections/${name}.md`);
  if (entry.data.section !== name) {
    throw new Error(`Section file ${entry.id} declares "section: ${entry.data.section}", expected "${name}"`);
  }
  return {
    entry,
    data: entry.data as DataFor<N>,
    translationMissing: lang !== defaultLang && !localized,
    needsProofreading: lang !== defaultLang && !!localized && !entry.data.proofread,
  };
}

/** True when a Markdown body has real content (ignores HTML comments and whitespace). */
export function hasBody(body: string | undefined): boolean {
  return !!body && body.replace(/<!--[\s\S]*?-->/g, '').trim().length > 0;
}

export type StageStatus = 'done' | 'active' | 'upcoming';

export interface ResolvedStage {
  slug: string;
  order: number;
  status: StageStatus;
  title: string;
  date: string | null;
  cover: ImageMetadata | null;
  coverAlt: string;
  gallery: { src: ImageMetadata; alt: string }[];
  video: string | null;
  learned: string | null;
  /** Entry whose Markdown body is rendered (localized if available) */
  bodyEntry: CollectionEntry<'stages'>;
  hasText: boolean;
  translationMissing: boolean;
  needsProofreading: boolean;
}

function formatDate(value: string | Date | null | undefined, lang: Lang): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toLocaleDateString(lang === 'de' ? 'de-CH' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return value.trim() || null;
}

/**
 * Progress stages. The English file is the master for order, status, date and media;
 * the German file (if present) supplies title, text and "what we learned".
 */
export async function getStages(lang: Lang): Promise<ResolvedStage[]> {
  const all = await getCollection('stages');
  const masters = all.filter((s) => s.id.startsWith(`${defaultLang}/`));

  return masters
    .map((master) => {
      const slug = master.id.split('/').pop()!;
      const localized = lang === defaultLang ? master : all.find((s) => s.id === `${lang}/stages/${slug}`);
      const text = localized ?? master;
      if (!master.data.status) {
        throw new Error(`Stage ${master.id} is missing "status" (done | active | upcoming)`);
      }
      return {
        slug,
        order: master.data.order,
        status: master.data.status,
        title: text.data.title,
        date: formatDate(master.data.date, lang),
        cover: master.data.cover ?? null,
        coverAlt: text.data.cover_alt ?? master.data.cover_alt ?? text.data.title,
        gallery: master.data.gallery.map((img, i) => ({
          src: img.src,
          alt: img.alt ?? `${text.data.title} – ${i + 1}`,
        })),
        video: master.data.video ?? null,
        learned: text.data.learned ?? master.data.learned ?? null,
        bodyEntry: text,
        hasText: hasBody(text.body),
        translationMissing: lang !== defaultLang && !localized,
        needsProofreading: lang !== defaultLang && !!localized && !localized.data.proofread,
      } satisfies ResolvedStage;
    })
    .sort((a, b) => a.order - b.order);
}

export interface ProgressSummary {
  total: number;
  /** 0-based index of the current stage */
  currentIndex: number;
  current: ResolvedStage | undefined;
  /** Share of the bar (first → last node) that is filled, 0–100 */
  fill: number;
}

/**
 * Current stage = the `active` one, otherwise the last `done` one, otherwise the first.
 * Shared by the Progress page and the home page indicator so both always agree.
 */
export function summarizeProgress(stages: ResolvedStage[]): ProgressSummary {
  const total = stages.length;
  const activeIndex = stages.findIndex((s) => s.status === 'active');
  const lastDoneIndex = stages.map((s) => s.status).lastIndexOf('done');
  const currentIndex = activeIndex >= 0 ? activeIndex : Math.max(lastDoneIndex, 0);
  return {
    total,
    currentIndex,
    current: stages[currentIndex],
    fill: total > 1 ? (currentIndex / (total - 1)) * 100 : 100,
  };
}

/* ------------------------------------------------------------------ */
/* Images referenced by file name from JSON data                      */
/* ------------------------------------------------------------------ */

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/{team,coaches,partners,posts}/*.{jpg,jpeg,png,webp,avif,svg}',
  { eager: true },
);

/** Resolve e.g. `photo: "yannic.jpg"` in team.json to src/assets/team/yannic.jpg. */
export function assetImage(folder: 'team' | 'coaches' | 'partners' | 'posts', fileName: string): ImageMetadata | null {
  if (!fileName) return null;
  const mod = imageModules[`/src/assets/${folder}/${fileName}`];
  if (!mod) {
    console.warn(`[akribis] Image not found: src/assets/${folder}/${fileName} – showing placeholder`);
    return null;
  }
  return mod.default;
}


/** Collection entries in the order they appear in the JSON file (the loader sorts by id). */
export async function getOrdered<C extends 'team' | 'coaches'>(collection: C) {
  const order = (collection === 'team' ? teamJson : coachesJson).map((item) => item.id);
  const entries = await getCollection(collection);
  return entries.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}

export function localize(value: { en: string; de?: string }, lang: Lang): string {
  return (lang === 'de' ? value.de : undefined) ?? value.en;
}
