import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {LoadData} from '../common';
import {NewUser} from './create';
import React from 'react';
import {User} from '../../interfaces';
import {UsersNav} from './UsersNav';

/**
 * Router component for users views
 * @returns Users router component
 */
export const UsersRouter: React.VFC = () => {
  const {path, url} = useRouteMatch();

  return (
    <LoadData<User[]> url="/api/users" config={{withCredentials: true}}>
      {(users) => (
        <UsersNav>
          <Switch>
            <Route exact path={`${path}/new`} component={() => <NewUser />} />
            <Route
              exact
              path={`${path}/edit`}
              component={() => <EditUser users={users} />}
            />
            <Route
              exact
              path={`${path}/delete`}
              component={() => <DeleteUser users={users} />}
            />
            <Route
              exact
              path={path}
              component={() => <Redirect to={`${url}/new`} />}
            />
            <Route component={() => <Redirect to="new" />} />
          </Switch>
        </UsersNav>
      )}
    </LoadData>
  );
};
