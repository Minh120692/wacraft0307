import Link from "next/link";
import { blogPostHref } from "../lib/site-content";

const DATE_LOCALE = {
  default: "ja-JP",
  en: "en-US",
};

export function formatPostDate(isoDate, locale = "default") {
  return new Date(isoDate).toLocaleDateString(DATE_LOCALE[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogPostCard({ post, locale = "default" }) {
  const href = blogPostHref(locale, post.slug);
  const readMore = locale === "en" ? "Read more" : "続きを読む";

  return (
    <article className="card h-100 border-0 shadow-sm" data-aos="fade-up">
      {post.image ? (
        <Link href={href}>
          <img src={post.image} alt={post.title} className="card-img-top" loading="lazy" />
        </Link>
      ) : null}
      <div className="card-body d-flex flex-column">
        <time className="text-uppercase small text-body-secondary mb-2" dateTime={post.date}>
          {formatPostDate(post.date, locale)}
        </time>
        <h3 className="h5 card-title mb-3">
          <Link href={href} className="text-reset text-decoration-none">
            {post.title}
          </Link>
        </h3>
        <p className="card-text flex-grow-1">{post.description}</p>
        <Link href={href} className="mt-3 align-self-start text-decoration-none">
          {readMore} <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
    </article>
  );
}
