import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

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
    <Switch>
      <Route exact path="/album/:date/:slug" component={ViewAlbum} />
      <ProtectedRoute exact path="/album/new" component={NewAlbum} />
      <Route exact path={['/album/new', '/album/:date/:slug/:route']}>
        <Nav />
        <Switch>
          <ProtectedRoute
            exact
            path="/album/:date/:slug/edit-album"
            component={EditAlbum}
          />
          <ProtectedRoute
            exact
            path="/album/:date/:slug/edit-images"
            component={EditImages}
          />
          <ProtectedRoute
            exact
            path="/album/:date/:slug/delete"
            component={DeleteAlbum}
          />
          <Route component={() => <Redirect to={`${url}/edit-album`} />} />
        </Switch>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
};
