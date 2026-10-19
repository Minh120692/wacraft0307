---
title: 'Per-page SEO metadata and a per-locale html lang'
type: 'feature'
created: '2026-10-19'
status: 'done'
route: 'dispatch'
review_loop_iteration: 1
baseline_commit: '8ce080114b24f935fc21138f6ea81c5737606af7'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every marketing page inherits one static `metadata` from `app/layout.js`. This covers `/`, `/about/` and `/solutions/` in both locales. The metadata has:
- the title "WA+CRAFT";
- one English description written before the five-service copy;
- `og:url` fixed to the homepage;
- no canonical, no hreflang and no JSON-LD.

`<html lang="en">` is also hardcoded on every page, including the Japanese ones. A company that sells SEO cannot ship this. (Found in the 2026-10-19 live audit; logged in `deferred-work.md`.)

**Approach:**
- Give each marketing page and both blog indexes their own title, description, canonical, hreflang (`ja`, `en`, `x-default`) and Open Graph data, all from one pure metadata builder.
- Add `x-default` to the post pages.
- Emit Organization + WebSite JSON-LD on both homepages.
- Split the app into one root layout per locale, so Japanese pages declare `lang="ja"`.

**Decisions:**
1. `x-default` points to the Japanese URL. Japan is the primary market and `default` is the Japanese locale. When a post exists only in English, `x-default` points to the English URL.
2. Organization + WebSite JSON-LD go on the two homepages only.
3. The brand in titles and `og:site_name` stays "WA+CRAFT", matching the blog's ` | WA+CRAFT` suffix and the logo. JSON-LD uses `name` "WA+CRAFT", `alternateName` "Wa+Craft", and the `legalName` from the company table.
4. Titles and descriptions are the copy in Design Notes, approved together with this spec.

## Boundaries & Constraints

**Always:**
- All metadata and JSON-LD logic lives in a new JSX-free `lib/seo.js`, so `node --test` can import it. Pages only call it.
- Build every URL with `absoluteUrl` / `absoluteAsset` and `routeFor` / `blogPostHref`, with the trailing slash. Serialize JSON-LD with `serializeJsonLd`.
- Everything is build-time and works with `output: "export"`.
- Next merges `metadata` shallowly, so every page that sets `openGraph` sets all of it.

**Never:**
- Deploy, publish or touch the VPS. `wacraft-jp.com` is served by a private VPS behind Cloudflare.
- Change any visible page copy, the blog front-matter contract, `app/sitemap.js` or `app/robots.js`.
- Touch the uncommitted `_bmad/` changes, `.agents/`, the root legacy `*.html` files or `company-profile.html`.
- Add dependencies.
- **Out of scope:** Twitter card tags, a default OG image, BreadcrumbList.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| JA marketing page | `/about/` | `<html lang="ja">`. Title and description from Design Notes. Canonical `https://wacraft-jp.com/about/`. hreflang `ja` → `/about/`, `en` → `/en/about/`, `x-default` → `/about/`. `og:url` equals the canonical. `og:locale` is `ja_JP`. | N/A |
| EN marketing page | `/en/solutions/` | `<html lang="en">`. English title and description. Canonical `/en/solutions/`. The same hreflang trio. `og:locale` is `en_US`. | N/A |
| Homepage JSON-LD | `/` and `/en/` | Exactly one `application/ld+json` with `@graph` [Organization, WebSite]. `inLanguage` is the page's language. No other marketing page has it. | N/A |
| Blog index | `/blog/`, `/en/blog/` | Its own title and description. hreflang `ja`, `en`, `x-default` → `/blog/`. | N/A |
| Post in both locales | `ai-bpo-operations` | hreflang `ja`, `en`, and `x-default` → the Japanese URL. | N/A |
| Single-locale post | JA-only `non-core-operations`; an EN-only fixture | Only its own language, plus `x-default` → that same URL. | N/A |
| Unknown URL | `out/404.html` | Site CSS linked, `lang="ja"`, `noindex`. | N/A |
| Distinct pages | all 8 indexable non-post pages | 8 different titles and 8 different descriptions. Japanese pages carry Japanese descriptions. | N/A |

</frozen-after-approval>

## Code Map

**Root layout and the locale split** (checked on 2026-10-19 in a throwaway worktree)
- `app/layout.js:1-50` is the only root layout. It holds a static `metadata` (title, English `SITE_DESCRIPTION`, `openGraph.url: "/"`), `<html lang="en" suppressHydrationWarning>`, a `<head>` of icon, font and CSS links, and `<body className="index-page">`.
- The split works:
  - `git mv` the JA routes (`app/page.js`, `about/`, `solutions/`, `blog/`) into `app/(ja)/`, and `app/en` into `app/(en)/en/`.
  - Give each group its own `layout.js` and delete `app/layout.js`.
  - Add one `../` to every relative import in the moved files.
  - `sitemap.js` and `robots.js` stay at `app/`. Their output stays byte-identical.
  - The build keeps the same routes. Tests need no import changes, because they import `app/sitemap.js` and `app/robots.js`.
- **404 colours:** `public/assets/css/main.css` has no `prefers-color-scheme` rule. It colours `h1`–`h6` with `var(--heading-color)` (`#000000`) and the body with `var(--background-color)` (`#ffffff`). Any dark-mode background on the 404 therefore hides its headings.
- **404:** with no root layout, `out/404.html` becomes Next's bare page. `app/(ja)/not-found.js` does **not** fix that. `app/global-not-found.js` does: it carries its own `<html lang="ja">`, head and CSS import, and needs `experimental: { globalNotFound: true }` in `next.config.mjs` (Next 15.5.19).
- The language switch in `components/site-header.js` is a `next/link`. Across root layouts it does a full reload, which is acceptable; no change.

**Pages that get metadata**
- Home, about and solutions pages in both locales export no `metadata` today.
- `app/blog/page.js:8-31` and `app/en/blog/page.js:8-31` build inline `metadata` (title, description, `alternates` ja/en, `openGraph`). Replace it with the builder.
- `app/blog/[slug]/page.js:24-52` and its `en` twin build the post metadata inline:
  - an absent post returns `{title: "Not found | WA+CRAFT", robots: {index: false, follow: false}}`;
  - otherwise `${post.title} | WA+CRAFT`, the description, a canonical, `languages` from `alternatePaths(slug)` (`lib/blog.js`, which returns `{ja?, en?}` paths), and an `article` `openGraph` with a hard-coded `siteName` and `locale`, `publishedTime`, `modifiedTime` and an optional image.
  - Move all of it into `lib/seo.js`. The pages keep only the call.
- `components/article-json-ld.js:12-25` declares `author` and `publisher` as anonymous Organizations (`name`, plus `logo` for the publisher).

**Helpers to reuse**
- `lib/site-url.js`: `SITE_URL`, `absoluteUrl` (adds the trailing slash), `absoluteAsset`.
- `lib/blog.js`: `serializeJsonLd`, `LOCALE_LANG`.
- `lib/site-content.js`: `routeFor`, `MARKETING_PAGES`.
- `components/article-json-ld.js` is the pattern for a JSON-LD component.
- Organization facts come from `content/default/company-info.js` `ROWS` and its EN twin:
  - legal name Wa+Craft 有限会社 / Wa+Craft Co., Ltd.
  - address 15 Ngo Thi Si Street, Ngu Hanh Son Ward, Da Nang City, VN
  - telephone +81-70-9103-1967 and +84-91-723-1967
  - founded 2026-03-03
  - logo `/assets/img/logo.svg`

**Tests**
- `npm test` runs `node --test`, which picks up `lib/*.test.js`.
- JSX modules cannot be imported by `node --test`, so test `lib/seo.js` directly.
- Rendered output (`lang`, `<title>`, 404) is checked in the built `out/`.

## Tasks & Acceptance

**Execution:**
- [x] `lib/seo.js` (new):
  - `PAGE_META[locale][pageKey]` holds `{title, description}` for `home`, `about`, `solutions` and `blog`, with copy from Design Notes.
  - `pageMetadata(pageKey, locale)` returns `{title, description, alternates: {canonical, languages: {ja, en, "x-default"}}, openGraph: {type: "website", siteName: "WA+CRAFT", locale, alternateLocale, title, description, url}}`.
  - `withXDefault(languages)` adds `x-default`: the `ja` URL when present, otherwise `en`.
  - `postLanguages(slug, root)` returns the absolute `{ja?, en?, "x-default"}` map for a post.
  - `postMetadata(locale, slug, root)` returns a post page's whole metadata, the not-found branch included. Its `og:locale:alternate` is set only when the translation exists.
  - `siteJsonLd(locale)` returns the `@graph` from Design Notes.
  - `ORGANIZATION_ID` is the one Organization `@id`.
- [x] `components/site-head.js` (new): the shared `<head>` children from today's layout. `components/site-json-ld.js` (new): renders `siteJsonLd(locale)`.
- [x] `app/(ja)/layout.js`, `app/(en)/en/layout.js` (new):
  - `<html lang="ja">` / `<html lang="en">` with `SiteHead` and the same `<body>`.
  - A fallback `metadata`: `metadataBase` plus that locale's home title and description.
- [x] Move the routes with `git mv` as in the Code Map, fix the relative imports, and delete `app/layout.js`.
- [x] `app/global-not-found.js` (new) and `next.config.mjs`:
  - The 404 gets `lang="ja"`, site CSS, title "404 | WA+CRAFT" and `robots: {index: false}`.
  - Its English message sits in an element with `lang="en"`.
  - It sets no dark-mode colours, because the site has no dark theme.
- [x] Home, about and solutions pages in both locales: `export const metadata = pageMetadata(key, LOCALE)`. Both homepages render `<SiteJsonLd locale=… />`.
- [x] Blog index pages in both locales: switch to `pageMetadata("blog", LOCALE)`. Post pages in both locales: `generateMetadata` returns `postMetadata(LOCALE, slug)`.
- [x] `components/article-json-ld.js`: give `author` (when it is the default WA+CRAFT) and `publisher` the `"@id": ORGANIZATION_ID`, and keep their `name`/`logo`.
- [x] `lib/seo.test.js` (new). Cover every matrix row through the exported builders, using `fixtureRoot` posts only, never the live `content/blog`:
  - distinct titles and descriptions per locale, with Japanese text in the `default` descriptions;
  - canonical equals `og.url`;
  - the hreflang trio;
  - `postLanguages` and `postMetadata` for ja+en, ja-only, en-only and missing posts;
  - the JSON-LD from Design Notes, with an identical Organization node in both locales and a per-locale WebSite;
  - `metadataBase.href` compared with `new URL(SITE_URL).href`.
  - A route check: walk `app/` for `page.js` files, drop the `(group)` segments, and `deepEqual` the result with the `routeFor` URLs of `MARKETING_PAGES` and `blog` in both locales, plus `/blog/[slug]/` and `/en/blog/[slug]/`. Each of those files must contain `export const metadata` or `generateMetadata`.

**Acceptance Criteria:**
- Given the built `out/`, when every `index.html` is checked, then each Japanese page (posts included) has `lang="ja"` and each `/en/` page has `lang="en"`.
- Given each indexable page, when its head is read, then it has exactly one canonical, equal to its own URL, and `og:url` equals that canonical.
- Given the build before and after this change, when `out/sitemap.xml` and `out/robots.txt` are compared, then they are byte-identical, and the visible body text of every page is unchanged.

## Implementation Notes

- 2026-10-19 (implementation): done by a fresh-context subagent. It added `layoutMetadata()` and `notFoundMetadata()` to `lib/seo.js`, so layouts and the 404 also only call the builder. The new files were marked `git add -N` and the moves staged with `git mv`. The 404 keeps Next's built-in message and look inside `app/global-not-found.js`. The EN descriptions are 175–180 characters, longer than the Design Notes guideline, and were kept word for word.
- 2026-10-19 (task verification): 105/105 tests. In the built `out/`: 9 pages `lang="ja"` (posts and 404 included) and 5 `lang="en"`; 8 distinct titles; `sitemap.xml` and `robots.txt` byte-identical to a baseline build of 8ce0801; the Organization/WebSite `@graph` only in `out/index.html` and `out/en/index.html`; one canonical equal to `og:url`, plus `x-default`, on every indexable page; the 404 has site CSS and `noindex`. The matrix rows about `lang`, homepage-only JSON-LD and the 404 render are covered by these build-output checks, since `node --test` cannot import the JSX layouts (render harness already in deferred-work).

- 2026-10-19 (loop 1 re-derivation): a fresh subagent applied the KEEP patch and the amendments. It staged only the 10 pure `git mv` renames, so the commit can land the moves first (finding 9). Verified by me: 115/115 tests. In the built `out/`: `lang` 9 ja / 5 en, 8 distinct titles, `sitemap.xml`/`robots.txt` byte-identical to 8ce0801, one canonical = `og:url` plus `x-default` on every indexable page, an identical Organization node on `/` and `/en/` with per-locale WebSite `@id`s, `@graph` nowhere else, Article author/publisher `@id` = `#organization`, and a 404 with `lang="ja"`, site CSS, `noindex`, no dark-mode CSS and its message in `lang="en"`.

## Spec Change Log

- **Review loop 1 (2026-10-19).**
  - **Triggering findings:** triage rows 1–3. (1) Both homepages gave one JSON-LD `@id` different `legalName`/`inLanguage`, because the Design Notes said the EN copy swaps them. (2) The Article JSON-LD was not tied to that Organization. (3) The post pages kept their metadata inline, against the Always rule, so the x-default tests checked a copy of the page code.
  - **Amended:**
    - Design Notes JSON-LD: one locale-invariant Organization, and a per-locale WebSite with its own `@id`/`url`.
    - Tasks: `postLanguages`/`postMetadata`/`ORGANIZATION_ID` in `lib/seo.js`; post pages call `postMetadata`; the Article JSON-LD links to `ORGANIZATION_ID`.
    - Folded patch findings 4–8: no dark-mode colours on the 404 and `lang="en"` on its message; fixture-only tests; `metadataBase` compared through `new URL`; the `app/` route walk.
    - Code Map: post-page and 404-colour facts.
  - **Known-bad states avoided:** contradictory structured data for one entity; post metadata that tests cannot reach; a 404 that dark-mode users cannot read; tests that break when seo-cockpit publishes.
  - **KEEP:** the reverted implementation was correct everywhere else and is saved as `/tmp/claude-1000/-home-luonghailam-Projects-wacraft0307/94419d13-8419-47fa-85f7-11f2af010e1e/scratchpad/marketing-page-seo-loop1-keep.patch`. Apply it to the baseline with `git apply`, which applies cleanly, then change only what this entry amends. In particular keep:
    - the route-group split and the `git mv` moves;
    - `SiteHead`;
    - both layouts with `layoutMetadata`;
    - `notFoundMetadata` and the 404 markup apart from the two amended points;
    - the `globalNotFound` flag;
    - `PAGE_META` copy word for word;
    - `pageMetadata` and `withXDefault`;
    - every page's wiring;
    - the existing `lib/seo.test.js` cases, with live-post cases moved to fixtures.

## Review Triage Log

Pass 1 (2026-10-19), layers: blind-hunter (BH), edge-case-hunter (EC), verification-gap (VG).

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | BH, EC | Both homepages emit the same `#organization`/`#website` `@id`s with different `legalName`/`inLanguage`, and the EN WebSite sits at the JA root URL | low | `siteJsonLd()` follows the Design Notes ("the EN one swaps `legalName` and `inLanguage`"), so crawlers get one entity with contradictory facts. The spec caused this. | bad_spec (group A) |
| 2 | BH | Article JSON-LD `publisher`/`author` are not linked to the new `#organization` node | low | `components/article-json-ld.js` still declares an anonymous Organization. Same root cause as 1: the spec never defined one site-wide Organization identity. | bad_spec (group A) |
| 3 | BH, VG | Post pages still build metadata inline, and their x-default tests check a copy of the page logic | medium | Pre-verified (VG). Both `[slug]/page.js` compose `withXDefault(...)` and Open Graph inline, with hard-coded `siteName`/`locale` and no `og:locale:alternate`. The test helper `postLanguages` re-implements that code, so breaking the page fails no test. The spec's task ("Post pages: `languages: withXDefault(…)`") contradicts its own Always rule ("all metadata logic lives in `lib/seo.js`"). | bad_spec (group B) |
| 4 | BH | The 404 text is invisible in dark mode | medium | The inline `FALLBACK_CSS` turns the body black under `prefers-color-scheme: dark`. `main.css` has no dark theme and colours `h1`/`h2` `var(--heading-color)` `#000`, so "404" and its message are black on black. Caused by combining Next's fallback CSS with the site CSS. | patch (folded into the loopback) |
| 5 | BH, EC | The 404 message is English text under `<html lang="ja">` | low | `app/global-not-found.js` wraps "This page could not be found." in `lang="ja"`. Before the split it was `lang="en"`. | patch (folded into the loopback) |
| 6 | VG | No test checks that the moved pages are still served at the `ROUTES` URLs | medium | Pre-verified. The sitemap, canonical and redirect tests all derive from `ROUTES`; none reads `app/`. A misplaced page would 404 while the sitemap still lists it. | patch (folded into the loopback) |
| 7 | BH, EC | The hreflang tests depend on live posts (`ai-bpo-operations`, `non-core-operations`) | low | seo-cockpit writes `content/blog`. Unpublishing or translating a post would fail a unit test about hreflang logic. | patch (folded into the loopback) |
| 8 | EC | The `metadataBase` test fails when `NEXT_PUBLIC_SITE_URL` has a path or an uppercase host | low | The reviewer ran it. `meta.metadataBase.href` is compared with `${SITE_URL}/`, not with `new URL(SITE_URL).href`. | patch (folded into the loopback) |
| 9 | BH | Git pairs the two post-page moves the wrong way round | low | The pages are similar enough that rename detection crosses them, so history would cross too. Fix at commit time: commit the pure moves first, then the edits. | patch (commit procedure) |
| 10 | BH | Duplicate `charset`/`viewport` meta tags | low | Pre-existing: live `wacraft-jp.com` has the same two of each today. `SiteHead` only moved them. | defer |
| 11 | BH | The 404 is a dead end, with no link back to `/` or `/en/` | low | Pre-existing: Next's built-in 404 that shipped before had no links either. | defer |
| 12 | VG, BH | Page wiring (the arguments each page passes), `<html lang>`, homepage-only JSON-LD and the 404 render are checked only by one-off build commands | low | Pre-verified. `node --test` cannot import the JSX layouts and pages. Needs the render/build-output harness already logged in `deferred-work.md`. | defer |
| 13 | VG | The 404 depends on the experimental `globalNotFound` flag, and nothing pins its behaviour | low | Pre-verified. Only a build-output check can see this, which is the same harness as 12. | defer (with 12) |
| 14 | BH | The company facts in `lib/seo.js` are hand-copied from `company-info.js` | low | Real duplication, but the facts rarely change, and the fix is a refactor into a shared data module, not a correction. | reject |
| 15 | BH | The copy misses the Design Notes length targets (EN descriptions 175–180 chars, EN titles 61–62, some JA descriptions short) | low | The user approved this copy word for word (decision 4). Google truncates by pixel width and often rewrites snippets. A short JA description does no harm. Changing it is a copy decision for the human; raised in the summary. | reject |
| 16 | BH | The 404 loads stylesheets it does not use | false | The spec requires the site CSS on the 404 (matrix row "Unknown URL"). | reject |
| 17 | BH | The 404 has two `noindex` tags | low | Harmless. Removing ours would make `noindex` depend on Next's implicit one alone. | reject |
| 18 | BH | The about pages pass a literal locale instead of `LOCALE` | low | Style only; the values are correct. | reject |
| 19 | BH | `package.json` allows `next ^15.0.0` while the 404 needs 15.4+ | false | `^15.0.0` resolves to the newest 15.x, and the lockfile pins 15.5.19. No install path gets a version without `globalNotFound`. | reject |
| 20 | EC | `pageMetadata("toString")` yields an undefined title | false | Unreachable: every caller passes a literal key from `MARKETING_PAGES`/`blog`, and unknown real keys throw. | reject |
| 21 | BH | The `PostalAddress` is loosely structured and the phones are a bare array | low | Valid schema.org as written. A `contactPoint` refinement is an enhancement, not a defect. | reject |

Pass 2 (2026-10-19, after loop 1).

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 22 | VG, BH | The Article JSON-LD is still built inside the JSX component, so its new `@id` links have no test | medium | Pre-verified (VG). `components/article-json-ld.js` builds `author`/`publisher` itself, against the Always rule ("all metadata and JSON-LD logic lives in `lib/seo.js`"). Deleting the `@id` leaves 115/115 green. The logo path is also written twice. The Always rule settles the fix. | patch |
| 23 | EC, BH | The company-author match is an exact, untrimmed `=== "WA+CRAFT"`, and a blank author emits an empty `name` | low | `lib/blog.js` keeps `author` untrimmed, so `"Wa+Craft"` (the Organization's own `alternateName`) or `"WA+CRAFT "` loses the `@id`. `author: ""` is not nullish, so `?? SITE_NAME` keeps `""`. A direct fix inside the same builder. | patch |
| 24 | EC, BH | The "sets metadata in every page file" test matches the words in comments too | low | The regex `/export const metadata\b|generateMetadata/` is unanchored, so a page that only mentions `generateMetadata` in a comment passes and silently inherits the home title. Anchoring it is a direct correction. | patch |
| 25 | BH | The `PAGE_META` tests compare the builder with the constant it reads, so the approved copy is not pinned | low | Swapping the about and solutions copy within one locale passes every test. A keyword per page pins decision 4's copy with a few direct assertions. | patch |
| 26 | EC | `pageMetadata("constructor"/"toString")` | false | carried. Same claim and location as row 20: unreachable, since every caller passes a literal key. | reject |
| 27 | BH | The route walk cannot catch a page in the wrong locale group or passing the wrong locale | low | carried. Same claim as row 12 (page wiring and `<html lang>` need the render/build-output harness). | defer (row 12) |
| 28 | BH | `notFound()` inside a page (the empty-locale `__no-posts` slug, or `next dev`) still renders Next's built-in fallback, with its dark-mode CSS, under `lang="ja"` | low | Pre-existing: before the split the same built-in rendered inside the old root layout with the same CSS. In the export it is reached only when a locale has no posts, at an unlinked `noindex` URL. Unknown URLs get `global-not-found`. | defer |
| 29 | BH | seo-cockpit's `imageAlt` is dropped, so posts get no `og:image:alt` | low | `postMetadata` emits `images: [{url}]` only. Reading `imageAlt` changes the front-matter contract, which the spec forbids. | defer |
| 30 | EC | The route walk would misreport `_private`, `@slot` or intercepting folders | low | No such folder exists, and supporting them adds branches for a hypothetical. | reject |
| 31 | BH | The `(en)` group is redundant (`app/en/layout.js` could be a root layout), and an `@/` alias would shorten imports | low | The current structure builds and works. The change would be churn, not a fix. | reject |
| 32 | BH | Organization omits `taxID`, `founder`, `numberOfEmployees` and `description`, and WebSite omits `alternateName` | low | Valid schema.org as specified in Design Notes. These are enhancements, not defects. | reject |
| 33 | BH | `lib/seo.js` adds a third copy of `localeKey`/`otherLocale` | low | Developer-only duplication with no caller that diverges today. Consolidating them is a refactor. | reject |
| 34 | BH | The descriptions spell the brand "Wa+Craft" (about, solutions) and "WA+CRAFT" (blog) | low | The copy was approved word for word (decision 4). Raised with the human instead. | reject |
| 35 | BH | The SEO copy lives in `lib/seo.js` rather than `content/<locale>/` | false | The spec puts `PAGE_META` in `lib/seo.js` on purpose, so tests can import it. | reject |

## Design Notes

Each title stays under about 35 full-width characters. Each JA description is about 110–120 characters, and each EN description is under about 160 characters.

| Page | JA title / description | EN title / description |
|------|-----------------------|------------------------|
| home | WA+CRAFT \| 日本語対応ベトナムチーム×AIのBPO・業務支援 / 日本語対応可能なベトナムチームとAI・業務改善を組み合わせ、EC運営、BPO、デジタルマーケティング、動画制作、営業・CRM支援まで。中小企業・スタートアップの成長に合わせて、必要な業務を柔軟に組み合わせられます。 | WA+CRAFT \| Japanese-speaking BPO and business support with AI / A Japanese-speaking Vietnamese team combined with AI and process improvement, covering e-commerce operations, BPO, digital marketing, video production and sales & CRM support. |
| about | 会社情報・代表挨拶 \| WA+CRAFT / 日本とベトナムの強みを掛け合わせ、人材・AI・IT・業務改善で企業の業務を支えるWa+Craftの会社情報です。代表挨拶、会社概要、4つのバリュー、チームをご紹介します。 | Company Information \| WA+CRAFT / Company information for Wa+Craft, a BPO partner combining the strengths of Japan and Vietnam with people, AI, IT and process improvement: our message, overview, values and team. |
| solutions | EC運営・BPO・マーケティング・動画・営業支援 \| WA+CRAFT / EC運営支援、BPO・業務改善、SEO・SNSなどのデジタルマーケティング、EC・SNS向け動画制作、顧客リスト作成からCRM管理までの営業支援。Wa+Craftの5つのソリューションをご紹介します。 | E-commerce, BPO, Marketing, Video and Sales Support \| WA+CRAFT / Wa+Craft's five solutions: marketplace operations, BPO and process improvement, SEO and social marketing, e-commerce and social video, and sales support from prospect lists to CRM. |
| blog | ブログ \| WA+CRAFT / EC運営、業務改善・BPO、デジタルマーケティングなど、ビジネスに役立つ情報を発信するWA+CRAFTのブログです。 | Blog \| WA+CRAFT / Practical insights on e-commerce operations, process improvement, BPO and digital marketing from WA+CRAFT. |

JSON-LD: the Organization node is identical on both homepages, with one `@id`. The WebSite node is per locale. On `/en/` it is `@id` `${SITE_URL}/en/#website`, `url` `${SITE_URL}/en/`, `inLanguage: "en"`.

```js
{ "@context": "https://schema.org", "@graph": [
  { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "WA+CRAFT",
    alternateName: ["Wa+Craft", "Wa+Craft Co., Ltd."], legalName: "Wa+Craft 有限会社",
    url: `${SITE_URL}/`, logo: absoluteAsset("/assets/img/logo.svg"),
    foundingDate: "2026-03-03", telephone: ["+81-70-9103-1967", "+84-91-723-1967"],
    address: { "@type": "PostalAddress", streetAddress: "15 Ngo Thi Si Street",
      addressLocality: "Ngu Hanh Son Ward, Da Nang City", addressCountry: "VN" } },
  { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "WA+CRAFT", url: `${SITE_URL}/`,
    inLanguage: "ja", publisher: { "@id": `${SITE_URL}/#organization` } } ] }
```

## Verification

**Commands:**
- Before any change, save the baseline: `npm run build && cp out/sitemap.xml out/robots.txt <scratch>/`.
- `npm test`: all pass.
- `npm run build`: succeeds.
- Language attributes:
  - `for f in $(find out -name index.html -o -name 404.html); do printf '%s ' "$f"; grep -o '<html lang="[a-z]*"' "$f"; done` shows `ja` everywhere except `out/en/**`, which shows `en`.
- Titles:
  - `grep -ho '<title>[^<]*' out/index.html out/about/index.html out/solutions/index.html out/blog/index.html out/en/index.html out/en/about/index.html out/en/solutions/index.html out/en/blog/index.html | sort | uniq -d` prints nothing.
- Sitemap and robots:
  - `cmp out/sitemap.xml <scratch>/sitemap.xml && cmp out/robots.txt <scratch>/robots.txt` succeeds.

**Manual checks:**
- Open `/`, `/about/` and `/en/` from `python3 -m http.server -d out`. Check that:
  - the pages look unchanged;
  - the head shows one canonical, the hreflang trio and the JSON-LD on the homepages only;
  - the language switch still works, with a full reload.
