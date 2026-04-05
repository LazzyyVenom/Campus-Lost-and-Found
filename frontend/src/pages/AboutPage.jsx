export default function AboutPage() {
  return (
    <>
      <section className="hero-big hero-public">
        <div>
          <p className="hero-label">Why This Site</p>
          <h1>Why we built this Lost and Found platform</h1>
          <p>Students lose keys, ID cards, notes, and devices almost every week. This app gives one official place to report and recover items.</p>
        </div>
      </section>

      <section className="feature-grid panel">
        <h2>What this project solves</h2>
        <article>
          <h3>Student-friendly flow</h3>
          <p>Simple forms, clear statuses, and quick return process for daily usage.</p>
        </article>
        <article>
          <h3>Trust and safety</h3>
          <p>Logged-in users, admin-only audit data, and controlled item updates.</p>
        </article>
        <article>
          <h3>Real project value</h3>
          <p>Built with MERN in a clean architecture suitable for college submission and demo.</p>
        </article>
      </section>
    </>
  );
}
