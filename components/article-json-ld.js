import { serializeJsonLd } from "../lib/blog";
import { articleJsonLd } from "../lib/seo";

/**
 * `Article` structured data for one blog post, built by `articleJsonLd` and
 * rendered as a single `application/ld+json` block on the post page.
 */
export default function ArticleJsonLd({ post, locale = "default" }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd(post, locale)) }}
    />
  );
}
