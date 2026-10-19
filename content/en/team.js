const MEMBERS = [
  {
    name: "Nhat Minh",
    title: "Team Manager",
    bio: "As Team Manager, he leads the team's direction while promoting smooth communication and high-quality creative delivery. He combines flexible thinking with strong execution to maximize results.",
  },
  {
    name: "Takahiko Nomoto",
    title: "Chief Executive Officer",
    bio: "An experienced leader who guides the organization in pursuing innovation and excellence. He delivers transformative solutions at the intersection of technology and business.",
  },
  {
    name: "Thao Nippon",
    title: "Creative Director",
    bio: "Specializes in visual storytelling to build brand identity. She skillfully integrates the latest design trends to create intuitive and engaging experiences that resonate with users.",
  },
  {
    name: "Hai Dang",
    title: "Head of Operations",
    bio: "A specialist in building and optimizing efficient business processes. From resource management to improving team performance, he creates a reliable foundation for achieving goals.",
  },
];

/** "Nhat Minh" -> "NM": the first letter of the first two words of a name. */
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export default function TeamSection() {
  return (
    <section id="team" className="team section light-background">
      <div className="container section-title">
        <span className="subtitle">Team</span>
        <h2>Meet Our Team</h2>
        <p>
          Behind-the-scenes professionals who support business growth.
          We operate from Japan and Vietnam to provide BPO services that streamline operations for small businesses and startups.
          We create systems that communicate in Japanese, operate overseas, and deliver results, supporting your challenges from the background.
        </p>
      </div>

      <div className="container">
        <div className="row gy-5">
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold">Key member</h3>
            </div>
          </div>

          {MEMBERS.map((member) => (
            <div className="col-lg-3 col-md-6" key={member.name}>
              <div className="team-member">
                {/* Initials until real photos of the members are supplied; no stock faces. */}
                <div className="member-img">
                  <div className="member-initials" aria-hidden="true">{initials(member.name)}</div>
                </div>
                <div className="member-info">
                  <h4>{member.name}</h4>
                  <span>{member.title}</span>
                  <p>{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
