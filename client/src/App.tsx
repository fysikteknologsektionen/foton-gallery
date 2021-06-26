import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Header} from './components/Header';
import {NotFoundView} from './views/NotFoundView';
import {CreateAlbumView} from './views/CreateAlbumView';
import {CreateUserView} from './views/CreateUserView';
import {AlbumView} from './views/AlbumView';

/**
 * Top-level App component
 * @return {JSX.Element}
 */
export function App() {
  return (
    <Router>
      <Header />
      <main className='container mt-3'>
        <Switch>
          <Route path='/album/new' component={CreateAlbumView} />
          <Route path='/user/new' component={CreateUserView} />
          <Route path='/album/:year/:month/:day/:slug' component={AlbumView} />
          <Route path='/' component={NotFoundView} />
        </Switch>
      </main>
      <footer>footer</footer>
    </Router>
  );
}
