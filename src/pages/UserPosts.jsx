import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import usePaginated from '../hooks/usePaginated';
import { formatDateTime } from '../utils/format';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

// Route: /users/:id/posts  -> backed by the $lookup aggregation (scenario 2)
export default function UserPostsPage() {
  const { id } = useParams();
  // `key` resets the page state when switching between users.
  return <UserPosts key={id} userId={id} />;
}

function UserPosts({ userId }) {
  const { user } = useAuth();
  const { data, pagination, page, setPage, loading, error, reload } = usePaginated(
    `/users/${userId}/posts`,
    5
  );
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const isMe = userId === user._id;
  const posts = data?.posts;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.post('/posts', form);
      setForm({ title: '', content: '' });
      setMessage({ type: 'success', text: 'Post published.' });
      if (page === 1) reload();
      else setPage(1);
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
          <h1>{isMe ? 'My Posts' : `Posts by ${data?.author?.name || '…'}`}</h1>
          <p className="muted">Posts are public. Everyone can read them.</p>
        </div>
      </div>

      <Alert type={message?.type} onClose={() => setMessage(null)}>
        {message?.text}
      </Alert>
      <Alert>{error}</Alert>

      {isMe && (
        <form className="card form form-card" onSubmit={handleSubmit}>
          <h2 className="card-title">Write a post</h2>
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={120}
              required
            />
          </label>
          <label className="field">
            <span>Content</span>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              maxLength={5000}
              required
            />
          </label>
          <div className="form-actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Publishing…' : 'Publish'}
            </button>
          </div>
        </form>
      )}

      {loading && !data ? (
        <Loader />
      ) : posts?.length === 0 ? (
        <EmptyState title="No posts yet" text={isMe ? 'Write your first post above.' : undefined} />
      ) : (
        <div className={`stack ${loading ? 'is-loading' : ''}`}>
          {posts?.map((post) => (
            <article key={post._id} className="card post-card">
              <div className="post-head">
                <span className="avatar">{data.author.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{data.author.name}</strong>
                  <div className="muted small">{formatDateTime(post.createdAt)}</div>
                </div>
              </div>
              <h3>{post.title}</h3>
              <p className="note-body">{post.content}</p>
            </article>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
