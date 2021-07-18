import {NavLink, useRouteMatch} from 'react-router-dom';

import React from 'react';
import {join} from 'path';

/**
 * HOC for rendering a navigation for users pages
 * @param WrappedComponent Component to render as child
 * @param users Album data (also passed to child)
 * @returns withUserNav HOC
 */
export const UsersNav: React.VFC = () => {
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
