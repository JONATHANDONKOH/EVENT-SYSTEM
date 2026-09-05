import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    location: '',
  });
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
      await register(form);
      // redirect on success, e.g. navigate('/feed')
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="Form" onSubmit={handleSubmit}>
      <h2 className="createaccount">Create Account</h2>

      {error && <p>{error}</p>}

      <div>
        <label htmlFor="name">Name</label><br />
        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required />
      </div><br />

      <div>
        <label htmlFor="email">Email</label><br />
        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
      </div><br />

      <div>
        <label htmlFor="password">Password</label><br />
        <input type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
      </div><br />

      <div>
        <label htmlFor="location">Location</label><br />
        <input type="text" id="location" name="location" value={form.location} onChange={handleChange} required />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register'}
      </button>

      {/* New Login button */}
      <button type="button" onClick={() => navigate('/login')} style={{ marginTop: '10px' }}>
        Go to Login
      </button>
    </form>
  );
}
