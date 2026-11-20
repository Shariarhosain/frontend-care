import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDate, toInterestList } from '../utils/format';
import Alert from '../components/Alert';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user.name, interests: user.interests.join(', ') });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.patch('/auth/me', {
        name: form.name,
        interests: toInterestList(form.interests),
      });
      setUser(res.data.data);
      setForm({ name: res.data.data.name, interests: res.data.data.interests.join(', ') });
      setMessage({ type: 'success', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="narrow">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p className="muted">Your interests are used on the Interests page.</p>
        </div>
      </div>

      <div className="card profile-card">
        <span className="avatar avatar-lg">{user.name.charAt(0).toUpperCase()}</span>
        <div>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <p className="small muted">
            <span className={`badge badge-${user.role}`}>{user.role}</span> · Joined{' '}
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <Alert type={message?.type} onClose={() => setMessage(null)}>
        {message?.text}
      </Alert>

      <form className="card form form-card" onSubmit={handleSubmit}>
        <h2 className="card-title">Edit profile</h2>
        <label className="field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={50}
            required
          />
        </label>
        <label className="field">
          <span>
            Interests <small>(comma separated)</small>
          </span>
          <input
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="chess, reading, travel"
          />
        </label>
        <div className="form-actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
