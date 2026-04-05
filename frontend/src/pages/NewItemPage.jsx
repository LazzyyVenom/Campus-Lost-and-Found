import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function NewItemPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    itemType: 'LOST',
    title: '',
    category: '',
    description: '',
    incidentDate: '',
    locationLost: '',
    locationFound: '',
    contactInfo: '',
    imageData: '',
  });

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await client.post('/items', form);
      navigate('/my-posts');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not create item.');
    }
  }

  return (
    <section className="panel form-wrap form-large">
      <h1>Post Lost or Found Item</h1>
      <p className="meta">This page is kept for older links. The redesigned flow uses Report Lost Item and Report Found Item.</p>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>Item Type</label>
        <select name="itemType" value={form.itemType} onChange={onChange}>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>

        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />

        <label>Category</label>
        <input name="category" value={form.category} onChange={onChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={5} required />

        <label>Date</label>
        <input name="incidentDate" type="date" value={form.incidentDate} onChange={onChange} required />

        <label>Lost Location</label>
        <input name="locationLost" value={form.locationLost} onChange={onChange} />

        <label>Found Location</label>
        <input name="locationFound" value={form.locationFound} onChange={onChange} />

        <label>Contact Info</label>
        <input name="contactInfo" value={form.contactInfo} onChange={onChange} required />

        <button className="btn btn-gold" type="submit">Publish Listing</button>
      </form>
    </section>
  );
}
