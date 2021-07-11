import {Album} from '../../interfaces';
import {NavLink} from 'react-router-dom';
import React from 'react';

/**
 * HOC for rendering a navigation for album pages
 * @param WrappedComponent Component to render as child
 * @param album Album data (also passed to child)
 * @returns withAlbumsNav HOC
 */
export const AlbumNav: React.VFC<{children: React.ReactNode; album: Album}> = ({
  children,
  album,
}) => {
  return (
    <>
      <h1>{`Hantera album: ${album.name}`}</h1>
      <nav className="nav nav-tabs mb-3">
        <NavLink className="nav-link" to="edit" activeClassName="active">
          Redigera albuminformation
        </NavLink>
        <NavLink className="nav-link" to="images" activeClassName="active">
          Hantera bilder
        </NavLink>
        <NavLink className="nav-link" to="delete" activeClassName="active">
          Ta bort
        </NavLink>
      </nav>
      {children}
    </>
  );
};
