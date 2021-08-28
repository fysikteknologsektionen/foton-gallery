import {FallbackProps} from 'react-error-boundary';
import {Link} from 'react-router-dom';
import React from 'react';

/**
 * Component for rendering an error fallback view for when an album cannot be
 * fetched
 * @returns Error fallback view-component
 */
export const InvalidAlbumFallback: React.VFC<FallbackProps> = ({
  resetErrorBoundary,
}) => {
  return (
    <>
      <h1>Albumet hittades inte</h1>
      <p>
        Det gick inte att hitta albumet. Om du blev du länkad hit är det möjligt
        att albumet har flyttats till en ny adress.
      </p>
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
