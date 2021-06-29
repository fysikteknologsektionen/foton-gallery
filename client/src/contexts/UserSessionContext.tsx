import Cookies from 'js-cookie';
import React, {createContext, useState} from 'react';
import {UserSession} from '../interfaces';

// We need to allow a generic Function type for the default value,
// with this hack we still keep type guard however
interface UserSessionContext {
  userSession?: UserSession,
  setUserSession: React.Dispatch<React.SetStateAction<UserSession | undefined>> | Function,
}

// Set default to some throwaway values,
// these should never be used since the context is almost top-level
export const userSessionContext = createContext<UserSessionContext>({
  userSession: undefined,
  setUserSession: console.error,
});

/**
 * Context provider for UserSession
 * @param children Child components
 * @returns React component
 */
export function UserSessionContextProvider({children}: {children: JSX.Element}) {
  let sessionCookie: UserSession | undefined;
  try {
    sessionCookie = Cookies.getJSON('session') as UserSession;
  } catch (error) {
    sessionCookie = undefined;
  }

  const [userSession, setUserSession] = useState<UserSession | undefined>(sessionCookie);

  return (
    <userSessionContext.Provider value={{userSession, setUserSession}}>
      {children}
    </userSessionContext.Provider>
  );
};
