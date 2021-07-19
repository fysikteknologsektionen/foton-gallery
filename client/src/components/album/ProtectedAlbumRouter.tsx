import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {AlbumNav} from './AlbumNav';
import DeleteAlbum from './delete';
import EditAlbum from './edit-album';
import EditImages from './edit-images';
import NewAlbum from './new';
import React from 'react';
import {join} from 'path';

const ProtectedAlbumRouter: React.VFC = () => {
  const {url} = useRouteMatch();

  return (
    <Switch>
      <Route exact path="/album/new">
        <NewAlbum />
      </Route>
      <Route path="/album/:date/:slug">
        <AlbumNav />
        <Switch>
          <Route exact path="/album/:date/:slug/edit-album">
            <EditAlbum />
          </Route>
          <Route exact path="/album/:date/:slug/edit-images">
            <EditImages />
          </Route>
          <Route exact path="/album/:date/:slug/delete">
            <DeleteAlbum />
          </Route>
          <Route>
            <Redirect to={join(url, '..', 'edit-album')} />
          </Route>
        </Switch>
      </Route>
    </Switch>
  );
};

export default ProtectedAlbumRouter;
