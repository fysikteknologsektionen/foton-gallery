import {Alert, Spinner} from '../common';
import {NavLink, Redirect, Route, Switch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {NewUser} from './new';
import React from 'react';
import {User} from '../../interfaces';
import {UsersContextProvider} from '../../contexts';
import {useGetData} from '../../hooks';

/**
 * View component for rendering various pages related to users
 * @return React component
 */
export function Users() {
  const {data, error} = useGetData<User[]>({
    url: '/api/user',
  });

  if (error) {
    return (
      <Alert
        type="danger"
        message="Det gick inte att hämta användardata."
        heading="Något gick fel"
        showBackButton
      />
    );
  }

  if (!data) {
    return <Spinner />;
  } else {
    return (
      <>
        <h1>Hantera användare</h1>
        <nav className="nav nav-tabs mb-3">
          <NavLink
            className="nav-link"
            exact
            to="/users/new"
            activeClassName="active"
          >
            Skapa
          </NavLink>
          <NavLink
            className="nav-link"
            exact
            to="/users/edit"
            activeClassName="active"
          >
            Redigera
          </NavLink>
          <NavLink
            className="nav-link"
            exact
            to="/users/delete"
            activeClassName="active"
          >
            Ta bort
          </NavLink>
        </nav>
        <UsersContextProvider initialValue={data}>
          <Switch>
            <Route exact path="/users/new" component={
              () => <NewUser />}
            />
            <Route exact path="/users/edit" component={
              () => <EditUser />}
            />
            <Route exact path="/users/delete" component={
              () => <DeleteUser />}
            />
            <Route path="/" component={() => <Redirect to="/users/new" />} />
          </Switch>
        </UsersContextProvider>
      </>
    );
  }
}
