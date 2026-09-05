import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(form);
      // redirect on success, e.g. navigate('/feed')
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <h2 className="Login">Log In</h2>

      {error && <p>{error}</p>}

      <div>
        <label htmlFor="email">Email</label><br />
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div><br />

      <div>
        <label htmlFor="password">Password</label><br />
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div><br />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Log In'}
      </button>

      {/* New Register button */}
      <button
        type="button"
        onClick={() => navigate('/register')}
        style={{ marginTop: '10px' }}
      >
        Go to Register
      </button>
    </form>
  );
}
