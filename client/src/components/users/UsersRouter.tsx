import {Link, Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {LoadData} from '../common';
import {NewUser} from './create';
import React from 'react';
import {User} from '../../interfaces';
import {UsersNav} from './UsersNav';
import {join} from 'path';

/**
 * Router component for users views
 * @returns Users router component
 */
export const UsersRouter: React.VFC = () => {
  const {path, url} = useRouteMatch();

  return (
    <LoadData<User[]>
      url="/api/users"
      config={{withCredentials: true}}
      errorElement={
        <div>
          <h1>Något gick fel. 🙁</h1>
          <p>
            Det gick inte att hämta en lista över användare. Detta beror
            sannolikt på ett tillfälligt avbrott. Försök igen om en stund.
          </p>
          <Link className="btn btn-secondary" to="/">
            Till startsidan
          </Link>
        </div>
      }
    >
      {(users, updateData) => (
        <UsersNav>
          <Switch>
            <Route
              exact
              path={`${path}/new`}
              component={() => <NewUser updateData={updateData} />}
            />
            <Route
              exact
              path={`${path}/edit`}
              component={() => (
                <EditUser users={users} updateData={updateData} />
              )}
            />
            <Route
              exact
              path={`${path}/delete`}
              component={() => (
                <DeleteUser users={users} updateData={updateData} />
              )}
            />
            <Route component={() => <Redirect to={join(url, 'new')} />} />
          </Switch>
        </UsersNav>
      )}
    </LoadData>
  );
};
