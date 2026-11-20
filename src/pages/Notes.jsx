import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import usePaginated from '../hooks/usePaginated';
import { formatDate } from '../utils/format';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

const emptyForm = { title: '', content: '' };

export default function Notes() {
  const { data: notes, pagination, page, setPage, loading, error, reload } = usePaginated(
    '/notes',
    9
  );
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
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
    try {
      if (editingId) {
        await api.patch(`/notes/${editingId}`, form);
        reload();
      } else {
        await api.post('/notes', form);
        if (page === 1) reload();
        else setPage(1); // new notes appear first
      }
      setMessage({ type: 'success', text: editingId ? 'Note updated.' : 'Note created.' });
      closeForm();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    try {
      await api.delete(`/notes/${note._id}`);
      setMessage({ type: 'success', text: 'Note deleted.' });
      if (editingId === note._id) closeForm();
      reload();
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) });
    }
  };

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>My Notes</h1>
          <p className="muted">Private notes. Only you can see them.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={openCreate}>
            + New note
          </button>
        )}
      </div>

      <Alert type={message?.type} onClose={() => setMessage(null)}>
        {message?.text}
      </Alert>
      <Alert>{error}</Alert>

      {showForm && (
        <form className="card form form-card" onSubmit={handleSubmit}>
          <h2 className="card-title">{editingId ? 'Edit note' : 'New note'}</h2>
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={120}
              placeholder="Note title"
              required
              autoFocus
            />
          </label>
          <label className="field">
            <span>Content</span>
            <textarea
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              maxLength={5000}
              placeholder="Write something…"
            />
          </label>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={closeForm}>
              Cancel
            </button>
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </form>
      )}

      {loading && !notes ? (
        <Loader />
      ) : notes?.length === 0 ? (
        <EmptyState title="No notes yet" text="Create your first note to get started." />
      ) : (
        <div className={`grid ${loading ? 'is-loading' : ''}`}>
          {notes?.map((note) => (
            <article key={note._id} className="card note-card">
              <Link to={`/notes/${note._id}`} className="note-title">
                {note.title}
              </Link>
              <p className="note-content">{note.content || <em className="muted">No content</em>}</p>
              <div className="note-footer">
                <span className="muted small">{formatDate(note.createdAt)}</span>
                <div className="row-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(note)}>
                    Edit
                  </button>
                  <button className="btn btn-danger-ghost btn-sm" onClick={() => handleDelete(note)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
