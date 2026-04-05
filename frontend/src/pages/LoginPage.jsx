import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await client.post('/auth/login', form);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Login failed.');
    }
  }

  return (
    <section className="form-wrap panel">
      <h1>Login</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>Email</label>
        <input name="email" type="email" onChange={onChange} value={form.email} required />

        <label>Password</label>
        <div className="pw-wrap">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            onChange={onChange}
            value={form.password}
            required
          />
          <button type="button" className="pw-btn" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button className="btn btn-primary" type="submit">Login</button>
      </form>
      <p><Link to="/forgot-password">Forgot password?</Link></p>
      <p>New user? <Link to="/signup">Create account</Link></p>
    </section>
  );
}
