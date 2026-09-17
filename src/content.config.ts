import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import type { SchemaContext } from 'astro:content';

/* ------------------------------------------------------------------ */
/* Page sections – src/content/{en,de}/sections/<section>.md           */
/* ------------------------------------------------------------------ */

const common = {
  /** German drafts: set to true once a team member has proofread the text */
  proofread: z.boolean().default(true),
};

const heroSchema = (image: SchemaContext['image']) =>
  z.object({
    section: z.literal('hero'),
    tagline: z.string(),
    subline: z.string(),
    /** Optional background photo (src/assets/…) – empty shows a placeholder */
    background: image().nullish(),
    background_alt: z.string().nullish(),
    /** Optional background video in /public/videos, e.g. /videos/hero.mp4 */
    background_video: z.string().nullish(),
    ...common,
  });

const challengeSchema = z.object({
  section: z.literal('challenge'),
  title: z.string(),
  sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  ...common,
});

const projectSchema = z.object({
  section: z.literal('project'),
  title: z.string(),
  /** Short team/lab context shown below the Project page title */
  context: z
    .object({
      focus: z.object({ title: z.string(), text: z.string() }),
      lab: z.object({ title: z.string(), text: z.string() }),
    })
    .optional(),
  idea: z.object({ title: z.string(), text: z.string() }),
  diagram: z.array(
    z.object({
      label: z.string(),
      scale: z.string(),
      text: z.string().optional(),
      highlight: z.boolean().default(false),
    }),
  ),
  build: z.object({ title: z.string(), text: z.string() }),
  goal: z.object({ title: z.string(), text: z.string() }),
  target: z.object({ title: z.string(), label: z.string(), value: z.string(), range: z.string().optional() }),
  path: z.object({
    title: z.string(),
    text: z.string(),
    steps: z.array(z.string()).default([]),
  }),
  ...common,
});

const technologySchema = (image: SchemaContext['image']) =>
  z.object({
  section: z.literal('technology'),
  title: z.string().optional(),
  intro: z.string().optional(),
  cards: z.array(
    z.object({
      title: z.string(),
      text: z.string(),
      /** Optional icon/image (src/assets/…) – empty shows a placeholder */
      image: image().nullish(),
      image_alt: z.string().nullish(),
    }),
  ),
  specs: z.array(
    z.object({
      label: z.string(),
      /** Leave empty until measured on own hardware – renders as TBD */
      value: z.string().nullish(),
    }),
  ),
  ...common,
});

const progressSchema = z.object({
  section: z.literal('progress'),
  title: z.string().optional(),
  intro: z.string().optional(),
  ...common,
});

const impactSchema = z.object({
  section: z.literal('impact'),
  title: z.string().optional(),
  items: z.array(z.object({ title: z.string(), text: z.string() })),
  ...common,
});

const teamSchema = z.object({
  section: z.literal('team'),
  title: z.string().optional(),
  intro: z.string(),
  ...common,
});

const coachesSchema = z.object({
  section: z.literal('coaches'),
  title: z.string().optional(),
  intro: z.string().optional(),
  ...common,
});

const partnersSchema = z.object({
  section: z.literal('partners'),
  title: z.string().optional(),
  /** "What is a Focus Project?" – top of the Partners page */
  focus: z.object({ title: z.string(), text: z.string() }),
  why: z.object({
    title: z.string(),
    points: z.array(z.object({ title: z.string(), text: z.string() })).min(1),
  }),
  /** "Who do we reach?" – audiences + one sentence about the Rollout */
  reach: z.object({ title: z.string(), audiences: z.array(z.string()).min(1), text: z.string() }),
  cta: z.object({ title: z.string(), text: z.string(), button: z.string() }),
  ...common,
});

const contactSchema = z.object({
  section: z.literal('contact'),
  title: z.string().optional(),
  intro: z.string().optional(),
  ...common,
});

/** Home page teasers – short versions of the Project page content */
const homeSchema = z.object({
  section: z.literal('home'),
  challenge: z.object({
    title: z.string(),
    /** 2–3 sentences */
    text: z.string(),
    statement: z.string().optional(),
  }),
  project: z.object({
    title: z.string(),
    text: z.string(),
  }),
  progress: z.object({ title: z.string().optional() }).optional(),
  ...common,
});

const sections = defineCollection({
  loader: glob({ pattern: '{en,de}/sections/*.md', base: './src/content' }),
  schema: ({ image }) =>
    z.discriminatedUnion('section', [
    heroSchema(image),
    homeSchema,
    challengeSchema,
    projectSchema,
    technologySchema(image),
    progressSchema,
    impactSchema,
    teamSchema,
    coachesSchema,
    partnersSchema,
    contactSchema,
  ]),
});

/* ------------------------------------------------------------------ */
/* Progress stages – src/content/{en,de}/stages/NN-slug.md             */
/* ------------------------------------------------------------------ */

const stages = defineCollection({
  loader: glob({ pattern: '{en,de}/stages/*.md', base: './src/content' }),
  schema: ({ image }) =>
    z.object({
      order: z.number().int().positive(),
      title: z.string(),
      /** Required in the English (master) file; German files inherit it */
      status: z.enum(['done', 'active', 'upcoming']).optional(),
      /** Optional – only shown when filled, e.g. "October 2026" */
      date: z.union([z.string(), z.date()]).nullish(),
      cover: image().nullish(),
      cover_alt: z.string().nullish(),
      gallery: z
        .array(z.object({ src: image(), alt: z.string().optional() }))
        .nullish()
        .transform((v) => v ?? []),
      /** Path of a local video in /public/videos, e.g. /videos/kick-off.mp4 */
      video: z.string().nullish(),
      learned: z.string().nullish(),
      proofread: z.boolean().default(true),
    }),
});

/* ------------------------------------------------------------------ */
/* Language-independent data                                          */
/* ------------------------------------------------------------------ */

const localized = z.object({ en: z.string(), de: z.string().optional() });

const team = defineCollection({
  loader: file('src/content/team.json'),
  schema: z.object({
    name: z.string(),
    subteam: z.enum(['controls', 'electronics', 'mechanics']),
    role: localized,
    study: localized,
    /** File name inside src/assets/team/ – empty shows a placeholder */
    photo: z.string().default(''),
    /** Only shown when filled */
    linkedin: z.union([z.url(), z.literal('')]).default(''),
  }),
});

const coaches = defineCollection({
  loader: file('src/content/coaches.json'),
  schema: z.object({
    name: z.string(),
    role: localized,
    photo: z.string().default(''),
  }),
});

/* ------------------------------------------------------------------ */
/* Social media posts – src/content/posts.json                         */
/* Link cards only: local image + caption, the link opens the post.    */
/* ------------------------------------------------------------------ */

/** What a link to ONE post looks like per platform (profile links are rejected). */
const postUrlPatterns = {
  instagram: { hosts: ['instagram.com'], path: /^\/(p|reel|tv)\/[\w-]+/, example: 'https://www.instagram.com/p/ABC123/' },
  linkedin: {
    hosts: ['linkedin.com'],
    path: /^\/(posts\/[^/]+|feed\/update\/urn:li:[^/]+)/,
    example: 'https://www.linkedin.com/posts/akribis-eth-zurich_…',
  },
  youtube: {
    hosts: ['youtube.com', 'youtu.be'],
    path: /^\/(watch|shorts\/[\w-]+|[\w-]{6,}$)/,
    example: 'https://www.youtube.com/watch?v=ABC123',
  },
} as const;

const posts = defineCollection({
  loader: file('src/content/posts.json'),
  schema: z
    .object({
      platform: z.enum(['instagram', 'linkedin', 'youtube']),
      /** Direct link to the individual post – not the profile */
      url: z.url({ protocol: /^https$/, error: '"url" must be the full https:// link to the post (copy it from the browser address bar)' }),
      /** File name inside src/assets/posts/, e.g. "kick-off-team.jpg" */
      image: z.string().min(1),
      caption: z.object({ en: z.string().min(1), de: z.string().optional() }),
      /** Stage file name without .md, e.g. "02-concept" */
      stage: z.string().min(1),
      /** Publication date, e.g. "2026-10-05" – newest posts are shown first */
      date: z.coerce.date(),
    })
    .superRefine((post, ctx) => {
      const rule = postUrlPatterns[post.platform];
      // Zod still runs this check when "url" itself is invalid (e.g. "#") – that error is already reported
      if (!rule || !URL.canParse(post.url)) return;
      const url = new URL(post.url);
      const host = url.hostname.replace(/^(www|m)\./, '');
      const isPost =
        rule.hosts.some((h) => host === h) &&
        rule.path.test(url.pathname) &&
        (post.platform !== 'youtube' || url.pathname !== '/watch' || url.searchParams.has('v'));
      if (!isPost) {
        ctx.addIssue({
          code: 'custom',
          path: ['url'],
          message: `"url" must link to a single ${post.platform} post, not a profile or another site. Example: ${rule.example}`,
        });
      }
    }),
});

export const collections = { sections, stages, team, coaches, posts };
