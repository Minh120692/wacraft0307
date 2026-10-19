import { BLOG_ROOT, LOCALE_LANG, alternatePaths, getPost } from "./blog.js";
import { blogPostHref, pageHref, routeFor } from "./site-content.js";
import { SITE_URL, absoluteAsset, absoluteUrl } from "./site-url.js";

/**
 * Page-level SEO for the static export: titles, descriptions, canonical, hreflang,
 * Open Graph and the site-wide JSON-LD, for the marketing pages, the blog indexes
 * and the blog posts. Kept free of JSX so `node --test` can import it; pages and
 * layouts only call these builders.
 */

/** Brand shown in titles, `og:site_name` and the JSON-LD `name`. */
export const SITE_NAME = "WA+CRAFT";

/** Open Graph locale for each locale key. */
export const OG_LOCALE = {
  default: "ja_JP",
  en: "en_US",
};

/** Title and description of every page that has no front-matter of its own. */
export const PAGE_META = {
  default: {
    home: {
      title: "WA+CRAFT | 日本語対応ベトナムチーム×AIのBPO・業務支援",
      description:
        "日本語対応可能なベトナムチームとAI・業務改善を組み合わせ、EC運営、BPO、デジタルマーケティング、動画制作、営業・CRM支援まで。中小企業・スタートアップの成長に合わせて、必要な業務を柔軟に組み合わせられます。",
    },
    about: {
      title: "会社情報・代表挨拶 | WA+CRAFT",
      description:
        "日本とベトナムの強みを掛け合わせ、人材・AI・IT・業務改善で企業の業務を支えるWa+Craftの会社情報です。代表挨拶、会社概要、4つのバリュー、チームをご紹介します。",
    },
    solutions: {
      title: "EC運営・BPO・マーケティング・動画・営業支援 | WA+CRAFT",
      description:
        "EC運営支援、BPO・業務改善、SEO・SNSなどのデジタルマーケティング、EC・SNS向け動画制作、顧客リスト作成からCRM管理までの営業支援。Wa+Craftの5つのソリューションをご紹介します。",
    },
    blog: {
      title: "ブログ | WA+CRAFT",
      description:
        "EC運営、業務改善・BPO、デジタルマーケティングなど、ビジネスに役立つ情報を発信するWA+CRAFTのブログです。",
    },
  },
  en: {
    home: {
      title: "WA+CRAFT | Japanese-speaking BPO and business support with AI",
      description:
        "A Japanese-speaking Vietnamese team combined with AI and process improvement, covering e-commerce operations, BPO, digital marketing, video production and sales & CRM support.",
    },
    about: {
      title: "Company Information | WA+CRAFT",
      description:
        "Company information for Wa+Craft, a BPO partner combining the strengths of Japan and Vietnam with people, AI, IT and process improvement: our message, overview, values and team.",
    },
    solutions: {
      title: "E-commerce, BPO, Marketing, Video and Sales Support | WA+CRAFT",
      description:
        "Wa+Craft's five solutions: marketplace operations, BPO and process improvement, SEO and social marketing, e-commerce and social video, and sales support from prospect lists to CRM.",
    },
    blog: {
      title: "Blog | WA+CRAFT",
      description:
        "Practical insights on e-commerce operations, process improvement, BPO and digital marketing from WA+CRAFT.",
    },
  },
};

function localeKey(locale = "default") {
  return locale === "en" ? "en" : "default";
}

function otherLocale(locale = "default") {
  return localeKey(locale) === "en" ? "default" : "en";
}

/**
 * Add the `x-default` hreflang to a `{ja?, en?}` map of absolute URLs.
 * Japan is the primary market, so it points to the Japanese URL, or to the
 * English one when the page exists only in English.
 */
export function withXDefault(languages = {}) {
  const fallback = languages.ja ?? languages.en;
  return fallback === undefined ? { ...languages } : { ...languages, "x-default": fallback };
}

/**
 * The full `metadata` of a page that exists in both locales: title, description,
 * a self-referencing canonical, the `ja` / `en` / `x-default` hreflang trio and
 * a complete `openGraph` (Next merges metadata shallowly, so it is never partial).
 */
export function pageMetadata(pageKey, locale = "default") {
  const key = localeKey(locale);
  const meta = PAGE_META[key][pageKey];
  if (!meta) {
    throw new Error(
      `No SEO copy for page "${pageKey}" (expected one of ${Object.keys(PAGE_META[key]).join(", ")})`
    );
  }

  const canonical = absoluteUrl(routeFor(pageKey, key));
  const languages = withXDefault({
    [LOCALE_LANG.default]: absoluteUrl(routeFor(pageKey, "default")),
    [LOCALE_LANG.en]: absoluteUrl(routeFor(pageKey, "en")),
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[key],
      alternateLocale: OG_LOCALE[otherLocale(key)],
      title: meta.title,
      description: meta.description,
      url: canonical,
    },
  };
}

/**
 * Absolute hreflang map of a blog post: `{ja?, en?, "x-default"}`, holding only
 * the locales that publish this slug. `root` lets tests point it at fixtures.
 */
export function postLanguages(slug, root = BLOG_ROOT) {
  return withXDefault(
    Object.fromEntries(
      Object.entries(alternatePaths(slug, root)).map(([lang, href]) => [lang, absoluteUrl(href)])
    )
  );
}

/**
 * The full `metadata` of a blog post page. A slug the locale does not publish
 * (only the reserved empty-locale slug reaches this) is kept out of the index.
 */
export function postMetadata(locale = "default", slug = "", root = BLOG_ROOT) {
  const key = localeKey(locale);
  const post = getPost(key, slug, root);
  if (!post) {
    return { title: `Not found | ${SITE_NAME}`, robots: { index: false, follow: false } };
  }

  const canonical = absoluteUrl(blogPostHref(key, slug));
  const languages = postLanguages(slug, root);
  const translated = languages[LOCALE_LANG[otherLocale(key)]] !== undefined;

  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    alternates: { canonical, languages },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: OG_LOCALE[key],
      ...(translated ? { alternateLocale: OG_LOCALE[otherLocale(key)] } : {}),
      title: post.title,
      description: post.description,
      url: canonical,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      ...(post.image ? { images: [{ url: absoluteAsset(post.image) }] } : {}),
    },
  };
}

/** Fallback `metadata` of a locale's root layout, for any page that sets none. */
export function layoutMetadata(locale = "default") {
  const { title, description } = PAGE_META[localeKey(locale)].home;
  return { metadataBase: new URL(SITE_URL), title, description };
}

/** `metadata` of the 404 page, which must never be indexed. */
export function notFoundMetadata() {
  return {
    metadataBase: new URL(SITE_URL),
    title: `404 | ${SITE_NAME}`,
    robots: { index: false },
  };
}

/**
 * The one `@id` of the company in structured data. The homepages define the node;
 * the WebSite nodes and every Article's author and publisher point to it.
 */
export const ORGANIZATION_ID = absoluteUrl(`${routeFor("home", "default")}#organization`);

/** The company logo, in the Organization node and every Article's publisher. */
export const LOGO_PATH = "/assets/img/logo.svg";

/** Other names of the company: the Organization's `alternateName`. */
const ALTERNATE_NAMES = ["Wa+Craft", "Wa+Craft Co., Ltd."];

/**
 * The company, identical on both homepages so crawlers see one entity with one set
 * of facts. The facts come from the company table (`content/<locale>/company-info.js`),
 * which holds them as JSX and so cannot be imported here.
 */
function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    alternateName: [...ALTERNATE_NAMES],
    legalName: "Wa+Craft 有限会社",
    url: absoluteUrl(routeFor("home", "default")),
    logo: absoluteAsset(LOGO_PATH),
    foundingDate: "2026-03-03",
    telephone: ["+81-70-9103-1967", "+84-91-723-1967"],
    address: {
      "@type": "PostalAddress",
      streetAddress: "15 Ngo Thi Si Street",
      addressLocality: "Ngu Hanh Son Ward, Da Nang City",
      addressCountry: "VN",
    },
  };
}

/**
 * `Organization` + `WebSite` structured data for a locale's homepage. The WebSite
 * node is per locale: its own `@id`, its own root URL and its own language.
 */
export function siteJsonLd(locale = "default") {
  const key = localeKey(locale);
  const home = absoluteUrl(routeFor("home", key));

  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "WebSite",
        "@id": absoluteUrl(`${routeFor("home", key)}#website`),
        name: SITE_NAME,
        url: home,
        inLanguage: LOCALE_LANG[key],
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

/** Names that mean the company itself, compared case-insensitively. */
const COMPANY_NAMES = new Set([SITE_NAME, ...ALTERNATE_NAMES].map((name) => name.toLowerCase()));

/**
 * The Article author. A blank or absent `author` means the company, as does any of
 * its names in any case; the company points to the homepages' Organization node.
 */
function articleAuthor(author) {
  const name = typeof author === "string" ? author.trim() : "";
  if (name === "" || COMPANY_NAMES.has(name.toLowerCase())) {
    return { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME };
  }
  return { "@type": "Organization", name };
}

/** `Article` structured data for one blog post, as its post page renders it. */
export function articleJsonLd(post, locale = "default") {
  const url = absoluteUrl(blogPostHref(locale, post.slug));

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: LOCALE_LANG[locale] ?? "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: articleAuthor(post.author),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteAsset(LOGO_PATH) },
    },
    ...(post.image ? { image: [absoluteAsset(post.image)] } : {}),
  };
}

/** Labels of the first two breadcrumb steps, per locale. */
const BREADCRUMB_LABELS = {
  default: { home: "TOP", blog: "ブログ" },
  en: { home: "Home", blog: "Blog" },
};

/** The breadcrumb trail of a blog post: home › blog › the post itself. */
export function postBreadcrumbs(post, locale = "default") {
  const key = localeKey(locale);
  const labels = BREADCRUMB_LABELS[key];
  return [
    { label: labels.home, href: pageHref("home", key) },
    { label: labels.blog, href: pageHref("blog", key) },
    { label: post.title, href: blogPostHref(key, post.slug) },
  ];
}

/** `BreadcrumbList` structured data for a `{label, href}` trail, as the page shows it. */
export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}
