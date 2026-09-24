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
