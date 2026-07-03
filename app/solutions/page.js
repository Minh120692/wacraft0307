import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

function SolutionsIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Solutions</span>
        <h1>サービス一覧</h1>
        <p>WA+CRAFTが提供するソリューションをまとめた独立ページです。今は既存デザインを引き継いだベースとして用意してあり、あとから自由に内容を整理できます。</p>
      </div>
    </section>
  );
}

export default function SolutionsPage() {
  const Solutions = defaultSections.services;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="solutions"
      intro={<SolutionsIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-solutions"
    >
      <Solutions />
    </SitePage>
  );
}
