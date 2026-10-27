import ContactForm from "../../../components/contact-form";
import SitePage from "../../../components/site-page";
import defaultSections from "../../../content/default/index.js";
import { pageMetadata } from "../../../lib/seo";

const LOCALE = "default";

export const metadata = pageMetadata("contact", LOCALE);

export default function ContactPage() {
  const Footer = defaultSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="contact" footer={<Footer />} scriptSuffix="-contact">
      <ContactForm locale={LOCALE} />
    </SitePage>
  );
}
