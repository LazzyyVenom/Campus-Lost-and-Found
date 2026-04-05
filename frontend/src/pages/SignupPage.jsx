import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function onChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await client.post('/auth/signup', form);
      login(response.data.token, response.data.user);
      navigate('/browse');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Signup failed.');
    }
  }

  return (
    <section className="form-wrap panel">
      <h1>Create Account</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={onSubmit}>
        <label>Full Name</label>
        <input name="name" value={form.name} onChange={onChange} required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} required />

        <label>Password</label>
        <div className="pw-wrap">
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
          <button type="button" className="pw-btn" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <label>Confirm Password</label>
        <input
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={form.confirmPassword}
          onChange={onChange}
          minLength={6}
          required
        />

        <button className="btn btn-gold" type="submit">Sign Up</button>
      </form>
      <p>Already registered? <Link to="/login">Login</Link></p>
    </section>
  );
}
