import React, {createContext, useState} from 'react';

import Cookies from 'js-cookie';
import {UserSession} from '../interfaces';

interface UserSessionContext {
  userSession: UserSession | undefined,
  setUserSession:
    React.Dispatch<React.SetStateAction<UserSession | undefined>> |
    (() => undefined),
}

export const userSessionContext = createContext<UserSessionContext>({
  userSession: undefined,
  setUserSession: () => undefined,
});

/**
 * Context provider for UserSession
 * @param children Child components to provide context to
 * @returns React component
 */
export function UserSessionContextProvider({children}: {
  children: JSX.Element | JSX.Element[]
}) {
  // Try to load existing session from cookie storage
  let sessionCookie: UserSession | undefined;
  try {
    sessionCookie = Cookies.getJSON('session') as UserSession;
  } catch (error) {
    sessionCookie = undefined;
  }

  const [userSession, setUserSession] = useState(sessionCookie);

  return (
    <userSessionContext.Provider value={{userSession, setUserSession}}>
      {children}
    </userSessionContext.Provider>
  );
};
