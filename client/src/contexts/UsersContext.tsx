import React, {createContext, useState} from 'react';

import {User} from '../interfaces';

interface UsersContext {
  users: User[],
  setUsers:
    React.Dispatch<React.SetStateAction<User[]>> |
    (() => void),
}

export const usersContext = createContext<UsersContext>({
  users: [],
  setUsers: () => {},
});

/**
 * Context provider for users
 * @param children Child components to provide context to
 * @return React component
 */
export function UsersContextProvider({children, initialValue}: {
  children: JSX.Element | JSX.Element[],
  initialValue: User[],
}) {
  const [users, setUsers] = useState(initialValue);

  return (
    <usersContext.Provider value={{users, setUsers}}>
      {children}
    </usersContext.Provider>
  );
}
