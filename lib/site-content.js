const ROUTES = {
  home: { default: "/", en: "/en" },
  about: { default: "/about", en: "/en/about" },
  solutions: { default: "/solutions", en: "/en/solutions" },
  blog: { default: "/blog", en: "/en/blog" },
  contact: { default: "/contact", en: "/en/contact" },
};

export { ROUTES };

/** Route keys that make up the public site, in navigation order. */
export const MARKETING_PAGES = ["home", "about", "solutions", "contact"];

/**
 * The five services, in display order. Each key is at once the section anchor on
 * the solutions page, the target of `solutionHref` and the blog tag that lists a
 * post under that service's related posts.
 */
export const SERVICE_KEYS = ["ec", "bpo", "marketing", "video", "sales"];

function localeKey(locale = "default") {
  return locale === "en" ? "en" : "default";
}

export function routeFor(pageKey, locale = "default") {
  return ROUTES[pageKey][localeKey(locale)];
}

/**
 * Path of a single blog post, built from the blog route so links stay centralized.
 * Carries the trailing slash the export emits, so in-site links never need a redirect.
 */
export function blogPostHref(locale = "default", slug = "") {
  return `${routeFor("blog", locale)}/${slug}/`;
}

/**
 * A marketing route with the trailing slash the export emits, for in-page links.
 * `routeFor` stays slash-free because the header compares against it.
 */
export function pageHref(pageKey, locale = "default") {
  return routeFor(pageKey, locale).replace(/\/?$/, "/");
}

/** Link to one service's section on the solutions page, e.g. `/solutions/#ec`. */
export function solutionHref(locale = "default", key = "") {
  if (!SERVICE_KEYS.includes(key)) {
    throw new Error(`Unknown service key "${key}" (expected one of ${SERVICE_KEYS.join(", ")})`);
  }
  return `${pageHref("solutions", locale)}#${key}`;
}

/** The same page in the other locale, falling back to that locale's home page. */
export function counterpartHref(pageKey, locale = "default") {
  const other = localeKey(locale) === "en" ? "default" : "en";
  return ROUTES[pageKey] ? routeFor(pageKey, other) : routeFor("home", other);
}

export function getPageChrome(locale = "default", activePage = "home", langHrefOverride = null) {
  return {
    logoHref: routeFor("home", locale),
    homeHref: routeFor("home", locale),
    aboutHref: routeFor("about", locale),
    solutionsHref: routeFor("solutions", locale),
    blogHref: routeFor("blog", locale),
    contactHref: routeFor("contact", locale),
    langHref: langHrefOverride ?? counterpartHref(activePage, locale),
    langLabel: locale === "en" ? "Japanese" : "English",
  };
}
