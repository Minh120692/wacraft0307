import Link from "next/link";
import { notFound } from "next/navigation";

import SitePage from "../../../../../components/site-page";
import ArticleJsonLd from "../../../../../components/article-json-ld";
import { formatPostDate } from "../../../../../components/blog-post-card";
import enSections from "../../../../../content/en/index.js";
import { alternatePaths, getPost, getPosts } from "../../../../../lib/blog";
import { postMetadata } from "../../../../../lib/seo";
import { routeFor } from "../../../../../lib/site-content";

const LOCALE = "en";
const EMPTY_SLUG = "__no-posts";

/**
 * `output: "export"` rejects a dynamic segment whose params list is empty, so an
 * empty locale falls back to one reserved slug that renders the 404 page.
 */
export function generateStaticParams() {
  const params = getPosts(LOCALE).map((post) => ({ slug: post.slug }));
  return params.length > 0 ? params : [{ slug: EMPTY_SLUG }];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  // The reserved empty-locale slug exports as Next's 404 page; postMetadata keeps it
  // out of the index.
  return postMetadata(LOCALE, slug);
}

export default async function EnglishBlogPostPage({ params }) {
  const { slug } = await params;
  const post = getPost(LOCALE, slug);
  if (!post) notFound();

  const Footer = enSections.footer;
  // Prefer the translated post over the other locale's blog index when it exists.
  const translationHref = alternatePaths(slug)["ja"] ?? null;

  return (
    <SitePage
      locale={LOCALE}
      activePage="blog"
      intro={
        <section className="page-title section light-background">
          <div className="container section-title" data-aos="fade-up">
            <span className="subtitle">Blog</span>
            <h1>{post.title}</h1>
            <p>
              <time dateTime={post.date}>{formatPostDate(post.date, LOCALE)}</time>
            </p>
          </div>
        </section>
      }
      footer={<Footer />}
      scriptSuffix="-en-blog-post"
      langHref={translationHref}
    >
      <ArticleJsonLd post={post} locale={LOCALE} />
      <section className="blog-details section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <article
                className="blog-post-body"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
              <p className="mt-5">
                <Link href={routeFor("blog", LOCALE)}>&larr; Back to all articles</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
