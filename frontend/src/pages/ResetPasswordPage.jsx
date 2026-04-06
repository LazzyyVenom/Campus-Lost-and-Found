import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    resetCode: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await client.post('/auth/reset-password', form);
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 1200);
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-wrap panel auth-card">
      <p className="hero-label">Password Recovery</p>
      <h1>Reset Password</h1>
      <p className="auth-subline">Enter your reset code and set a new password.</p>
      {error && <p className="error-text">{error}</p>}
      {message && <p className="success-text">{message}</p>}
      <p className="hint-text">Paste the code shown on forgot-password screen.</p>
      <form onSubmit={onSubmit}>
        <label>Reset Code</label>
        <input name="resetCode" value={form.resetCode} onChange={onChange} required />

        <label>New Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} minLength={6} required />

        <label>Confirm New Password</label>
        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} minLength={6} required />

        <button className="btn btn-gold" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </section>
  );
}
