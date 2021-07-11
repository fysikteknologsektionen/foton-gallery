import React, {useContext} from 'react';

import {NotFound} from '../not-found';
import {Route} from 'react-router-dom';
import {sessionContext} from '../../contexts';

/**
 * Component for conditionally rendering a route depending on if user is
 * authorized or not
 * @param adminOnly Whether the route is accessible to all logged in users or
 * only admins
 * @param path Path to match
 * @param component Component to render if authorized
 * @return ProtectedRoute component
 */
export function ProtectedRoute({
  adminOnly = false,
  path,
  exact = false,
  component,
}: {
  adminOnly?: boolean;
  path: string;
  exact?: boolean;
  component: React.VFC;
}): JSX.Element {
  const {session} = useContext(sessionContext);
  const authorized = !(!session || (adminOnly && session.role !== 'admin'));

  return (
    <Route
      exact={exact}
      path={path}
      component={authorized ? component : NotFound}
    />
  );
}
