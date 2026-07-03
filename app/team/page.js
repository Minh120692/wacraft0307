import SitePage from "../../components/site-page";
import defaultSections from "../../content/default/index.js";

function TeamIntro() {
  return (
    <section className="page-title section light-background">
      <div className="container section-title">
        <span className="subtitle">Team</span>
        <h1>チーム紹介</h1>
        <p>WA+CRAFTのチームを紹介する独立ページです。今後、メンバープロフィールや役割、メッセージなどを整理して載せていけます。</p>
      </div>
    </section>
  );
}

export default function TeamPage() {
  const Team = defaultSections.team;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage
      locale="default"
      activePage="team"
      intro={<TeamIntro />}
      contact={<Contact />}
      footer={<Footer />}
      scriptSuffix="-team"
    >
      <Team />
    </SitePage>
  );
}
