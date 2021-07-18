import axios, {AxiosRequestConfig} from 'axios';
import {useCallback, useEffect, useState} from 'react';

/**
 * Fetches and returns data from some API endpoint
 * @template T Data type
 * @param url Url to fetch from
 * @param config Axios request configuration
 * @param errorMessage Error message to pass to error handler
 * @param fetchImmediately Whether to fetch data on mount or not
 * @returns Data with type T and a function to fetch data
 */
export function useFetch<T>({
  url,
  config,
  errorMessage,
  fetchImmediately = true,
}: {
  url: string;
  config?: AxiosRequestConfig;
  errorMessage?: string;
  fetchImmediately?: boolean;
}): {data: T | undefined; fetchData: () => Promise<void>} {
  const [data, setData] = useState<T>();

  /**
   * Fetches data
   */
  const fetchData = useCallback(async () => {
    try {
      const res = await axios.get<T>(url, config);
      setData(res.data);
    } catch (error) {
      console.error(errorMessage);
    }
  }, [url, config, errorMessage]);

  useEffect(() => {
    if (fetchImmediately) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    fetchData,
  };
}
