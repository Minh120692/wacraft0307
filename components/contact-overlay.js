"use client";

import { useEffect, useState } from "react";

const copy = {
  default: {
    title: "問い合わせ",
    subtitle: "Contact Us",
    description: [
      "まずはお気軽にご相談ください。",
      "業務内容の整理から、最適なプランのご提案まで、無料でサポートいたします。",
      "小さな業務からでも、すぐに始められます。",
      "24〜48時間以内に、こちらから折り返しご連絡いたします。",
    ],
    formTitle: "メッセージを送る",
    name: "フルネーム",
    email: "メールアドレス",
    subject: "件名",
    message: "メッセージ",
    preferred: "ご都合の良い日時（任意）",
    loading: "読み込み中",
    sent: "24時間から48時間以内にご連絡いたします。",
    submit: "メッセージを送る",
  },
  en: {
    title: "Get in Touch",
    subtitle: "Contact Us",
    description: [
      "Please feel free to contact us first.",
      "We provide free support from clarifying your operational needs to proposing the best plan.",
      "You can start with small tasks right away.",
      "We will get back to you within 24-48 hours.",
    ],
    formTitle: "Send a Message",
    name: "Full Name",
    email: "Email Address",
    subject: "Subject",
    message: "Message",
    preferred: "Preferred date/time (optional)",
    loading: "Loading",
    sent: "We will respond within 24-48 hours.",
    submit: "Send Message",
  },
};

export default function ContactOverlay({ locale = "default" }) {
  const [open, setOpen] = useState(false);
  const t = copy[locale === "en" ? "en" : "default"];

  useEffect(() => {
    function onClick(event) {
      const trigger = event.target.closest('[data-contact-trigger="true"], a[href="#contact"]');
      if (!trigger) return;
      event.preventDefault();
      setOpen(true);
    }

    function onKeyDown(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="floating-contact-btn"
        aria-label="Open contact form"
        onClick={() => setOpen(true)}
      >
        <i className="bi bi-chat-dots-fill"></i>
      </button>

      <div
        id="contactPopup"
        className={`contact-popup${open ? " active" : ""}`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setOpen(false);
          }
        }}
      >
        <div className="contact-popup-content">
          <button
            type="button"
            className="close-popup"
            id="closePopup"
            aria-label="Close contact form"
            onClick={() => setOpen(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>

          <section id="contact" className="contact section light-background">
            <div className="container section-title">
              <span className="subtitle">{t.subtitle}</span>
              <h2>{t.title}</h2>
              <p>
                {t.description[0]}<br />
                {t.description[1]}<br />
                {t.description[2]}<br />
                {t.description[3]}
              </p>
            </div>

            <div className="container">
              <div className="row gy-4">
                <div className="col-lg-12">
                  <div className="form-wrapper">
                    <div className="form-header">
                      <h3>{t.formTitle}</h3>
                    </div>

                    <form action="/api/contact" method="post" className="php-email-form">
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
                            <input type="date" id="preferredDate" className="form-control" placeholder="YYYY-MM-DD" />
                          </div>
                          <div className="col-md-3">
                            <select id="preferredHour" className="form-control">
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
                            <select id="preferredMinute" className="form-control">
                              <option value="00">00</option>
                              <option value="15">15</option>
                              <option value="30">30</option>
                              <option value="45">45</option>
                            </select>
                          </div>
                          <div className="col-md-2">
                            <select id="preferredPeriod" className="form-control">
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </div>
                        <input type="hidden" id="preferredDatetime" name="preferred_datetime" />
                      </div>

                      <div className="my-3">
                        <div className="loading">{t.loading}</div>
                        <div className="error-message"></div>
                        <div className="sent-message">{t.sent}</div>
                      </div>

                      <button type="submit" className="submit-btn">
                        <span>{t.submit}</span>
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
