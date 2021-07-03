import React, {useContext} from 'react';

import {NotFound} from './NotFound';
import {Route} from 'react-router-dom';
import {userSessionContext} from '../../contexts';

/**
 * Component for conditionally rendering route depending on
 * if user is authorized or not
 * @param adminOnly Whether the route is accessible to only
 * admins or all logged inusers
 * @param exact Exact route match
 * @param path Path to match
 * @param component Component to render if authorized
 * @return React component
 */
export function ProtectedRoute({
  adminOnly,
  exact,
  path,
  component,
}: {
  adminOnly?: boolean,
  exact?: boolean,
  path: string,
  component: () => JSX.Element,
}) {
  const {userSession} = useContext(userSessionContext);
  const authorized = !(!userSession || (adminOnly && !userSession.isAdmin));

  return (
    <Route
      exact={exact}
      path={path}
      component={authorized ? component : NotFound}
    />
  );
}
