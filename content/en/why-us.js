export default function WhyUsSection() {
  return (
    <section id="why-us" className="why-us section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Why Choose Us</span>
        <h2>Why Choose Us</h2>
        <p>We are chosen as a partner not just for cost savings but because we blend Japanese-quality communication with cutting-edge technology to create an advantageous back office for your business.</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>Why are we chosen?</h2>
              <p>Based on the materials you provided, we have summarized our main strengths.</p>
            </div>
          </div>
          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
            <div className="image-wrapper">
              <img src="/assets/img/about/hahoangmedia-31 (1).jpg" alt="Professional team collaboration" className="img-fluid" />
            </div>
          </div>
        </div>

        <div className="features-grid" data-aos="fade-up" data-aos-delay="400">
          <div className="row g-5">
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-item">
                <div className="icon-wrapper">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <div className="feature-content">
                  <h3>Highly efficient operations using AI</h3>
                  <p>By combining AI tools with human judgment, we deliver both speed and accuracy. From simple tasks to complex operations, we design the optimal workflow.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-item">
                <div className="icon-wrapper">
                  <i className="bi bi-award"></i>
                </div>
                <div className="feature-content">
                  <h3>Vietnamese staff who can speak Japanese</h3>
                  <p>Our staff are able to communicate in Japanese and perform tasks accurately and courteously. They understand cultural nuance, providing reliable, comfortable collaboration.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-item">
                <div className="icon-wrapper">
                  <i className="bi bi-headset"></i>
                </div>
                <div className="feature-content">
                  <h3>Eliminating the hurdles to utilizing overseas resources</h3>
                  <p>We handle all the management and coordination, allowing you to use overseas resources with the same ease as domestic teams.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
              <div className="feature-item">
                <div className="icon-wrapper">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <div className="feature-content">
                  <h3>The flexibility to start small and expand greatly</h3>
                  <p>Start from a single person or a few hours and scale up as needed. We adapt flexibly to your company&apos;s growth phase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
