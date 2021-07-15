import React, {ReactElement, useCallback, useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';

import {Spinner} from './Spinner';

/**
 * Component that fetches data before passing it to and rendering child
 * component. Renders a loading indicator while waiting and an error message
 * if fetching fails
 * @template T Passed to fetch request and typeof data passed to child
 * @param children Function that takes a data parameter and a data update
 * function and returns child component
 * @returns WaitForData component for render-props pattern
 */
export const LoadData = <T, >({
  children,
  url,
  errorElement,
  config,
}: {
  children: (data: T, getData: () => Promise<void>) => React.ReactElement;
  url: string;
  errorElement: React.ReactElement;
  config?: AxiosRequestConfig;
}): ReactElement => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);

  /**
   * GET:s data
   */
  const getData = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<T>(url, config);
      setData(res.data);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }, [url, config]);

  // Get data on mount
  useEffect(() => {
    getData();
  }, [getData]);

  if (error) {
    return errorElement;
  }

  if (!data) {
    return <Spinner />;
  } else {
    return children(data, getData);
  }
};
