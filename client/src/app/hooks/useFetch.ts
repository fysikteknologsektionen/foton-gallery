import axios, {AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';

/**
 * Fetches and returns data from some API endpoint
 * @template T Data type
 * @param url Url to fetch from
 * @param config Axios request configuration
 * @returns Fetched data
 * @throws error with custom error message if data fetching fails
 */
export function useFetch<T>({
  url,
  config,
}: {
  url: string;
  config?: AxiosRequestConfig;
}): T | undefined {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  // Fetch data
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<T>(url, config);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(config)]);

  if (error) {
    throw error;
  }

  return data;
}
