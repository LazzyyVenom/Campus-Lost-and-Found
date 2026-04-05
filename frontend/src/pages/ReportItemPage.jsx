import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function ReportItemPage({ mode }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    itemType: mode,
    title: '',
    description: '',
    category: '',
    incidentDate: '',
    locationLost: '',
    locationFound: '',
    contactInfo: '',
    imageData: '',
  });

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function onFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageData: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      await client.post('/items', form);
      navigate('/my-posts');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not submit report.');
    }
  }

  return (
    <section className="panel form-wrap form-large">
      <h1>{mode === 'LOST' ? 'Report Lost Item' : 'Report Found Item'}</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>Item Name</label>
        <input name="title" value={form.title} onChange={onChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} rows={4} required />

        <label>Category</label>
        <input name="category" value={form.category} onChange={onChange} required />

        <label>Date</label>
        <input name="incidentDate" type="date" value={form.incidentDate} onChange={onChange} required />

        <label>Location</label>
        <input
          name={mode === 'LOST' ? 'locationLost' : 'locationFound'}
          value={mode === 'LOST' ? form.locationLost : form.locationFound}
          onChange={onChange}
          required
        />

        <label>Contact details</label>
        <input name="contactInfo" value={form.contactInfo} onChange={onChange} placeholder="Phone or email" required />

        <label>Image upload (optional)</label>
        <input type="file" accept="image/*" onChange={onFileChange} />

        {form.imageData && <img className="preview-image" src={form.imageData} alt="preview" />}

        <button className="btn btn-gold" type="submit">Submit Post</button>
      </form>
    </section>
  );
}
