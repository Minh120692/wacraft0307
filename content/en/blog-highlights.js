import BlogPostCard from "../../components/blog-post-card";
import { pageHref } from "../../lib/site-content.js";

const LOCALE = "en";

/** Homepage teaser for the newest posts. Renders nothing when the locale has none. */
export default function BlogHighlightsSection({ posts = [] }) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="blog section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Blog</span>
        <h2>Insights for your business</h2>
        <p>
          We share practical information on e-commerce operations, process improvement,
          digital marketing and more.
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {posts.map((post) => (
            <div className="col-lg-4 col-md-6" key={post.slug}>
              <BlogPostCard post={post} locale={LOCALE} />
            </div>
          ))}
        </div>

        <div className="cta-section justify-content-center">
          <a href={pageHref("blog", LOCALE)} className="btn-outline">View all posts →</a>
        </div>
      </div>
    </section>
  );
}
