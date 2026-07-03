export default function FooterSection() {
  return (
    <footer id="footer" className="footer dark-background">
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-5 col-md-12 footer-about">
            <a href="/en" className="logo d-flex align-items-center flex-direction-column">
              <img src="/assets/img/logo-removebg-preview.png" alt="WA+CRAFT logo" className="logo-img" />
            </a>
            <div className="brand-text">
              <h4 className="mb-0">WA+CRAFT</h4>
              <p className="tagline mb-0" style={{ fontSize: "0.95rem", opacity: 0.85 }}>Harmony Through Craftsmanship</p>
            </div>
          </div>

          <div className="col-lg-2 col-6 footer-links">
            <h4>Useful</h4>
            <ul>
              <li><a href="/en">Home</a></li>
              <li><a href="/en/about">About</a></li>
              <li><a href="/en/solutions">Services</a></li>
              <li><a href="/en/why-us">Why Choose Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6 footer-links">
            <h4>Services</h4>
            <ul>
              <li><a href="/en/solutions">BPO Services</a></li>
              <li><a href="/en/solutions">Sales Support</a></li>
              <li><a href="/en/solutions">AI Utilization Support</a></li>
              <li><a href="/en/solutions">Recruitment Support</a></li>
              <li><a href="/en/solutions">Data Analysis &amp; Organization</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-12 footer-contact text-center text-md-start">
            <h4>Contact</h4>
            <p><i className="bi bi-geo-alt-fill me-2" aria-hidden="true"></i>15 Ngo Thi Si Street, Ngu Hanh Son Ward, Da Nang City, Vietnam</p>
            <p className="mt-4"><i className="bi bi-telephone-fill me-2" aria-hidden="true"></i><span>+84 91 723 1967 (VN)</span></p>
            <p><i className="bi bi-telephone-fill me-2" aria-hidden="true"></i><span>+81 70 9103 1967 (JP)</span></p>
            <p><i className="bi bi-envelope-fill me-2" aria-hidden="true"></i><a href="mailto:nomoto-t@wacraft-jp.com">nomoto-t@wacraft-jp.com</a></p>
            <p><i className="bi bi-globe me-2" aria-hidden="true"></i>www.wacraft-jp.com</p>
          </div>
        </div>
      </div>
      <div className="container copyright text-center mt-4"></div>
    </footer>
  );
}
