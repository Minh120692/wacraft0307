import { solutionHref } from "../../lib/site-content.js";

const LOCALE = "en";

/** Homepage cards: the short copy from the HOMEPAGE tab, not the solutions-page text. */
const SERVICES = [
  {
    key: "ec",
    icon: "bi-cart3",
    name: "EC Operations Support",
    catch: "Run your online stores more efficiently.",
    text: "From product listings and inventory management to promotions and data reports, we support your marketplace operations end to end.",
    malls: "Rakuten / Amazon / Yahoo! Shopping / LINE Shopping",
  },
  {
    key: "bpo",
    icon: "bi-diagram-3",
    name: "Business Process Outsourcing",
    catch: "Make everyday work run more smoothly.",
    text: "From routine tasks such as data entry and processing to IT tools and automation, we help you work more efficiently.",
  },
  {
    key: "marketing",
    icon: "bi-megaphone",
    name: "Digital Marketing Support",
    catch: "Digital tools that bring in customers.",
    text: "We support a wide range of digital marketing, including SEO, social media, website management and traffic analysis.",
  },
  {
    key: "video",
    icon: "bi-camera-video",
    name: "Video Production Support",
    catch: "Videos that get your message across and grow your business.",
    text: "We produce product videos, ad videos and more for use in e-commerce and social media marketing.",
  },
  {
    key: "sales",
    icon: "bi-person-lines-fill",
    name: "Sales & CRM Support",
    catch: "Sell more efficiently.",
    text: "From building prospect lists to email outreach, appointment setting and CRM management, we support your sales activities.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Solutions</span>
        <h2>What We Offer</h2>
        <p>
          From routine daily tasks to specialized assignments, we provide tailored solutions to meet your needs.
          By combining Japanese-speaking Vietnamese professionals with AI, we deliver both precision and speed to support your company&apos;s DX and growth.
        </p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row gy-5">
          {SERVICES.map((service) => (
            <div className="col-lg-4 col-md-6" key={service.key}>
              <div className="service-item">
                <div className="service-icon">
                  <i className={`bi ${service.icon}`} aria-hidden="true"></i>
                </div>
                <div className="d-flex flex-column">
                  <h3>{service.name}</h3>
                  <p className="fw-bold mb-2">{service.catch}</p>
                  <p className={service.malls ? "mb-3" : undefined}>{service.text}</p>
                  {service.malls ? <p className="small">{service.malls}</p> : null}
                  <a href={solutionHref(LOCALE, service.key)} className="service-link">
                    <span aria-hidden="true">→</span> Learn more
                    <span className="visually-hidden"> about {service.name}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
