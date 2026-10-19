const PARAGRAPHS = [
  "Wa+Craftは、日本企業の皆様にとって、日々の業務を安心して任せられる「もうひとつのチーム」でありたいと考えています。",
  "私たちが考えるBPOは、単に業務を外部に切り出し、代行することではありません。",
  "ベトナム人材の柔軟性と、日本語での丁寧なコミュニケーション。そこにAI・ITの力と業務改善の視点を組み合わせることで、目の前の業務を支えるだけでなく、より効率的で、継続して運用できる仕組みをつくること。それが、私たちの目指すBPOです。",
  "お客様からいただいた業務を、決められた通りに進めるだけではなく、「なぜこの業務が必要なのか」「もっと良い方法はないか」という視点を持って、一つひとつの仕事に向き合う。",
  "そして、そこで生まれた時間やリソースを、本来注力すべき仕事や事業の成長につなげていただく。",
  "それが、私たちが提供したい価値です。",
  "中小企業やスタートアップ企業をはじめ、限られたリソースの中で成長を目指す企業にとって、必要な業務を必要な分だけ、柔軟に組み合わせ、状況に応じて広げていける存在でありたいと考えています。",
];

const CLOSING = "そう思っていただける仕事を、一つひとつ積み重ねながら、お客様のそばで共に考え、共に歩むパートナーであり続けます。";

export default function MessageSection() {
  return (
    <section id="message" className="message section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Message</span>
        <h2>代表挨拶</h2>
      </div>

      <div className="container">
        <div className="row gy-5 align-items-start">
          <div className="col-lg-8">
            {PARAGRAPHS.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="fw-bold">
              「相談してよかった」<br />
              「任せてよかった」
            </p>
            <p>{CLOSING}</p>
          </div>

          <div className="col-lg-4">
            {/* Placeholder until a real photo of the representative is supplied. */}
            <figure className="text-center mb-0">
              <div className="portrait-placeholder light-background ratio ratio-1x1 rounded">
                <div className="d-flex align-items-center justify-content-center">
                  <img src="/assets/img/logo-mark.svg" alt="Wa+Craft" className="w-50" />
                </div>
              </div>
              <figcaption className="mt-3 fw-bold">代表 野本 享彦</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
