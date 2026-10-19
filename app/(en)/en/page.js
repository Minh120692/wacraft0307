import SitePage from "../../components/site-page";
import enSections from "../../content/en/index.js";
import { featuredPosts } from "../../lib/blog";

const LOCALE = "en";

export default function EnglishHomePage() {
  const Hero = enSections.hero;
  const About = enSections.about;
  const Services = enSections.services;
  const BlogHighlights = enSections["blog-highlights"];
  const ContactCta = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="home" footer={<Footer />} scriptSuffix="-en">
      <Hero />
      <About />
      <Services />
      <BlogHighlights posts={featuredPosts(LOCALE)} />
      <ContactCta />
    </SitePage>
  );
}
