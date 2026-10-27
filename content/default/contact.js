import { pageHref } from "../../lib/site-content.js";

/** Homepage contact call-to-action, linking to the contact page that holds the form. */
export default function ContactSection() {
  return (
    <section id="contact-cta" className="contact-cta section">
      <div className="container section-title mb-0 pb-0" data-aos="fade-up">
        <span className="subtitle">Contact</span>
        <h2>お気軽に、お話をお聞かせください。</h2>
        <p>お客様の課題やご要望に合わせて、最適なサポートをご提案いたします。</p>
        <div className="cta-section justify-content-center">
          <a href={pageHref("contact", "default")} className="btn-primary">お問い合わせ →</a>
        </div>
      </div>
    </section>
  );
}
