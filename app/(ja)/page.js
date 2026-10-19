import SitePage from "../../components/site-page";
import SiteJsonLd from "../../components/site-json-ld";
import defaultSections from "../../content/default/index.js";
import { featuredPosts } from "../../lib/blog";
import { pageMetadata } from "../../lib/seo";

const LOCALE = "default";

export const metadata = pageMetadata("home", LOCALE);

export default function HomePage() {
  const Hero = defaultSections.hero;
  const About = defaultSections.about;
  const Services = defaultSections.services;
  const BlogHighlights = defaultSections["blog-highlights"];
  const ContactCta = defaultSections.contact;
  const Footer = defaultSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="home" footer={<Footer />}>
      <SiteJsonLd locale={LOCALE} />
      <Hero />
      <About />
      <Services />
      <BlogHighlights posts={featuredPosts(LOCALE)} />
      <ContactCta />
    </SitePage>
  );
}
