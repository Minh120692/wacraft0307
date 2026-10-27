"use client";

import { useState } from "react";

import { CONTACT_EMAIL, sendContactForm } from "../lib/contact-form";

/**
 * Inlined by Next at build time; written out in full so it can be. Empty when
 * the build had no key, and then the page offers the email address instead.
 */
const ACCESS_KEY = (process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "").trim();

const copy = {
  default: {
    title: "お問い合わせ",
    subtitle: "Contact",
    description: [
      "サービスに関するご質問やご相談は、こちらからお気軽にお問い合わせください。",
      "48時間以内に、こちらから折り返しご連絡いたします。",
    ],
    formTitle: "お問い合わせはこちら",
    formLead: "お気軽に下記フォームにて送信ください。弊社担当よりご連絡させていただきます。",
    name: "氏名",
    email: "メールアドレス",
    subject: "件名",
    message: "メッセージ",
    preferred: "面談ご希望日時（任意）",
    sending: "送信中…",
    sent: "送信が完了しました。48時間以内にご連絡いたします。",
    error: `送信できませんでした。時間をおいて再度お試しいただくか、${CONTACT_EMAIL} までメールでご連絡ください。`,
    unavailable: `現在フォームからの送信を受け付けておりません。お手数ですが ${CONTACT_EMAIL} までメールでご連絡ください。`,
    submit: "メッセージを送る",
  },
  en: {
    title: "Contact Us",
    subtitle: "Contact",
    description: [
      "For questions or advice about our services, please feel free to contact us here.",
      "We will get back to you within 48 hours.",
    ],
    formTitle: "Contact form",
    formLead: "Fill in the form below and a member of our team will get back to you.",
    name: "Full Name",
    email: "Email Address",
    subject: "Subject",
    message: "Message",
    preferred: "Preferred meeting date and time (optional)",
    sending: "Sending…",
    sent: "Your message has been sent. We will respond within 48 hours.",
    error: `Your message could not be sent. Please try again later or email us at ${CONTACT_EMAIL}.`,
    unavailable: `The contact form is not available right now. Please email us at ${CONTACT_EMAIL}.`,
    submit: "Send Message",
  },
};

/** Renders `text` with the contact address in it as a mailto: link. */
function WithEmailLink({ text, linkClassName }) {
  const at = text.indexOf(CONTACT_EMAIL);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <a href={`mailto:${CONTACT_EMAIL}`} className={linkClassName}>
        {CONTACT_EMAIL}
      </a>
      {text.slice(at + CONTACT_EMAIL.length)}
    </>
  );
}

export default function ContactForm({ locale = "default" }) {
  /** idle | sending | sent | error */
  const [status, setStatus] = useState("idle");
  const t = copy[locale === "en" ? "en" : "default"];

  async function onSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    setStatus("sending");

    const next = await sendContactForm(fields, { accessKey: ACCESS_KEY, locale });
    if (next === "sent") form.reset();
    setStatus(next);
  }

  return (
    <section id="contact" className="contact section light-background">
      <div className="container section-title">
        <span className="subtitle">{t.subtitle}</span>
        <h1>{t.title}</h1>
        <p>
          {t.description.map((line, index) => (
            <span key={line}>
              {index > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      </div>

      <div className="container">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>{t.formTitle}</h2>
            {ACCESS_KEY && <p className="mt-2 mb-0">{t.formLead}</p>}
          </div>

          {!ACCESS_KEY ? (
            <p className="mb-0">
              <WithEmailLink text={t.unavailable} />
            </p>
          ) : (
            <form className="php-email-form" onSubmit={onSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>{t.name}</label>
                    <input type="text" name="name" required />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>{t.email}</label>
                    <input type="email" name="email" required />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>{t.subject}</label>
                <input type="text" name="subject" required />
              </div>

              <div className="form-group">
                <label htmlFor="projectMessage">{t.message}</label>
                <textarea name="message" id="projectMessage" rows="5" required></textarea>
              </div>

              <div className="form-group">
                <label>{t.preferred}</label>
                <div className="row g-2">
                  <div className="col-md-5">
                    <input type="date" id="preferredDate" name="preferred_date" className="form-control" placeholder="YYYY-MM-DD" />
                  </div>
                  <div className="col-md-3">
                    <select id="preferredHour" name="preferred_hour" className="form-control">
                      <option value="">Hour</option>
                      <option value="01">01</option>
                      <option value="02">02</option>
                      <option value="03">03</option>
                      <option value="04">04</option>
                      <option value="05">05</option>
                      <option value="06">06</option>
                      <option value="07">07</option>
                      <option value="08">08</option>
                      <option value="09">09</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select id="preferredMinute" name="preferred_minute" className="form-control">
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <select id="preferredPeriod" name="preferred_period" className="form-control">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Honeypot: hidden from people, so only a bot fills it in. */}
              <input
                type="text"
                name="botcheck"
                className="visually-hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="my-3" aria-live="polite">
                {status === "sending" && <div className="loading d-block">{t.sending}</div>}
                {status === "error" && (
                  <div className="error-message d-block">
                    <WithEmailLink text={t.error} linkClassName="text-white text-decoration-underline" />
                  </div>
                )}
                {status === "sent" && <div className="sent-message d-block">{t.sent}</div>}
              </div>

              <button type="submit" className="submit-btn" disabled={status === "sending"}>
                <span>{t.submit}</span>
                <i className="bi bi-arrow-right"></i>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
