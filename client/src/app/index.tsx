import './styles/globals.scss';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import React, {Suspense} from 'react';

import {AlbumPage} from './pages/album';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from './components/error-fallback';
import {Footer} from './components/footer';
import {Header} from './components/header';
import {ProtectedRoute} from './components/common/protected-route';
import {SessionContextProvider} from './contexts/session';
import {Spinner} from './components/common/spinner';
import {ToastContextProvider} from './contexts/toast';

const HomePage = React.lazy(() => import('./pages/home'));
const UsersPage = React.lazy(() => import('./pages/users'));
const NotFound = React.lazy(() => import('./pages/not-found'));

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
            <ErrorBoundary
              fallbackRender={ErrorFallback}
              onError={(error) => console.error(error)}
            >
              <Suspense fallback={<Spinner />}>
                <Switch>
                  <Route
                    exact
                    path={['/', '/page/:page(\\d+)']}
                    component={HomePage}
                  />
                  <ProtectedRoute path="/users" component={UsersPage} />
                  <Route path="/album" component={AlbumPage} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </BrowserRouter>
      </ToastContextProvider>
    </SessionContextProvider>
  );
};
