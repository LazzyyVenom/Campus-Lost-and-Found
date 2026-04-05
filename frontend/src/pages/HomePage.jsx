import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchItems() {
      setLoading(true);
      try {
        const response = await client.get('/items', {
          params: {
            latest: 6,
            status: 'ALL',
          },
        });
        setItems(response.data.items);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  return (
    <>
      <section className="hero-big hero-public">
        <div>
          <p className="hero-label">Public Access</p>
          <h1>Lost Something? Find It Here!</h1>
          <p>Report lost items or help others by posting found items.</p>
          <div className="hero-actions">
            <Link to={user ? '/report/lost' : '/login'} className="btn btn-gold">
              Report Lost Item
            </Link>
            <Link to={user ? '/report/found' : '/login'} className="btn btn-outline-light">
              Report Found Item
            </Link>
          </div>
        </div>
      </section>

      <section className="panel how-grid">
        <h2>How It Works</h2>
        <article>
          <strong>Step 1</strong>
          <p>Post your lost item</p>
        </article>
        <article>
          <strong>Step 2</strong>
          <p>Someone finds it</p>
        </article>
        <article>
          <strong>Step 3</strong>
          <p>Contact and return</p>
        </article>
      </section>

      <section className="panel">
        <h2>Recent Lost & Found Items</h2>
        {loading && <p>Loading...</p>}
        {!loading && items.length === 0 && <p>No items yet.</p>}
        <div className="cards-grid">
          {items.map((item) => (
            <article key={item._id} className="item-card">
              <div className="item-row">
                <span className="chip">{item.itemType}</span>
                <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>
                <strong>Location:</strong>{' '}
                {item.itemType === 'LOST' ? (item.locationLost || 'Not mentioned') : (item.locationFound || 'Not mentioned')}
              </p>
              <p>
                <strong>Date:</strong> {new Date(item.incidentDate).toLocaleDateString()}
              </p>
              <Link to={`/items/${item._id}`} className="read-link">
                Open details
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel feature-grid">
        <h2>Features</h2>
        <article>
          <h3>Easy reporting</h3>
          <p>Post item details in a clean and simple form.</p>
        </article>
        <article>
          <h3>Quick contact</h3>
          <p>Direct contact with owner for quick return.</p>
        </article>
        <article>
          <h3>Secure system</h3>
          <p>Authenticated users and status tracking for trust.</p>
        </article>
      </section>

      <section className="cta-strip">
        <div>
          <h2>Help someone find their lost item</h2>
          <p>Your one post can solve someone’s stressful day.</p>
        </div>
        <Link to={user ? '/report/lost' : '/login'} className="btn btn-gold">
          Post Now
        </Link>
      </section>
    </>
  );
}
