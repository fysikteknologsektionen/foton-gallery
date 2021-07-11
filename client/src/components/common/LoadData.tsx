import React, {useEffect, useState} from 'react';
import axios, {AxiosRequestConfig} from 'axios';

import {Spinner} from './Spinner';

/**
 * Component that fetches data before passing it to and rendering child
 * component. Renders a loading indicator while waiting and an error message
 * if fetching fails
 * @template T Passed to fetch request and typeof data passed to child
 * @param children Function that takes a data parameter and returns child
 * component
 * @returns WaitForData component for render-props pattern
 */
export function LoadData<T>({
  children,
  url,
  config,
}: {
  children: (data: T) => JSX.Element;
  url: string;
  config?: AxiosRequestConfig;
}): JSX.Element {
  const [data, setData] = useState<T>();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<T>(url, config);
        setData(res.data);
      } catch (error) {
        console.error(error);
        setError(true);
      }
    })();
  }, [url, config]);

  if (error) {
    return (
      <>
        <h1>Något gick fel</h1>
        <p>
          Det gick inte att hämta sidinnehållet. Försök igen om en stund.
          Kvarstår problemet kan du{' '}
          <a href="mailto:spidera@ftek.se">kontakta Spidera</a>.
        </p>
      </>
    );
  }

  if (!data) {
    return <Spinner />;
  } else {
    return children(data);
  }
}
