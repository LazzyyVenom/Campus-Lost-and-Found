import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="panel hero-medium center-text">
      <h1>404 - Page not found</h1>
      <p>The page you are trying to open does not exist.</p>
      <Link className="btn btn-primary" to="/">Back to home</Link>
    </section>
  );
}
