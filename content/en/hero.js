export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <p className="small fw-bold text-uppercase mb-3">BPO × AI × BUSINESS SUPPORT</p>
              <h1>Even in a talent shortage,<br />keep your business growing.</h1>
              <p className="mb-3">
                A Japanese-speaking Vietnamese team combined with AI and process improvement,
                covering e-commerce operations, digital marketing, video production and sales support.
              </p>
              <p className="mb-5">
                We offer services that small and medium-sized businesses and startups can combine flexibly and scale as they grow.
              </p>
              <div className="hero-cta">
                <a href="#contact" data-contact-trigger="true" className="btn-primary">Contact Us →</a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image">
              <img src="/assets/img/about/hahoangmedia-39 (1).jpg" alt="Business Success" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
