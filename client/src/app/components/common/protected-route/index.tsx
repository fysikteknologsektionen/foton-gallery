import React, {useContext} from 'react';
import {Route, RouteProps} from 'react-router-dom';

import {sessionContext} from '../../../contexts/session';

const NotFound = React.lazy(() => import('../../../pages/not-found'));

/**
 * Component for conditionally rendering a route depending on if user is
 * authorized or not
 * @param props Props to pass to router
 * @return ProtectedRoute component
 */
export const ProtectedRoute: React.VFC<RouteProps> = (props) => {
  const {session} = useContext(sessionContext);

  if (session) {
    return <Route {...props} />;
  } else {
    return <NotFound />;
  }
};
