import ContactForm from "../../../../components/contact-form";
import SitePage from "../../../../components/site-page";
import enSections from "../../../../content/en/index.js";
import { pageMetadata } from "../../../../lib/seo";

const LOCALE = "en";

export const metadata = pageMetadata("contact", LOCALE);

export default function ContactPage() {
  const Footer = enSections.footer;

  return (
    <SitePage locale={LOCALE} activePage="contact" footer={<Footer />} scriptSuffix="-contact">
      <ContactForm locale={LOCALE} />
    </SitePage>
  );
}
