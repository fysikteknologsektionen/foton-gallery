import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {ErrorBoundary} from 'react-error-boundary';
import {InvalidAlbumFallback} from './components/invalid-album-fallback';
import {Nav} from './components/nav';
import {ProtectedRoute} from '../../components/common/protected-route';
import React from 'react';

const ViewAlbum = React.lazy(() => import('./view'));
const NewAlbum = React.lazy(() => import('./new'));
const EditAlbum = React.lazy(() => import('./edit-album'));
const EditImages = React.lazy(() => import('./edit-images'));
const DeleteAlbum = React.lazy(() => import('./delete'));
const NotFound = React.lazy(() => import('../not-found'));

/**
 * Router component for rendering album pages
 * @returns Album router component
 */
export const AlbumPage: React.VFC = () => {
  const {url} = useRouteMatch();

  return (
    <ErrorBoundary
      fallbackRender={InvalidAlbumFallback}
      onError={(error) => console.error(error)}
    >
      <Switch>
        <Route exact path="/album/:date/:slug" component={ViewAlbum} />
        <ProtectedRoute exact path="/album/new" component={NewAlbum} />
        <ProtectedRoute
          exact
          path={['/album/new', '/album/:date/:slug/:route']}
        >
          <Nav />
          <Switch>
            <Route
              exact
              path="/album/:date/:slug/edit-album"
              component={EditAlbum}
            />
            <Route
              exact
              path="/album/:date/:slug/edit-images"
              component={() => <EditImages />}
            />
            <Route
              exact
              path="/album/:date/:slug/delete"
              component={DeleteAlbum}
            />
            <Route component={() => <Redirect to={`${url}/edit-album`} />} />
          </Switch>
        </ProtectedRoute>
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
};
