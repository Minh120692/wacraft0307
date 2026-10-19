import Link from "next/link";

import ArticleJsonLd from "./article-json-ld";
import { formatPostDate } from "./blog-post-card";
import { serializeJsonLd } from "../lib/blog";
import { breadcrumbJsonLd, postBreadcrumbs } from "../lib/seo";
import { blogPostHref, pageHref } from "../lib/site-content";

const LABELS = {
  default: {
    breadcrumb: "パンくずリスト",
    toc: "目次",
    published: "公開日：",
    updated: "更新日：",
    related: "関連記事",
    back: "ブログ一覧へ戻る",
    aboutTitle: "WA+CRAFTについて",
    aboutText:
      "日本語対応可能なベトナムチームとAI・業務改善を組み合わせ、EC運営、BPO・業務改善、デジタルマーケティング、動画制作、営業支援まで、必要な業務を柔軟に組み合わせて支援します。",
    services: "サービス一覧を見る",
    contact: "お問い合わせ →",
  },
  en: {
    breadcrumb: "Breadcrumb",
    toc: "Contents",
    published: "Published: ",
    updated: "Updated: ",
    related: "Related articles",
    back: "Back to all articles",
    aboutTitle: "About WA+CRAFT",
    aboutText:
      "A Japanese-speaking Vietnamese team combined with AI and process improvement, covering e-commerce operations, BPO, digital marketing, video production and sales & CRM support.",
    services: "See our services",
    contact: "Contact us →",
  },
};

function Breadcrumbs({ items, label }) {
  return (
    <>
      <nav aria-label={label} className="blog-breadcrumb">
        <ol>
          {items.map((item, index) =>
            index < items.length - 1 ? (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ) : (
              <li key={item.href}>
                <span aria-current="page">{item.label}</span>
              </li>
            )
          )}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd(items)) }}
      />
    </>
  );
}

/** The table of contents, rendered twice: a sticky sidebar on wide screens, inline on narrow ones. */
function TableOfContents({ items, label, className }) {
  return (
    <nav aria-label={label} className={`blog-toc ${className}`}>
      <p className="blog-toc-title">{label}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={`blog-toc-depth-${item.depth}`}>
            <a href={`#${item.id}`}>
              {item.number ? <span className="blog-toc-number">{item.number}</span> : null}
              <span className="blog-toc-text">{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function AboutBox({ locale, labels }) {
  return (
    <aside aria-labelledby="blog-post-about-title" className="blog-post-about">
      <p id="blog-post-about-title" className="blog-post-about-title">
        {labels.aboutTitle}
      </p>
      <p className="blog-post-about-text">{labels.aboutText}</p>
      <div className="cta-section">
        <a href="#contact" data-contact-trigger="true" className="btn-primary">
          {labels.contact}
        </a>
        <Link href={pageHref("solutions", locale)} className="btn-outline">
          {labels.services}
        </Link>
      </div>
    </aside>
  );
}

function RelatedPosts({ posts, locale, labels }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="blog-related-title" className="blog-related">
      <h2 id="blog-related-title" className="blog-related-title">
        {labels.related}
      </h2>
      <ul className="blog-related-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={blogPostHref(locale, post.slug)} className="blog-related-item">
              <span className="blog-related-thumb">
                {post.image ? (
                  <img src={post.image} alt="" loading="lazy" decoding="async" />
                ) : (
                  <img src="/assets/img/logo-mark.svg" alt="" className="blog-related-placeholder" />
                )}
              </span>
              <span className="blog-related-text">
                <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
                <span className="blog-related-heading">{post.title}</span>
                <span className="blog-related-summary">{post.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * A blog post page, laid out like the setsubi-pro.net columns: breadcrumb, then the
 * table of contents beside the article (above the body on narrow screens), the
 * meta line, title, hero image, body, the company box and related posts.
 */
export default function BlogPostLayout({ post, locale = "default", related = [] }) {
  const labels = LABELS[locale] ?? LABELS.default;
  const hasToc = post.toc.length > 1;
  // Every post shows both dates; one never edited counts as updated when published.
  const updated = post.updated ?? post.date;

  return (
    <section className="blog-details section">
      <ArticleJsonLd post={post} locale={locale} />
      <div className="container">
        <Breadcrumbs items={postBreadcrumbs(post, locale)} label={labels.breadcrumb} />

        <div className={hasToc ? "blog-post-layout has-toc" : "blog-post-layout"}>
          {hasToc ? (
            <aside className="blog-post-sidebar">
              <TableOfContents items={post.toc} label={labels.toc} className="blog-toc-sticky" />
            </aside>
          ) : null}

          <article className="blog-post">
            <div className="blog-post-meta">
              {post.subcategory ? <span className="blog-post-badge">{post.subcategory}</span> : null}
              <span>
                {labels.published}
                <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
              </span>
              <span>
                {labels.updated}
                <time dateTime={updated}>{formatPostDate(updated, locale)}</time>
              </span>
            </div>

            <h1 id="article-title" className="blog-post-title">
              {post.title}
            </h1>

            {post.image ? (
              <figure className="blog-post-hero">
                <img
                  src={post.image}
                  alt={post.imageAlt ?? post.title}
                  width={post.imageSize?.width}
                  height={post.imageSize?.height}
                  fetchPriority="high"
                  decoding="async"
                />
              </figure>
            ) : null}

            {hasToc ? (
              <TableOfContents items={post.toc} label={labels.toc} className="blog-toc-inline" />
            ) : null}

            <div className="blog-post-body" dangerouslySetInnerHTML={{ __html: post.html }} />

            <AboutBox locale={locale} labels={labels} />

            <RelatedPosts posts={related} locale={locale} labels={labels} />

            <p className="blog-post-back">
              <Link href={pageHref("blog", locale)}>&larr; {labels.back}</Link>
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
