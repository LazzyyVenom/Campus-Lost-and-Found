import { useState } from 'react';
import client from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await client.post('/auth/forgot-password', { email });
      setMessage(`Demo reset code: ${response.data.resetCode}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not generate reset code.');
    }
  }

  return (
    <section className="form-wrap panel">
      <h1>Forgot Password</h1>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <form onSubmit={onSubmit}>
        <label>Registered Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="btn btn-gold" type="submit">Generate Reset Code</button>
      </form>
    </section>
  );
}
