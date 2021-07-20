import {Redirect, Route, Switch} from 'react-router-dom';

import {Nav} from './Nav';
import React from 'react';

const NewUser = React.lazy(() => import('./new'));
const EditUser = React.lazy(() => import('./edit'));
const DeleteUser = React.lazy(() => import('./delete'));

/**
 * Component for rendering Users-pages
 * @returns Users page component
 */
const UsersPage: React.VFC = () => (
  <>
    <Nav />
    <Switch>
      <Route exact path="/users/new" component={NewUser} />
      <Route exact path="/users/edit" component={EditUser} />
      <Route exact path="/users/delete" component={DeleteUser} />
      <Route component={() => <Redirect to="/users/new" />} />
    </Switch>
  </>
);

export default UsersPage;
