import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";

import {
  BLOG_ROOT,
  alternatePaths,
  getPost,
  getPosts,
  hasPost,
  readPostsFromDir,
  serializeJsonLd,
} from "./blog.js";
import {
  blogPostHref,
  counterpartHref,
  getPageChrome,
  routeFor,
  MARKETING_PAGES,
} from "./site-content.js";
import { SITE_URL, absoluteUrl } from "./site-url.js";
import { sitemapEntries } from "../app/sitemap.js";
import robots from "../app/robots.js";

/* ------------------------------------------------------------------ fixtures */

const tmpRoots = [];

function post(fields = {}, body = "Body text.") {
  const front = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
  return `---\n${front}\n---\n\n${body}\n`;
}

const VALID = {
  title: '"A valid post"',
  date: "2026-01-02",
  description: '"A valid description."',
  published: "true",
};

/** Build a throwaway blog root: { default: {file: contents}, en: {...} }. */
function fixtureRoot(tree) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-fixture-"));
  tmpRoots.push(root);
  for (const [locale, files] of Object.entries(tree)) {
    const dir = path.join(root, locale);
    fs.mkdirSync(dir, { recursive: true });
    for (const [name, contents] of Object.entries(files)) {
      fs.writeFileSync(path.join(dir, name), contents);
    }
  }
  return root;
}

after(() => {
  for (const root of tmpRoots) fs.rmSync(root, { recursive: true, force: true });
});

/* -------------------------------------------------- matrix: post list order */

describe("post list", () => {
  it("lists 2+ published posts newest-first by date", () => {
    const root = fixtureRoot({
      default: {
        "older.md": post({ ...VALID, date: "2026-01-01", title: '"Older"' }),
        "newest.md": post({ ...VALID, date: "2026-03-01", title: '"Newest"' }),
        "middle.md": post({ ...VALID, date: "2026-02-01", title: '"Middle"' }),
      },
    });

    assert.deepEqual(
      getPosts("default", root).map((p) => p.slug),
      ["newest", "middle", "older"]
    );
  });

  it("derives the slug from the filename and renders the body to HTML", () => {
    const root = fixtureRoot({
      default: { "my-slug.md": post(VALID, "## Heading\n\nParagraph.") },
    });
    const [only] = getPosts("default", root);

    assert.equal(only.slug, "my-slug");
    assert.match(only.html, /<h2[^>]*>Heading<\/h2>/);
    assert.match(only.html, /<p>Paragraph\.<\/p>/);
  });

  it("ignores non-Markdown files in the locale directory", () => {
    const root = fixtureRoot({
      default: { "real.md": post(VALID), "notes.txt": "not a post", "README.md.bak": "nope" },
    });
    assert.deepEqual(getPosts("default", root).map((p) => p.slug), ["real"]);
  });
});

/* ------------------------------------------------------- matrix: empty state */

describe("empty state", () => {
  it("returns no posts for a locale with no published posts", () => {
    const root = fixtureRoot({
      default: { "draft.md": post({ ...VALID, published: "false" }) },
      en: {},
    });
    assert.deepEqual(getPosts("default", root), []);
    assert.deepEqual(getPosts("en", root), []);
  });

  it("returns no posts when the locale directory does not exist", () => {
    const root = fixtureRoot({ default: {} });
    assert.deepEqual(getPosts("en", root), []);
    assert.deepEqual(readPostsFromDir(path.join(root, "nope")), []);
  });
});

/* ------------------------------------------------------ matrix: unknown slug */

describe("unknown slug", () => {
  it("getPost returns null and the slug is absent from generateStaticParams input", () => {
    const root = fixtureRoot({ default: { "exists.md": post(VALID) } });

    assert.equal(getPost("default", "does-not-exist", root), null);
    assert.equal(hasPost("default", "does-not-exist", root), false);
    assert.deepEqual(
      getPosts("default", root).map((p) => ({ slug: p.slug })),
      [{ slug: "exists" }]
    );
  });
});

/* -------------------------------------------------------- matrix: draft post */

describe("draft post", () => {
  it("excludes published: false from the list, the params and the sitemap", () => {
    const root = fixtureRoot({
      default: {
        "live.md": post(VALID),
        "draft.md": post({ ...VALID, published: "false", title: '"Draft"' }),
      },
      en: {},
    });

    const slugs = getPosts("default", root).map((p) => p.slug);
    assert.deepEqual(slugs, ["live"]);
    assert.equal(getPost("default", "draft", root), null);

    const urls = sitemapEntries(root).map((e) => e.url);
    assert.ok(urls.includes(absoluteUrl(blogPostHref("default", "live"))));
    assert.ok(!urls.some((u) => u.includes("/draft/")));
  });
});

/* ------------------------------------------------------ matrix: invalid post */

describe("invalid post", () => {
  for (const field of ["title", "date", "description"]) {
    it(`throws naming the file and the missing field: ${field}`, () => {
      const fields = { ...VALID };
      delete fields[field];
      const root = fixtureRoot({ default: { "broken.md": post(fields) } });

      assert.throws(() => getPosts("default", root), (error) => {
        assert.match(error.message, /broken\.md/);
        assert.match(error.message, new RegExp(field));
        return true;
      });
    });
  }

  it("throws on an unparseable date", () => {
    const root = fixtureRoot({
      default: { "bad-date.md": post({ ...VALID, date: '"not-a-date"' }) },
    });
    assert.throws(() => getPosts("default", root), /bad-date\.md.*date/s);
  });

  it("throws on an unparseable updated date", () => {
    const root = fixtureRoot({
      default: { "bad-updated.md": post({ ...VALID, updated: '"nonsense"' }) },
    });
    assert.throws(() => getPosts("default", root), /bad-updated\.md.*date/s);
  });

  it("throws when published is not a boolean", () => {
    const root = fixtureRoot({
      default: { "stringy.md": post({ ...VALID, published: '"true"' }) },
    });
    assert.throws(() => getPosts("default", root), /stringy\.md.*published/s);
  });

  it("throws when image is not a string", () => {
    const root = fixtureRoot({
      default: { "bad-image.md": post({ ...VALID, image: "12" }) },
    });
    assert.throws(() => getPosts("default", root), /bad-image\.md.*image/s);
  });

  it("throws on a duplicate slug within a locale", () => {
    // `.md` and `.MD` resolve to the same slug, so the pair is rejected.
    const root = fixtureRoot({
      default: { "dupe.md": post(VALID), "dupe.MD": post(VALID) },
    });
    assert.throws(() => getPosts("default", root), /duplicate slug "dupe"/);
  });

  it("does not reject the same slug across different locales", () => {
    const root = fixtureRoot({
      default: { "shared.md": post(VALID) },
      en: { "shared.md": post(VALID) },
    });
    assert.equal(getPosts("default", root).length, 1);
    assert.equal(getPosts("en", root).length, 1);
  });
});

/* ------------------------------------------- matrix: unpaired / paired posts */

describe("hreflang pairing", () => {
  it("an unpaired post lists only the locale it exists in", () => {
    const root = fixtureRoot({
      default: { "ja-only.md": post(VALID) },
      en: {},
    });
    assert.deepEqual(alternatePaths("ja-only", root), { ja: "/blog/ja-only/" });
  });

  it("an English-only post lists only en", () => {
    const root = fixtureRoot({
      default: {},
      en: { "en-only.md": post(VALID) },
    });
    assert.deepEqual(alternatePaths("en-only", root), { en: "/en/blog/en-only/" });
  });

  it("a paired post lists reciprocal ja and en alternates", () => {
    const root = fixtureRoot({
      default: { "paired.md": post(VALID) },
      en: { "paired.md": post(VALID) },
    });
    assert.deepEqual(alternatePaths("paired", root), {
      ja: "/blog/paired/",
      en: "/en/blog/paired/",
    });
  });

  it("a draft in one locale is not offered as an alternate", () => {
    const root = fixtureRoot({
      default: { "half.md": post(VALID) },
      en: { "half.md": post({ ...VALID, published: "false" }) },
    });
    assert.deepEqual(alternatePaths("half", root), { ja: "/blog/half/" });
  });
});

/* ------------------------------------------------------------ matrix: sitemap */

describe("sitemap", () => {
  const root = fixtureRoot({
    default: { "one.md": post(VALID), "hidden.md": post({ ...VALID, published: "false" }) },
    en: { "one.md": post(VALID) },
  });
  const entries = sitemapEntries(root);
  const urls = entries.map((e) => e.url);

  it("lists every marketing route in both locales", () => {
    for (const locale of ["default", "en"]) {
      for (const pageKey of MARKETING_PAGES) {
        assert.ok(
          urls.includes(absoluteUrl(routeFor(pageKey, locale))),
          `missing ${pageKey} (${locale})`
        );
      }
      assert.ok(urls.includes(absoluteUrl(routeFor("blog", locale))));
    }
  });

  it("lists every published post in both locales", () => {
    assert.ok(urls.includes(absoluteUrl(blogPostHref("default", "one"))));
    assert.ok(urls.includes(absoluteUrl(blogPostHref("en", "one"))));
  });

  it("omits unpublished posts", () => {
    assert.ok(!urls.some((u) => u.includes("hidden")));
  });

  it("emits absolute URLs that all end in a trailing slash", () => {
    for (const url of urls) {
      assert.ok(url.startsWith(`${SITE_URL}/`), `not absolute: ${url}`);
      assert.ok(url.endsWith("/"), `no trailing slash: ${url}`);
    }
  });

  it("contains no duplicate URLs", () => {
    assert.equal(new Set(urls).size, urls.length);
  });
});

/* ----------------------------------------------------------- canonical origin */

describe("site url", () => {
  it("falls back to the production origin when NEXT_PUBLIC_SITE_URL is unset", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    try {
      const fresh = await import(`./site-url.js?fallback=${Date.now()}`);
      assert.equal(fresh.SITE_URL, "https://wacraft-jp.com");
      assert.equal(fresh.absoluteUrl("/blog"), "https://wacraft-jp.com/blog/");
    } finally {
      if (previous !== undefined) process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it("strips a trailing slash from a configured origin", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.test///";
    try {
      const fresh = await import(`./site-url.js?strip=${Date.now()}`);
      assert.equal(fresh.SITE_URL, "https://example.test");
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it("preserves a fragment and a query string", () => {
    assert.equal(absoluteUrl("/blog/x#top"), `${SITE_URL}/blog/x/#top`);
    assert.equal(absoluteUrl("/blog/x?a=1#top"), `${SITE_URL}/blog/x/?a=1#top`);
    assert.equal(absoluteUrl("/blog/x/"), `${SITE_URL}/blog/x/`);
  });

  it("honours NEXT_PUBLIC_SITE_URL for every emitted URL", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://staging.example.com/";
    try {
      const fresh = await import(`./site-url.js?origin=${Date.now()}`);
      assert.equal(fresh.SITE_URL, "https://staging.example.com");
      assert.equal(fresh.absoluteUrl("/blog/x"), "https://staging.example.com/blog/x/");
      assert.equal(
        fresh.absoluteAsset("/assets/img/logo.svg"),
        "https://staging.example.com/assets/img/logo.svg"
      );
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it("adds a trailing slash to page URLs but not to asset URLs", async () => {
    const { absoluteAsset } = await import("./site-url.js");
    assert.equal(absoluteUrl("/en/blog"), `${SITE_URL}/en/blog/`);
    assert.equal(absoluteUrl("/"), `${SITE_URL}/`);
    assert.equal(absoluteAsset("/assets/img/a.png"), `${SITE_URL}/assets/img/a.png`);
    assert.equal(absoluteAsset("https://cdn.example.com/a.png"), "https://cdn.example.com/a.png");
  });
});

/* ------------------------------------------------------------- shipped content */

describe("shipped content", () => {
  it("the committed seed posts satisfy the publish contract", () => {
    const ja = getPosts("default", BLOG_ROOT);
    const en = getPosts("en", BLOG_ROOT);
    assert.ok(ja.length >= 1);
    assert.ok(en.length >= 1);
    for (const p of [...ja, ...en]) {
      assert.equal(typeof p.title, "string");
      assert.ok(p.description.length > 0);
      assert.ok(p.html.length > 0);
      assert.ok(!Number.isNaN(new Date(p.date).getTime()));
    }
  });
});

/* --------------------------------------------------------------- regressions */

describe("front-matter validation details", () => {
  it("names the real field when `updated` is unparseable", () => {
    const root = fixtureRoot({
      default: { "bad-updated.md": post({ ...VALID, updated: '"nonsense"' }) },
    });
    assert.throws(() => getPosts("default", root), (error) => {
      assert.match(error.message, /bad-updated\.md/);
      assert.match(error.message, /field "updated" is not a parseable date/);
      assert.doesNotMatch(error.message, /field "date"/);
      return true;
    });
  });

  it("still names `date` when `date` is the unparseable one", () => {
    const root = fixtureRoot({
      default: { "bad-date.md": post({ ...VALID, date: '"nonsense"' }) },
    });
    assert.throws(() => getPosts("default", root), /field "date" is not a parseable date/);
  });

  for (const field of ["title", "description"]) {
    it(`rejects a whitespace-only ${field}`, () => {
      const root = fixtureRoot({
        default: { "blank.md": post({ ...VALID, [field]: '"   "' }) },
      });
      assert.throws(() => getPosts("default", root), (error) => {
        assert.match(error.message, /blank\.md/);
        assert.match(error.message, new RegExp(`required front-matter field "${field}"`));
        return true;
      });
    });
  }

  it("trims surrounding whitespace off title and description", () => {
    const root = fixtureRoot({
      default: {
        "padded.md": post({ ...VALID, title: '"  Padded  "', description: '"  Desc.  "' }),
      },
    });
    const [only] = getPosts("default", root);
    assert.equal(only.title, "Padded");
    assert.equal(only.description, "Desc.");
  });
});

/* ------------------------------------------------------- seo-cockpit format */

// Byte-for-byte what seo-cockpit's `serializeArticle` (cockpit/lib/frontmatter.ts) writes.
const COCKPIT_POST = `---
title: "AI×BPOで経理業務を効率化する方法"
description: "請求書処理や入力作業をAIとBPOで効率化する手順を解説します。"
excerpt: "経理の定型業務を外部化する手順。"
publishedDate: 2026-10-20
updatedDate: 2026-10-22
category: bpo
subcategory: "経理"
image: /img/blog/cockpit-post/thumb.webp
imageAlt: "書類を確認する担当者"
---

## 経理業務の課題

本文。
`;

describe("seo-cockpit front-matter", () => {
  it("publishes the exact file the cockpit writes", () => {
    const root = fixtureRoot({ default: { "cockpit-post.md": COCKPIT_POST } });
    const [only] = getPosts("default", root);
    assert.equal(only.slug, "cockpit-post");
    assert.equal(only.published, true);
    assert.equal(only.date, "2026-10-20T00:00:00.000Z");
    assert.equal(only.updated, "2026-10-22T00:00:00.000Z");
    assert.equal(only.image, "/img/blog/cockpit-post/thumb.webp");
    assert.match(only.html, /<h2>経理業務の課題<\/h2>/);
  });

  it("treats a missing `published` as published", () => {
    const fields = { ...VALID };
    delete fields.published;
    const root = fixtureRoot({ default: { "no-flag.md": post(fields) } });
    assert.deepEqual(getPosts("default", root).map((p) => p.slug), ["no-flag"]);
  });

  it("still rejects an empty `published`", () => {
    const root = fixtureRoot({ default: { "empty-flag.md": post({ ...VALID, published: "" }) } });
    assert.throws(() => getPosts("default", root), /empty-flag\.md.*published/s);
  });

  it("prefers `date` and `updated` over the cockpit's names when both are set", () => {
    const root = fixtureRoot({
      default: {
        "both.md": post({
          ...VALID,
          date: "2026-01-02",
          publishedDate: "2026-05-05",
          updated: "2026-02-02",
          updatedDate: "2026-06-06",
        }),
      },
    });
    const [only] = getPosts("default", root);
    assert.equal(only.date, "2026-01-02T00:00:00.000Z");
    assert.equal(only.updated, "2026-02-02T00:00:00.000Z");
  });

  it("names both spellings when the date is missing", () => {
    const fields = { ...VALID };
    delete fields.date;
    const root = fixtureRoot({ default: { "undated.md": post(fields) } });
    assert.throws(
      () => getPosts("default", root),
      /undated\.md.*missing required front-matter field "date" \(or "publishedDate"\)/s
    );
  });

  for (const key of ["publishedDate", "updatedDate"]) {
    it(`names \`${key}\` when it is the unparseable one`, () => {
      const fields = { ...VALID, [key]: '"nonsense"' };
      if (key === "publishedDate") delete fields.date;
      const root = fixtureRoot({ default: { "bad-alias.md": post(fields) } });
      assert.throws(
        () => getPosts("default", root),
        new RegExp(`bad-alias\\.md.*field "${key}" is not a parseable date`, "s")
      );
    });
  }
});

describe("slug charset", () => {
  for (const name of ["Has Spaces.md", "Uppercase.md", "日本語.md", "-leading.md", "trailing-.md", "under_score.md"]) {
    it(`rejects "${name}"`, () => {
      const root = fixtureRoot({ default: { [name]: post(VALID) } });
      assert.throws(() => getPosts("default", root), (error) => {
        assert.match(error.message, /lowercase ASCII letters, digits and hyphens/);
        return true;
      });
    });
  }

  it("accepts lowercase ASCII letters, digits and hyphens", () => {
    const root = fixtureRoot({ default: { "ai-bpo-2026.md": post(VALID) } });
    assert.deepEqual(getPosts("default", root).map((p) => p.slug), ["ai-bpo-2026"]);
  });
});

describe("blogPostHref", () => {
  it("carries the trailing slash the export emits, in both locales", () => {
    assert.equal(blogPostHref("default", "a-post"), "/blog/a-post/");
    assert.equal(blogPostHref("en", "a-post"), "/en/blog/a-post/");
  });

  it("does not change what absoluteUrl produces", () => {
    assert.equal(
      absoluteUrl(blogPostHref("default", "a-post")),
      `${SITE_URL}/blog/a-post/`
    );
  });
});

describe("sitemap lastModified", () => {
  it("uses the newest `updated ?? date` rather than the newest post", () => {
    const root = fixtureRoot({
      default: {
        "newer-post.md": post({ ...VALID, date: "2026-05-01" }),
        "older-post.md": post({ ...VALID, date: "2026-01-01", updated: "2026-09-01" }),
      },
      en: {},
    });

    const indexEntry = sitemapEntries(root).find(
      (e) => e.url === absoluteUrl(routeFor("blog", "default"))
    );
    assert.equal(indexEntry.lastModified.toISOString(), "2026-09-01T00:00:00.000Z");
  });

  it("leaves the blog index without a lastModified when the locale is empty", () => {
    const root = fixtureRoot({ default: {}, en: {} });
    const indexEntry = sitemapEntries(root).find(
      (e) => e.url === absoluteUrl(routeFor("blog", "default"))
    );
    assert.equal(indexEntry.lastModified, undefined);
  });
});

describe("robots", () => {
  it("allows everything and points at an absolute sitemap URL with no trailing slash", () => {
    const result = robots();
    assert.deepEqual(result.rules, [{ userAgent: "*", allow: "/" }]);
    assert.equal(result.sitemap, `${SITE_URL}/sitemap.xml`);
    assert.ok(!result.sitemap.endsWith("/"));
  });
});

describe("header language switch", () => {
  it("points at the same page in the other locale", () => {
    assert.equal(getPageChrome("default", "about").langHref, "/en/about");
    assert.equal(getPageChrome("en", "about").langHref, "/about");
    assert.equal(getPageChrome("default", "blog").langHref, "/en/blog");
    assert.equal(getPageChrome("en", "blog").langHref, "/blog");
  });

  it("falls back to the other locale's home page for an unknown page key", () => {
    assert.equal(counterpartHref("not-a-route", "default"), "/en");
    assert.equal(counterpartHref("not-a-route", "en"), "/");
    assert.equal(getPageChrome("default", "not-a-route").langHref, "/en");
  });

  it("exposes blogHref and honours an explicit override", () => {
    assert.equal(getPageChrome("default", "blog").blogHref, "/blog");
    assert.equal(getPageChrome("en", "blog").blogHref, "/en/blog");
    assert.equal(
      getPageChrome("default", "blog", "/en/blog/paired/").langHref,
      "/en/blog/paired/"
    );
    // A missing translation falls back to today's behavior.
    assert.equal(getPageChrome("default", "blog", null).langHref, "/en/blog");
  });

  it("a post page's override matches the hreflang alternate it emits", () => {
    const root = fixtureRoot({
      default: { "paired.md": post(VALID) },
      en: { "paired.md": post(VALID) },
    });
    const alternates = alternatePaths("paired", root);
    assert.equal(getPageChrome("default", "blog", alternates.en).langHref, "/en/blog/paired/");
    assert.equal(getPageChrome("en", "blog", alternates.ja).langHref, "/blog/paired/");
  });
});

describe("serializeJsonLd", () => {
  it("escapes a </script> in a post field so the block cannot be closed early", () => {
    const out = serializeJsonLd({ headline: "a</script><script>alert(1)</script>" });
    assert.ok(!out.includes("</script>"));
    assert.ok(!out.includes("<"));
    assert.ok(!out.includes(">"));
    assert.ok(out.includes("\\u003c/script\\u003e"));
  });

  it("escapes ampersands", () => {
    assert.equal(serializeJsonLd({ a: "x&y" }), '{"a":"x\\u0026y"}');
  });

  it("still parses back to the original value", () => {
    const data = { headline: "R&D </script> <b>bold</b>", n: 1 };
    assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
  });
});
