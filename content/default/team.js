export default function TeamSection() {
  return (
    <section id="team" className="team section light-background">
      <div className="container section-title">
        <span className="subtitle">Team</span>
        <h2>私たちのチームを紹介します</h2>
        <p>
          企業の成長を支える、裏方のプロフェッショナル。
          私たちは、日本とベトナムを拠点に、中小企業・スタートアップの業務効率化を支援するBPOサービスを提供しています。
          「日本語で伝わる」「海外で動く」「成果が返ってくる」仕組みをつくり、企業の挑戦を裏側から支えます。
        </p>
      </div>

      <section id="director" className="director section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="director-content">
                <div className="director-info mt-4">
                  <h4>Takahiko Nomoto</h4>
                  <p className="text-muted">野本 隆彦 – 最高技術責任者（CEO）</p>
                  <p>経験豊富なリーダーとして、イノベーションと卓越性の追求を組織に導いています。テクノロジーとビジネスの交点で、変革的なソリューションを実現しています。</p>
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
              <span>主要メンバー</span>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="team-member">
              <div className="member-img">
                <img src="/assets/img/person/person-f-8.webp" className="img-fluid" alt="Nhat Minh" loading="lazy" />
              </div>
              <div className="member-info">
                <h4>Nhat Minh</h4>
                <span>チームマネージャー</span>
                <p>チームマネージャーとして、チームの方向性を統括しながら、円滑なコミュニケーションと高品質なクリエイティブ制作を推進しています。柔軟な発想と実行力を活かし、魅力的なコンテンツと成果の最大化を目指しています。</p>
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
                <span>最高技術責任者</span>
                <p>経験豊富なリーダーとして、イノベーションと卓越性の追求を組織に導いています。テクノロジーとビジネスの交点で、変革的なソリューションを実現しています。</p>
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
                <span>クリエイティブディレクター</span>
                <p>視覚的なストーリーテリングを通じて、ブランドのアイデンティティを確立します。最新のデザイン・トレンドを巧みに取り入れ、ユーザーの心に響く直感的で魅力的な体験を創造することを得意としています。</p>
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
                <span>オペレーション責任者</span>
                <p>効率的なビジネスプロセスの構築と最適化のスペシャリストです。リソース管理からチームのパフォーマンス向上まで、組織全体の運営を円滑にし、目標達成に向けた確実な土台を築きます。</p>
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
