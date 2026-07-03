export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>Through innovation and dedication, we deliver tangible results.</h2>
              <p className="lead">We are a team of professionals passionate about delivering results that exceed expectations and driving meaningful transformation.</p>
              <p>Based in Japan and Vietnam, we provide BPO services that combine Japanese-capable Vietnamese talent with the latest AI technology. Our mission is to convert the operational busywork that companies face into tangible, reliable results.</p>
              <p>More than simple outsourcing, we optimize the balance of speed, quality, and cost to accelerate your growth as an integrated extension of your team. We remove the barriers to using overseas resources and enable smooth collaboration with the same ease as domestic teams.</p>

              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="15" data-purecounter-duration="1"></div>
                  <div className="stat-label">Years of Experience</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="850" data-purecounter-duration="1"></div>
                  <div className="stat-label">Completed Projects</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="240" data-purecounter-duration="1"></div>
                  <div className="stat-label">Satisfied Clients</div>
                </div>
              </div>

              <div className="cta-section">
                <a href="/en/team" className="btn-outline">Meet the Team</a>
              </div>
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="300">
            <div className="image-wrapper">
              <img src="/assets/img/about/about-square-12.webp" alt="About us" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
