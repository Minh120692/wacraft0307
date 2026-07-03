export default function WhyUsSection() {
  return (
    <section id="why-us" className="why-us section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Why choose us</span>
        <h2>選ばれる理由</h2>
        <p>提携先として当社が選ばれる理由は、単なるコスト削減に留まらず、日本品質のコミュニケーションと最新テクノロジーを融合させた「攻めのバックオフィス」を実現できる点にあります。</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>なぜ私たちは選ばれるのか？</h2>
              <p>提供いただいた資料に基づき、主な強みを整理しました。</p>
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
                  <p>AIツールと人の判断を組み合わせることで、スピードと精度を両立。単純作業から高度な業務まで、最適なワークフローを構築します。</p>
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
                  <p>日本語でのコミュニケーションが可能なスタッフが、正確かつ丁寧に業務を遂行します。文化的なニュアンスも理解し、安心して任せられる体制を整えています。</p>
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
                  <p>面倒な管理や調整はすべて当社が代行。国内と同じ感覚で、海外リソースを活用できます。</p>
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
                  <p>1名・数時間からスタートでき、必要に応じてスケールアップが可能。企業の成長フェーズに合わせて柔軟に対応します。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
