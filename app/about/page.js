import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

function AboutIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">About Us</span>
        <h1>私たちについて</h1>
        <p>
          当社は、EC運営、SEO・SNSマーケティング、ショート動画制作、リード獲得支援を一貫して提供し、お客様の集客・販売促進・営業成果向上を支援します。
          日本語対応可能な専門チームが、商品登録、コンテンツ制作、SNS運用、動画編集、顧客リスト作成、メール配信、CRM運用まで幅広く対応します。
          人材力、ITツール、自動化、データ分析を活用し、低コストで高品質な運用体制を構築。お客様の売上拡大と業務効率化を同時に実現します。
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const About = defaultSections.about;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="about"
      intro={<AboutIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-about"
    >
      <About />
    </SitePage>
  );
}
