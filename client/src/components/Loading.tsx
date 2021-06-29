import React, {useEffect, useState} from 'react';
import {GoBackButton} from '.';

/**
 * Component for displaying a delayed loading spinner
 * @param loading Boolean whether the child element is loading or not
 * @param children Child elements to render when not loading
 * @return React component
 */
export function Loading({loading, error, children}: {loading: boolean, error?: Error, children: JSX.Element | JSX.Element[]}) {
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  // To prevent flickering for fast connections, we wait a moment to display the spinner
  useEffect(() => {
    setTimeout(() => setShowSpinner(true), 2000);
  }, []);

  const spinner = (
    <div className={`spinner-grow ${!showSpinner && 'd-none'}`} role="status">
      <span className="visually-hidden">Laddar...</span>
    </div>
  );

  const errorMessage = (
    <div>
      <h1>
        Något gick fel!
        &nbsp;<i className="bi-emoji-frown"></i>
      </h1>
      <p>{error?.message}</p>
      <GoBackButton />
    </div>
  );

  return (
    <>
      {error ? errorMessage :
          loading ? spinner :
          children}
    </>
  );
}
