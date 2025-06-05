// React
import { useEffect, useState } from "react";

// Errors
import { FetchError } from "../errors/FetchError";

interface UseFetchState<T> {
  data: T | null;
  error: FetchError | null;
  isLoading: boolean;
}

interface UseFetchOptions extends RequestInit {
  // Add any additional options specific to your fetch implementation
}

interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useFetch<T = any>(
  fetchFunction: (options: UseFetchOptions) => Promise<T>,
  options?: UseFetchOptions
): UseFetchResult<T> {
  // Initial state
  const initialState: UseFetchState<T> = {
    data: null,
    error: null,
    isLoading: false,
  };

  // State
  const [state, setState] = useState(initialState);

  // Fetch data
  useEffect(() => {
    const fetchData = setTimeout(async () => {
      setState({
        data: null,
        error: null,
        isLoading: true,
      });

      const data = await fetchFunction(options ?? {}).catch((error: FetchError) => {
        setState({
          data: null,
          error,
          isLoading: false,
        });
      });
      
      setState({
        data: data as T | null,
        error: null,
        isLoading: false,
      });
    }, 0);

    // Cleanup
    return () => clearTimeout(fetchData);
  }, [fetchFunction, options]);

  return state;
}
