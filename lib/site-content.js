const ROUTES = {
  home: { default: "/", en: "/en" },
  about: { default: "/about", en: "/en/about" },
  solutions: { default: "/solutions", en: "/en/solutions" },
  "why-us": { default: "/why-us", en: "/en/why-us" },
  team: { default: "/team", en: "/en/team" },
  blog: { default: "/blog", en: "/en/blog" },
};

export { ROUTES };

/** Route keys that make up the public site, in navigation order. */
export const MARKETING_PAGES = ["home", "about", "solutions", "why-us", "team"];

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

/** The same page in the other locale, falling back to that locale's home page. */
export function counterpartHref(pageKey, locale = "default") {
  const other = localeKey(locale) === "en" ? "default" : "en";
  return ROUTES[pageKey] ? routeFor(pageKey, other) : routeFor("home", other);
}

export function normalizeHtml(html, locale = "default") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/action="form-mail\/send_email\.php"/gi, 'action="/api/contact"')
    .replace(/href="index\.html"/gi, `href="${routeFor("home", locale)}"`)
    .replace(/href="index-en\.html"/gi, 'href="/en"')
    .replace(/href="about\.html"/gi, `href="${routeFor("about", locale)}"`)
    .replace(/href="about-en\.html"/gi, 'href="/en/about"')
    .replace(/href="solutions\.html"/gi, `href="${routeFor("solutions", locale)}"`)
    .replace(/href="solutions-en\.html"/gi, 'href="/en/solutions"')
    .replace(/href="why-us\.html"/gi, `href="${routeFor("why-us", locale)}"`)
    .replace(/href="why-us-en\.html"/gi, 'href="/en/why-us"')
    .replace(/href="team\.html"/gi, `href="${routeFor("team", locale)}"`)
    .replace(/href="team-en\.html"/gi, 'href="/en/team"')
    .replace(/href="#about"/gi, `href="${routeFor("about", locale)}"`)
    .replace(/href="#services"/gi, `href="${routeFor("solutions", locale)}"`)
    .replace(/href="#why-us"/gi, `href="${routeFor("why-us", locale)}"`)
    .replace(/href="#team"/gi, `href="${routeFor("team", locale)}"`)
    .replace(/href="#"/gi, `href="${routeFor("home", locale)}"`)
    .replace(/href="#contact"/gi, 'href="#contact"')
    .replace(/src="img\//gi, 'src="/img/')
    .replace(/href="img\//gi, 'href="/img/')
    .replace(/src="assets\//gi, 'src="/assets/')
    .replace(/href="assets\//gi, 'href="/assets/')
    .trim();
}

export function getPageChrome(locale = "default", activePage = "home", langHrefOverride = null) {
  return {
    logoHref: routeFor("home", locale),
    homeHref: routeFor("home", locale),
    aboutHref: routeFor("about", locale),
    solutionsHref: routeFor("solutions", locale),
    whyUsHref: routeFor("why-us", locale),
    teamHref: routeFor("team", locale),
    blogHref: routeFor("blog", locale),
    langHref: langHrefOverride ?? counterpartHref(activePage, locale),
    langLabel: locale === "en" ? "Japanese" : "English",
  };
}
