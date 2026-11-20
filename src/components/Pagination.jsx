export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.total === 0) return null;
  const { page, totalPages, total } = pagination;

  return (
    <div className="pagination">
      <button
        className="btn btn-ghost btn-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Prev
      </button>
      <span className="pagination-info">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> · {total} total
      </span>
      <button
        className="btn btn-ghost btn-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
