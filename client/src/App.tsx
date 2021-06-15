import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Gallery } from './views/Gallery';
import { Header } from './components/Header';
import { Login } from './views/Login';
import { NotFound } from './views/NotFound';
import { CreateAlbum } from './views/CreateAlbum';
import { CreateUser } from './views/CreateUser';

export function App () {
  return (
    <Router>
      <Header />
      <main className='container mt-3'>
        
          <Switch>
            <Route path='/album/new' component={CreateAlbum} />
            <Route path='/user/new' component={CreateUser} />
            <Route path='/login' component={Login} />
            <Route exact path='/' component={Gallery} />
            <Route path='/' component={NotFound} />
          </Switch>
        
      </main>
      <footer>footer</footer>
    </Router>
  );
}