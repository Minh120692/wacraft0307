export default function ContactSection() {
  return (
    <section id="contact" className="contact section light-background">
      <div className="container section-title">
        <span className="subtitle">Contact Us</span>
        <h2>Get in Touch</h2>
        <p>
          Please feel free to contact us first.<br />
          We provide free support from clarifying your operational needs to proposing the best plan.<br />
          You can start with small tasks right away.<br />
          We will get back to you within 24-48 hours.
        </p>
      </div>

      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-12">
            <div className="form-wrapper">
              <div className="form-header">
                <h3>Send a Message</h3>
              </div>

              <form action="/api/contact" method="post" className="php-email-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" name="name" required />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" name="email" required />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" name="subject" required />
                </div>

                <div className="form-group">
                  <label htmlFor="projectMessage">Message</label>
                  <textarea name="message" id="projectMessage" rows="5" required></textarea>
                </div>

                <div className="form-group">
                  <label>Preferred date/time (optional)</label>
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
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">We will respond within 24-48 hours.</div>
                </div>

                <button type="submit" className="submit-btn">
                  <span>Send Message</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
