import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../api/client';
import { toInterestList } from '../utils/format';
import Alert from '../components/Alert';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ ...form, interests: toInterestList(form.interests) });
      navigate('/notes');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="brand-logo brand-logo-lg">SN</span>
          <h1>Create an account</h1>
          <p>Start keeping your notes safe</p>
        </div>

        <Alert>{error}</Alert>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange} required autoFocus />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              placeholder="At least 6 characters"
              required
            />
          </label>
          <label className="field">
            <span>
              Interests <small>(optional, comma separated)</small>
            </span>
            <input
              name="interests"
              value={form.interests}
              onChange={handleChange}
              placeholder="chess, reading, travel"
            />
          </label>
          <button className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
