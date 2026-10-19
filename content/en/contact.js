/**
 * Homepage contact call-to-action. The form itself lives in the contact popup,
 * which owns `#contact`; this section only opens it.
 */
export default function ContactSection() {
  return (
    <section id="contact-cta" className="contact-cta section">
      <div className="container section-title mb-0 pb-0" data-aos="fade-up">
        <span className="subtitle">Contact</span>
        <h2>We&apos;d love to hear from you.</h2>
        <p>Tell us about your challenges and needs, and we will propose the support that fits best.</p>
        <div className="cta-section justify-content-center">
          <a href="#contact" data-contact-trigger="true" className="btn-primary">Contact Us →</a>
        </div>
      </div>
    </section>
  );
}
