import SitePage from "../../../components/site-page";
import defaultSections from "../../../content/default/index.js";
import { pageMetadata } from "../../../lib/seo";

export const metadata = pageMetadata("about", "default");

function AboutIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">About Us</span>
        <h1>会社情報</h1>
        <p className="lead fw-bold mb-4">日本とベトナムの力を、ひとつの価値に。</p>
        <p className="mb-3">
          日本企業が培ってきた仕事へのこだわりと、ベトナム人材が持つ柔軟性や可能性。<br />
          Wa+Craftは、両国それぞれの強みを活かし、人材・AI・IT・業務改善を組み合わせることで、企業の業務をより良いかたちへ変えていきます。
        </p>
        <p>
          単なる業務代行ではなく、お客様と共に考え、必要な業務を必要な分だけ柔軟に支える。<br />
          それが、私たちWa+Craftの目指すBPOです。
        </p>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const Message = defaultSections.message;
  const CompanyInfo = defaultSections["company-info"];
  const Values = defaultSections.values;
  const Team = defaultSections.team;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="about"
      intro={<AboutIntro />}
      footer={<Footer />}
      scriptSuffix="-about"
    >
      <Message />
      <CompanyInfo />
      <Values />
      <Team />
    </SitePage>
  );
}
