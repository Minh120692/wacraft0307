const PARAGRAPHS = [
  "At Wa+Craft, we want to be the “other team” that Japanese companies can trust with their day-to-day work.",
  "To us, BPO is not simply about carving out tasks and handing them to someone else.",
  "We combine the flexibility of Vietnamese talent and careful communication in Japanese with the power of AI and IT and an eye for process improvement. In doing so, we aim not only to support the work in front of us but to build systems that are more efficient and can keep running. That is the BPO we are working toward.",
  "Rather than just carrying out the work our clients give us exactly as instructed, we approach each task asking “Why is this work needed?” and “Is there a better way?”",
  "Then we want our clients to put the time and resources this frees up toward the work they should be focusing on and toward growing their business.",
  "That is the value we want to provide.",
  "For small businesses, startups and any company aiming to grow with limited resources, we want to be a partner that provides just the work that is needed, combines it flexibly, and expands it as circumstances change.",
];

const CLOSING = "We will keep building up work that earns those words, one task at a time, and remain a partner who thinks and moves forward together with our clients, right beside them.";

export default function MessageSection() {
  return (
    <section id="message" className="message section">
      <div className="container section-title" data-aos="fade-up">
        <span className="subtitle">Message</span>
        <h2>A Message from Our Representative</h2>
      </div>

      <div className="container">
        <div className="row gy-5 align-items-start">
          <div className="col-lg-8">
            {PARAGRAPHS.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <p className="fw-bold">
              &ldquo;I&apos;m glad I asked them.&rdquo;<br />
              &ldquo;I&apos;m glad I left it to them.&rdquo;
            </p>
            <p>{CLOSING}</p>
          </div>

          <div className="col-lg-4">
            {/* Placeholder until a real photo of the representative is supplied. */}
            <figure className="text-center mb-0">
              <div className="portrait-placeholder light-background ratio ratio-1x1 rounded">
                <div className="d-flex align-items-center justify-content-center">
                  <img src="/assets/img/logo-mark.svg" alt="Wa+Craft" className="w-50" />
                </div>
              </div>
              <figcaption className="mt-3 fw-bold">Takahiko Nomoto, Representative</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
