import SitePage from "../components/site-page";
import defaultSections from "../content/default/index.js";
import { featuredPosts } from "../lib/blog";

const LOCALE = "default";

export default function HomePage() {
  const Hero = defaultSections.hero;
  const About = defaultSections.about;
  const Services = defaultSections.services;
  const BlogHighlights = defaultSections["blog-highlights"];
  const ContactCta = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="home" footer={<Footer />}>
      <Hero />
      <About />
      <Services />
      <BlogHighlights posts={featuredPosts(LOCALE)} />
      <ContactCta />
    </SitePage>
  );
}
