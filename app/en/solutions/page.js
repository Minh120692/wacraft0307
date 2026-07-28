import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

export default function EnglishSolutionsPage() {
  const Solutions = enSections.services;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="solutions"
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-solutions"
    >
      <Solutions />
    </SitePage>
  );
}
