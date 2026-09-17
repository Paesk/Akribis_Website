# Akribis – website

Website of **Akribis**, an ETH Zurich D-MAVT Focus Project (2026/27) at the Advanced Manufacturing Lab (am|z).
Built with [Astro](https://astro.build) as a fully static site: no backend, no database, no external requests.

- Pages: Home, Project, Technology, Progress, Team, Partners, Contact + Imprint (see the table below)
- English (`/en/`, default) and German (`/de/`); `/` redirects to `/en/`
- All content lives in `src/content/` – you do **not** need to touch layout code to change texts, team, stages or partners

---

## 1. Development

Requirements: [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install        # once
npm run dev        # http://localhost:4321  (live reload)
```

In dev mode a **Design** button appears bottom right (dev-only design switcher, see [§ 4](#4-fonts-colours-and-the-design-switcher)).

```bash
npm run check      # type-check content and components
npm run build      # production build → dist/
npm run preview    # serve dist/ locally to test the build
```

> **Windows:** stop the dev server (`Ctrl+C`, or `npx astro dev stop`) before running `check`/`build`, otherwise the shared `.astro/` cache can be locked.

## 2. Deployment

`npm run build` writes the complete website to **`dist/`**. It is plain HTML/CSS/JS/fonts and runs on **any static web server** – no server rules needed (the `/` → `/en/` redirect is a static HTML page).

1. `npm run build`
2. Upload the **contents** of `dist/` to the web root of the host (ETH hosting or external – TBD).
3. Recommended on the host: gzip/brotli compression and long cache headers for `/_astro/*` and `/fonts/*` (file names in `_astro/` are content-hashed).

**Domain:** set once in `astro.config.mjs` (`SITE_URL`, currently the placeholder `https://akribis.ethz.ch`). Canonical, hreflang and Open Graph URLs are derived from it. If the site is served from a sub-folder, also set `base` in `astro.config.mjs`; all internal links respect it.

---

## 3. Editing content (no coding needed)

All files below are plain text. Edit, save, check with `npm run dev`, then commit.

### Where is what?

| What | File |
|---|---|
| Home page teasers (challenge, project) | `src/content/{en,de}/sections/home.md` |
| Section texts (EN) | `src/content/en/sections/<section>.md` |
| Section texts (DE) | `src/content/de/sections/<section>.md` |
| Progress stages | `src/content/en/stages/NN-slug.md` (+ German text in `src/content/de/stages/`) |
| Social media posts | `src/content/posts.json` (images in `src/assets/posts/`) |
| Team members | `src/content/team.json` |
| Coaches | `src/content/coaches.json` |
| Partners / sponsors | `src/content/partners.json` |
| Email, address, social media | `src/content/site.json` |
| Buttons, navigation, labels | `src/i18n/en.json`, `src/i18n/de.json` |
| Fonts & colours | `src/theme/theme.ts`, `src/theme/fonts.ts` |

Texts in `.md` files sit between the `---` lines (YAML). If a text contains a colon followed by a space (`: `), wrap it in double quotes.

### Progress stages (moving the progress bar)

Each stage is one file in `src/content/en/stages/`. **To move the bar, change `status`** – nothing else:

```yaml
order: 2
title: Concept
status: active        # done | active | upcoming
date:                 # optional, free text, e.g. "October 2026" – only shown when filled
cover:                # optional image
gallery: []           # optional images
video:                # optional local video, e.g. /videos/concept.mp4
learned:              # optional "What we learned" text
```

- The **update text** goes below the closing `---` as normal text (Markdown). Empty → a placeholder is shown.
- The **English file is the master** for status, date, images and video. The German file in `src/content/de/stages/` only contains the translated `title`, text and `learned`.
- Images: put them in `src/assets/stages/` and reference them relative to the stage file. They are automatically converted to AVIF/WebP and lazy-loaded:
  ```yaml
  cover: ../../../assets/stages/concept-cover.jpg
  cover_alt: CAD model of the correction stage
  gallery:
    - src: ../../../assets/stages/concept-1.jpg
      alt: Team discussing the concept at the whiteboard
  ```
- Videos: put the file (e.g. MP4, compressed) into `public/videos/` and write `video: /videos/concept.mp4`.
- "Stage X of 8" is the `active` stage (or the last `done` one). Add/remove stages by adding/removing files; keep `order` consistent.
- Social media posts about a stage are added separately – see the next section.

### How to add a social media post

Posts appear as cards on the **home page** ("Latest from our socials", the 3 newest) and in the matching **stage panel on the Progress page**. The website never embeds Instagram/LinkedIn/YouTube: it shows a picture and a short caption stored here, and clicking the card opens the post on the platform.

While `posts.json` is empty, three grey **"Post TBD"** placeholder cards are shown. They disappear automatically as soon as you add the first real post.

1. **Publish the post** on Instagram, LinkedIn or YouTube first.
2. **Copy the link to that one post** – not to the profile:
   - Instagram: open the post → ⋯ → *Copy link* → looks like `https://www.instagram.com/p/ABC123/` (or `/reel/…`)
   - LinkedIn: open the post → ⋯ → *Copy link to post* → looks like `https://www.linkedin.com/posts/…` or `https://www.linkedin.com/feed/update/urn:li:activity:…`
   - YouTube: *Share* → *Copy* → looks like `https://www.youtube.com/watch?v=ABC123` or `https://youtu.be/ABC123`
3. **Save the post image** (the photo you posted, JPG or PNG) into the folder `src/assets/posts/`. Use a simple file name without spaces, e.g. `concept-first-sketches.jpg`. Only use images the team may publish (everyone shown has agreed).
4. **Find the stage name**: it is the file name in `src/content/en/stages/` without `.md`, e.g. `02-concept`.
5. **Open `src/content/posts.json`** and add one block per post. If the file only contains `[]`, replace it with:
   ```json
   [
     {
       "id": "concept-first-sketches",
       "platform": "instagram",
       "url": "https://www.instagram.com/p/ABC123/",
       "image": "concept-first-sketches.jpg",
       "caption": { "en": "First sketches of the correction stage", "de": "Erste Skizzen der Korrekturstufe" },
       "stage": "02-concept",
       "date": "2026-10-05"
     }
   ]
   ```
   To add another post, put a comma after the closing `}` of the previous block and paste a new block before the final `]`.
   - `id`: any unique name (lowercase, dashes) – just used to tell posts apart
   - `platform`: `instagram`, `linkedin` or `youtube`
   - `caption`: short, 1–2 lines. Without `"de"` the English caption is shown on the German page. Swiss spelling ("ss").
   - `date`: the day the post was published (`YYYY-MM-DD`). Newest posts are shown first.
6. **Check it:** run `npm run dev`, open http://localhost:4321/en/ and the Progress page, and click the card – it should open the post in a new tab.
7. **Commit** the changed `posts.json` and the new image.

If something is wrong, `npm run dev` / `npm run build` shows a message naming the post, e.g. *"url" must link to a single instagram post, not a profile* or *unknown stage "concept". Use one of: 01-kick-off, 02-concept, …*. A missing image file shows a grey placeholder instead of the picture.

To remove a post, delete its block (and the image). When the last post is removed, the placeholder cards come back.

### Team

`src/content/team.json` – one block per person:

```json
{
  "id": "joel-brozek",
  "name": "Joel Brozek",
  "subteam": "mechanics",
  "role": { "en": "Sponsoring", "de": "Sponsoring" },
  "study": { "en": "Mechanical Engineering, ETH Zurich", "de": "Maschineningenieurwissenschaften, ETH Zürich" },
  "photo": "joel-brozek.jpg",
  "linkedin": "https://www.linkedin.com/in/…"
}
```

- `subteam`: `controls`, `electronics` or `mechanics` (shown as "Subteam · Controls", DE "Subteam · Regelung"). Cards are grouped Controls → Electronics → Mechanics, then alphabetically by last name – the order in the file does not matter. All cards look the same.
- `role`: the organisational soft role, shown as "Soft role · …". The Team Lead is simply `"role": { "en": "Team Lead", "de": "Teamleitung" }`.
- `photo`: file name inside `src/assets/team/` (portrait, ideally 4:5). Empty → placeholder.
- `linkedin`: only shown when filled. **No personal email addresses.**
- Only publish people who gave consent for name/photo.

Coaches work the same way in `src/content/coaches.json` (photos in `src/assets/coaches/`, square).

### Partners / sponsors

`src/content/partners.json`. The logo wall is **hidden while `partners` is empty**.

```json
"partners": [
  { "name": "Company AG", "logo": "company-ag.svg", "url": "https://www.company.ch", "tier": "tier-1" },
  { "name": "Workshop GmbH", "logo": "workshop.png", "url": "", "tier": "supporters" }
]
```

- Logo files go into `src/assets/partners/` (SVG or PNG with transparent background).
- `tier` must match an `id` in `tiers`. Rename the tier `name`s to match the sponsoring brochure (currently TBD). `supporters` is the in-kind / supporters group. Empty tiers are not shown.
- No tiers, benefits or prices on the website – only names and logos.

### Contact, email, social media

`src/content/site.json`:

- `email.placeholder: true` → shown as a marked placeholder, not clickable. Set to `false` once `akribis@ethz.ch` exists.
- `address.placeholder: false` once the postal address is confirmed.
- `socials`: set `placeholder: false` once an account is live (then it becomes a link). An empty `url` or `"enabled": false` hides it (e.g. YouTube).

### Section texts & German translations

- Every section has an English and a German file with the same name.
- German drafts carry `proofread: false` → a small **"Proofreading TBD"** marker is shown. After proofreading, set `proofread: true` (or delete the line). Swiss spelling: "ss", no "ß".
- If a German file is missing, the English text is shown with a **"Translation TBD"** marker – the page never breaks.
- The hero tagline **"Beyond humanoid precision."** stays English in both languages.
- Hero photo/video: add `background: ../../../assets/hero.jpg` (+ `background_alt`) or `background_video: /videos/hero.mp4` to `src/content/en/sections/hero.md`.
- Technology cards: add `image: ../../../assets/tech/…` (+ `image_alt`) per card. Spec values (`specs`) only with **own measured data**; empty → "TBD".

### Wording rules (short version)

No "world's first / unique / only" claims · accuracy figures only as **targets** until measured · do not name the humanoid model ("a humanoid robot") · welding is the goal, adhesive dispensing is a validation step · no budget, prices, tiers, internal processes · only the project email and Joel's email are public · "positioning accuracy of the tool relative to the workpiece" · external sources only public and linked.

---

## 4. Fonts, colours and the design switcher

`npm run dev` → **Design** button (bottom right). Choose heading/body/mono font, light/dark theme, accent colour and whether the hero tagline uses Zen Dots. The selection is remembered in your browser. **Copy config** copies a snippet – paste it over the `theme` block in `src/theme/theme.ts` and commit. The switcher is only rendered in dev mode and is not part of `npm run build`.

- Defaults until decided: Space Grotesk (headings), Inter (body), JetBrains Mono (mono), light theme, brand orange `#FF4A1C`.
- All fonts are local files in `public/fonts/` (licences in `public/fonts/licenses/`). **Add a font:** copy the `.woff2` into `public/fonts/` and add one entry to the list in `src/theme/fonts.ts`.
- Accent variants live in `src/theme/theme.ts`; each has a text colour that meets WCAG AA contrast.
- Logo files: originals in `/brand`, used from `src/assets/brand/`. The dark grey of the logo switches to light grey in dark mode; the orange is unchanged. Zen Dots is used only for the logo (and optionally the tagline).

---

## 5. Project structure

```
astro.config.mjs            site URL (domain), i18n
brand/                      original logo files
public/                     copied as-is: fonts, favicons, videos
src/
  content.config.ts         content schemas (validates all content files)
  content/                  ALL content – see § 3
  i18n/                     UI strings EN/DE + helpers (routes: imprint ↔ impressum)
  theme/                    theme config + font list
  assets/                   images (optimised at build time)
  lib/                      content loading (fallbacks, markers, ordering)
  layouts/BaseLayout.astro  <head>, fonts, theme variables, header/footer
  components/               Header, Footer, Logo, Placeholder, Marker, …
  components/sections/      one component per content section (reused by the pages)
  components/home/          home page teasers, progress indicator, partner CTA
  components/dev/           dev-only design switcher
  pages/                    / (redirect), [lang]/index|project|technology|progress|team|partners|contact,
                            en/imprint, de/impressum, 404
  styles/global.css         design tokens & base styles
```

Pages only combine section components; navigation, language switch and hreflang are driven by the `routes` map in `src/i18n/utils.ts`.

| Page | URL (EN · DE) | Sections (content files) |
|---|---|---|
| Home | `/en/` · `/de/` | Hero (`hero.md`), challenge + project teasers (`home.md`; diagram and goal from `project.md`), progress indicator (stage files), partner CTA (`partners.md`) |
| Project | `/en/project/` · `/de/project/` | `challenge.md`, `project.md`, `impact.md` |
| Technology | `/en/technology/` · `/de/technology/` | `technology.md` |
| Progress | `/en/progress/` · `/de/progress/` | stage files |
| Team | `/en/team/` · `/de/team/` | `team.md`, `team.json`, `coaches.json` |
| Partners | `/en/partners/` · `/de/partners/` | `partners.md`, `partners.json` |
| Contact | `/en/contact/` · `/de/contact/` | `site.json` |

**Add a page:** create `src/pages/[lang]/<slug>.astro` (copy e.g. `technology.astro`), add the route to `routes` (and to `navRoutes` for the menu) in `src/i18n/utils.ts`, and add `nav.<key>` + `pages.<key>` strings to `src/i18n/en.json` / `de.json`.

## 6. Open placeholders (visible on the site)

Hero photo/video · stage texts 2–8, stage photos · team photos (9) + group photo · coach photos (6) · LinkedIn URLs · ETH and am|z logos · spec values · partner logos + tier names · project email · postal address · social media accounts · imprint/legal text · German proofreading.
