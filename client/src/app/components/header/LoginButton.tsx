import React, {useContext} from 'react';

import axios from 'axios';
import {sessionContext} from '../../contexts/session';
import {toastContext} from '../../contexts/toast';

/**
 * Component for displaying modal that allows uploading images
 * @param albumId ID of the album to add images to
 * @return React component
 */
export const LoginButton: React.VFC = () => {
  const {session, updateSession} = useContext(sessionContext);
  const newToast = useContext(toastContext);

  /**
   * Logs user out
   */
  async function logout() {
    try {
      await axios.delete('/api/auth/logout');
      updateSession();
      newToast({
        title: 'Logga ut',
        message: 'Du är nu utloggad.',
        type: 'success',
      });
    } catch (error) {
      console.error();
      newToast({
        title: 'Logga ut',
        message: 'Det gick inte att logga ut.',
        type: 'danger',
      });
    }
  }

  if (!session) {
    return (
      <a
        className="btn btn-outline-secondary mt-1 mt-md-0"
        href="/api/auth/google"
      >
        Logga in
      </a>
    );
  } else {
    return (
      <button
        className="btn btn-outline-secondary mt-1 mt-md-0"
        type="button"
        onClick={logout}
      >
        Logga ut
      </button>
    );
  }
};
