import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

function WhyUsIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Why Choose Us</span>
        <h1>選ばれる理由</h1>
        <p>WA+CRAFTの強みや選ばれる理由をまとめた独立ページです。ここをベースに実績、比較表、FAQなどをあとから追加しやすい構成にしています。</p>
      </div>
    </section>
  );
}

export default function WhyUsPage() {
  const WhyUs = defaultSections["why-us"];
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="why-us"
      intro={<WhyUsIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-why-us"
    >
      <WhyUs />
    </SitePage>
  );
}
