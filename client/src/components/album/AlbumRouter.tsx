import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {AlbumNav} from './AlbumNav';
import {DeleteAlbum} from './delete';
import {EditAlbum} from './edit-album';
import {EditImages} from './edit-images';
import {ProtectedRoute} from '../common';
import React from 'react';
import {ViewAlbum} from './view';
import {join} from 'path';

/**
 * Router component for album views
 * @returns Album router component
 */
export const AlbumRouter: React.VFC = () => {
  const {path, url} = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={() => <ViewAlbum />} />
      <ProtectedRoute
        path={path}
        component={() => (
          <>
            <AlbumNav />
            <Switch>
              <Route exact path={`${path}/edit-album`} component={EditAlbum} />
              <Route
                exact
                path={`${path}/edit-images`}
                component={EditImages}
              />
              <Route exact path={`${path}/delete`} component={DeleteAlbum} />
              <Redirect to={join(url, 'edit-images')} />
            </Switch>
          </>
        )}
      />
    </Switch>
  );
};
