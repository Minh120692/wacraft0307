import { BLOG_ROOT, getPosts, LOCALES } from "../lib/blog.js";
import { MARKETING_PAGES, blogPostHref, routeFor } from "../lib/site-content.js";
import { absoluteUrl } from "../lib/site-url.js";

// Reading NEXT_PUBLIC_SITE_URL would otherwise mark this route dynamic,
// which `output: "export"` rejects.
export const dynamic = "force-static";

/**
 * Every indexable URL of the static export: each marketing route and the blog
 * index in both locales, plus every published post. All absolute, all with the
 * trailing slash the export emits.
 */
export function sitemapEntries(root = BLOG_ROOT) {
  const entries = [];

  for (const locale of LOCALES) {
    for (const pageKey of MARKETING_PAGES) {
      entries.push({
        url: absoluteUrl(routeFor(pageKey, locale)),
        changeFrequency: "monthly",
        priority: pageKey === "home" ? 1 : 0.8,
      });
    }

    const posts = getPosts(locale, root);

    // Newest change in the locale, which is not always the newest post:
    // an older post can carry a more recent `updated`.
    const lastChanged = posts.reduce(
      (latest, post) => {
        const stamp = post.updated ?? post.date;
        return latest === undefined || stamp > latest ? stamp : latest;
      },
      undefined
    );

    entries.push({
      url: absoluteUrl(routeFor("blog", locale)),
      lastModified: lastChanged ? new Date(lastChanged) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    for (const post of posts) {
      entries.push({
        url: absoluteUrl(blogPostHref(locale, post.slug)),
        lastModified: new Date(post.updated ?? post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}

export default function sitemap() {
  return sitemapEntries();
}
