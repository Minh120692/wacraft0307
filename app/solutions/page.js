import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

export default function SolutionsPage() {
  const Solutions = defaultSections.services;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="solutions"
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-solutions"
    >
      <Solutions />
    </SitePage>
  );
}
