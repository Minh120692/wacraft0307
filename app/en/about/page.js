import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

function AboutIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">About Us</span>
        <h1>Company Information</h1>
        <p className="lead fw-bold mb-4">The strengths of Japan and Vietnam, combined into one.</p>
        <p className="mb-3">
          The care for craft that Japanese companies have built up, and the flexibility and potential of Vietnamese talent.<br />
          Wa+Craft draws on the strengths of both countries and combines people, AI, IT and process improvement to change the way companies work for the better.
        </p>
        <p>
          Not simply doing tasks on your behalf, but thinking alongside you and flexibly supporting just the work you need.<br />
          That is the BPO we at Wa+Craft are working toward.
        </p>
      </div>
    </section>
  );
}

export default function EnglishAboutPage() {
  const Message = enSections.message;
  const CompanyInfo = enSections["company-info"];
  const Values = enSections.values;
  const Team = enSections.team;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="about"
      intro={<AboutIntro />}
      footer={<Footer />}
      scriptSuffix="-en-about"
    >
      <Message />
      <CompanyInfo />
      <Values />
      <Team />
    </SitePage>
  );
}
