import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalListings: 0, openListings: 0, resolvedListings: 0 });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ q: '', category: '', status: 'OPEN' });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function fetchItems(nextFilters = filters) {
    setLoading(true);
    try {
      const response = await client.get('/items', { params: nextFilters });
      setItems(response.data.items);
      setStats(response.data.stats);
      setCategories(response.data.categories);
      setFilters(response.data.filters);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function onChange(event) {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  function onSubmit(event) {
    event.preventDefault();
    fetchItems(filters);
  }

  function resetFilters() {
    const clean = { q: '', category: '', status: 'OPEN' };
    setFilters(clean);
    fetchItems(clean);
  }

  return (
    <>
      <section className="hero-big">
        <div>
          <p className="hero-label">Campus Utility Project</p>
          <h1>Lost something? Found something? Manage it from one place.</h1>
          <p>
            This MERN app is built as a student-friendly daily portal for reporting, searching, and recovering lost items.
          </p>
          <div className="hero-actions">
            {!user && (
              <>
                <Link to="/signup" className="btn btn-primary">Create account</Link>
                <Link to="/login" className="btn btn-muted">Login</Link>
              </>
            )}
            {user && (
              <>
                <Link to="/items/new" className="btn btn-primary">Post new item</Link>
                <Link to="/dashboard" className="btn btn-muted">Open dashboard</Link>
              </>
            )}
          </div>
        </div>
        <div className="stat-boxes">
          <article><p>Total Users</p><strong>{stats.totalUsers}</strong></article>
          <article><p>Total Listings</p><strong>{stats.totalListings}</strong></article>
          <article><p>Open Cases</p><strong>{stats.openListings}</strong></article>
        </div>
      </section>

      <section className="panel search-panel">
        <h2>Find Listings Quickly</h2>
        <form className="search-grid" onSubmit={onSubmit}>
          <input name="q" placeholder="Search by title, description, location" value={filters.q} onChange={onChange} />
          <select name="category" value={filters.category} onChange={onChange}>
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="OPEN">Open</option>
            <option value="CLAIMED">Claimed</option>
            <option value="RESOLVED">Resolved</option>
            <option value="ALL">All</option>
          </select>
          <button className="btn btn-primary" type="submit">Apply</button>
          <button className="btn btn-muted" type="button" onClick={resetFilters}>Reset</button>
        </form>
      </section>

      <section className="panel">
        <h2>Latest Listings</h2>
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No listings found for selected filters.</p>}
        <div className="cards-grid">
          {items.map((item) => (
            <article key={item._id} className="item-card">
              <div className="item-row">
                <span className="chip">{item.category}</span>
                <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description.slice(0, 130)}{item.description.length > 130 ? '...' : ''}</p>
              <p className="meta">Owner: {item.ownerId?.name || 'N/A'}</p>
              <Link to={`/items/${item._id}`} className="read-link">Open details</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
