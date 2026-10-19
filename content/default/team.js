const MEMBERS = [
  {
    name: "Nhat Minh",
    title: "チームマネージャー",
    bio: "チームマネージャーとして、チームの方向性を統括しながら、円滑なコミュニケーションと高品質なクリエイティブ制作を推進しています。柔軟な発想と実行力を活かし、魅力的なコンテンツと成果の最大化を目指しています。",
  },
  {
    name: "Takahiko Nomoto",
    title: "最高経営責任者",
    bio: "経験豊富なリーダーとして、イノベーションと卓越性の追求を組織に導いています。テクノロジーとビジネスの交点で、変革的なソリューションを実現しています。",
  },
  {
    name: "Thao Nippon",
    title: "クリエイティブディレクター",
    bio: "視覚的なストーリーテリングを通じて、ブランドのアイデンティティを確立します。最新のデザイン・トレンドを巧みに取り入れ、ユーザーの心に響く直感的で魅力的な体験を創造することを得意としています。",
  },
  {
    name: "Hai Dang",
    title: "オペレーション責任者",
    bio: "効率的なビジネスプロセスの構築と最適化のスペシャリストです。リソース管理からチームのパフォーマンス向上まで、組織全体の運営を円滑にし、目標達成に向けた確実な土台を築きます。",
  },
];

/** "Nhat Minh" -> "NM": the first letter of the first two words of a name. */
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

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

      <div className="container">
        <div className="row gy-5">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold">Key member</h3>
              <span>主要メンバー</span>
            </div>
          </div>

          {MEMBERS.map((member) => (
            <div className="col-lg-3 col-md-6" key={member.name}>
              <div className="team-member">
                {/* Initials until real photos of the members are supplied; no stock faces. */}
                <div className="member-img">
                  <div className="member-initials" aria-hidden="true">{initials(member.name)}</div>
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <span>{member.title}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
