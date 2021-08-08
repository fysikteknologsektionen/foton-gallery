import {Link} from 'react-router-dom';
import React from 'react';

/**
 * Component for rendering a page for unauthorized log ins
 * @returns Unauthorized view-component
 */
const Unauthorized: React.VFC = () => (
  <>
    <h1>403: Ej tillåten</h1>
    <p>Du är inte tillåten att logga in på denna sida.</p>
    <Link className="btn btn-secondary" to="/">
      Till startsidan
    </Link>
  </>
);

export default Unauthorized;
