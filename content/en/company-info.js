const BUSINESS = [
  "EC Operations Support",
  "BPO & Process Improvement",
  "Digital Marketing Support",
  "Video Production Support",
  "Sales & CRM Support",
];

const STAFF = [
  "Japanese JLPT N1 × 1",
  "Japanese JLPT N2 × 2",
  "IT specialists × 2",
  "Accounting × 1",
];

const ROWS = [
  { label: "Company name", value: "Wa+Craft Co., Ltd." },
  { label: "Representative", value: "Takahiko Nomoto" },
  { label: "Address", value: "15 Ngo Thi Si Street, Ngu Hanh Son Ward, Da Nang City, Vietnam" },
  {
    label: "Enterprise registration no.",
    value: "0402324942 (Da Nang City Department of Planning and Investment)",
  },
  {
    label: "TEL",
    value: (
      <>
        <span className="text-nowrap">+81 70 9103 1967 (Japan)</span> /{" "}
        <span className="text-nowrap">+84 91 723 1967 (Vietnam)</span>
      </>
    ),
  },
  { label: "Established", value: "March 3, 2026" },
  { label: "Capital", value: "500,000,000 VND" },
  { label: "Business", value: BUSINESS },
  { label: "Staff", value: STAFF },
];

export default function CompanyInfoSection() {
  return (
    <section id="company" className="company-info section light-background">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Company Info</span>
        <h2>Company Overview</h2>
      </div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="table-responsive">
              <table className="table mb-0">
                <tbody>
                  {ROWS.map(({ label, value }) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
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
