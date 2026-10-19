const VALUES = [
  {
    icon: "bi-people",
    title: "People",
    text: "We provide the resources you need, drawing on the expertise of Japanese-speaking Vietnamese talent.",
  },
  {
    icon: "bi-award",
    title: "Quality",
    text: "We take responsibility for every task and pursue careful, accurate work.",
  },
  {
    icon: "bi-gear-wide-connected",
    title: "Systems",
    text: "We use AI, automation and data to make work more efficient.",
  },
  {
    icon: "bi-arrows-move",
    title: "Flexibility",
    text: "We provide the services and resources you need, flexibly, according to your situation and needs.",
  },
];

export default function ValuesSection() {
  return (
    <section id="values" className="services section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Our Values</span>
        <h2>Wa+Craft&apos;s Four Values</h2>
        <p>People × Quality × Systems × Flexibility</p>
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
