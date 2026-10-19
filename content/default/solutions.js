import BlogPostCard from "../../components/blog-post-card";
import { SERVICES } from "./solutions-data.js";

const LOCALE = "default";

const LABELS = {
  points: "Wa+Craftのポイント",
  related: "関連ブログ",
};

function ServiceBlock({ service, light, posts }) {
  return (
    <section id={service.key} className={`services section${light ? " light-background" : ""}`}>
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <span className="subtitle">
            <i className={`bi ${service.icon} me-2`} aria-hidden="true"></i>
            {service.name}
          </span>
          <h2>{service.catch}</h2>
          {service.body.map((text) => (
            <p key={text} className="mb-3">{text}</p>
          ))}
        </div>

        {service.groups.map((group) => (
          <div className="mb-5" key={group.title}>
            <h3 className="h4 mb-4">{group.title}</h3>
            <div className="row gy-4">
              {group.items.map((item) => (
                <div className="col-lg-4 col-md-6" key={item.title}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body p-4">
                      <h4 className="h6 fw-bold mb-2">{item.title}</h4>
                      <p className="mb-0">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {service.malls ? (
          <div className="mb-5">
            <h3 className="h4 mb-3">{service.malls.title}</h3>
            <p className="mb-0">{service.malls.items.join(" / ")}</p>
          </div>
        ) : null}

        {service.flow ? (
          <div className="mb-5">
            <h3 className="h4 mb-4">{service.flow.title}</h3>
            <ol className="list-unstyled d-flex flex-wrap align-items-center gap-2 mb-0">
              {service.flow.steps.map((step, index) => (
                <li key={step} className="d-flex align-items-center gap-2">
                  {index > 0 ? <i className="bi bi-arrow-right" aria-hidden="true"></i> : null}
                  <span className="border rounded-pill px-3 py-2 bg-white">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {service.callout ? (
          <div className="card border-0 shadow-sm mb-5">
            <div className="card-body p-4 p-lg-5">
              <p className="small fw-bold text-uppercase mb-2">{service.callout.label}</p>
              <h3 className="h4 mb-3">{service.callout.title}</h3>
              <p className="mb-0">{service.callout.text}</p>
            </div>
          </div>
        ) : null}

        <div className={posts.length > 0 ? "mb-5" : undefined}>
          <h3 className="h4 mb-4">{LABELS.points}</h3>
          <div className="row gy-4">
            {service.points.map((point) => (
              <div className="col-lg-6" key={point.title}>
                <div className="service-item">
                  <div className="service-icon">
                    <i className="bi bi-check2-circle"></i>
                  </div>
                  <div>
                    <h4 className="h5 mb-2">{point.title}</h4>
                    <p className="mb-0">{point.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {posts.length > 0 ? (
          <div>
            <h3 className="h4 mb-4">{LABELS.related}</h3>
            <div className="row gy-4">
              {posts.map((post) => (
                <div className="col-lg-4 col-md-6" key={post.slug}>
                  <BlogPostCard post={post} locale={LOCALE} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** `related` maps a service key to its tagged posts, already capped and ordered. */
export default function SolutionsSection({ related = {} }) {
  return (
    <>
      <section className="page-title section light-background">
        <div className="container section-title" data-aos="fade-up">
          <span className="subtitle">Our Solutions</span>
          <h1>事業を支える、5つのソリューション。</h1>
          <p className="mb-3">
            Wa+Craftは、企業が抱えるさまざまな課題に合わせて、5つの領域から必要なサポートをご提供します。
          </p>
          <p>
            一つの業務だけでなく、複数のソリューションを組み合わせることで、より柔軟で効率的な運営体制を支援します。
          </p>
        </div>
      </section>

      {SERVICES.map((service, index) => (
        <ServiceBlock
          key={service.key}
          service={service}
          light={index % 2 === 1}
          posts={related[service.key] ?? []}
        />
      ))}
    </>
  );
}
