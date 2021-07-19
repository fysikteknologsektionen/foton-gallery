import {Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

import {DeleteUser} from './delete';
import {EditUser} from './edit';
import {NewUser} from './new';
import React from 'react';
import {UsersNav} from './UsersNav';
import {join} from 'path';

/**
 * Router component for users views
 * @returns Users router component
 */
export const UsersRouter: React.VFC = () => {
  const {url} = useRouteMatch();

  return (
    <>
      <UsersNav />
      <Switch>
        <Route exact path="/user/new" component={NewUser} />
        <Route exact path="/user/edit" component={EditUser} />
        <Route exact path="/user/delete" component={DeleteUser} />
        <Route component={() => <Redirect to={join(url, 'new')} />} />
      </Switch>
    </>
  );
};
