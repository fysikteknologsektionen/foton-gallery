import React, {useEffect, useState} from 'react';

/**
 * Component for displaying a delayed loading spinner
 * @param {boolean} loading - Boolean whether the child element is loading or not
 * @param {JSX.Element | JSX.Element[]} children - Child elements to render when not loading
 * @return {JSX.Element}
 */
export function Loading({loading, children}: {loading: boolean, children: JSX.Element | JSX.Element[]}) {
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

  return (
    <>
      {loading ? spinner : children}
    </>
  );
}
