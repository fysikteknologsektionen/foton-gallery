import {FallbackProps} from 'react-error-boundary';
import {Link} from 'react-router-dom';
import React from 'react';

/**
 * Component for rendering an error fallback view
 * @returns Error fallback view-component
 */
export const ErrorFallback: React.VFC<FallbackProps> = ({
  resetErrorBoundary,
  error
}) => {
  return (
    <>
      <h1>Något gick fel</h1>
      <p>Det gick inte att ladda sidan. Försök igen senare.</p>
      <details>
        <summary>Felmeddelande</summary>
        <pre>
          {`${error.name}: ${error.message}\n${error.stack}`}
        </pre>
      </details>
      <Link
        className="btn btn-secondary mb-5"
        to="/"
        onClick={() => resetErrorBoundary()}
      >
        Till startsidan
      </Link>
    </>
  );
};
