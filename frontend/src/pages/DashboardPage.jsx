import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function DashboardPage() {
  const [myItems, setMyItems] = useState([]);
  const [claimedItems, setClaimedItems] = useState([]);
  const [error, setError] = useState('');

  async function loadData() {
    try {
      const response = await client.get('/items/dashboard');
      setMyItems(response.data.myItems);
      setClaimedItems(response.data.claimedItems);
    } catch {
      setError('Could not load dashboard data.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function resolveItem(id) {
    await client.post(`/items/${id}/resolve`);
    loadData();
  }

  async function deleteItem(id) {
    await client.delete(`/items/${id}`);
    loadData();
  }

  return (
    <>
      <section className="panel hero-medium">
        <h1>Your Dashboard</h1>
        <p>Manage posted and claimed items from one place.</p>
        <Link className="btn btn-primary" to="/items/new">Post New Item</Link>
      </section>

      {error && <p className="error-text">{error}</p>}

      <section className="panel">
        <h2>Your Posted Items</h2>
        <div className="cards-grid">
          {myItems.map((item) => (
            <article key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p>Status: {item.status}</p>
              <p>Claimed by: {item.claimedBy?.name || 'No one yet'}</p>
              <div className="actions">
                <Link className="btn btn-muted" to={`/items/${item._id}`}>Open</Link>
                {item.status !== 'RESOLVED' && (
                  <button className="btn btn-primary" onClick={() => resolveItem(item._id)} type="button">Resolve</button>
                )}
                <button className="btn btn-danger" onClick={() => deleteItem(item._id)} type="button">Delete</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Items You Claimed</h2>
        <div className="cards-grid">
          {claimedItems.map((item) => (
            <article key={item._id} className="item-card">
              <h3>{item.title}</h3>
              <p>Owner: {item.ownerId?.name || 'N/A'}</p>
              <p>Status: {item.status}</p>
              <Link className="read-link" to={`/items/${item._id}`}>View details</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
