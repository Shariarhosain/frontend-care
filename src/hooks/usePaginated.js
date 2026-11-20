import { useCallback, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

// Loads a paginated API endpoint: GET url?page=&limit=
export default function usePaginated(url, limit = 10) {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(url, { params: { page, limit } });
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [url, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  // If the current page became empty (e.g. its last item was deleted), go back one page.
  useEffect(() => {
    if (pagination && page > pagination.totalPages) setPage(pagination.totalPages);
  }, [pagination, page]);

  return { data, pagination, page, setPage, loading, error, reload: load };
}
