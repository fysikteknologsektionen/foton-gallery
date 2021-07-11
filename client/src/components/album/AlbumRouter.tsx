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
  const {path, url} = useRouteMatch();

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
            path={path}
            component={() => (
              <AlbumNav album={album}>
                <Switch>
                  <Route
                    exact
                    path={`${path}/edit`}
                    component={() => <EditAlbum album={album} />}
                  />
                  <Route
                    exact
                    path={`${path}/images`}
                    component={() => <ManageAlbumImages album={album} />}
                  />
                  <Route
                    exact
                    path={`${path}/delete`}
                    component={() => <DeleteAlbum album={album} />}
                  />
                  <Route component={() => <Redirect to={`${url}/edit`} />} />
                </Switch>
              </AlbumNav>
            )}
          />
        </Switch>
      )}
    </LoadData>
  );
}
