- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: Make the seo-cockpit runner publish articles into this repository by git commit.
  evidence: Split from the blog spec on 2026-09-24. It is an independently shippable deliverable
    living in a different repository (~/Projects/auto_workflow/seo-cockpit, which has its own
    _bmad-output), and it depends on the publish contract this spec establishes. The runner
    currently targets a separate Astro/Decap site per its README. Needs its own bmad-build run
    in that repo, covering: the import transform from lumina-wiki output schema (id/type/covers,
    with SEO metadata in a prose "## SEO metadata" section) to this repo's blog front-matter,
    the GitHub commit target (branch, path content/blog/<locale>/), and deploy triggering —
    noting this site was intentionally taken offline on 2026-08-12.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: The Why Choose Us nav item never highlights, because SiteHeader looks up chrome["why-usHref"] while getPageChrome exposes whyUsHref.
  evidence: Pre-existing, not caused by the blog change. components/site-header.js builds the key as `${activePage}Href` and falls back to homeHref, so /why-us/ marks Home active. The blog's activePage="blog" happens to match, which is why the new routes are unaffected.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: The ten marketing pages still have no canonical, hreflang or per-page title and description.
  evidence: Excluded by the spec's Never list, but they are the pages that actually sell the service and the sitemap now lists all ten. Worth its own spec once the blog lands.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: SEO surface additions not covered by this spec — x-default hreflang, Twitter card tags, a default Open Graph image, and Organization/WebSite/BreadcrumbList JSON-LD.
  evidence: None is a defect in what was built; each is an addition beyond the approved scope. x-default matters most for a two-locale site.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: Rendered Markdown is injected without sanitization.
  evidence: lib/blog.js renders with marked and both post pages use dangerouslySetInnerHTML; content/blog/README.md advertises that inline HTML works. Rejected as a patch because the trust boundary is the git repo — a committer already has code execution — but it deserves a decision once the seo-cockpit runner is the one writing these files.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: Blog index has no pagination and the site has no RSS feed; blog is linked only from the header, not the footer.
  evidence: Does not bite at two posts; becomes real once publishing is automated and post count grows.
- source_spec: `_bmad-output/implementation-artifacts/spec-blog-seo.md`
  summary: Post card images have no width/height, guaranteeing layout shift, and front-matter image paths are never checked for existence.
  evidence: components/blog-post-card.js renders a bare <img>. Fixing CLS needs dimensions the front-matter does not carry — the contract would have to gain them.
- source_spec: none
  summary: Give the marketing pages per-page Japanese/English titles and descriptions, canonical, hreflang with x-default, Organization/WebSite JSON-LD, a per-locale html lang and a per-page og:url.
  evidence: Split on 2026-10-19 from the "fix every site defect" request so it runs after the content refresh, which deletes /why-us/ and /team/ and rewrites the copy the descriptions must match. Live audit the same day found one title "WA+CRAFT", one English description, no canonical/hreflang/JSON-LD on all ten marketing pages, lang="en" on every page and og:url fixed to the homepage, all from the static metadata in app/layout.js.
- source_spec: none
  summary: Make the contact form deliver mail again; it posts to /api/contact, which returns 404 on the live static export.
  evidence: Split on 2026-10-19 from the "fix every site defect" request. It needs a human decision on the delivery backend (Vercel function, third-party form service, or leaving static export), which the content refresh spec already lists as out of scope.
- source_spec: none
  summary: Replace the BootstrapMade "Axis" stock person-*.webp photos on the team section with real photos of the named staff.
  evidence: Split on 2026-10-19 from the "fix every site defect" request. Real photos must come from the client; until then the choice is between keeping stock faces, neutral placeholders or no photos, which is a human decision.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Before deploying the content refresh, put the four why-us/team redirects on whatever origin actually serves wacraft-jp.com, or point the domain at Vercel, because the vercel.json redirects never run there.
  evidence: Checked live on 2026-10-19. wacraft-jp.com answers through Cloudflare with no x-vercel-id, and its origin redirects /about to http://wacraft-jp.com:3010/about/, which does not load. wacraft-jp.vercel.app is on Vercel and answers /about with 308 /about/. Shipping the route deletions to the current origin would turn /why-us/ and /team/ into 404s. The broken :3010 redirect for every slash-less URL is a separate, already-live defect of that origin.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Add a render or build-output test harness so rendered behaviour is tested, not only the data behind it.
  evidence: The content and section modules are JSX, which `node --test` cannot import. No test checks that /about/ renders id="team" (the /team/ redirect target), or that the homepage teaser and the 関連ブログ blocks render nothing when their lists are empty. The tests only assert that featuredPosts/relatedPostsByService return []. Review findings 8, 9 and 16.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Decide how posts published by seo-cockpit should reach a service's 関連ブログ, because the cockpit writes `category` (e.g. bpo) and never `tags`.
  evidence: getPostsByTag reads only `tags`, and the byte-for-byte COCKPIT_POST fixture has `category: bpo` and no tags, so every automated post is left out of related lists. The refresh spec forbade any front-matter contract change beyond documenting `tags`. Either reading `category` (both repos' contract docs) or emitting `tags` from the cockpit needs a decision.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Confirm the issuing authority printed next to enterprise registration number 0402324942 on /about/ (currently ダナン市計画投資局 / Department of Planning and Investment).
  evidence: Unverified (maybe-false; medium if true). Reviewers say Vietnam's provincial planning-and-investment departments were merged into departments of finance before the company's 2026-03-03 founding, and the address row already uses the post-2025 ward naming. The text comes from decision 4 and company-profile.html. The registration certificate settles it.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Give non-core-operations and business-standardization a card/OG image.
  evidence: Neither post has `image` (the spec allowed omitting it when no asset fits), so in the homepage teaser and the BPO 関連ブログ only ai-bpo-operations shows a picture, and social shares of the new posts get no preview image.
- source_spec: `_bmad-output/implementation-artifacts/spec-site-content-refresh.md`
  summary: Remove or fill the 12 dead href="#" social icons on the team cards, now shown on /about/.
  evidence: Pre-existing markup in content/{default,en}/team.js, previously on /team/ and the homepage. Best handled with the deferred team-photo replacement.
- source_spec: `_bmad-output/implementation-artifacts/spec-marketing-page-seo.md`
  summary: Drop the duplicate charset and viewport meta tags every page emits (Next adds its own, and the shared head adds a second pair with initial-scale=1.0).
  evidence: Pre-existing. Live wacraft-jp.com shows two `<meta charSet>` and two viewport tags today. The per-locale layout split only moved them into components/site-head.js. The fix is deleting the two tags there, or declaring `export const viewport`.
- source_spec: `_bmad-output/implementation-artifacts/spec-marketing-page-seo.md`
  summary: Give the 404 page a way back: a bilingual message with links to / and /en/.
  evidence: Pre-existing. Next's built-in 404, which shipped before and which app/global-not-found.js reproduces, has no header, navigation or links. One static 404.html serves both locales.
- source_spec: `_bmad-output/implementation-artifacts/spec-marketing-page-seo.md`
  summary: Cover page-level SEO in the render/build-output harness: each page's pageMetadata arguments, <html lang>, homepage-only Organization/WebSite JSON-LD, and the 404 that depends on the experimental globalNotFound flag.
  evidence: Review findings 12 and 13. The builders are unit-tested, but which key and locale each JSX page passes, where SiteJsonLd renders, and whether Next honours globalNotFound are observable only in the built out/. They were checked by one-off commands on 2026-10-19. Belongs with the render harness entry already in this file.
- source_spec: `_bmad-output/implementation-artifacts/spec-marketing-page-seo.md`
  summary: Give each locale group a not-found.js that renders without dark-mode colours and with the right lang, so a page's own notFound() call (the empty-locale __no-posts slug, or unknown slugs in next dev) no longer shows Next's built-in fallback.
  evidence: Pre-existing. Next's built-in not-found carries an @media (prefers-color-scheme: dark) rule that turns the body black while main.css keeps headings #000, and before the split it rendered inside the old root layout the same way. In the static export it is reached only when a locale has no published posts, at an unlinked noindex URL; unknown URLs already get app/global-not-found.js.
- source_spec: `_bmad-output/implementation-artifacts/spec-marketing-page-seo.md`
  summary: Carry seo-cockpit's `imageAlt` into post Open Graph images (og:image:alt), updating content/blog/README.md and the cockpit contract together.
  evidence: cockpit/lib/frontmatter.ts writes `imageAlt`, but lib/blog.js ignores unknown keys and postMetadata emits `images: [{ url }]` only. The marketing-page SEO spec forbade front-matter contract changes.
- source_spec: `_bmad-output/implementation-artifacts/spec-team-initials-avatars.md`
  summary: Confirm the team members' pronouns with the client, or rewrite the four EN bios in content/en/team.js without pronouns as the JA bios are.
  evidence: The EN bios say "he"/"she" (e.g. "As Team Manager, he leads…" for Nhat Minh, whose old stock photo was a woman's), while the JA bios use none. With the photos gone, these pronouns are the page's only gender claim, and nobody has confirmed them. The initials-avatar spec kept the bios word for word.
- source_spec: `_bmad-output/implementation-artifacts/spec-team-initials-avatars.md`
  summary: Show the representative one way on /about/: the 代表挨拶 placeholder (logo mark) and the team card ("TN" initials) differ, and the JA team card names him "Takahiko Nomoto" while the message and company table say 野本 享彦.
  evidence: Pre-existing from the content refresh (logo placeholder) and the original team markup (romanized name). It becomes visible once the stock photo is gone, since both placeholders sit on the same page.
