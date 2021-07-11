import React, {useEffect, useState} from 'react';

/**
 * Component for rendering a loading spinner
 * @return Spinner component
 */
export function Spinner(): JSX.Element {
  const [show, setShow] = useState(false);

  // Wait to display the spinner to prevent flickering
  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`d-flex justify-content-center mt-5 ${!show && 'd-none'}`}>
      <div
        className="spinner-grow"
        style={{width: '2.5rem', height: '2.5rem'}}
        role="status"
      >
        <span className="visually-hidden">Laddar...</span>
      </div>
    </div>
  );
}
