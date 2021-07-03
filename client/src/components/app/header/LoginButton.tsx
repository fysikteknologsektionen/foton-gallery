import React, {useContext} from 'react';

import {useFetch} from '../../../hooks';
import {userSessionContext} from '../../../contexts';

/**
 * Component for rending a login button.
 * Switches to logout button when logged in.
 * @return React component
 */
export function LoginButton() {
  const {userSession, setUserSession} = useContext(userSessionContext);
  const {fetchData} = useFetch({
    method: 'DELETE',
    url: '/api/auth',
  });

  /**
 * Logs user out
 */
  async function logoutUser() {
    await fetchData();
    setUserSession(undefined);
  }

  if (userSession) {
    return (
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={logoutUser}
      >
        Logga ut
      </button>
    );
  } else {
    return (
      <>
        <button
          className="btn btn-outline-secondary"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#login-modal"
        >
          Logga in
        </button>
      </>
    );
  }
}
