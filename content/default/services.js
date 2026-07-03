export default function ServicesSection() {
  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Solutions</span>
        <h2>私たちが提供するもの</h2>
        <p>
          日々のルーティン業務から専門性の高いタスクまで、貴社のニーズに合わせた最適なソリューションを提供します。
          日本語対応のベトナム人材とAIの力を組み合わせることで、業務の精度とスピードを両立させ、企業のDXと成長を力強くバックアップします。
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-5">
          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div>
                <h3>BPO Service</h3>
                <p>データ入力、顧客管理、リスト整備など、日々のバックオフィス業務を幅広くサポートします。業務負荷を大幅に軽減し、貴社チームがコア業務に集中できる環境をつくります。</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-palette"></i>
              </div>
              <div>
                <h3>Sales Support</h3>
                <p>ターゲット精度の高い見込み顧客リストの作成から、アポイント獲得、メールマーケティングまで、営業活動を効率化します。成果に直結する仕組みづくりを支援し、成約率の向上に貢献します。</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-code-slash"></i>
              </div>
              <div>
                <h3>AI Utilization Support</h3>
                <p>AIツールの導入サポートや業務の自動化により、貴社のDX（デジタルトランスフォーメーション）を推進します。人とAIの最適な役割分担を設計し、生産性を最大化するワークフローを構築します。</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-megaphone"></i>
              </div>
              <div>
                <h3>Recruitment Support</h3>
                <p>候補者リストの作成から、スクリーニング、面接のスケジュール調整まで、採用活動のバックオフィス業務をトータルに代行します。煩雑な事務作業を切り離すことで、採用活動のスピードと質を大幅に向上させます。</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-people"></i>
              </div>
              <div>
                <h3>Team Building</h3>
                <p>日本語対応のベトナム人材を活用し、貴社の「もうひとつのチーム」を構築します。1名・数時間の小規模スタートから柔軟に対応し、企業の成長フェーズに合わせて最適なチーム体制をスケールアップさせることが可能です。</p>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div className="service-item">
              <div className="service-icon">
                <i className="bi bi-bar-chart"></i>
              </div>
              <div>
                <h3>Data Analysis and Organization</h3>
                <p>AIツールと人の判断を組み合わせ、大量のデータ入力やリスト整備、情報の構造化を効率的に行います。複雑なデータの整理を自動化・効率化することで、迅速な意思決定を支える高精度なデータ基盤を提供します。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
