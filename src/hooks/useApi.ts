import { useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * useApi — Generic hook for calling async API functions with loading/error state.
 *
 * @example
 * const { data, loading, error, execute } = useApi(careerApi.getCareers);
 * useEffect(() => { execute({ domain: 'Technology' }); }, []);
 */
export function useApi<T = unknown>(
  apiFn: (...args: any[]) => Promise<{ data: { success: boolean; [key: string]: any } }>,
  dataKey?: string
): UseApiReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const res = await apiFn(...args);
        const responseData = res?.data;
        // Extract data by key or return full response data
        const extracted: T = dataKey ? responseData[dataKey] : responseData;
        setState({ data: extracted, loading: false, error: null });
        return extracted;
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          'An unexpected error occurred.';
        setState((prev) => ({ ...prev, loading: false, error: message }));
        return null;
      }
    },
    [apiFn, dataKey]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

// ─── Convenience: Fire-and-forget on mount ────────────────────────────────────
import { useEffect } from 'react';

export function useApiOnMount<T = unknown>(
  apiFn: (...args: any[]) => Promise<{ data: { success: boolean; [key: string]: any } }>,
  args: any[] = [],
  dataKey?: string
): Omit<UseApiReturn<T>, 'execute'> & { refetch: () => void } {
  const { execute, ...rest } = useApi<T>(apiFn, dataKey);

  useEffect(() => {
    execute(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ...rest, refetch: () => execute(...args) };
}
