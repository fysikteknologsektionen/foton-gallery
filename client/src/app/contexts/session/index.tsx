import React, {createContext, useEffect, useState} from 'react';

import Cookies from 'js-cookie';
import {UserSession} from '../../../interfaces';

interface SessionContext<T> {
  session: T;
  updateSession: () => void;
}

export const sessionContext = createContext<
  SessionContext<UserSession | undefined>
>({
  session: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  updateSession: () => {},
});

/**
 * Provider component for sessionContext
 * @param children Children to provide context to
 * @returns SessionContextProvider component
 */
export const SessionContextProvider: React.VFC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [session, setSession] = useState<UserSession>();

  /**
   * Updates user session by reading cookie anew
   */
  function updateSession() {
    const sessionCookie = Cookies.getJSON('session') as UserSession | undefined;
    setSession(sessionCookie);
  }

  // Update session on mount
  useEffect(() => {
    updateSession();
  }, []);

  return (
    <sessionContext.Provider value={{session, updateSession}}>
      {children}
    </sessionContext.Provider>
  );
};
