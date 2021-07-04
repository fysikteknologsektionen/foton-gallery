import React, {useContext} from 'react';

import axios from 'axios';
import {userSessionContext} from '../../../contexts';

/**
 * Component for rending a login button.
 * Switches to logout button when logged in.
 * @return React component
 */
export function LoginButton() {
  const {userSession, setUserSession} = useContext(userSessionContext);

  /**
   * Logs user out
   */
  async function logoutUser() {
    try {
      await axios.delete('/api/auth');
    } catch (error) {
      console.error(error);
    }
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
