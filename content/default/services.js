import { solutionHref } from "../../lib/site-content.js";

const LOCALE = "default";

/** Homepage cards: the short copy from the HOMEPAGE tab, not the solutions-page text. */
const SERVICES = [
  {
    key: "ec",
    icon: "bi-cart3",
    name: "EC Operations Support",
    catch: "EC運営を、より効率的に。",
    text: "商品登録から在庫管理、販促、データレポートまで、ECモール運営を一貫してサポートします。",
    malls: "Rakuten / Amazon / Yahoo! Shopping / LINE Shopping",
  },
  {
    key: "bpo",
    icon: "bi-diagram-3",
    name: "Business Process Outsourcing",
    catch: "日々の業務を、もっとスムーズに。",
    text: "データ入力・処理などの定型業務から、ITツール活用や自動化まで、業務効率化を支援します。",
  },
  {
    key: "marketing",
    icon: "bi-megaphone",
    name: "Digital Marketing Support",
    catch: "デジタルの力で、集客を支える。",
    text: "SEO、SNS、Webサイト運営、アクセス分析など、デジタルマーケティングを幅広くサポートします。",
  },
  {
    key: "video",
    icon: "bi-camera-video",
    name: "Video Production Support",
    catch: "伝わる動画を、ビジネスの力に。",
    text: "ECやSNSマーケティングに活用できる商品紹介動画・広告動画などを制作します。",
  },
  {
    key: "sales",
    icon: "bi-person-lines-fill",
    name: "Sales & CRM Support",
    catch: "営業活動を、もっと効率的に。",
    text: "見込み顧客のリスト作成からメール配信、アポイント設定、CRM管理まで、営業活動を支援します。",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Solutions</span>
        <h2>私たちが提供するもの</h2>
        <p>
          日々のルーティン業務から専門性の高いタスクまで、貴社のニーズに合わせた最適なソリューションを提供します。
          日本語対応のベトナム人材とAIの力を組み合わせることで、業務の精度とスピードを両立させ、企業のDXと成長を力強くバックアップします。
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
                    <span aria-hidden="true">→</span> 詳しく見る
                    <span className="visually-hidden">（{service.name}）</span>
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
