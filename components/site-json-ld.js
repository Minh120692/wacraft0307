import { serializeJsonLd } from "../lib/blog";
import { siteJsonLd } from "../lib/seo";

/**
 * `Organization` + `WebSite` structured data, rendered as a single
 * `application/ld+json` block on each locale's homepage only.
 */
export default function SiteJsonLd({ locale = "default" }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd(locale)) }}
    />
  );
}
