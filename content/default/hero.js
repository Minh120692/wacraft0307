export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <p className="small fw-bold text-uppercase mb-3">BPO × AI × BUSINESS SUPPORT</p>
              <h1>人材不足時代でも、<br />事業成長を止めない。</h1>
              <p className="mb-3">
                日本語対応可能なベトナムチームとAI・業務改善を組み合わせ、<br />
                EC運営、デジタルマーケティング、動画制作、営業支援まで。
              </p>
              <p className="mb-5">
                中小企業・スタートアップ企業の成長に合わせ、必要な業務を柔軟に組み合わせ、拡張できるサービスを提供します。
              </p>
              <div className="hero-cta">
                <a href="#contact" data-contact-trigger="true" className="btn-primary">お問い合わせ →</a>
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
