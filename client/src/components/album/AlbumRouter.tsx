import {LoadData, ProtectedRoute} from '../common';
import React, {
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import {Album} from '../../interfaces';
import {AlbumNav} from './AlbumNav';
import {DeleteAlbum} from './delete';
import {EditAlbum} from './edit';
import {ManageAlbumImages} from './images';
import {ViewAlbum} from './view';

/**
 * Router component for album views
 * @returns Album router component
 */
export function AlbumRouter(): JSX.Element {
  const {date, slug} = useParams<{date: string; slug: string}>();
  const {path} = useRouteMatch();

  return (
    <LoadData<Album> url={`/api/albums/${date}/${slug}`}>
      {(album, updateData) => (
        <Switch>
          <Route
            exact
            path={path}
            component={() => <ViewAlbum album={album} />}
          />
          <AlbumNav album={album}>
            <ProtectedRoute
              exact
              path={`${path}/edit`}
              component={() => (
                <EditAlbum album={album} updateData={updateData} />
              )}
            />
            <ProtectedRoute
              exact
              path={`${path}/images`}
              component={() => <ManageAlbumImages album={album} />}
            />
            <ProtectedRoute
              exact
              path={`${path}/delete`}
              component={() => <DeleteAlbum album={album} />}
            />
          </AlbumNav>
          <Route component={() => <Redirect to="edit" />} />
        </Switch>
      )}
    </LoadData>
  );
}
