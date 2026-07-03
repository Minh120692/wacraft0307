import SitePage from "../../../components/site-page";
import enSections from "../../../content/en/index.js";

function TeamIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title">
        <span className="subtitle">Team</span>
        <h1>Meet Our Team</h1>
        <p>This is the standalone team page for WA+CRAFT. You can later expand it with bios, roles, photos, and company culture content.</p>
      </div>
    </section>
  );
}

export default function EnglishTeamPage() {
  const Team = enSections.team;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage
      locale="en"
      activePage="team"
      intro={<TeamIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-en-team"
    >
      <Team />
    </SitePage>
  );
}
