import {Link} from 'react-router-dom';
import React from 'react';

/**
 * Component for rendering a generic 404 not-found-view
 * @returns NotFound view-component
 */
export const NotFound: React.VFC = () => (
  <>
    <h1>404: Sidan kunde inte hittas</h1>
    <p>Sidan du försökte nå finns inte.</p>
    <Link className="btn btn-secondary" to="/">
      Till startsidan
    </Link>
  </>
);
