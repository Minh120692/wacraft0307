/**
 * Homepage contact call-to-action. The form itself lives in the contact popup,
 * which owns `#contact`; this section only opens it.
 */
export default function ContactSection() {
  return (
    <section id="contact-cta" className="contact-cta section">
      <div className="container section-title mb-0 pb-0" data-aos="fade-up">
        <span className="subtitle">Contact</span>
        <h2>お気軽に、お話をお聞かせください。</h2>
        <p>お客様の課題やご要望に合わせて、最適なサポートをご提案いたします。</p>
        <div className="cta-section justify-content-center">
          <a href="#contact" data-contact-trigger="true" className="btn-primary">お問い合わせ →</a>
        </div>
      </div>
    </section>
  );
}
