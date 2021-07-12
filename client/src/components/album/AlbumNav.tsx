import {NavLink, useRouteMatch} from 'react-router-dom';

import {Album} from '../../interfaces';
import React from 'react';
import {join} from 'path';

/**
 * HOC for rendering a navigation for album pages
 * @param WrappedComponent Component to render as child
 * @param album Album data (also passed to child)
 * @returns withAlbumsNav HOC
 */
export const AlbumNav: React.VFC<{children: React.ReactNode} & Album> = ({
  children,
  name,
}) => {
  const {url} = useRouteMatch();
  return (
    <>
      <h1>Hantera album</h1>
      <p className="text-muted">{name}</p>
      <nav className="nav nav-tabs mb-3">
        <NavLink
          className="nav-link"
          to={join(url, 'edit')}
          activeClassName="active"
        >
          Redigera albuminformation
        </NavLink>
        <NavLink
          className="nav-link"
          to={join(url, 'images')}
          activeClassName="active"
        >
          Hantera bilder
        </NavLink>
        <NavLink
          className="nav-link"
          to={join(url, 'delete')}
          activeClassName="active"
        >
          Ta bort
        </NavLink>
      </nav>
      {children}
    </>
  );
};
