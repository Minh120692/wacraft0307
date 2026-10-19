---
title: 'Site content refresh from the "Nội dung web WA+" brief'
type: 'feature'
created: '2026-10-05'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '7eaa435341b89a62f19b03da34fee028ae2f0a59'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The live site no longer matches the company's positioning. It sells six legacy services (BPO / Sales / AI / Recruitment / Team Building / Data), the homepage ends in Why Us + Team, About has no message, company facts or values, Solutions is six one-line cards, and the blog has one post. The client brief redefines all of it.

**Approach:** Rebuild the homepage, About, Solutions and the contact popup copy around five services (EC Operations, BPO, Digital Marketing, Video Production, Sales & CRM). Fold Team into About, replace Why Us with four values, add two Japanese blog posts, and mirror the structure in English.

**Content source of truth:** Google Doc "Nội dung web WA+" (fileId `1UTmXurs0_9thy6XEw02WZc1xXWCA7Aizj5VRHHjqTq4`, read 2026-10-05 via Google Drive `read_file_content`). It has seven tabs, one per deliverable:
- HOMEPAGE
- ABOUT US
- OS (Solutions)
- BLOG
- ノンコア業務 (post)
- 業務標準化 (post)
- CONTACT

Japanese copy is taken verbatim from the doc. The only exceptions are the corrections listed below.

**Decisions (human-answered, locked):**
1. **English:** translate every changed page into English so `/en` keeps the same structure, keys and anchors. The two new posts are Japanese-only, which the blog contract allows.
2. **Why Us and Team:** fold both into About. Team becomes a section of `/about` (`id="team"`), and the four values replace Why Us. Delete the `/why-us` and `/team` routes in both locales, remove them from the nav, and 301-redirect the old URLs.
3. **Hero CTA:** 「お問い合わせ →」 opens the on-site contact popup. It no longer links to bpo-offshore.com.
4. **The doc's "TEL 0402324942" row:** that number is the enterprise registration number (see `company-profile.html` l.1594-1603). Render it as 企業登録番号 0402324942（ダナン市計画投資局）, and add a separate TEL row: +81 70 9103 1967（日本） / +84 91 723 1967（ベトナム）.
5. **Corrections applied to the doc copy:**
   - The representative is **野本 享彦** everywhere, matching the doc and the legal registration; the site currently says 隆彦.
   - The duplicate 「EC運営支援」 in 事業内容 is dropped.
   - 「、、」 in the Video section becomes 「、」.
   - Blog headings are renumbered properly: the doc's export shows every heading as "1.".

## Boundaries & Constraints

**Always:**
- Keep the existing content pattern: one JSX component per section in `content/{default,en}/*.js`, registered in that locale's `index.js`. Long repeated content (the five services) goes in a data array in the component file and is rendered with `map`.
- Build links with `routeFor`, `blogPostHref` or the new `solutionHref`, always with a trailing slash. Never hardcode paths.
- Use only existing theme and Bootstrap classes: `section-title`, `subtitle`, `service-item`, `service-link`, `btn-primary`, `btn-outline`, `table`, `BlogPostCard`. If new CSS is unavoidable, add a minimal rule to `styles/legacy-inline.css`.
- Every contact button is `<a href="#contact" data-contact-trigger="true">`. The popup already listens for that selector.
- Data is build-time only and works with `output: "export"`.
- At 375px width, no page has horizontal scroll. Tables scroll inside their own wrapper.

**Never:**
- Deploy, publish or re-alias. Pushing does not auto-deploy, and production deploys need separate human approval.
- Change the blog front-matter schema, which is the seo-cockpit contract. This spec only documents a meaning for the existing `tags` field.
- Touch:
  - the uncommitted `_bmad/` changes
  - root legacy `*.html` files or `company-profile.html`
  - `server/contact-route.js` or `form-mail/`
  - the existing post `ai-bpo-operations.md`
- Add dependencies.
- **Out of scope:**
  - The contact form posts to `/api/contact`, which a static export does not serve. This is a pre-existing problem that needs its own decision.
  - A real photo of 野本 享彦: use a placeholder.
  - Changing seo-cockpit so it emits service tags.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Featured posts | ≥3 published posts in the locale | Homepage blog section shows the newest 3 plus 「BLOG一覧を見る →」 | N/A |
| Few posts | 1–2 published posts | Shows only those cards, with no placeholders | N/A |
| No posts | 0 published posts in the locale | Homepage blog section is not rendered | N/A |
| Related posts | Posts whose `tags` contain a service key (case-insensitive, e.g. `BPO` matches `bpo`) | That service's 関連ブログ shows up to 3, newest first | N/A |
| No related posts | No post tagged with the key | The 関連ブログ block for that service is not rendered | N/A |
| Draft tagged post | `published: false` and a matching tag | Not shown anywhere | N/A |
| Service deep link | `/solutions/#video` | Scrolls to that service with its heading visible below the fixed header | N/A |
| Old URL | `/why-us/`, `/team/`, `/en/why-us/`, `/en/team/` | 301 to `/about/`, `/about/#team`, `/en/about/`, `/en/about/#team` | N/A |
| Sitemap | Build runs | No why-us or team URLs; every remaining marketing route and post in both locales | N/A |

</frozen-after-approval>

## Code Map

**Content source**
- The Google Doc was re-read on 2026-10-19 (Drive `modifiedTime` 2026-10-06T07:17Z, after the 2026-10-05 read). Every decision above still matches it. Re-read the doc during implementation and take copy from it, not from memory.
- The doc's CONTACT tab ends with a Vietnamese internal note asking which mailbox receives the form. That note is not site copy; the delivery problem is logged in `deferred-work.md`.

**Page shell and routes**
- `components/site-page.js:6-14`: `SitePage` **ignores** the `contact` prop that every page passes. Drop that prop on every page you touch.
- `components/site-header.js:22-29`: nav labels are hardcoded English and shared by both locales. Line 10's `${activePage}Href` lookup is why Why Us never highlights; that bug is logged in `deferred-work.md` and goes away once the item is removed.
- `lib/site-content.js`:
  - `ROUTES` (l.1-8), `MARKETING_PAGES` (l.13) and `getPageChrome` (l.64-76) are the things to edit.
  - `normalizeHtml` (l.37-62) is dead code that nothing imports. It calls `routeFor("why-us")`, which would throw after the route is removed, so delete it.
- `app/sitemap.js`: iterates `MARKETING_PAGES`, so it needs no change.
- `public/assets/css/main.css:755,763`: `scroll-margin-top` already exists on sections, so anchors clear the fixed header.

**Homepage**
- `app/page.js`, `app/en/page.js`: currently render Hero, About, Services, WhyUs and Team (`["why-us"]` and `.team` at l.8-9, l.18-19). `content/{default,en}/index.js` imports both at l.4-5 and maps them at l.13-14.
- `content/default/hero.js:15`: the CTA href is bpo-offshore.com. `content/en/hero.js:15` points to `/en/about`.
- `content/default/about.js`: also rendered on `/about`. After this change it is homepage-only. l.29 links to `/team` (「チームに会う」), and `content/en/about.js:29` links to `/en/team`. The rewrite drops both.
- `content/{default,en}/footer.js:22`: hardcoded `/why-us` and `/en/why-us` links. l.32-34 lists the legacy services.
- `content/en/about.js:13-26`: shows fake stats counters (15 / 850 / 240). Remove them.
- `content/default/services.js`: six cards (`row gy-5` > `col-lg-4 col-md-6` > `.service-item`). It is shared by `/` and `/solutions`; after this change it is homepage-only. `.service-link` is styled in `main.css` but unused, so use it for 「詳しく見る」.
- `content/{default,en}/contact.js`: never rendered, because of the dead `contact` prop. Rewrite it as the homepage contact CTA section.

**About**
- `app/about/page.js:4-18`: inline `AboutIntro`, followed by `<About />`. `app/en/about/page.js:4-16` is the same, with h1 "About Our Team" at l.9.
- `content/default/team.js`:
  - l.14-33: generic `#director` block. Remove it; it duplicates 代表挨拶. `content/en/team.js:14-33` has the same block.
  - l.21: the name 隆彦. l.69 is the title 最高経営責任者 and stays.
  - The four member cards use stock `person-*.webp` images. Keep them for now; replacing them is a separate deferred item.
- Representative photo placeholder: do **not** use a stock face such as `person-m-12.webp`, because a stranger's photo captioned 野本 享彦 is the same defect as the stock team photos. Use `/assets/img/logo-mark.svg` centred in a `light-background` square with alt "Wa+Craft".

**Solutions**
- `app/solutions/page.js` and `app/en/solutions/page.js:5`: both render `services`. Switch both to the new `solutions` component, passing related posts.

**Blog**
- `lib/blog.js`:
  - `getPosts(locale, root)` (l.162) returns published posts newest-first.
  - Each post object (l.111-124) carries `tags`, which defaults to `[]`. Elements are not type-checked, so compare with `String(t).toLowerCase()`.
  - marked runs with its defaults (l.123), so GFM tables render as a bare `<table>`.
  - The existing `ai-bpo-operations.md` posts (both locales) carry `tags: [AI, BPO]`, so they will appear under BPO 関連ブログ with no edit.
- `components/blog-post-card.js`: `BlogPostCard({post, locale})` is reusable as-is.
- `content/blog/README.md`: the field table is l.42-53, and the `tags` row ("metadata only") is l.51. l.55-67, "Files written by seo-cockpit", stays untouched.
- No CSS styles tables inside `.blog-post-body`.

**Contact popup**
- `components/contact-overlay.js:5-40`: the `copy` object.
- `section#contact` is l.99-205, `.form-header` (only an `h3`) is l.117-119, and `<form>` is l.121-199.
- The date + hour + minute + AM/PM pickers stay.

**Tests**
- `lib/blog.test.js`: `npm test` runs `node --test`. Relevant blocks: sitemap (l.260-301, iterates `MARKETING_PAGES` so it adapts), shipped content (l.362-377: title, description, html, date), seo-cockpit front-matter (l.444-506), header language switch (l.573-607).

## Tasks & Acceptance

**Execution:**

*Routes, navigation and footer*
- [x] `lib/site-content.js`:
  - Remove `why-us` and `team` from `ROUTES`, `MARKETING_PAGES` and `getPageChrome`.
  - Delete `normalizeHtml`.
  - Add `SERVICE_KEYS = ["ec","bpo","marketing","video","sales"]` and `solutionHref(locale, key)`, which returns `/solutions/#ec`.
  - Rationale: one source for service anchors and tags.
- [x] `components/site-header.js`: nav becomes Home / About Us / Our Solutions / Blog / Contact / language switch.
- [x] Delete `app/{,en/}why-us/page.js`, `app/{,en/}team/page.js` and `content/{default,en}/why-us.js`, then update both `index.js` maps. Rationale: decision 2.
- [x] `vercel.json` (new): the four permanent redirects from the matrix. `next.config` redirects do not work with `output: "export"`.
- [x] `content/{default,en}/footer.js`:
  - Useful column: Home, About, Our Solutions, Blog, Contact.
  - Services column: the five 事業内容 names, each linking via `solutionHref`.

*Homepage*
- [x] `content/{default,en}/hero.js`:
  - Eyebrow 「BPO × AI × BUSINESS SUPPORT」.
  - h1 「人材不足時代でも、<br/>事業成長を止めない。」.
  - The two paragraphs from the doc.
  - CTA 「お問い合わせ →」 opening the popup.
- [x] `content/{default,en}/about.js`:
  - h2 「日本とベトナムの力を、ひとつの価値に。」 plus the doc's paragraphs.
  - Button 「私たちについて →」 linking to `/about/`.
  - Remove the stats block.
- [x] `content/{default,en}/services.js`:
  - Keep the header and intro (the doc says 「PHẦN NÀY KHÔNG ĐỔI」).
  - Five cards, each with icon, English name, catch line, text and 「→ 詳しく見る」 linking via `solutionHref`. The EC card also lists the malls.
- [x] `content/{default,en}/blog-highlights.js` (new):
  - Receives a `posts` prop.
  - Header 「ビジネスに役立つ情報をお届けします」.
  - `BlogPostCard` grid and 「BLOG一覧を見る →」.
- [x] `content/{default,en}/contact.js`: rewrite as a CTA section with 「お気軽に、お話をお聞かせください。」, its text, and a 「お問い合わせ →」 button opening the popup.
- [x] `app/page.js`, `app/en/page.js`:
  - Render Hero, About, Services, BlogHighlights (`getPosts(locale).slice(0,3)`), ContactCta.
  - Drop WhyUs, Team and the `contact` prop.

*About*
- [x] `app/{,en/}about/page.js`:
  - `AboutIntro` gets subtitle "About Us", h1 「会社情報」, lead 「日本とベトナムの力を、ひとつの価値に。」 and the doc's text.
  - Then render Message, CompanyInfo, Values, Team.
- [x] `content/{default,en}/message.js` (new): MESSAGE / 代表挨拶 with the full doc text, the logo placeholder from the Code Map (no stock face), and the caption 「代表 野本 享彦」.
- [x] `content/{default,en}/company-info.js` (new): 会社概要 table (`.table-responsive > table.table`). Rows: 会社名, 代表者, 所在地, 企業登録番号, TEL, 設立, 資本金, 事業内容 (five items), 人材. Values come from the doc plus decision 4.
- [x] `content/{default,en}/values.js` (new): header 「Wa+Craftの4つのバリュー」 / 「人材 × 品質 × 仕組み × 柔軟性」, followed by 4 cards.
- [x] `content/{default,en}/team.js`: remove the `#director` block, fix the name, keep `id="team"`.

*Solutions*
- [x] `content/{default,en}/solutions.js` (new):
  - Intro 「事業を支える、5つのソリューション。」 plus two paragraphs.
  - Five `<section id={key}>` blocks built from a data array (see Design Notes), alternating `light-background`.
  - Each block renders its groups, malls, callout, flow, points, and 関連ブログ only when posts exist.
- [x] `app/{,en/}solutions/page.js`: build `related[key] = getPostsByTag(locale, key).slice(0,3)` and pass it to the component.
- [x] `lib/blog.js`: add `getPostsByTag(locale, tag, root)`. It matches tags case-insensitively and keeps the `getPosts` order.
- [x] `content/blog/README.md`: document that a tag equal to a service key (`ec|bpo|marketing|video|sales`) lists the post under that service's 関連ブログ. The schema is unchanged.

*Contact popup*
- [x] `components/contact-overlay.js`:
  - JP copy:
    - subtitle "Contact", title 「お問い合わせ」.
    - Description: 「サービスに関するご質問やご相談は、こちらからお気軽にお問い合わせください。」 and 「48時間以内に、こちらから折り返しご連絡いたします。」.
    - formTitle 「お問い合わせはこちら」.
    - New `formLead` under the h3: 「お気軽に下記フォームにて送信ください。弊社担当よりご連絡させていただきます。」.
    - Label 「面談ご希望日時（任意）」.
  - EN copy translated to match.
  - Fields unchanged.

*Blog posts*
- [x] `content/blog/default/non-core-operations.md` and `content/blog/default/business-standardization.md` (new):
  - Titles from the doc.
  - Front-matter: `date: 2026-10-05`, `published: true`, `tags: [bpo]`, and a `description` of 160 characters or fewer.
  - `image` is an existing asset only if one fits; otherwise omit it.
  - Body: `##` for main sections and `###` for subsections, numbered correctly. The コア/ノンコア comparison is a GFM table. The closing CTA links `[お問い合わせはこちら](#contact)`.
- [x] `styles/legacy-inline.css`: add a `.blog-post-body table` rule with borders, cell padding and horizontal scroll on narrow screens.

*Tests*
- [x] `lib/blog.test.js`, new tests:
  - `getPostsByTag`: case-insensitive matching, drafts excluded, order kept, unknown tag returns `[]`.
  - `solutionHref`.
  - The sitemap omits `/why-us/` and `/team/`.
  - `vercel.json` holds exactly the four permanent redirects from the matrix.

**Acceptance Criteria:**
- Given the built site, when `/` loads, then its `<main>` holds exactly hero, about, services, blog and contact CTA, in that order.
- Given any page, when the header renders, then the nav shows Home, About Us, Our Solutions, Blog and Contact, and the current page is marked active.
- Given the hero or contact-CTA button, when clicked, then the contact popup opens.
- Given `out/`, when searched, then `bpo-offshore.com`, `隆彦`, `Why Choose Us` and `提供いただいた資料` do not appear.
- Given `/about/`, when it loads, then it shows intro, 代表挨拶, 会社概要, values and team, and the table rows match decision 4 and the doc.
- Given `/solutions/`, when it loads, then all five services render with the doc's task lists and points, and BPO lists the tagged posts under 関連ブログ.
- Given any `/en/` page, when compared with its Japanese counterpart, then sections, anchors and links correspond one-to-one, with English copy.
- Given a 375px viewport, when any changed page is viewed, then nothing scrolls horizontally.

## Implementation Notes

- 2026-10-19: `baseline_commit` stays 7eaa435 from planning. HEAD was c6e5d2b, which only taught `lib/blog.js` the seo-cockpit front-matter aliases (with its tests in `lib/blog.test.js` and README l.55-67). Diffs taken from the baseline include that unrelated commit; judge only this spec's changes.

- 2026-10-19 (implementation): delivered by a fresh-context subagent; `npm test` and `npm run build` pass. Its judgment calls: `vercel.json` uses `statusCode: 301` because `permanent: true` sends 308 on Vercel; `pageHref()` adds the trailing slash that `routeFor` leaves off for the header; the homepage CTA section is `#contact-cta` because the popup owns `#contact`; extra CSS in `styles/legacy-inline.css` for `.cta-section` buttons, `.portrait-placeholder` and a smaller hero `h1` (the theme size broke 「止めない。」); 「経理担当　x１名」 normalized to 「経理担当 × 1名」; the doc's 「BPO（Business Process Outsourcing)」 bracket and the missing 。 on the last Digital Marketing point kept verbatim; no `image` on the two new posts; descriptions written from the intros (96 and 94 characters).
- 2026-10-19 (task verification): the matrix rows for the homepage teaser (3+, 1-2, 0 posts) and the related-posts cap had no test, because the selection lived in JSX that `node --test` cannot import. Moved it into `lib/blog.js` as `featuredPosts()`, `relatedPostsByService()` and `POST_LIST_LIMIT`, used by the four pages, with tests. The components only render what those return. Section anchors (`#ec` … `#sales`) and the homepage section order were checked in the built `out/` HTML.
- 2026-10-19 (deploy finding): `wacraft-jp.com` is not served by Vercel. It has no `x-vercel-id`, and its origin answers `/about` with `301 http://wacraft-jp.com:3010/about/`, which does not load. `wacraft-jp.vercel.app` is Vercel and answers `/about` with `308 /about/`. So the `vercel.json` redirects only reach visitors once the custom domain points at Vercel; on the current origin the four old URLs need the same redirects in whatever serves it.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-10-19), layers: blind-hunter (BH), edge-case-hunter (EC), verification-gap (VG).

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | EC | A `#contact` CTA does nothing when the page loads with `#contact`, opens in a new tab, or is clicked before hydration | medium | `components/contact-overlay.js:48-67` only listens for clicks. It never reads `location.hash`, and `#contact` sits inside the hidden popup. The hero, contact CTA and both new posts now depend on it. | patch |
| 2 | VG | The solutions `SERVICES` keys are not tied to `SERVICE_KEYS` | medium | Pre-verified. `content/{default,en}/solutions.js` hard-codes the keys used for anchors and `related[...]`, while footer and homepage links use `solutionHref` over `SERVICE_KEYS`. A rename breaks links and drops related posts silently; no test or build catches it. | patch |
| 3 | BH | The English copy has awkward or misleading lines | low | The hero "Short on people, still growing." can read as Wa+Craft being short-staffed. The video catch "Videos that land, working for your business." is awkward. The message paragraph opens on a fragment. The popup says "Please send us the form below". | patch |
| 4 | BH | The service-card links all read "→ 詳しく見る"/"→ Learn more", and decorative icons are announced | low | Five identical link texts in `content/{default,en}/services.js`. The `bi` icons there and in `values.js` lack `aria-hidden`, which the solutions headings do set. Screen-reader users meet this on the homepage. | patch |
| 5 | EC | The `#director`/`.director` CSS is now dead | low | `styles/legacy-inline.css:92-150` styles only the block this change removed. No other element uses it. The fix is a direct deletion. | patch |
| 6 | EC | PureCounter still loads and runs on every page | low | The EN stats row was the last `.purecounter` element (the JP one was already commented out). `components/legacy-scripts.js:9,59-61` loads and initializes it for nothing. The fix is a direct deletion. | patch |
| 7 | BH | The old URLs will 404 on the live domain, because `vercel.json` never runs there | high | `wacraft-jp.com` has no `x-vercel-id`, and its origin redirects `/about` to `http://wacraft-jp.com:3010/about/`. Pre-existing infrastructure; nothing in this repo controls that origin. | defer |
| 8 | VG | No test checks that `/about/` renders `id="team"` for the `/team/` redirect | low | Pre-verified. The redirect test strips the fragment. A render or build-output harness is needed, and the repo has none. | defer (with 9, 16) |
| 9 | VG | The hide-when-empty branches (teaser, 関連ブログ) are never executed by a test | low | Pre-verified. The tests assert the helpers return `[]`, not that the components render nothing. Same missing render harness as 8. | defer (with 8, 16) |
| 10 | VG, BH, EC | seo-cockpit posts never appear under 関連ブログ, because the cockpit writes `category`, not `tags` | medium | `COCKPIT_POST` has `category: bpo` and no `tags`, and `getPostsByTag` reads only `tags`. The frozen intent forbids changing the front-matter contract beyond documenting `tags`, so giving `category` meaning needs its own decision. | defer |
| 11 | BH | The registration authority 「ダナン市計画投資局」 may be out of date | maybe-false | Decision 4 prescribes this text, taken from `company-profile.html`. The claim that provincial planning-and-investment departments merged into finance departments before the 2026-03-03 founding needs the registration certificate to settle. Medium if true. | defer |
| 12 | BH | The two new posts have no image, so teaser and related cards are uneven and get no OG image | low | `BlogPostCard` skips the image when `image` is absent, and only `ai-bpo-operations` has one. The spec allows omitting it; fixing it needs image assets. | defer |
| 13 | BH | The team cards keep 12 dead `href="#"` social icons, now shown on About | low | Pre-existing markup in `content/{default,en}/team.js`, previously on `/team` and the homepage. Belongs with the deferred team-photo work. | defer |
| 14 | BH, EC | The redirects miss the slash-less forms (`/why-us`) | false | Verified on Vercel: `wacraft-jp.vercel.app/why-us-zz` answers `308 /why-us-zz/`. The slash is added before `vercel.json` matches, so `/why-us` reaches the 301 in two hops. | reject |
| 15 | BH | The CEO card on About uses a stock face while 代表挨拶 uses the logo; titles vary | false | Team photos were split off by the user on 2026-10-19 (team-photo entry in `deferred-work.md`), so the intent excludes them here. 代表者 is the table label, and 最高経営責任者 was set deliberately in 7eaa435. | reject |
| 16 | BH | No test asserts the `#team` anchor | low | Duplicate of 8. | defer (with 8, 9) |
| 17 | BH | The team intro keeps the retired slogan 「日本語で伝わる」「海外で動く」「成果が返ってくる」 | low | The copy is accurate, just no longer the hero line. The doc gives no team copy, so a fix needs new copy rather than a direct correction. | reject |
| 18 | BH | The marketing pages still have one title and an English description | false | The user split this off on 2026-10-19 as its own goal (deferred entry for per-page metadata). The intent excludes it here. | reject |
| 19 | BH | Service names are copied in eight places and "disagree" | low | They differ on purpose. Cards and solutions use the HOMEPAGE/OS-tab names (Business Process Outsourcing), and the footer and table use the 事業内容 names (BPO・業務改善支援), as the spec says. Centralizing them is a refactor, not a correction. | reject |
| 20 | BH | The brand is written both "Wa+Craft" and "WA+CRAFT" | low | The client's copy writes Wa+Craft, and the pre-existing logo and site chrome write WA+CRAFT. Not introduced here, and choosing one is a brand decision. | reject |
| 21 | BH | The new posts link nowhere but the contact form | low | The bodies are verbatim from the doc per the frozen intent, so adding links would change client copy. | reject |
| 22 | BH | Some doc typos were kept (`（…)`, missing 。, 送信ください) | false | The frozen intent allows only the listed corrections, so keeping the rest verbatim is required. Raised with the human instead. | reject |
| 23 | BH | Phone numbers are not `tel:` links | low | Mobile Safari and Chrome auto-link phone numbers. This is an enhancement, not a defect. | reject |
| 24 | BH | The homepage lost its Why Us proof points | false | Decision 2 replaces Why Us with the four values on About. | reject |
| 25 | EC | A cockpit post without `description` fails the whole build | false | Failing loudly on a missing required field is the documented contract (README). A bad post already failed the build through the blog pages before this change, and the code is from c6e5d2b. | reject |
| 26 | EC | The README says "schema unchanged" while `published` became optional | false | Those README lines come from c6e5d2b, inside this diff's baseline, as the Implementation Notes record. This change only rewrote the `tags` row. | reject |
| 27 | EC | The company table may scroll sideways at 375px | false | Even if a row overflows, `.table-responsive` scrolls inside its own wrapper, which the spec allows. The implementation check found no page-level horizontal scroll at 375px. | reject |

## Design Notes

Each service is one object in the data array. The same short key is the section anchor, the `solutionHref` target and the blog tag:

```js
{ key: "video", icon: "bi-camera-video", name: "Video Production Support",
  catch: "伝えたいことを、動画というカタチに。", body: ["…", "…"],
  groups: [{ title: "対応できる動画", items: [{ title: "商品紹介動画", text: "…" }] },
           { title: "制作内容", items: [/* … */] }],
  callout: { label: "EC × Video", title: "商品の魅力を、動画でもっと伝える。", text: "…" },
  points: [{ title: "EC・SNS向け動画制作に対応", text: "…" }] }
```

Optional fields:
- `malls`: EC only.
- `callout`: EC × Marketing on Digital Marketing, and EC × Video on Video Production.
- `flow`: Sales only, with steps 調査・抽出 → 顧客リスト作成 → セールスメール → 反応確認 → アポイント設定 → 顧客フォロー → CRM更新.

The homepage cards use different, shorter copy from the doc's HOMEPAGE tab. Do not share text between the cards and the detail sections.

## Verification

**Commands:**
- `npm test`: all pass, including the "shipped content" check on the two new posts.
- `npm run build`: the static export succeeds.
- `ls out/why-us out/team out/en/why-us out/en/team`: all four are missing.
- `ls out/blog/non-core-operations out/blog/business-standardization`: both exist.
- `grep -rl "隆彦\|bpo-offshore.com\|Why Choose Us\|提供いただいた資料" out/`: no output.

**Manual checks:**
- Serve with `python3 -m http.server -d out 8080` and open `/`, `/about/`, `/solutions/`, the two new posts and the `/en/` counterparts at 1280px and 375px. Check that:
  - section order matches the acceptance criteria,
  - 「詳しく見る」 anchors land below the header,
  - both CTAs open the popup,
  - the tables are readable on mobile,
  - nothing overflows horizontally.
- Redirects in `vercel.json` only take effect on Vercel, so the local server cannot test them. Check them on a preview deployment once one is approved.
