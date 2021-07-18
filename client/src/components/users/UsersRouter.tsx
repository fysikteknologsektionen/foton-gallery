import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {NewUser} from './create';
import React from 'react';
import {UsersNav} from './UsersNav';
import {join} from 'path';

/**
 * Router component for users views
 * @returns Users router component
 */
export const UsersRouter: React.VFC = () => {
  const {path, url} = useRouteMatch();
  return (
    <>
      <UsersNav />
      <Switch>
        <Route exact path={`${path}/new`} component={NewUser} />
        <Route exact path={`${path}/edit`} component={EditUser} />
        <Route exact path={`${path}/delete`} component={DeleteUser} />
        <Route component={() => <Redirect to={join(url, 'new')} />} />
      </Switch>
    </>
  );
};
