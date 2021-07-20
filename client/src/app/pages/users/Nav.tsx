import {NavLink, useRouteMatch} from 'react-router-dom';

import React from 'react';
import {join} from 'path';

/**
 * Component for rendering a users toolbar/navigation
 * @returns Navigation component
 */
export const Nav: React.VFC = () => {
  const {url} = useRouteMatch();

  return (
    <>
      <h1>Hantera användare</h1>
      <nav className="nav nav-tabs mb-3" aria-label="Verktygsnavigering">
        <NavLink
          className="nav-link"
          to={join(url, 'new')}
          activeClassName="active"
        >
          Skapa ny
        </NavLink>
        <NavLink
          className="nav-link"
          to={join(url, 'edit')}
          activeClassName="active"
        >
          Redigera
        </NavLink>
        <NavLink
          className="nav-link"
          to={join(url, 'delete')}
          activeClassName="active"
        >
          Ta bort
        </NavLink>
      </nav>
    </>
  );
};
