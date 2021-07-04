import React, {FormEvent, useContext, useState} from 'react';

import {Alert} from '../../common';
import Cookies from 'js-cookie';
import {UserSession} from '../../../interfaces';
import axios from 'axios';
import {useFormState} from '../../../hooks';
import {userSessionContext} from '../../../contexts';

/**
 * Component for render a login modal
 * @return React component
 */
export function LoginModal() {
  const {formState, handleFormChange, clear} = useFormState();
  const [error, setError] = useState<Error>();
  const {setUserSession} = useContext(userSessionContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await axios.post('/api/auth', formState);
      setUserSession(Cookies.getJSON('session') as UserSession);
      document.getElementById('login-modal-close-button')?.click();
      clear();
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  return (
    <div
      className="modal fade"
      id="login-modal"
      aria-labelledby="login-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="login-modal-label">
              Logga in
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {
                error &&
                <Alert
                  type="warning"
                  message={'Det gick inte att logga in. Kontrollera att du ' +
                  'har skrivit in rätt användaruppgifter och försök igen.'}
                />
              }
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  id="login-modal-username-input"
                  type="text"
                  name="username"
                  placeholder="Skriv in ditt användarnamn"
                  required
                  value={formState.username}
                  onChange={handleFormChange}
                />
                <label
                  className="form-label"
                  htmlFor="login-modal-username-input"
                >
                  Användarnamn
                </label>
              </div>
              <div className="form-floating">
                <input
                  className="form-control"
                  id="login-modal-password-input"
                  type="password"
                  name="password"
                  placeholder="Skriv in ditt lösenord"
                  required
                  value={formState.password}
                  onChange={handleFormChange}
                />
                <label
                  className="form-label"
                  htmlFor="login-modal-password-input"
                >
                  Lösenord
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit">
                Logga in
              </button>
              <button
                className="btn btn-secondary"
                id="login-modal-close-button"
                type="button"
                data-bs-dismiss="modal"
              >
                Stäng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
