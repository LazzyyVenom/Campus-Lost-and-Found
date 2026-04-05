import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const contactValue = item?.contactInfo || '';
  const emailLink = contactValue.includes('@') ? `mailto:${contactValue}` : '';
  const phoneDigits = contactValue.replace(/[^0-9+]/g, '');
  const phoneLink = phoneDigits.length >= 7 ? `tel:${phoneDigits}` : '';

  async function loadItem() {
    try {
      const response = await client.get(`/items/${id}`);
      setItem(response.data.item);
    } catch {
      setError('Item not found.');
    }
  }

  useEffect(() => {
    loadItem();
  }, [id]);

  async function claimItem() {
    setError('');
    setMessage('');

    try {
      const response = await client.post(`/items/${id}/claim`);
      setMessage(response.data.message);
      loadItem();
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not claim this item.');
    }
  }

  if (!item) {
    return <p className="center-text">Loading item details...</p>;
  }

  return (
    <section className="panel details-card">
      <h1>{item.title}</h1>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <div className="item-row">
        <span className="chip">{item.itemType}</span>
        <span className={`badge ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>
      <p>{item.description}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Date:</strong> {item.incidentDate ? new Date(item.incidentDate).toLocaleDateString() : 'Not provided'}</p>
      <p><strong>Owner:</strong> {item.ownerId?.name || 'N/A'}</p>
      <p><strong>Contact:</strong> {item.contactInfo}</p>
      {(emailLink || phoneLink) && (
        <div className="actions">
          {phoneLink && (
            <a className="btn btn-secondary" href={phoneLink}>
              Call Owner
            </a>
          )}
          {emailLink && (
            <a className="btn btn-secondary" href={emailLink}>
              Email Owner
            </a>
          )}
        </div>
      )}
      <p><strong>Lost Location:</strong> {item.locationLost || 'Not provided'}</p>
      <p><strong>Found Location:</strong> {item.locationFound || 'Not provided'}</p>
      <p><strong>Claimed By:</strong> {item.claimedBy?.name || 'No one yet'}</p>

      {item.imageData && <img className="preview-image" src={item.imageData} alt={item.title} />}

      {user && item.status !== 'RETURNED' && String(item.ownerId?._id) !== String(user.id) && (
        <button className="btn btn-gold" type="button" onClick={claimItem}>
          Claim This Item
        </button>
      )}
    </section>
  );
}
