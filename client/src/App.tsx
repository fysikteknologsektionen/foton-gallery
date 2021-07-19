import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {ProtectedRoute, Spinner} from './components/common';
import React, {Suspense} from 'react';
import {SessionContextProvider, ToastContextProvider} from './contexts';

import AlbumRouter from './components/album';
import {Gallery} from './components/gallery';
import {Header} from './components/header';
import {NotFound} from './components/not-found';

const UsersRouter = React.lazy(() => import('./components/users'));

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
                <Route exact path={['/', '/page/:page(\\d+)']}>
                  <Gallery />
                </Route>
                <ProtectedRoute adminOnly path="/users">
                  <UsersRouter />
                </ProtectedRoute>
                <Route path="/album">
                  <AlbumRouter />
                </Route>
                <Route>
                  <NotFound />
                </Route>
              </Switch>
            </Suspense>
          </main>
        </BrowserRouter>
      </ToastContextProvider>
    </SessionContextProvider>
  );
};
