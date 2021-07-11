import React, {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {LoadData} from '../common';
import {NewUser} from './create';
import {User} from '../../interfaces';
import {withUsersNav} from './withUsersNav';

/**
 * Router component for users views
 * @returns Users router component
 */
export function UsersRouter(): JSX.Element {
  const {path, url} = useRouteMatch();

  return (
    <LoadData<User[]> url="/api/users" config={{withCredentials: true}}>
      {(users) => (
        <Switch>
          <Route
            exact
            path={`${path}/new`}
            component={withUsersNav(NewUser, users)}
          />
          <Route
            exact
            path={`${path}/edit`}
            component={withUsersNav(EditUser, users)}
          />
          <Route
            exact
            path={`${path}/delete`}
            component={withUsersNav(DeleteUser, users)}
          />
          <Route
            exact
            path={path}
            component={() => <Redirect to={`${url}/new`} />}
          />
          <Route component={() => <Redirect to="new" />} />
        </Switch>
      )}
    </LoadData>
  );
}
