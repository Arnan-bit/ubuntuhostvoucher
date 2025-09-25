
// src/hooks/use-client-data.ts
import { useState, useEffect, useCallback } from 'react';

// A custom hook to safely fetch data on the client side after mounting.
export function useClientData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const loadData = useCallback(async () => {
    // No need to set loading to true here again, as it's set initially.
    // This prevents re-triggering loading state on re-fetches if not desired.
    try {
      const result = await fetcher();
      setData(result);
    } catch (e) {
      console.error("Failed to fetch client data:", e);
      setError(e);
    } finally {
      // Ensure loading is always set to false after the fetch attempt.
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    // We only want to run this once when the component mounts.
    loadData();
  }, [loadData]); // useCallback ensures loadData reference is stable

  return { data, loading, error, reload: loadData };
}
