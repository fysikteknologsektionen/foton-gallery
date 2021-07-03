import axios, {AxiosRequestConfig} from 'axios';
import {useEffect, useState} from 'react';

/**
 * Fetches data using axios
 * @template T Type passed to axios and reflected in returned data
 * @param config Configuration to be passed t axios requ =>t
 * @param callImmediately Whether to fetch data immediately on hook creation
 * or only when fetchData is called
 * @param onSuccess Function to run if the request is successful
 * @returns Object containing data, error and fetchData function
 */
export function useFetch<T>(
    config: AxiosRequestConfig,
    callImmediately: boolean = false,
    onSuccess?: () => void,
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();

  /**
   * Fetches data using predefined config
   */
  async function fetchData() {
    try {
      const res = await axios.request(config);
      setData(res.data.length > 1 ? res.data : res.data[0]);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError(error);
      console.error(error);
    }
  }

  // Fetch data at once if flagged to
  useEffect(() => {
    if (callImmediately) {
      fetchData();
    }
  }, []);

  return {
    data,
    error,
    fetchData,
  };
}
