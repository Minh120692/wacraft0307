const BUSINESS = [
  "EC運営支援",
  "BPO・業務改善支援",
  "デジタルマーケティング支援",
  "動画制作支援",
  "Sales・CRM支援",
];

const STAFF = ["日本語 N1 × 1名", "日本語 N2 × 2名", "IT人材 × 2名", "経理担当 × 1名"];

const ROWS = [
  { label: "会社名", value: "Wa+Craft 有限会社" },
  { label: "代表者", value: "野本 享彦" },
  { label: "所在地", value: "15 Ngo Thi Si Street, Ngu Hanh Son Ward, Da Nang City, Vietnam" },
  { label: "企業登録番号", value: "0402324942（ダナン市計画投資局）" },
  {
    label: "TEL",
    value: (
      <>
        <span className="text-nowrap">+81 70 9103 1967（日本）</span> /{" "}
        <span className="text-nowrap">+84 91 723 1967（ベトナム）</span>
      </>
    ),
  },
  { label: "設立", value: "2026年3月3日" },
  { label: "資本金", value: "500,000,000 VND" },
  { label: "事業内容", value: BUSINESS },
  { label: "人材", value: STAFF },
];

export default function CompanyInfoSection() {
  return (
    <section id="company" className="company-info section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Company Info</span>
        <h2>会社概要</h2>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  {ROWS.map(({ label, value }) => (
                    <tr key={label}>
                      <th scope="row" className="text-nowrap">{label}</th>
                      <td>
                        {Array.isArray(value) ? (
                          <ul className="list-unstyled mb-0">
                            {value.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
