import {NotFound, ProtectedRoute} from '../common';
import {Route, Switch} from 'react-router-dom';

import React from 'react';
import {ViewAlbum} from './view';

const ProtectedAlbumRouter = React.lazy(() => import('./ProtectedAlbumRouter'));

/**
 * Router component for album views
 * @returns Album router component
 */
export const AlbumRouter: React.VFC = () => {
  return (
    <Switch>
      <Route exact path="/album/:date/:slug">
        <ViewAlbum />
      </Route>
      <ProtectedRoute exact path={['/album/new', '/album/:date/:slug/:route']}>
        <ProtectedAlbumRouter />
      </ProtectedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};
