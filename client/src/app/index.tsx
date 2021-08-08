import './styles/globals.scss';

import {BrowserRouter, Route, Switch} from 'react-router-dom';
import React, {Suspense} from 'react';

import {AlbumPage} from './pages/album';
import {ErrorBoundary} from 'react-error-boundary';
import {ErrorFallback} from './components/error-fallback';
import {Footer} from './components/footer';
import {Header} from './components/header';
import {SessionContextProvider} from './contexts/session';
import {Spinner} from './components/common/spinner';
import {ToastContextProvider} from './contexts/toast';
import {UpdateTitle} from './components/update-title';

const HomePage = React.lazy(() => import('./pages/home'));
const Unauthorized = React.lazy(() => import('./pages/unauthorized'));
const NotFound = React.lazy(() => import('./pages/not-found'));

/**
 * Component for rendering the main application tree
 * @returns App component
 */
export const App: React.VFC = () => (
  <SessionContextProvider>
    <ToastContextProvider>
      <BrowserRouter>
        <UpdateTitle />
        <Header />
        <main>
          <div className="container mt-3 mb-3">
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
                  <Route path="/album" component={AlbumPage} />
                  <Route path="/unauthorized" component={Unauthorized} />
                  <Route component={NotFound} />
                </Switch>
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
        <Footer />
      </BrowserRouter>
    </ToastContextProvider>
  </SessionContextProvider>
);
