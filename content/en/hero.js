export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 data-aos="fade-up" data-aos-delay="200">AI-based BPO and a Japanese-speaking Vietnamese team are available to handle your business.</h1>
              <p data-aos="fade-up" data-aos-delay="300" className="fw-bold">Communicate in Japanese. Operate internationally. Deliver results.</p>
              <p data-aos="fade-up" data-aos-delay="300" className="mb-5">
                By combining Japanese-speaking Vietnamese personnel with AI, we achieve both accuracy and speed in our operations.
                We provide flexible and scalable services to support small and medium-sized enterprises and startups.
              </p>
              <div className="hero-cta" data-aos="fade-up" data-aos-delay="400">
                <a href="/en/about" className="btn-primary">Consult first</a>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-image" data-aos="fade-left" data-aos-delay="300">
              <img src="/assets/img/about/hahoangmedia-39 (1).jpg" alt="Business Success" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
