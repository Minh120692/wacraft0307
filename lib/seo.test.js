import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { after, describe, it } from "node:test";

import { getPost, serializeJsonLd } from "./blog.js";
import {
  LOGO_PATH,
  OG_LOCALE,
  ORGANIZATION_ID,
  PAGE_META,
  SITE_NAME,
  articleJsonLd,
  breadcrumbJsonLd,
  layoutMetadata,
  notFoundMetadata,
  pageMetadata,
  postLanguages,
  postBreadcrumbs,
  postMetadata,
  siteJsonLd,
  withXDefault,
} from "./seo.js";
import { MARKETING_PAGES, blogPostHref, routeFor } from "./site-content.js";
import { SITE_URL } from "./site-url.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(HERE, "..", "app");

/** Every indexable page that is not a post: the marketing pages plus the blog index. */
const PAGE_KEYS = [...MARKETING_PAGES, "blog"];
const LOCALES = ["default", "en"];

/** Hiragana, katakana or CJK ideographs. */
const JAPANESE = /[぀-ヿ一-鿿]/;

/* ------------------------------------------------------------------ fixtures */

const tmpRoots = [];

const FIXTURE_FIELDS = {
  title: '"Fixture"',
  date: "2026-01-02",
  description: '"Fixture post."',
};

/**
 * A throwaway blog root: { default: { slug: {front-matter overrides} }, en: {...} }.
 * The hreflang tests use these posts only, never the live `content/blog`, which
 * seo-cockpit publishes into.
 */
function fixtureRoot(tree) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "seo-fixture-"));
  tmpRoots.push(root);
  for (const [locale, posts] of Object.entries(tree)) {
    const dir = path.join(root, locale);
    fs.mkdirSync(dir, { recursive: true });
    for (const [slug, fields] of Object.entries(posts)) {
      const front = Object.entries({ ...FIXTURE_FIELDS, ...fields })
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      fs.writeFileSync(path.join(dir, `${slug}.md`), `---\n${front}\n---\n\nBody.\n`);
    }
  }
  return root;
}

after(() => {
  for (const root of tmpRoots) fs.rmSync(root, { recursive: true, force: true });
});

/** One post in both locales, one per locale only, and an unpublished draft. */
const POSTS = fixtureRoot({
  default: {
    both: {
      title: '"両方にある記事"',
      description: '"日本語の説明です。"',
      image: '"/assets/img/both.png"',
    },
    "ja-only": { title: '"日本語だけの記事"', date: "2026-02-03", updated: "2026-03-04" },
    draft: { published: "false" },
  },
  en: {
    both: { title: '"A post in both locales"', description: '"The English description."' },
    "en-only": { title: '"An English-only post"', date: "2026-04-05" },
  },
});

/** One Japanese post per kind of `author` front-matter. */
const AUTHORS = fixtureRoot({
  default: {
    company: { author: '"WA+CRAFT"' },
    "alternate-name": { author: '"Wa+Craft"' },
    padded: { author: '"  wa+craft co., ltd.  "' },
    blank: { author: '""' },
    absent: {},
    other: { author: '"  Jane Doe  "' },
  },
});

/* ------------------------------------------------------- marketing pages */

/**
 * One literal keyword per page and locale, so swapping two pages' approved copy
 * fails even though the builder reads the same `PAGE_META` the tests compare with.
 */
const TITLE_KEYWORDS = {
  default: {
    home: /^WA\+CRAFT \| 日本語対応/,
    about: /会社情報/,
    solutions: /EC運営/,
    blog: /^ブログ \|/,
  },
  en: {
    home: /^WA\+CRAFT \| Japanese-speaking/,
    about: /Company Information/,
    solutions: /E-commerce/,
    blog: /^Blog \|/,
  },
};

describe("pageMetadata", () => {
  it("gives the Japanese about page its copy, a self canonical and the hreflang trio", () => {
    const meta = pageMetadata("about", "default");

    assert.equal(meta.title, PAGE_META.default.about.title);
    assert.equal(meta.description, PAGE_META.default.about.description);
    assert.equal(meta.alternates.canonical, `${SITE_URL}/about/`);
    assert.deepEqual(meta.alternates.languages, {
      ja: `${SITE_URL}/about/`,
      en: `${SITE_URL}/en/about/`,
      "x-default": `${SITE_URL}/about/`,
    });
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.openGraph.locale, "ja_JP");
    assert.equal(meta.openGraph.alternateLocale, "en_US");
  });

  it("gives the English solutions page its copy, an /en/ canonical and the same trio", () => {
    const meta = pageMetadata("solutions", "en");

    assert.equal(meta.title, PAGE_META.en.solutions.title);
    assert.equal(meta.description, PAGE_META.en.solutions.description);
    assert.equal(meta.alternates.canonical, `${SITE_URL}/en/solutions/`);
    assert.deepEqual(meta.alternates.languages, {
      ja: `${SITE_URL}/solutions/`,
      en: `${SITE_URL}/en/solutions/`,
      "x-default": `${SITE_URL}/solutions/`,
    });
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.openGraph.locale, "en_US");
    assert.equal(meta.openGraph.alternateLocale, "ja_JP");
  });

  it("points both homepages at the trailing-slash roots", () => {
    assert.equal(pageMetadata("home", "default").alternates.canonical, `${SITE_URL}/`);
    assert.equal(pageMetadata("home", "en").alternates.canonical, `${SITE_URL}/en/`);
    assert.deepEqual(pageMetadata("home", "en").alternates.languages, {
      ja: `${SITE_URL}/`,
      en: `${SITE_URL}/en/`,
      "x-default": `${SITE_URL}/`,
    });
  });

  it("gives each blog index its own copy and the trio with x-default on /blog/", () => {
    for (const locale of LOCALES) {
      const meta = pageMetadata("blog", locale);
      assert.equal(meta.title, PAGE_META[locale].blog.title);
      assert.equal(meta.description, PAGE_META[locale].blog.description);
      assert.deepEqual(meta.alternates.languages, {
        ja: `${SITE_URL}/blog/`,
        en: `${SITE_URL}/en/blog/`,
        "x-default": `${SITE_URL}/blog/`,
      });
    }
    assert.equal(pageMetadata("blog", "default").alternates.canonical, `${SITE_URL}/blog/`);
    assert.equal(pageMetadata("blog", "en").alternates.canonical, `${SITE_URL}/en/blog/`);
  });

  it("sets a canonical equal to og:url, ending in a slash, on every page", () => {
    for (const locale of LOCALES) {
      for (const key of PAGE_KEYS) {
        const meta = pageMetadata(key, locale);
        assert.equal(meta.openGraph.url, meta.alternates.canonical, `${locale}/${key}`);
        assert.match(meta.alternates.canonical, /^https?:\/\/[^/]+\/(.*\/)?$/, `${locale}/${key}`);
      }
    }
  });

  it("always returns a complete openGraph, since Next merges metadata shallowly", () => {
    for (const locale of LOCALES) {
      for (const key of PAGE_KEYS) {
        const meta = pageMetadata(key, locale);
        assert.deepEqual(meta.openGraph, {
          type: "website",
          siteName: SITE_NAME,
          locale: OG_LOCALE[locale],
          alternateLocale: OG_LOCALE[locale === "en" ? "default" : "en"],
          title: meta.title,
          description: meta.description,
          url: meta.alternates.canonical,
        });
      }
    }
  });

  it("gives the 8 indexable non-post pages 8 different titles and descriptions", () => {
    const pages = LOCALES.flatMap((locale) => PAGE_KEYS.map((key) => pageMetadata(key, locale)));
    assert.equal(pages.length, 8);
    assert.equal(new Set(pages.map((meta) => meta.title)).size, 8);
    assert.equal(new Set(pages.map((meta) => meta.description)).size, 8);
  });

  it("writes the Japanese pages' descriptions in Japanese and keeps the brand in every title", () => {
    for (const key of PAGE_KEYS) {
      assert.match(pageMetadata(key, "default").description, JAPANESE, key);
      assert.doesNotMatch(pageMetadata(key, "en").description, JAPANESE, key);
      for (const locale of LOCALES) {
        assert.ok(pageMetadata(key, locale).title.includes(SITE_NAME), `${locale}/${key}`);
      }
    }
  });

  it("gives every page and locale the title of its own approved copy", () => {
    for (const locale of LOCALES) {
      for (const key of PAGE_KEYS) {
        assert.match(pageMetadata(key, locale).title, TITLE_KEYWORDS[locale][key], `${locale}/${key}`);
      }
    }
  });

  it("treats an unknown locale as the default one and rejects an unknown page", () => {
    assert.deepEqual(pageMetadata("about", "fr"), pageMetadata("about", "default"));
    assert.throws(() => pageMetadata("why-us", "default"), /No SEO copy for page "why-us"/);
  });
});

/* ---------------------------------------------------------------- hreflang */

describe("withXDefault", () => {
  it("points x-default to the Japanese URL when both locales exist", () => {
    const languages = { ja: `${SITE_URL}/blog/a/`, en: `${SITE_URL}/en/blog/a/` };
    assert.deepEqual(withXDefault(languages), { ...languages, "x-default": `${SITE_URL}/blog/a/` });
  });

  it("points x-default to the only URL of a Japanese-only page", () => {
    assert.deepEqual(withXDefault({ ja: `${SITE_URL}/blog/a/` }), {
      ja: `${SITE_URL}/blog/a/`,
      "x-default": `${SITE_URL}/blog/a/`,
    });
  });

  it("points x-default to the only URL of an English-only page", () => {
    assert.deepEqual(withXDefault({ en: `${SITE_URL}/en/blog/a/` }), {
      en: `${SITE_URL}/en/blog/a/`,
      "x-default": `${SITE_URL}/en/blog/a/`,
    });
  });

  it("adds nothing to an empty map and never mutates its input", () => {
    assert.deepEqual(withXDefault({}), {});
    const input = { ja: `${SITE_URL}/` };
    withXDefault(input);
    assert.deepEqual(input, { ja: `${SITE_URL}/` });
  });
});

describe("postLanguages", () => {
  it("gives a post in both locales the trio with x-default on the Japanese URL", () => {
    assert.deepEqual(postLanguages("both", POSTS), {
      ja: `${SITE_URL}/blog/both/`,
      en: `${SITE_URL}/en/blog/both/`,
      "x-default": `${SITE_URL}/blog/both/`,
    });
  });

  it("gives a Japanese-only post only ja plus x-default on that same URL", () => {
    assert.deepEqual(postLanguages("ja-only", POSTS), {
      ja: `${SITE_URL}/blog/ja-only/`,
      "x-default": `${SITE_URL}/blog/ja-only/`,
    });
  });

  it("gives an English-only post only en plus x-default on that same URL", () => {
    assert.deepEqual(postLanguages("en-only", POSTS), {
      en: `${SITE_URL}/en/blog/en-only/`,
      "x-default": `${SITE_URL}/en/blog/en-only/`,
    });
  });

  it("gives a missing or unpublished post no languages at all", () => {
    assert.deepEqual(postLanguages("missing", POSTS), {});
    assert.deepEqual(postLanguages("draft", POSTS), {});
  });
});

/* ------------------------------------------------------------------- posts */

describe("postMetadata", () => {
  it("builds the whole metadata of the Japanese side of a bilingual post", () => {
    assert.deepEqual(postMetadata("default", "both", POSTS), {
      title: "両方にある記事 | WA+CRAFT",
      description: "日本語の説明です。",
      alternates: {
        canonical: `${SITE_URL}/blog/both/`,
        languages: {
          ja: `${SITE_URL}/blog/both/`,
          en: `${SITE_URL}/en/blog/both/`,
          "x-default": `${SITE_URL}/blog/both/`,
        },
      },
      openGraph: {
        type: "article",
        siteName: SITE_NAME,
        locale: "ja_JP",
        alternateLocale: "en_US",
        title: "両方にある記事",
        description: "日本語の説明です。",
        url: `${SITE_URL}/blog/both/`,
        publishedTime: "2026-01-02T00:00:00.000Z",
        modifiedTime: "2026-01-02T00:00:00.000Z",
        images: [{ url: `${SITE_URL}/assets/img/both.png` }],
      },
    });
  });

  it("builds the English side with its own canonical and the same hreflang trio", () => {
    const meta = postMetadata("en", "both", POSTS);

    assert.equal(meta.title, "A post in both locales | WA+CRAFT");
    assert.equal(meta.description, "The English description.");
    assert.equal(meta.alternates.canonical, `${SITE_URL}/en/blog/both/`);
    assert.deepEqual(meta.alternates.languages, postLanguages("both", POSTS));
    assert.equal(meta.openGraph.url, meta.alternates.canonical);
    assert.equal(meta.openGraph.locale, "en_US");
    assert.equal(meta.openGraph.alternateLocale, "ja_JP");
    assert.equal("images" in meta.openGraph, false, "no image without front-matter image");
  });

  it("sets no og:locale:alternate and keeps only its own language on a Japanese-only post", () => {
    const meta = postMetadata("default", "ja-only", POSTS);

    assert.equal(meta.alternates.canonical, `${SITE_URL}/blog/ja-only/`);
    assert.deepEqual(meta.alternates.languages, {
      ja: `${SITE_URL}/blog/ja-only/`,
      "x-default": `${SITE_URL}/blog/ja-only/`,
    });
    assert.equal(meta.openGraph.locale, "ja_JP");
    assert.equal("alternateLocale" in meta.openGraph, false);
    assert.equal(meta.openGraph.publishedTime, "2026-02-03T00:00:00.000Z");
    assert.equal(meta.openGraph.modifiedTime, "2026-03-04T00:00:00.000Z");
  });

  it("sets no og:locale:alternate and points x-default to itself on an English-only post", () => {
    const meta = postMetadata("en", "en-only", POSTS);

    assert.equal(meta.alternates.canonical, `${SITE_URL}/en/blog/en-only/`);
    assert.deepEqual(meta.alternates.languages, {
      en: `${SITE_URL}/en/blog/en-only/`,
      "x-default": `${SITE_URL}/en/blog/en-only/`,
    });
    assert.equal(meta.openGraph.locale, "en_US");
    assert.equal("alternateLocale" in meta.openGraph, false);
  });

  it("sets a canonical equal to og:url on every published fixture post", () => {
    for (const [locale, slug] of [
      ["default", "both"],
      ["default", "ja-only"],
      ["en", "both"],
      ["en", "en-only"],
    ]) {
      const meta = postMetadata(locale, slug, POSTS);
      assert.equal(meta.openGraph.url, meta.alternates.canonical, `${locale}/${slug}`);
      assert.equal(meta.alternates.canonical, `${SITE_URL}${blogPostHref(locale, slug)}`);
    }
  });

  it("keeps a slug the locale does not publish out of the index", () => {
    const notFound = { title: "Not found | WA+CRAFT", robots: { index: false, follow: false } };
    assert.deepEqual(postMetadata("en", "missing", POSTS), notFound);
    assert.deepEqual(postMetadata("default", "en-only", POSTS), notFound);
    assert.deepEqual(postMetadata("en", "ja-only", POSTS), notFound);
    assert.deepEqual(postMetadata("default", "draft", POSTS), notFound);
  });
});

/* ----------------------------------------------------------------- JSON-LD */

/** The Organization node of the Design Notes, word for word. */
const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "WA+CRAFT",
  alternateName: ["Wa+Craft", "Wa+Craft Co., Ltd."],
  legalName: "Wa+Craft 有限会社",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/img/logo.svg`,
  foundingDate: "2026-03-03",
  telephone: ["+81-70-9103-1967", "+84-91-723-1967"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "15 Ngo Thi Si Street",
    addressLocality: "Ngu Hanh Son Ward, Da Nang City",
    addressCountry: "VN",
  },
};

describe("siteJsonLd", () => {
  it("returns one @graph of Organization then WebSite", () => {
    for (const locale of LOCALES) {
      const data = siteJsonLd(locale);
      assert.equal(data["@context"], "https://schema.org");
      assert.deepEqual(
        data["@graph"].map((node) => node["@type"]),
        ["Organization", "WebSite"]
      );
    }
  });

  it("describes one identical Organization on both homepages, under ORGANIZATION_ID", () => {
    assert.equal(ORGANIZATION_ID, `${SITE_URL}/#organization`);
    for (const locale of LOCALES) {
      assert.deepEqual(siteJsonLd(locale)["@graph"][0], ORGANIZATION, locale);
    }
  });

  it("gives the Japanese homepage the WebSite at the root, in Japanese", () => {
    assert.deepEqual(siteJsonLd("default")["@graph"][1], {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "WA+CRAFT",
      url: `${SITE_URL}/`,
      inLanguage: "ja",
      publisher: { "@id": ORGANIZATION_ID },
    });
  });

  it("gives the English homepage its own WebSite at /en/, in English", () => {
    assert.deepEqual(siteJsonLd("en")["@graph"][1], {
      "@type": "WebSite",
      "@id": `${SITE_URL}/en/#website`,
      name: "WA+CRAFT",
      url: `${SITE_URL}/en/`,
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID },
    });
  });

  it("serializes to JSON that cannot close its script block", () => {
    for (const locale of LOCALES) {
      const json = serializeJsonLd(siteJsonLd(locale));
      assert.doesNotMatch(json, /[<>&]/);
      assert.deepEqual(JSON.parse(json), siteJsonLd(locale));
    }
  });
});

describe("articleJsonLd", () => {
  it("builds the Article of a post, tied to the Organization node", () => {
    assert.deepEqual(articleJsonLd(getPost("default", "both", POSTS), "default"), {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "両方にある記事",
      description: "日本語の説明です。",
      datePublished: "2026-01-02T00:00:00.000Z",
      dateModified: "2026-01-02T00:00:00.000Z",
      inLanguage: "ja",
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/both/` },
      url: `${SITE_URL}/blog/both/`,
      author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: "WA+CRAFT" },
      publisher: {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "WA+CRAFT",
        logo: { "@type": "ImageObject", url: `${SITE_URL}${LOGO_PATH}` },
      },
      image: [`${SITE_URL}/assets/img/both.png`],
    });
  });

  it("uses the shared logo in both the Organization and the publisher", () => {
    const [organization] = siteJsonLd("default")["@graph"];
    const article = articleJsonLd(getPost("en", "en-only", POSTS), "en");
    assert.equal(article.publisher.logo.url, organization.logo);
    assert.equal(article.inLanguage, "en");
    assert.equal(article.url, `${SITE_URL}/en/blog/en-only/`);
    assert.equal(article.dateModified, article.datePublished);
    assert.equal("image" in article, false, "no image without front-matter image");
  });

  it("links the publisher to ORGANIZATION_ID whoever the author is", () => {
    for (const slug of ["company", "alternate-name", "padded", "blank", "absent", "other"]) {
      const article = articleJsonLd(getPost("default", slug, AUTHORS), "default");
      assert.equal(article.publisher["@id"], ORGANIZATION_ID, slug);
    }
  });

  it("treats the company's names, in any case and padding, and a blank author as the company", () => {
    const company = { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME };
    for (const slug of ["company", "alternate-name", "padded", "blank", "absent"]) {
      assert.deepEqual(articleJsonLd(getPost("default", slug, AUTHORS), "default").author, company, slug);
    }
  });

  it("keeps any other author as its own trimmed, unlinked Organization", () => {
    assert.deepEqual(articleJsonLd(getPost("default", "other", AUTHORS), "default").author, {
      "@type": "Organization",
      name: "Jane Doe",
    });
  });
});

/* ------------------------------------------------- layouts and the 404 page */

describe("post breadcrumbs", () => {
  const post = { title: "フォーム営業は違法？", slug: "form-sales-legal-rules" };

  it("runs home › blog › post with trailing-slash links in each locale", () => {
    assert.deepEqual(postBreadcrumbs(post, "default"), [
      { label: "TOP", href: "/" },
      { label: "ブログ", href: "/blog/" },
      { label: "フォーム営業は違法？", href: "/blog/form-sales-legal-rules/" },
    ]);
    assert.deepEqual(
      postBreadcrumbs(post, "en").map((item) => item.href),
      ["/en/", "/en/blog/", "/en/blog/form-sales-legal-rules/"]
    );
  });

  it("becomes a BreadcrumbList of absolute URLs in page order", () => {
    const data = breadcrumbJsonLd(postBreadcrumbs(post, "default"));
    assert.equal(data["@type"], "BreadcrumbList");
    assert.deepEqual(
      data.itemListElement.map(({ position, name, item }) => [position, name, item]),
      [
        [1, "TOP", `${SITE_URL}/`],
        [2, "ブログ", `${SITE_URL}/blog/`],
        [3, "フォーム営業は違法？", `${SITE_URL}/blog/form-sales-legal-rules/`],
      ]
    );
  });
});

describe("layout and 404 metadata", () => {
  it("falls back to each locale's home title and description in its root layout", () => {
    for (const locale of LOCALES) {
      const meta = layoutMetadata(locale);
      assert.equal(meta.metadataBase.href, new URL(SITE_URL).href);
      assert.equal(meta.title, PAGE_META[locale].home.title);
      assert.equal(meta.description, PAGE_META[locale].home.description);
      assert.equal(meta.openGraph, undefined, "no homepage og:url leaks to other pages");
    }
  });

  it("keeps the 404 page out of the index", () => {
    const meta = notFoundMetadata();
    assert.equal(meta.metadataBase.href, new URL(SITE_URL).href);
    assert.equal(meta.title, "404 | WA+CRAFT");
    assert.deepEqual(meta.robots, { index: false });
    assert.equal(meta.alternates, undefined);
  });
});

/* ------------------------------------------------------------------ routes */

/**
 * Every page file under `app/`, with the URL it is served at: route groups such as
 * `(ja)` and `(en)` add no URL segment.
 */
function pageRoutes(dir = APP_DIR, segments = []) {
  const routes = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const isGroup = /^\(.+\)$/.test(entry.name);
      routes.push(...pageRoutes(full, isGroup ? segments : [...segments, entry.name]));
    } else if (/^page\.[jt]sx?$/.test(entry.name)) {
      routes.push({ url: `/${segments.map((segment) => `${segment}/`).join("")}`, file: full });
    }
  }
  return routes;
}

describe("app routes", () => {
  const routes = pageRoutes();

  it("serves a page at exactly the URLs the sitemap and canonicals are built from", () => {
    const expected = [
      ...LOCALES.flatMap((locale) =>
        PAGE_KEYS.map((key) => routeFor(key, locale).replace(/\/?$/, "/"))
      ),
      blogPostHref("default", "[slug]"),
      blogPostHref("en", "[slug]"),
    ].sort();

    assert.deepEqual(routes.map((route) => route.url).sort(), expected);
  });

  it("sets metadata in every page file", () => {
    for (const { url, file } of routes) {
      const source = fs.readFileSync(file, "utf8");
      assert.match(source, /^export (const metadata\b|(async )?function generateMetadata\b)/m, url);
    }
  });
});
