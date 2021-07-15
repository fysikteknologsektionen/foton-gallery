import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ProtectedRoute, Spinner} from './components/common';
import React, {Suspense} from 'react';
import {SessionContextProvider, ToastContextProvider} from './contexts';

import {CreateAlbum} from './components/album/create';
import {Gallery} from './components/gallery';
import {Header} from './components/header';
import {NotFound} from './components/not-found';

const UsersRouter = React.lazy(() => import('./components/users'));
const AlbumRouter = React.lazy(() => import('./components/album'));

/**
 * Component for rendering the main application tree
 * @returns App component
 */
export const App: React.VFC = () => {
  return (
    <SessionContextProvider>
      <ToastContextProvider>
        <BrowserRouter>
          <Header />
          <main className="container mt-3">
            <Suspense fallback={<Spinner />}>
              <Switch>
                <Route exact path="/" component={Gallery} />
                <ProtectedRoute
                  isAdminOnly
                  path="/users"
                  component={UsersRouter}
                />
                <ProtectedRoute path="/albums/new" component={CreateAlbum} />
                <Route path="/album/:date/:slug" component={AlbumRouter} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </main>
        </BrowserRouter>
      </ToastContextProvider>
    </SessionContextProvider>
  );
};
