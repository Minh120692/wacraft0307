import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

function WhyUsIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Why Choose Us</span>
        <h1>Why Clients Choose WA+CRAFT</h1>
        <p>This is the dedicated Why Choose Us page. It is ready to be expanded later with proof points, process details, and stronger sales content.</p>
      </div>
    </section>
  );
}

export default function EnglishWhyUsPage() {
  const WhyUs = enSections["why-us"];
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="why-us"
      intro={<WhyUsIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-why-us"
    >
      <WhyUs />
    </SitePage>
  );
}
