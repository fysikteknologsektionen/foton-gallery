import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Header} from './components';
import {UserSessionContextProvider} from './contexts';
import {AlbumView, CreateAlbumView, CreateUserView, EditAlbumView, GalleryView, NotFoundView} from './views';

/**
 * Top-level App component
 * @return React component
 */
export function App() {
  return (
    <UserSessionContextProvider>
      <Router>
        <Header />
        <main className="container mt-3">
          <Switch>
            <Route path="/album/new" component={CreateAlbumView} />
            <Route path="/user/new" component={CreateUserView} />
            <Route exact path="/" component={GalleryView} />
            <Route exact path="/album/:year/:month/:day/:slug/edit" component={EditAlbumView} />
            <Route exact path="/album/:year/:month/:day/:slug" component={AlbumView} />
            <Route path="/" component={NotFoundView} />
          </Switch>
        </main>
        <footer>footer</footer>
      </Router>
    </UserSessionContextProvider>
  );
}
