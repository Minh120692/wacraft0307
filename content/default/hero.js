export default function HeroSection() {
  return (
    <section id="hero" className="hero section light-background">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1>AIーBPO × 日本語対応   <br /> ベトナムチームで、業務を受託</h1>
              <p className="fw-bold">日本語で伝わる。海外で動く。成果が返ってくる。</p>
              <p className="mb-5">
                日本語対応のベトナム人材とAIを組み合わせ、業務の精度とスピードを両立。
                中小企業、スタートアップ企業を支える、柔軟で拡張性の高いサービスを提供します。
              </p>
              <div className="hero-cta">
                <a href="/about" className="btn-primary">まずは相談する</a>
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
