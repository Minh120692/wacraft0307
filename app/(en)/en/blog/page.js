import SitePage from "../../../../components/site-page";
import BlogPostCard from "../../../../components/blog-post-card";
import enSections from "../../../../content/en/index.js";
import { getPosts } from "../../../../lib/blog";
import { pageMetadata } from "../../../../lib/seo";

const LOCALE = "en";
export const metadata = pageMetadata("blog", LOCALE);

function BlogIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Blog</span>
        <h1>Blog</h1>
        <p>
          Notes from the WA+CRAFT team on designing AI-assisted operations, e-commerce, SEO and
          social marketing, and video production.
        </p>
      </div>
    </section>
  );
}

export default function EnglishBlogIndexPage() {
  const posts = getPosts(LOCALE);
  const Footer = enSections.footer;

  return (
    <SitePage
      locale={LOCALE}
      activePage="blog"
      intro={<BlogIntro />}
      footer={<Footer />}
      scriptSuffix="-en-blog"
    >
      <section id="blog" className="blog section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="text-center">No articles have been published yet. Check back soon.</p>
          ) : (
            <div className="row gy-4">
              {posts.map((post) => (
                <div className="col-lg-4 col-md-6" key={post.slug}>
                  <BlogPostCard post={post} locale={LOCALE} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </SitePage>
  );
}
