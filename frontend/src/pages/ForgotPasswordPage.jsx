import { useState } from 'react';
import client from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await client.post('/auth/forgot-password', { email });
      setMessage(`Demo reset code: ${response.data.resetCode}`);
    } catch (apiError) {
      const apiMessage = apiError.response?.data?.message || '';
      if (/please wait 1 minute/i.test(apiMessage)) {
        setError('Please try again shortly.');
      } else {
        setError(apiMessage || 'Could not generate reset code.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-wrap panel auth-card">
      <p className="hero-label">Account Recovery</p>
      <h1>Forgot Password</h1>
      <p className="auth-subline">Enter your registered email to generate demo reset code.</p>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <p className="hint-text">Use the same email you used while signing up.</p>
      <form onSubmit={onSubmit}>
        <label>Registered Email</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <button className="btn btn-gold" type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Reset Code'}
        </button>
      </form>
    </section>
  );
}
