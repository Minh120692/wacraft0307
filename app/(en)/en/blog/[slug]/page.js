import { notFound } from "next/navigation";

import SitePage from "../../../../../components/site-page";
import BlogPostLayout from "../../../../../components/blog-post-layout";
import enSections from "../../../../../content/en/index.js";
import { alternatePaths, getPost, getPosts, relatedPosts } from "../../../../../lib/blog";
import { postMetadata } from "../../../../../lib/seo";

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
      footer={<Footer />}
      scriptSuffix="-en-blog-post"
      langHref={translationHref}
    >
      <BlogPostLayout post={post} locale={LOCALE} related={relatedPosts(LOCALE, slug)} />
    </SitePage>
  );
}
