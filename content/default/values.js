const VALUES = [
  {
    icon: "bi-people",
    title: "人材",
    text: "日本語対応可能なベトナム人材の専門性を活かし、必要なリソースを提供する。",
  },
  {
    icon: "bi-award",
    title: "品質",
    text: "一つひとつの業務に責任を持ち、丁寧かつ正確な仕事を追求する。",
  },
  {
    icon: "bi-gear-wide-connected",
    title: "仕組み",
    text: "AI・自動化・データを活用し、業務をより効率的にする。",
  },
  {
    icon: "bi-arrows-move",
    title: "柔軟性",
    text: "お客様の状況や必要に応じて、必要なサービスとリソースを柔軟に提供する。",
  },
];

export default function ValuesSection() {
  return (
    <section id="values" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Values</span>
        <h2>Wa+Craftの4つのバリュー</h2>
        <p>人材 × 品質 × 仕組み × 柔軟性</p>
      </div>

      <div className="container">
        <div className="row gy-4">
          {VALUES.map((value) => (
            <div className="col-md-6" key={value.title}>
              <div className="service-item">
                <div className="service-icon">
                  <i className={`bi ${value.icon}`} aria-hidden="true"></i>
                </div>
                <div>
                  <h3>{value.title}</h3>
                  <p className="mb-0">{value.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
