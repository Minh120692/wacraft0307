import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

function AboutIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">About Us</span>
        <h1>About Our Team</h1>
        <p>
          This is a standalone About Us page for WA+CRAFT. You can freely expand or rewrite this page later while keeping the current site styling as the base.
        </p>
      </div>
    </section>
  );
}

export default function EnglishAboutPage() {
  const About = enSections.about;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="about"
      intro={<AboutIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-about"
    >
      <About />
    </SitePage>
  );
}
