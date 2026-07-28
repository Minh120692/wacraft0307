import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

export default function EnglishTeamPage() {
  const Team = enSections.team;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="team"
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-team"
    >
      <Team />
    </SitePage>
  );
}
