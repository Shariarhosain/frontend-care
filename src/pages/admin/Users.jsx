import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import usePaginated from '../../hooks/usePaginated';
import { formatDate, toInterestList } from '../../utils/format';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

const emptyForm = { name: '', email: '', password: '', role: 'user', interests: '' };

export default function Users() {
  const { user: me } = useAuth();
  const { data: users, pagination, page, setPage, loading, error, reload } = usePaginated(
    '/users',
    8
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role, interests: u.interests.join(', ') });
    setEditingId(u._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const payload = { ...form, interests: toInterestList(form.interests) };
    if (editingId && !payload.password) delete payload.password; // keep current password

    try {
      if (editingId) {
        await api.patch(`/users/${editingId}`, payload);
        reload();
      } else {
        await api.post('/users', payload);
        if (page === 1) reload();
        else setPage(1);
      }
      setMessage({ type: 'success', text: editingId ? 'User updated.' : 'User created.' });
      closeForm();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}? Their notes and posts will also be deleted.`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      setMessage({ type: 'success', text: 'User deleted.' });
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Manage Users</h1>
          <p className="muted">Add, update or remove user accounts.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={openCreate}>
            + Add user
          </button>
        )}
      </div>

      <Alert type={message?.type} onClose={() => setMessage(null)}>
        {message?.text}
      </Alert>
      <Alert>{error}</Alert>

      {showForm && (
        <form className="card form form-card" onSubmit={handleSubmit}>
          <h2 className="card-title">{editingId ? 'Edit user' : 'Add user'}</h2>
          <div className="form-grid">
            <label className="field">
              <span>Name</span>
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label className="field">
              <span>
                Password {editingId && <small>(leave empty to keep current)</small>}
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                required={!editingId}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={editingId === me._id}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <label className="field field-full">
              <span>
                Interests <small>(comma separated)</small>
              </span>
              <input
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="chess, reading"
              />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={closeForm}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create user'}
            </button>
          </div>
        </form>
      )}

      {loading && !users ? (
        <Loader />
      ) : (
        <div className={`card table-card ${loading ? 'is-loading' : ''}`}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Interests</th>
                  <th>Joined</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <span className="avatar">{u.name.charAt(0).toUpperCase()}</span>
                        <div>
                          <strong>{u.name}</strong>
                          {u._id === me._id && <span className="you-tag">you</span>}
                          <div className="muted small">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <div className="chips">
                        {u.interests.length === 0 && <span className="muted small">—</span>}
                        {u.interests.map((i) => (
                          <span key={i} className="chip chip-sm">
                            {i}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="muted small nowrap">{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="row-actions right">
                        <Link to={`/users/${u._id}/posts`} className="btn btn-ghost btn-sm">
                          Posts
                        </Link>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(u)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger-ghost btn-sm"
                          onClick={() => handleDelete(u)}
                          disabled={u._id === me._id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
