import {
  Link,
  Redirect,
  Route,
  Switch,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import {LoadData, ProtectedRoute} from '../common';

import {Album} from '../../interfaces';
import {AlbumNav} from './AlbumNav';
import {DeleteAlbum} from './delete';
import {EditAlbum} from './edit';
import {ManageAlbumImages} from './images';
import React from 'react';
import {ViewAlbum} from './view';
import {join} from 'path';

/**
 * Router component for album views
 * @returns Album router component
 */
export const AlbumRouter: React.VFC = () => {
  const {date, slug} = useParams<{date: string; slug: string}>();
  const {path, url} = useRouteMatch();

  return (
    <LoadData<Album>
      url={`/api/albums/${date}/${slug}`}
      errorElement={
        <div>
          <h1>Något gick fel. 🙁</h1>
          <p>
            Det gick inte att hitta albumet. Om du blev länkad hit är det
            möjligt att albumet har flyttats till en ny adress.
          </p>
          <Link className="btn btn-secondary" to="/">
            Till startsidan
          </Link>
        </div>
      }
    >
      {(album) => {
        return (
          <Switch>
            <Route
              exact
              path={path}
              component={() => <ViewAlbum {...album} />}
            />
            <ProtectedRoute
              path={path}
              component={() => (
                <AlbumNav {...album}>
                  <Switch>
                    <Route
                      exact
                      path={`${path}/edit`}
                      component={() => <EditAlbum {...album} />}
                    />
                    <Route
                      exact
                      path={`${path}/images`}
                      component={() => <ManageAlbumImages album={album} />}
                    />
                    <Route
                      exact
                      path={`${path}/delete`}
                      component={() => <DeleteAlbum {...album} />}
                    />
                    <Redirect to={join(url, 'edit')} />
                  </Switch>
                </AlbumNav>
              )}
            />
          </Switch>
        );
      }}
    </LoadData>
  );
};
