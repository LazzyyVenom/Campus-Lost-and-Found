import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function BrowseItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ q: '', itemType: '', status: 'ALL', category: '' });

  async function fetchItems(nextFilters = filters) {
    const response = await client.get('/items', { params: nextFilters });
    setItems(response.data.items);
    setCategories(response.data.categories);
    setFilters(response.data.filters);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  function onChange(event) {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function onSubmit(event) {
    event.preventDefault();
    fetchItems(filters);
  }

  return (
    <>
      <section className="panel hero-medium">
        <h1>Browse Items</h1>
        <p>Search and filter lost and found posts.</p>
      </section>

      <section className="panel search-panel">
        <form className="search-grid" onSubmit={onSubmit}>
          <input name="q" placeholder="Search by item or location" value={filters.q} onChange={onChange} />
          <select name="itemType" value={filters.itemType} onChange={onChange}>
            <option value="">Lost + Found</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
          </select>
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="ALL">All status</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="RETURNED">Returned</option>
          </select>
          <select name="category" value={filters.category} onChange={onChange}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button className="btn btn-gold" type="submit">Apply</button>
        </form>
      </section>

      <section className="panel">
        <div className="cards-grid">
          {items.map((item) => (
            <article key={item._id} className="item-card">
              <div className="item-row">
                <span className="chip">{item.itemType}</span>
                <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description.slice(0, 120)}{item.description.length > 120 ? '...' : ''}</p>
              <p>
                <strong>Date:</strong> {new Date(item.incidentDate).toLocaleDateString()}
              </p>
              <Link className="read-link" to={`/items/${item._id}`}>View details</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
