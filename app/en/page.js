import SitePage from "../../components/site-page";
import enSections from "../../content/en/index.js";

export default function EnglishHomePage() {
  const Hero = enSections.hero;
  const About = enSections.about;
  const Services = enSections.services;
  const WhyUs = enSections["why-us"];
  const Team = enSections.team;
  const Contact = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage locale="en" activePage="home" contact={<Contact />} footer={<Footer />} scriptSuffix="-en">
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Team />
    </SitePage>
  );
}
