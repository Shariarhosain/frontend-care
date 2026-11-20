import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/format';
import Alert from '../components/Alert';
import Loader from '../components/Loader';

export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/notes/${id}`)
      .then((res) => setNote(res.data.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, [id]);

  const isOwner = note && note.user?._id === user._id;

  return (
    <section className="narrow">
      <button className="btn btn-ghost btn-sm back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <Alert>{error}</Alert>
      {!note && !error && <Loader />}

      {note && (
        <article className="card note-detail">
          <h1>{note.title}</h1>
          <div className="meta">
            {!isOwner && (
              <span>
                Owner: <strong>{note.user?.name}</strong> ({note.user?.email})
              </span>
            )}
            <span>Created {formatDateTime(note.createdAt)}</span>
            {note.updatedAt !== note.createdAt && <span>Updated {formatDateTime(note.updatedAt)}</span>}
          </div>
          <p className="note-body">{note.content || <em className="muted">No content</em>}</p>
          {isOwner && (
            <Link to="/notes" className="btn btn-ghost btn-sm">
              Go to my notes
            </Link>
          )}
        </article>
      )}
    </section>
  );
}
