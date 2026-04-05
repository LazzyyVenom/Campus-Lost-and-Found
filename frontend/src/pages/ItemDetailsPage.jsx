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
      <p>{item.description}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Owner:</strong> {item.ownerId?.name || 'N/A'}</p>
      <p><strong>Contact:</strong> {item.contactInfo}</p>
      <p><strong>Lost Location:</strong> {item.locationLost || 'Not provided'}</p>
      <p><strong>Found Location:</strong> {item.locationFound || 'Not provided'}</p>
      <p><strong>Claimed By:</strong> {item.claimedBy?.name || 'No one yet'}</p>

      {user && item.status === 'OPEN' && String(item.ownerId?._id) !== String(user.id) && (
        <button className="btn btn-primary" type="button" onClick={claimItem}>
          Claim This Item
        </button>
      )}
    </section>
  );
}
