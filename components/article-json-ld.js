import { LOCALE_LANG, serializeJsonLd } from "../lib/blog";
import { absoluteUrl, absoluteAsset } from "../lib/site-url";
import { blogPostHref } from "../lib/site-content";

/**
 * `Article` structured data for one blog post.
 * Rendered as a single `application/ld+json` block on the post page.
 */
export default function ArticleJsonLd({ post, locale = "default" }) {
  const url = absoluteUrl(blogPostHref(locale, post.slug));

  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: LOCALE_LANG[locale] ?? "en",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@type": "Organization", name: post.author ?? "WA+CRAFT" },
    publisher: {
      "@type": "Organization",
      name: "WA+CRAFT",
      logo: { "@type": "ImageObject", url: absoluteAsset("/assets/img/logo.svg") },
    },
    ...(post.image ? { image: [absoluteAsset(post.image)] } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
