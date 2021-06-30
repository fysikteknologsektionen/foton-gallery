import React, {useEffect, useState} from 'react';

import {GoBackButton} from '.';
import axios from 'axios';

/**
 * GET:s data from some endpoint and returns it via callback
 * renders a loading spinner and an error message if fetch fails
 * @param query Query path
 * @param params Query parameters
 * @param errorMessage Message to display if GET fails
 * @param callback Callback function called with data as a parameter
 * @param children Implicitly passed children
 * @return React component
 */
export function LoadData<T>({query, params, errorMessage, callback, children}: {
  query: string,
  params?: {[k: string]: any},
  errorMessage: string,
  callback(data: T): void,
  children: JSX.Element | JSX.Element[],
}) {
  // Whether the GET request was successful or not (i.e. error occured),
  // undefined if request has not been sent yet
  const [fetchSuccess, setFetchSuccess] = useState<boolean | undefined>();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // To prevent flickering we wait a moment to display the loading spinner
    setTimeout(() => setShowSpinner(true), 2000);
    // GET data
    (async () => {
      try {
        const res = await axios.get<T>(query, {
          params: params,
        });
        callback(res.data);
        setFetchSuccess(true);
      } catch (error) {
        console.error(error);
        setFetchSuccess(false);
      }
    })();
  }, []);

  const spinner = (
    <div
      className={
        `d-flex justify-content-center mt-5 ${!showSpinner && 'd-none'}`
      }
    >
      <div
        className="spinner-grow"
        style={{width: '2.5rem', height: '2.5rem'}}
        role="status"
      >
        <span className="visually-hidden">Laddar...</span>
      </div>
    </div>
  );

  const error = (
    <div>
      <h1>
        Något gick fel
        &nbsp;<i className="bi-emoji-frown"></i>
      </h1>
      <p>{errorMessage}</p>
      <GoBackButton />
    </div>
  );

  switch (fetchSuccess) {
    case true:
      return <>{children}</>;
    case false:
      return error;
    case undefined:
      return spinner;
  }
}
