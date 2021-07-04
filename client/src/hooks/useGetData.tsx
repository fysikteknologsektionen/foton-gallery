import {useEffect, useState} from 'react';

import axios from 'axios';

/**
 * Hook for GET:ing data from some endpoint
 * @template T Type of return data
 * @param url Request URL
 * @param params Params to pass to axios request
 * @returns Data and error objects
 */
export function useGetData<T>({url, params}: {
  url: string,
  params?: Record<string, any>,
}) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<T>(url, {
          params: params,
        });
        setData(res.data);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    })();
  }, []);

  return {
    data,
    error,
  };
}
