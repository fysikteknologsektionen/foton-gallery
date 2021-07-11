import {LoadData, ProtectedRoute} from '../common';
import React, {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import {Album} from '../../interfaces';
import {DeleteAlbum} from './delete';
import {EditAlbum} from './edit';
import {ManageAlbumImages} from './images';
import {ViewAlbum} from './view';
import {withAlbumNav} from './withAlbumNav';

/**
 * Router component for album views
 * @returns Album router component
 */
export function AlbumRouter(): JSX.Element {
  const {date, slug} = useParams<{date: string; slug: string}>();
  const {path} = useRouteMatch();

  return (
    <LoadData<Album> url={`/api/albums/${date}/${slug}`}>
      {(album) => (
        <Switch>
          <Route
            exact
            path={path}
            component={() => <ViewAlbum album={album} />}
          />
          <ProtectedRoute
            exact
            path={`${path}/edit`}
            component={withAlbumNav(EditAlbum, album)}
          />
          <ProtectedRoute
            exact
            path={`${path}/images`}
            component={withAlbumNav(ManageAlbumImages, album)}
          />
          <ProtectedRoute
            exact
            path={`${path}/delete`}
            component={withAlbumNav(DeleteAlbum, album)}
          />
          <Route component={() => <Redirect to="edit" />} />
        </Switch>
      )}
    </LoadData>
  );
}
