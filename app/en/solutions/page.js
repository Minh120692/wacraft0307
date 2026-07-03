import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

function SolutionsIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Solutions</span>
        <h1>Solutions Overview</h1>
        <p>This is the standalone solutions page for WA+CRAFT. It keeps the current design as a starting point so you can refine the copy and structure later.</p>
      </div>
    </section>
  );
}

export default function EnglishSolutionsPage() {
  const Solutions = enSections.services;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="solutions"
      intro={<SolutionsIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-solutions"
    >
      <Solutions />
    </SitePage>
  );
}
