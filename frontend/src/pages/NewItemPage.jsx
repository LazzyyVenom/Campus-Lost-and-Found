import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function NewItemPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    locationLost: '',
    locationFound: '',
    contactInfo: '',
  });

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await client.post('/items', form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not create item.');
    }
  }

  return (
    <section className="panel form-wrap form-large">
      <h1>Post Lost or Found Item</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />

        <label>Category</label>
        <input name="category" value={form.category} onChange={onChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={5} required />

        <label>Lost Location</label>
        <input name="locationLost" value={form.locationLost} onChange={onChange} />

        <label>Found Location</label>
        <input name="locationFound" value={form.locationFound} onChange={onChange} />

        <label>Contact Info</label>
        <input name="contactInfo" value={form.contactInfo} onChange={onChange} required />

        <button className="btn btn-primary" type="submit">Publish Listing</button>
      </form>
    </section>
  );
}
