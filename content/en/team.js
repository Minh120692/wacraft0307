export default function TeamSection() {
  return (
    <section id="team" className="team section light-background">
      <div className="container section-title">
        <span className="subtitle">Team</span>
        <h2>Meet Our Team</h2>
        <p>
          Behind-the-scenes professionals who support business growth.
          We operate from Japan and Vietnam to provide BPO services that streamline operations for small businesses and startups.
          We create systems that communicate in Japanese, operate overseas, and deliver results, supporting your challenges from the background.
        </p>
      </div>

      <section id="director" className="director section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="director-content">
                <div className="director-info mt-4">
                  <h4>Takahiko Nomoto</h4>
                  <p className="text-muted">Takahiko Nomoto - Chief Technology Officer (CEO)</p>
                  <p>As an experienced leader, I guide organizations toward innovation and the pursuit of excellence. I deliver transformative solutions at the intersection of technology and business.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="director-image">
                <img src="/assets/img/person/person-m-12.webp" alt="Director Profile" className="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="row gy-5">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold">Key member</h3>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/person/person-f-8.webp" className="img-fluid" alt="Nhat Minh" loading="lazy" />
              </div>
              <div className="member-info">
                <h4>Nhat Minh</h4>
                <span>Team Manager</span>
                <p>As Team Manager, he leads the team&apos;s direction while promoting smooth communication and high-quality creative delivery. He combines flexible thinking with strong execution to maximize results.</p>
                <div className="social">
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/person/person-m-12.webp" className="img-fluid" alt="Takahiko Nomoto" loading="lazy" />
              </div>
              <div className="member-info">
                <h4>Takahiko Nomoto</h4>
                <span>Chief Technology Officer</span>
                <p>An experienced leader who guides the organization in pursuing innovation and excellence. He delivers transformative solutions at the intersection of technology and business.</p>
                <div className="social">
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-github"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/person/person-f-3.webp" className="img-fluid" alt="Thao Nippon" loading="lazy" />
              </div>
              <div className="member-info">
                <h4>Thao Nippon</h4>
                <span>Creative Director</span>
                <p>Specializes in visual storytelling to build brand identity. She skillfully integrates the latest design trends to create intuitive and engaging experiences that resonate with users.</p>
                <div className="social">
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-dribbble"></i></a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/person/person-m-7.webp" className="img-fluid" alt="Hai Dang" loading="lazy" />
              </div>
              <div className="member-info">
                <h4>Hai Dang</h4>
                <span>Head of Operations</span>
                <p>A specialist in building and optimizing efficient business processes. From resource management to improving team performance, he creates a reliable foundation for achieving goals.</p>
                <div className="social">
                  <a href="#"><i className="bi bi-twitter-x"></i></a>
                  <a href="#"><i className="bi bi-linkedin"></i></a>
                  <a href="#"><i className="bi bi-facebook"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
