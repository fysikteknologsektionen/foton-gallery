import React, {useContext} from 'react';
import {Route, RouteProps} from 'react-router-dom';

import {sessionContext} from '../../../contexts/session';

const NotFound = React.lazy(() => import('../../../pages/not-found'));

/**
 * Component for conditionally rendering a route depending on if user is
 * authorized or not
 * @param adminOnly Whether the route is accessible to all logged in users or
 * only admins
 * @param rest Props to pass to router
 * @return ProtectedRoute component
 */
export const ProtectedRoute: React.VFC<
  {
    adminOnly?: boolean;
  } & RouteProps
> = ({adminOnly, ...rest}) => {
  const {session} = useContext(sessionContext);
  const authorized = !(!session || (adminOnly && session.role !== 'admin'));

  if (authorized) {
    return <Route {...rest} />;
  } else {
    return <NotFound />;
  }
};
