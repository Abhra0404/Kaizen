import { useEffect, useState } from 'react';

/**
 * Generic hook for fetching data that depends on a user ID.
 * Returns { data, loading, error, setData } so the page can do optimistic updates.
 */
export function useSupabaseQuery<T>(
  fetcher: (userId: string) => Promise<T>,
  userId: string | undefined
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetcher(userId)
      .then((result) => setData(result))
      .catch((err: unknown) => {
        console.error(err);
        setError(err instanceof Error ? err : new Error(String(err)));
      })
      .finally(() => setLoading(false));
  }, [userId, fetcher]);

  return { data, setData, loading, error };
}
