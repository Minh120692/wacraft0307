---
title: 'Blog section for SEO publishing'
type: 'feature'
created: '2026-09-24'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'd43741e5f9846fc6b2df676b5d4bca4847e9dbde'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** There is nowhere to publish articles, and no SEO surface: one static `metadata` object
in `app/layout.js` serves all ten routes — no canonical, no per-page title or description, no Open
Graph, no hreflang, no sitemap, no robots.txt, no structured data.

**Approach:** Add a blog — index plus per-post pages, Japanese and English — on the existing
`SitePage` shell and Bootstrap theme, with posts as Markdown files rendered at build time so the
static export keeps working. Ship its SEO surface with it: per-post metadata, canonicals, hreflang,
Open Graph, `Article` JSON-LD, a generated sitemap, and robots.txt.

**Decisions (human-answered, locked):**
1. Canonical origin from `NEXT_PUBLIC_SITE_URL`, falling back to `https://wacraft-jp.com`.
2. Both locales at launch: `default` (Japanese) at `/blog/`, `en` at `/en/blog/`, reciprocal hreflang.
   No Vietnamese tree.
3. Posts are Markdown with YAML front-matter.
4. This repository becomes a publish target for the `seo-cockpit` runner
   (`~/Projects/auto_workflow/seo-cockpit`). In scope here: a documented, stable **publish
   contract** — the directory layout and front-matter schema an external tool must produce.
   The runner-side changes live in that other repository and are deferred to their own run.
   No articles are imported yet: the existing 20 outputs in `auto_workflow/wiki/outputs/` are
   written for Setsubi Pro (home-equipment repair), not WA+CRAFT (AI x BPO), so the pipeline
   ships proven by a self-written seed post instead.

## Boundaries & Constraints

**Always:**
- Build-time only, compatible with `output: "export"`: dynamic segments resolve via
  `generateStaticParams`; no route handlers, no runtime fetching, no ISR.
- Honor `trailingSlash: true` in every emitted URL — canonical, hreflang, sitemap.
- Reuse `SitePage`, `SiteHeader` and existing Bootstrap/theme classes; blog chrome must be
  indistinguishable from existing pages.
- Register blog routes in `ROUTES` and resolve links via `routeFor` — never hardcoded strings.
- Keep the established locale pattern: `"default"`/`"en"` keys, duplicated route tree, `locale` prop.
- Validate front-matter at build time. Bad input fails the build, never a silent page.

**Never:**
- No CMS, database, or runtime content source. No Tailwind, CSS modules, or new styling system.
- Do not retrofit metadata onto the ten existing marketing pages. `metadataBase` and a default Open
  Graph in the root layout are in scope only because canonicals depend on them.
- Do not touch `normalizeHtml`, the contact overlay, `server/contact-route.js`, or root `.html` files.
- Do not deploy, publish, or re-alias the site. It was intentionally taken offline on 2026-08-12.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Post list | 2+ published posts in a locale | Index lists them newest-first by `date` | N/A |
| Empty state | No published posts in a locale | Index renders empty-state message; build succeeds | N/A |
| Unknown slug | `/blog/does-not-exist/` | Not in `generateStaticParams`; no page emitted | N/A |
| Draft post | `published: false` | Excluded from index, `generateStaticParams`, sitemap | N/A |
| Invalid post | Missing `title`/`date`/`description`/`published`, unparseable `date`, or duplicate slug in a locale | No page emitted | Throw at build time naming the file and the offending field |
| Unpaired post | Slug in one locale only | Builds; hreflang lists only the existing locale | N/A |
| Paired post | Same slug in both locales | Reciprocal `alternates.languages` for `ja` and `en` | N/A |
| Sitemap | Build runs | Every marketing route + every published post, both locales, absolute trailing-slash URLs | N/A |

</frozen-after-approval>

## Code Map

- `app/layout.js` -- only layout in the tree; static `metadata` at line 3, hand-written `<head>` with
  vendor `<link>` tags, `<html lang="en">` hardcoded for **both** locales. Add `metadataBase`; do not
  restructure the `<head>`.
- `components/site-page.js` -- `SitePage({locale, activePage, intro, children, footer, scriptSuffix})`;
  `intro` renders above `children` inside `<main className="main">`. The shell to reuse.
- `components/site-header.js` -- `SiteHeader({locale, activePage})`; needs a blog nav item.
- `lib/site-content.js` -- `ROUTES`, `routeFor`, `getPageChrome`. Extend both. Leave `normalizeHtml`.
- `app/about/page.js` -- representative page; copy its `SitePage` usage and inline-intro pattern.
- `content/default/*.js`, `content/en/*.js` -- existing JSX sections re-exported by
  `content/<locale>/index.js`. Blog content deliberately departs: Markdown, not JSX.
- `next.config.mjs` -- `output: "export"`, `trailingSlash: true`.
- New ground: no `app/sitemap.js`, `app/robots.js`, `robots.txt`, or JSON-LD exists anywhere.
- `package.json` -- next 15.5.19, react 19.2.7, nodemailer. No `devDependencies`, no test runner, no linter.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add `gray-matter` and `marked` -- synchronous, build-time, config-free
- [x] `lib/site-url.js` -- new; `SITE_URL` from `NEXT_PUBLIC_SITE_URL` with the `https://wacraft-jp.com`
      fallback, no trailing slash, plus `absoluteUrl(path)` that guarantees one -- one owner of origin
- [x] `content/blog/default/`, `content/blog/en/` -- new; one seed post per locale with full
      front-matter (`title`, `date`, `description`, `published`, optional `image`) -- real content to
      render, and documents the format by example
- [x] `lib/blog.js` -- new; at build time read a locale's Markdown dir, parse front-matter, validate
      required fields and date, reject duplicate slugs, render body to HTML; export `getPosts(locale)`
      (published, newest-first) and `getPost(locale, slug)`. Slug = filename -- single source of truth
- [x] `lib/site-content.js` -- add `blog: { default: "/blog", en: "/en/blog" }` to `ROUTES`, `blogHref`
      to `getPageChrome` -- keeps link resolution centralized
- [x] `components/site-header.js` -- blog nav item via `blogHref`, active on `activePage === "blog"`
- [x] `components/blog-post-card.js` -- new; one-post list markup in existing theme classes -- shared
      by both index pages
- [x] `components/article-json-ld.js` -- new; `Article` JSON-LD from post fields -- shared by both
      detail pages
- [x] `app/blog/page.js`, `app/en/blog/page.js` -- new; index rendering `getPosts(locale)` in
      `SitePage` with `activePage="blog"`, plus `metadata` with canonical and hreflang
- [x] `app/blog/[slug]/page.js`, `app/en/blog/[slug]/page.js` -- new; `generateStaticParams` from
      `getPosts`, `generateMetadata` for title/description/canonical/Open Graph/hreflang, JSON-LD
- [x] `app/layout.js` -- add `metadataBase` from `SITE_URL` and a default Open Graph block
- [x] `app/sitemap.js` -- new; every marketing route and published post, both locales, absolute
      trailing-slash URLs
- [x] `app/robots.js` -- new; allow all, `sitemap` pointing at the absolute sitemap URL
- [x] `package.json` -- add a `"test": "node --test"` script -- the repo has no test runner; Node 22's
      built-in `node:test` adds zero dependencies
- [x] `lib/blog.test.js` -- new; `node:test` cases covering **every row** of the I/O & Edge-Case
      Matrix against fixture directories: listing order, empty state, unknown slug, draft exclusion,
      each invalid-post failure (missing field, bad date, duplicate slug), unpaired and paired
      hreflang, and sitemap contents -- the matrix is the test plan
- [x] `content/blog/README.md` -- new; the publish contract for external tooling: exact directory
      per locale, filename-to-slug rule, every front-matter field with type and whether it is
      required, a copy-paste template, and the validation rules that fail the build -- the
      seo-cockpit runner is written against this file

**Acceptance Criteria:**
- Given the repo, when `npm run build` runs, then it exits 0 and `out/` holds `blog/index.html`,
  `en/blog/index.html`, and one directory with `index.html` per published post per locale.
- Given a built post page, then its HTML carries a unique `<title>`, unique meta description, an
  absolute `<link rel="canonical">` ending in `/`, Open Graph tags, and one `application/ld+json`
  block of type `Article`.
- Given `out/sitemap.xml`, then it lists every marketing route and published post as an absolute
  trailing-slash URL, and no unpublished post.
- Given `NEXT_PUBLIC_SITE_URL` set to another origin, when the build runs, then every canonical,
  hreflang and sitemap URL uses that origin.
- Given `content/blog/README.md`, when a post is authored strictly by following it, then the build
  accepts the post and emits its page — the contract is sufficient on its own.
- Given any blog page compared to a marketing page, then header, footer, contact overlay and
  scroll-top chrome are present and styled identically, and the blog nav item is active.

## Implementation Notes

- **Empty-locale build.** `output: "export"` rejects a dynamic segment whose `generateStaticParams`
  returns an empty array (`next/dist/build/index.js`: `hasGenerateStaticParams` requires
  `length > 0`). Both `[slug]` routes therefore fall back to a single reserved param `__no-posts`
  when the locale has no published posts; the page calls `notFound()`, so the export writes Next's
  404 page (which already carries `noindex`) at that path. The route is unlinked and absent from the
  sitemap. Verified by temporarily removing the English seed post: build exits 0 and
  `/en/blog/` renders the empty-state message.
- **`app/sitemap.js` and `app/robots.js` declare `export const dynamic = "force-static"`.** Reading
  `NEXT_PUBLIC_SITE_URL` otherwise marks those metadata routes dynamic and the export fails.
- **Testability.** `getPosts`/`getPost`/`hasPost`/`alternatePaths` and `sitemapEntries()` take an
  optional blog-root argument so `lib/blog.test.js` can point the real readers at throwaway fixture
  directories instead of duplicating parsing logic. Production callers use the default.
- **Two URL builders.** `absoluteUrl(path)` guarantees the trailing slash the export emits;
  `absoluteAsset(path)` never appends one, and is used for images, the logo and `/sitemap.xml`.
- **hreflang is derived once.** `alternatePaths(slug)` in `lib/blog.js` is the single place that
  decides which locales a slug is published in; both detail pages map it onto
  `alternates.languages`. It resolves paths through `blogPostHref` -> `routeFor`, so no route
  strings are duplicated.
- **Scope note (behavior change beyond the blog):** `getPageChrome` now takes `activePage` and the
  header language switch resolves to the *same* page in the other locale instead of always the home
  page. This is required by the spec's manual check ("Header language switch moves between `/blog/`
  and `/en/blog/`"), and applies uniformly, so `/about/` now links to `/en/about/` rather than
  `/en/`. No metadata was added to the existing marketing pages.
- **Card markup** uses stock Bootstrap (`card`, `card-body`, `row gy-4`, `col-lg-4`) plus the
  existing `page-title section light-background` / `container section-title` intro pattern copied
  from `app/about/page.js`. No CSS file was added or modified.

## Spec Change Log

## Review Triage Log

**Iteration 1 — fixed (all covered by `lib/blog.test.js`, 56 tests passing):**
- JSON-LD injection: extracted `serializeJsonLd` into `lib/blog.js`, escaping `&`, `<`, `>` so a
  `</script>` in a post field cannot close the block. Verified end-to-end with a throwaway post.
- `toIsoDate` now takes the field name, so a bad `updated:` reports `updated`, not `date`.
- Required string fields are rejected when blank after trimming; `title`/`description` are stored trimmed.
- Slug charset enforced (`^[a-z0-9]+(-[a-z0-9]+)*$`), so a filename can never produce a route that
  does not match the href linking it. Documented in `content/blog/README.md`.
- `blogPostHref` emits the trailing slash; `absoluteUrl` output is unchanged.
- Root `description` / `openGraph.description` replaced with real marketing copy (was an internal note).
- The reserved `__no-posts` slug returns `robots: { index: false, follow: false }`. Note: Next's
  `notFound()` path supplies its own 404 metadata, which already emits `noindex`; the explicit return
  is belt-and-braces.
- Blog-index `lastModified` is now the max `updated ?? date` across the locale, not `posts[0]`.
- `absoluteUrl` preserves a `#fragment` (and a query string).
- Language switch on a post page goes to the translated post via `alternatePaths(slug)`, threaded as
  an optional `langHref` through `SitePage` -> `SiteHeader` -> `getPageChrome`, falling back to the
  other locale's blog index when there is no translation. This now matches the hreflang on the page.
- Tests added for every fix, plus the three verification gaps: `SITE_URL` fallback asserted against
  the literal origin with the env var deleted, `app/robots.js` asserted directly, and
  `getPageChrome`/`counterpartHref` asserted per `activePage` in both locales including the
  unknown-key fallback.

Three layers ran: blind-hunter (15), verification-gap (7 gaps + 2 other), edge-case-hunter (12).

**Routed to patch** (caused by this change, smallest fix is a direct correction)

| Verdict | Finding | Evidence |
|---|---|---|
| high | Unescaped JSON-LD injection (`components/article-json-ld.js`) | Confirmed by reading the file: `JSON.stringify(data)` goes straight into `dangerouslySetInnerHTML`. The publish contract states external tooling writes these posts, so a `</script>` in a title is reachable input. |
| high | Whitespace-only `title`/`description` pass validation (`lib/blog.js`) | Reproduced directly against `readPostsFromDir`: a post with `title: "   "` does not throw and yields a blank title and blank meta description — on a feature whose whole purpose is metadata. |
| medium | `updated` parse error names the wrong field (`lib/blog.js`) | Reproduced: `Invalid blog post "bad-updated.md": field "date" is not a parseable date`. Contradicts the contract's promise that each error names the offending field; the existing test matches `/date/` so it passes on the wrong message. |
| medium | Site description is an internal migration note (`app/layout.js`) | Confirmed: `description: "AI x BPO service website migrated to Next.js."`, and this change newly copied it into `openGraph.description`, so it ships as the SERP and social description of all ten marketing pages. |
| medium | Post-page language switch loses the translation | Confirmed: post pages pass `activePage="blog"`, so `counterpartHref` resolves the index. The page emits reciprocal hreflang to the translated post while the visible switch does not go there. |
| medium | `SITE_URL` fallback test cannot fail | Confirmed at `lib/blog.test.js`: the assertion is the regex `/^https?:\/\/[^/]+$/`, which matches any origin, and it never unsets `NEXT_PUBLIC_SITE_URL`. The one constant the whole SEO surface hangs on is unpinned. |
| medium | `blogPostHref` omits the trailing slash (`lib/site-content.js`) | Confirmed: returns `/blog/<slug>` under `trailingSlash: true`, so in-site links depend on a redirect. The spec's Always list requires the trailing slash on every emitted URL. |
| low | `__no-posts` sentinel is an indexable 200 URL | Real but unreachable today — verified absent from `out/`; it only appears once a locale has zero published posts, and then with no title and no noindex. |
| low | Slug charset unvalidated (`lib/blog.js`) | Filename becomes the slug unchecked; spaces or non-ASCII yield a route that will not match its href. |
| low | Blog index `lastModified` uses `posts[0]` only (`app/sitemap.js`) | An older post with a newer `updated` is not reflected in the index lastmod. |
| low | `absoluteUrl` drops `#fragment` (`lib/site-url.js`) | Confirmed by reading the function: the hash is split off and never re-appended. No current caller passes one. |
| medium | No test covers `app/robots.js`, `getPageChrome`/`counterpartHref`, post `generateMetadata`, or the JSON-LD shape | Verification-gap layer demonstrated each by mutation: inverting `counterpartHref`, swapping `absoluteAsset` for `absoluteUrl` in robots, and dropping the canonical wrapper all leave 30/30 tests green and the build at exit 0. |

**Rejected**

| Verdict | Finding | Refutation |
|---|---|---|
| low | Rendered Markdown is not sanitized | Real that `marked` output is injected raw, but the trust boundary is the git repository: anyone who can commit a post can already commit JavaScript. The fix adds a sanitizer dependency and strips the inline HTML the contract deliberately allows — more complexity than the everyday risk justifies. Recorded as deferred instead. |
| false | `SITE_URL` needs an absolute-origin guard | `NEXT_PUBLIC_SITE_URL` is set by the operator at build time, not by untrusted input, and a malformed value fails the build loudly at `new URL(SITE_URL)` in the layout. Loud failure on a situation never shown to be reachable is correct behavior, not a defect. |

**Deferred** — recorded in `deferred-work.md`

| Verdict | Finding | Note |
|---|---|---|
| medium | `why-us` nav item never highlights | Pre-existing, not caused by this change: `SiteHeader` looks up `chrome["why-usHref"]` while the key is `whyUsHref`, so Home is marked active on `/why-us/`. Confirmed by reading both files. |
| medium | Marketing pages have no canonical, hreflang or per-page metadata | Real SEO gap, but the spec's Never list explicitly excludes retrofitting the ten marketing pages. |
| medium | No `x-default` hreflang, no Twitter card, no default OG image, no `Organization`/`WebSite`/`BreadcrumbList` JSON-LD | Genuine additions to the SEO surface, none of them defects in what was built. |
| low | No pagination, no RSS feed, blog absent from the footer | Scale and distribution concerns that do not bite at two posts. |
| low | `<img>` on the post card has no dimensions (CLS) | Real, but the fix needs image dimensions the front-matter does not carry. |
| low | `tags` validated then discarded; front-matter `image` existence unchecked | Neither affects a correct post. |
| low | Date formatting untested | Closing it means extracting a display helper out of a JSX module for a cosmetic string. |

## Verification

**Results (2026-09-24, clean `rm -rf out .next` run):**
- `npm run build` -- exits 0, 19 routes, `Exporting (2/2)`, no unexportable-dynamic-route warning.
- `npm test` -- 30 tests, 30 pass, 0 fail (9 suites, one per matrix row plus URL/origin and
  shipped-content checks).
- Served `out/` over a local static server: `/blog/`, `/en/blog/`,
  `/blog/ai-bpo-operations/`, `/en/blog/ai-bpo-operations/`, `/sitemap.xml`, `/robots.txt` all 200;
  `/blog/does-not-exist/` 404. Header, footer, contact trigger and scroll-top counts on blog pages
  match `out/about/index.html` exactly.
- Post HTML carries a unique `<title>`, unique meta description, absolute canonical ending in `/`,
  `og:*` tags and exactly one `application/ld+json` `Article` block.
- `out/sitemap.xml`: 14 absolute trailing-slash URLs (5 marketing + blog index + 1 post, x2 locales),
  no unpublished post.
- `NEXT_PUBLIC_SITE_URL=https://staging.example.com npm run build` -- every canonical, hreflang,
  sitemap `<loc>` and the robots `Sitemap:` line use that origin.
- Empty-locale build (English seed post temporarily removed) -- exits 0, `/en/blog/` shows the
  empty-state message.

**Commands:**
- `npm run build` -- expected: exits 0, no unexportable-dynamic-route warning
- `npx serve out`, load `/blog/`, one post, `/en/blog/` -- expected: all render with full chrome
- `cat out/sitemap.xml` -- expected: absolute trailing-slash URLs, no unpublished post

**Manual checks (if no CLI):**
- View source on a post page: canonical, Open Graph, hreflang and JSON-LD blocks present
- Header language switch moves between `/blog/` and `/en/blog/`
