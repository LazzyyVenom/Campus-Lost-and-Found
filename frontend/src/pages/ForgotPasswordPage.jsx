import { useState } from 'react';
import client from '../api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  async function onResetSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setResetLoading(true);

    try {
      const response = await client.post('/auth/reset-password', {
        resetCode,
        password,
        confirmPassword,
      });
      setMessage(response.data.message || 'Password reset successful. Please login with your new password.');
      setResetCode('');
      setPassword('');
      setConfirmPassword('');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not reset password.');
    } finally {
      setResetLoading(false);
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

      <form onSubmit={onResetSubmit}>
        <label>Reset Code</label>
        <input value={resetCode} onChange={(event) => setResetCode(event.target.value)} required />

        <label>New Password</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required />

        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          minLength={6}
          required
        />

        <button className="btn btn-primary" type="submit" disabled={resetLoading}>
          {resetLoading ? 'Updating...' : 'Set New Password'}
        </button>
      </form>
    </section>
  );
}
