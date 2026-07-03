import SitePage from "../components/site-page";
import defaultSections from "../content/default/index.js";

export default function HomePage() {
  const Hero = defaultSections.hero;
  const About = defaultSections.about;
  const Services = defaultSections.services;
  const WhyUs = defaultSections["why-us"];
  const Team = defaultSections.team;
  const Contact = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage locale="default" activePage="home" contact={<Contact />} footer={<Footer />}>
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Team />
    </SitePage>
  );
}
