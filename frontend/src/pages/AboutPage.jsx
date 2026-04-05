export default function AboutPage() {
  return (
    <>
      <section className="panel hero-medium">
        <p className="hero-label">Why This Site</p>
        <h1>Why we built this Lost and Found platform</h1>
        <p>
          Students lose keys, ID cards, notes, and devices almost every week. We built this app so there is one official place to report and recover lost items.
        </p>
      </section>

      <section className="three-cols">
        <article className="panel">
          <h3>Student-friendly flow</h3>
          <p>Simple forms, clear statuses, and quick claim process for daily usage.</p>
        </article>
        <article className="panel">
          <h3>Trust and safety</h3>
          <p>Logged-in users, admin-only audit data, and controlled item updates.</p>
        </article>
        <article className="panel">
          <h3>Real project value</h3>
          <p>Built with MERN in a clean architecture suitable for college submission and demo.</p>
        </article>
      </section>
    </>
  );
}
