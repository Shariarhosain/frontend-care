import { Link } from 'react-router-dom';
import usePaginated from '../hooks/usePaginated';
import Alert from '../components/Alert';
import Loader from '../components/Loader';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';

// Backed by the "group users by interest" aggregation (scenario 1).
export default function Interests() {
  const { data: groups, pagination, setPage, loading, error } = usePaginated(
    '/users/interests',
    9
  );

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Users by Interest</h1>
          <p className="muted">
            Every interest with the people who share it. Click a person to read their posts.
          </p>
        </div>
      </div>

      <Alert>{error}</Alert>

      {loading && !groups ? (
        <Loader />
      ) : groups?.length === 0 ? (
        <EmptyState title="No interests yet" text="Add interests from your profile page." />
      ) : (
        <div className={`grid ${loading ? 'is-loading' : ''}`}>
          {groups?.map((group) => (
            <article key={group.interest} className="card interest-card">
              <div className="interest-head">
                <h3>#{group.interest}</h3>
                <span className="count-pill">
                  {group.count} {group.count === 1 ? 'user' : 'users'}
                </span>
              </div>
              <div className="chips">
                {group.users.map((u) => (
                  <Link key={u._id} to={`/users/${u._id}/posts`} className="chip chip-link">
                    <span className="avatar avatar-xs">{u.name.charAt(0).toUpperCase()}</span>
                    {u.name}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </section>
  );
}
