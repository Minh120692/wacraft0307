import SitePage from "../../../components/site-page";
import BlogPostCard from "../../../components/blog-post-card";
import defaultSections from "../../../content/default/index.js";
import { getPosts } from "../../../lib/blog";
import { pageMetadata } from "../../../lib/seo";

const LOCALE = "default";
export const metadata = pageMetadata("blog", LOCALE);

function BlogIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Blog</span>
        <h1>ブログ</h1>
        <p>
          AI×BPOの運用設計、EC運営、SEO・SNSマーケティング、動画制作の現場から、
          実務で使える考え方と手順を公開しています。
        </p>
      </div>
    </section>
  );
}

export default function BlogIndexPage() {
  const posts = getPosts(LOCALE);
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale={LOCALE}
      activePage="blog"
      intro={<BlogIntro />}
      footer={<Footer />}
      scriptSuffix="-blog"
    >
      <section id="blog" className="blog section">
        <div className="container">
          {posts.length === 0 ? (
            <p className="text-center">記事はまだありません。近日公開予定です。</p>
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
