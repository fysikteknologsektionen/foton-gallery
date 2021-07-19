import axios, {AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';

/**
 * Fetches and returns data from some API endpoint
 * @template T Data type
 * @param url Url to fetch from
 * @param config Axios request configuration
 * @param errorMessage Error message to pass to error handler
 * @returns Fetched data
 */
export function useFetch<T>({
  url,
  config,
  errorMessage,
}: {
  url: string;
  config?: AxiosRequestConfig;
  errorMessage?: string;
}): T | undefined {
  const [data, setData] = useState<T>();

  // Fetch data
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<T>(url, config);
        setData(res.data);
      } catch (error) {
        console.error(errorMessage);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(config), errorMessage]);

  return data;
}
