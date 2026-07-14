export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1>AI-based BPO and a Japanese-speaking Vietnamese team are available to handle your business.</h1>
              <p className="fw-bold">Communicate in Japanese. Operate internationally. Deliver results.</p>
              <p className="mb-5">
                By combining Japanese-speaking Vietnamese personnel with AI, we achieve both accuracy and speed in our operations.
                We provide flexible and scalable services to support small and medium-sized enterprises and startups.
              </p>
              <div className="hero-cta">
                <a href="/en/about" className="btn-primary">Consult first</a>
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
