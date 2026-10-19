import { pageHref } from "../../lib/site-content.js";

export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>日本とベトナムの力を、ひとつの価値に。</h2>
              <p className="lead">
                日本企業が培ってきた仕事へのこだわりと、ベトナム人材が持つ柔軟性や可能性。<br />
                Wa+Craftは、それぞれの強みを掛け合わせることで、新しい価値を生み出せると考えています。
              </p>
              <p>そして、人材だけに頼るのではなく、AI・業務改善を組み合わせることで、単なる業務代行ではないBPOを目指しています。</p>
              <p>中小企業・スタートアップ企業が抱える業務の「手間」を減らし、より効率的で、継続的に成長できる仕組みへ。</p>
              <p>日本とベトナム、それぞれの強みを活かし、お客様にとっての「もうひとつのチーム」として、業務と事業の成長を支えます。</p>

              <div className="cta-section">
                <a href={pageHref("about", "default")} className="btn-outline">私たちについて →</a>
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
