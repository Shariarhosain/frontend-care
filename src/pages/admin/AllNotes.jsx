import { Link } from 'react-router-dom';
import usePaginated from '../../hooks/usePaginated';
import { formatDate } from '../../utils/format';
import Alert from '../../components/Alert';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';

export default function AllNotes() {
  const { data: notes, pagination, setPage, loading, error } = usePaginated('/notes/all', 10);

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>All Notes</h1>
          <p className="muted">Admin view of every user&apos;s notes.</p>
        </div>
      </div>

      <Alert>{error}</Alert>

      {loading && !notes ? (
        <Loader />
      ) : notes?.length === 0 ? (
        <EmptyState title="No notes in the system" />
      ) : (
        <div className={`card table-card ${loading ? 'is-loading' : ''}`}>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Note</th>
                  <th>Owner</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {notes?.map((note) => (
                  <tr key={note._id}>
                    <td>
                      <Link to={`/notes/${note._id}`} className="table-link">
                        {note.title}
                      </Link>
                      <div className="muted small truncate">{note.content}</div>
                    </td>
                    <td>
                      {note.user ? (
                        <>
                          <strong>{note.user.name}</strong>
                          <div className="muted small">{note.user.email}</div>
                        </>
                      ) : (
                        <span className="muted">Deleted user</span>
                      )}
                    </td>
                    <td className="muted small nowrap">{formatDate(note.createdAt)}</td>
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
