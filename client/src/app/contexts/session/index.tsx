import React, {createContext, useEffect, useState} from 'react';

import Cookies from 'js-cookie';

export interface UserSession {
  name: string;
  avatar: string;
}

interface SessionContext {
  session?: UserSession;
  updateSession: () => void;
}

export const sessionContext = createContext<SessionContext>({
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
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      try {
        const session: UserSession = JSON.parse(sessionCookie);
        setSession(session);
      } catch (error) {
        console.error(error);
      }
    }
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
