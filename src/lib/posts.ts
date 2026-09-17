import { getCollection } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { assetImage, getStages } from './content';
import { defaultLang, useTranslations, type Lang } from '../i18n/utils';

export type Platform = 'instagram' | 'linkedin' | 'youtube';

export const platformNames: Record<Platform, string> = {
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
};

export interface ResolvedPost {
  id: string;
  platform: Platform;
  platformName: string;
  /** Link to the individual post; null for placeholder posts (rendered as a non-clickable card) */
  url: string | null;
  /** Local image from src/assets/posts/; null shows a placeholder box */
  image: ImageMetadata | null;
  caption: string;
  /** German caption missing – English caption shown */
  captionFallback: boolean;
  /** Stage file name without .md, e.g. "02-concept" */
  stage: string;
  stageTitle: string;
  date: Date | null;
  placeholder: boolean;
}

/**
 * Shown only while src/content/posts.json is empty (the accounts do not exist yet).
 * As soon as one real post is added, all placeholders disappear.
 */
const placeholderPosts: { id: string; platform: Platform; stage: string }[] = [
  { id: 'placeholder-1', platform: 'instagram', stage: '02-concept' },
  { id: 'placeholder-2', platform: 'linkedin', stage: '02-concept' },
  { id: 'placeholder-3', platform: 'instagram', stage: '01-kick-off' },
];

/** All posts for a language, newest first. */
export async function getPosts(lang: Lang): Promise<ResolvedPost[]> {
  const t = useTranslations(lang);
  const stages = await getStages(lang);
  const stageTitles = new Map(stages.map((s) => [s.slug, s.title]));
  const stageTitle = (stage: string, postId: string) => {
    const title = stageTitles.get(stage);
    if (!title) {
      throw new Error(
        `Post "${postId}" in src/content/posts.json has unknown stage "${stage}". ` +
          `Use one of: ${[...stageTitles.keys()].join(', ')}`,
      );
    }
    return title;
  };

  const entries = await getCollection('posts');

  if (entries.length === 0) {
    return placeholderPosts.map((p) => ({
      ...p,
      platformName: platformNames[p.platform],
      url: null,
      image: null,
      caption: t('posts.placeholderCaption'),
      captionFallback: false,
      stageTitle: stageTitle(p.stage, p.id),
      date: null,
      placeholder: true,
    }));
  }

  return entries
    .map(({ id, data }) => {
      const localized = lang === defaultLang ? data.caption.en : data.caption.de;
      return {
        id,
        platform: data.platform,
        platformName: platformNames[data.platform],
        url: data.url,
        image: assetImage('posts', data.image),
        caption: localized ?? data.caption.en,
        captionFallback: !localized,
        stage: data.stage,
        stageTitle: stageTitle(data.stage, id),
        date: data.date,
        placeholder: false,
      } satisfies ResolvedPost;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
