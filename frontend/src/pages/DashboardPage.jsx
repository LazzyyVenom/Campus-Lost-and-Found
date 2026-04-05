import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const error = '';

  return (
    <>
      <section className="hero-big hero-public">
        <div>
          <p className="hero-label">Legacy Page</p>
          <h1>Use My Posts instead of Dashboard</h1>
          <p>
            The redesigned app uses Home, Browse Items, Report Lost Item, Report Found Item, and My Posts for the full workflow.
          </p>
        </div>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="panel">
        <h2>Go to the new workflow</h2>
        <p>This page is kept for compatibility only.</p>
        <Link className="btn btn-gold" to="/my-posts">Open My Posts</Link>
      </section>
    </>
  );
}
