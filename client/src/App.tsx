import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header';
import { NotFoundView } from './views/NotFoundView';
import { CreateAlbum } from './views/CreateAlbum';
import { CreateUser } from './views/CreateUser';
import { AlbumView } from './views/AlbumView';

export function App () {
  return (
    <Router>
      <Header />
      <main className='container mt-3'>
        
          <Switch>
            <Route path='/album/new' component={CreateAlbum} />
            <Route path='/user/new' component={CreateUser} />
            
            <Route path='/album/:year/:month/:day/:slug' component={AlbumView} />
            <Route path='/' component={NotFoundView} />
          </Switch>
        
      </main>
      <footer>footer</footer>
    </Router>
  );
}