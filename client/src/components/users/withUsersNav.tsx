import {NavLink} from 'react-router-dom';
import React from 'react';
import {User} from '../../interfaces';

/**
 * HOC for rendering a navigation for users pages
 * @param WrappedComponent Component to render as child
 * @param users Album data (also passed to child)
 * @returns withUserNav HOC
 */
export function withUsersNav(
    WrappedComponent: React.VFC<{users: User[]}>,
    users: User[],
): React.VFC {
  return function UsersNav(): JSX.Element {
    return (
      <>
        <h1>Hantera användare</h1>
        <nav className="nav nav-tabs mb-3">
          <NavLink className="nav-link" to="new" activeClassName="active">
            Skapa ny
          </NavLink>
          <NavLink className="nav-link" to="edit" activeClassName="active">
            Redigera
          </NavLink>
          <NavLink className="nav-link" to="delete" activeClassName="active">
            Ta bort
          </NavLink>
        </nav>
        <WrappedComponent users={users} />
      </>
    );
  };
}
