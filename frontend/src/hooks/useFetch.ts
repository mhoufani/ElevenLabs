// React
import { useEffect, useState } from "react";

// Errors
import { FetchError } from "../errors/FetchError";

export function useFetch(fetchFunction, options) {
  const initialState = {
    data: null,
    error: null,
    isLoading: false,
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const fetchData = async () => {
      setState({
        data: null,
        error: null,
        isLoading: true,
      });

      const data = await fetchFunction(options);
      setState({
        data,
        error: null,
        isLoading: false,
      });
    };

    void fetchData();
  }, [fetchFunction, options]);

  return state;
}
