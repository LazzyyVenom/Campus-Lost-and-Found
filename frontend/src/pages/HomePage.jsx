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
          <p>Report lost items, help others by posting found items, and recover valuables through verified campus contacts.</p>
          <div className="hero-actions">
            <Link to={user ? '/report/lost' : '/login'} className="btn btn-gold">
              Report Lost Item
            </Link>
            <Link to={user ? '/report/found' : '/login'} className="btn btn-outline-light">
              Report Found Item
            </Link>
          </div>
        </div>
        <div className="hero-note-card">
          <h3>Trusted by Students</h3>
          <p>Built for college workflows with owner verification, status timeline, and secure account-based reporting.</p>
          <Link to="/browse" className="read-link">Explore active reports</Link>
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

      <section className="panel stats-strip">
        <article>
          <h3>Verified posting</h3>
          <p>Account-based reports keep the system organized and easier to trust.</p>
        </article>
        <article>
          <h3>Faster recovery</h3>
          <p>Structured item details and status labels reduce noise during searches.</p>
        </article>
        <article>
          <h3>Better mobile flow</h3>
          <p>Responsive layout keeps browse, report, and account actions easy on phones.</p>
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

      <section className="panel spotlight-row">
        <article>
          <p className="hero-label">Campus Flow</p>
          <h2>Designed like a clean college noticeboard, not a noisy social feed.</h2>
          <p>
            Lost items, found items, and recovery updates sit in one place with direct actions and a calmer visual rhythm.
          </p>
        </article>
        <article>
          <p className="hero-label">Recovery Support</p>
          <h2>One account, one history, less confusion.</h2>
          <p>
            Users can track their own reports, manage follow-ups, and keep the process simple when an item is returned.
          </p>
        </article>
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

      <section className="panel two-col-premium">
        <article>
          <h2>Why this system feels different</h2>
          <p>
            Instead of random social posts, every entry is organized with category, date, location, and contact details.
            This reduces fake claims and speeds up genuine returns.
          </p>
          <ul className="classic-list">
            <li>Structured reporting and filtering</li>
            <li>Owner-first contact process</li>
            <li>Account-based activity logs</li>
          </ul>
        </article>
        <article>
          <h2>Campus Recovery Promise</h2>
          <p>
            Our goal is simple: no student should lose essential items because there was no formal recovery channel.
          </p>
          <p className="muted-line">Classic design. Reliable flow. Practical impact.</p>
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
