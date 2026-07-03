export default function AboutSection() {
  return (
    <section id="about" className="about section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="content">
              <h2>革新と献身を重ね、確かな成果を届けます。</h2>
              <p className="lead">私たちは、お客様の期待を超える成果を提供し、意味のある変革を推進することに情熱を注ぐプロフェッショナル集団です。</p>
              <p>日本とベトナムを拠点に、日本語対応が可能な優秀なベトナム人材と最新のAI技術を融合させたBPOサービスを提供しています。私たちのミッションは、中小企業やスタートアップ企業の皆様が直面する業務の「手間」を、確かな「成果」へと変えることです。</p>
              <p>単なる業務代行にとどまらず、スピード、品質、コストのバランスを最適化し、貴社の成長を加速させる「もうひとつのチーム」として寄り添います。海外リソース活用のハードルをゼロにし、国内と同じ感覚でスムーズな連携を実現します。</p>

              {/* <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="15" data-purecounter-duration="1"></div>
                  <div className="stat-label">経験年数</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="850" data-purecounter-duration="1"></div>
                  <div className="stat-label">完了したプロジェクト</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number purecounter" data-purecounter-start="0" data-purecounter-end="240" data-purecounter-duration="1"></div>
                  <div className="stat-label">満足したクライアント</div>
                </div>
              </div> */}

              <div className="cta-section">
                <a href="/team" className="btn-outline">チームに会う</a>
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
