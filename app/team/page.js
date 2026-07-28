import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

export default function TeamPage() {
  const Team = defaultSections.team;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="team"
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-team"
    >
      <Team />
    </SitePage>
  );
}
