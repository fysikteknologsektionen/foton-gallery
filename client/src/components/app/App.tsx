import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';

import {Album} from '../album';
import {EditAlbum} from '../album/edit';
import {Footer} from './footer';
import {Gallery} from '../gallery';
import {Header} from './header';
import {NotFound} from './NotFound';
import React from 'react';
import {UserSessionContextProvider} from '../../contexts';

/**
 * Top-level component
 * @return React component
 */
export function App() {
  return (
    <UserSessionContextProvider>
      <Router>
        <Header />
        <main className="container mt-3">
          <Switch>
            <Route
              exact
              path={['/', '/page/:page']}
              component={Gallery}
            />
            <Route
              exact
              path="/album/:year/:month/:day/:slug/edit"
              component={EditAlbum}
            />
            <Route
              exact
              path="/album/:year/:month/:day/:slug"
              component={Album}
            />
            <Route
              path="/"
              component={NotFound}
            />
          </Switch>
        </main>
        <Footer />
      </Router>
    </UserSessionContextProvider>
  );
}
