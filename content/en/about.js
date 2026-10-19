import { pageHref } from "../../lib/site-content.js";

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>The strengths of Japan and Vietnam, combined into one.</h2>
              <p className="lead">
                The care for craft that Japanese companies have built up, and the flexibility and potential of Vietnamese talent.<br />
                At Wa+Craft, we believe that combining these strengths creates new value.
              </p>
              <p>And rather than relying on people alone, we add AI and process improvement, aiming for BPO that is more than simply doing tasks on your behalf.</p>
              <p>We reduce the busywork that small businesses and startups carry, and build systems that are more efficient and keep growing.</p>
              <p>Drawing on the strengths of both Japan and Vietnam, we support the growth of your operations and your business as your &ldquo;other team&rdquo;.</p>

              <div className="cta-section">
                <a href={pageHref("about", "en")} className="btn-outline">About Us →</a>
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
