import SitePage from "../../../components/site-page";
import SiteJsonLd from "../../../components/site-json-ld";
import enSections from "../../../content/en/index.js";
import { featuredPosts } from "../../../lib/blog";
import { pageMetadata } from "../../../lib/seo";

const LOCALE = "en";

export const metadata = pageMetadata("home", LOCALE);

export default function EnglishHomePage() {
  const Hero = enSections.hero;
  const About = enSections.about;
  const Services = enSections.services;
  const BlogHighlights = enSections["blog-highlights"];
  const ContactCta = enSections.contact;
  const Footer = enSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="home" footer={<Footer />} scriptSuffix="-en">
      <SiteJsonLd locale={LOCALE} />
      <Hero />
      <About />
      <Services />
      <BlogHighlights posts={featuredPosts(LOCALE)} />
      <ContactCta />
    </SitePage>
  );
}
