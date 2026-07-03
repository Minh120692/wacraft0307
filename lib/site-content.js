const ROUTES = {
  home: { default: "/", en: "/en" },
  about: { default: "/about", en: "/en/about" },
  solutions: { default: "/solutions", en: "/en/solutions" },
  "why-us": { default: "/why-us", en: "/en/why-us" },
  team: { default: "/team", en: "/en/team" },
};

function localeKey(locale = "default") {
  return locale === "en" ? "en" : "default";
}

export function routeFor(pageKey, locale = "default") {
  return ROUTES[pageKey][localeKey(locale)];
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

export function getPageChrome(locale = "default") {
  return {
    logoHref: routeFor("home", locale),
    homeHref: routeFor("home", locale),
    aboutHref: routeFor("about", locale),
    solutionsHref: routeFor("solutions", locale),
    whyUsHref: routeFor("why-us", locale),
    teamHref: routeFor("team", locale),
    langHref: locale === "en" ? "/" : "/en",
    langLabel: locale === "en" ? "Japanese" : "English",
  };
}
