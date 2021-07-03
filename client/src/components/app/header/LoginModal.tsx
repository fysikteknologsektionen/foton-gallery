import React, {FormEvent, useContext} from 'react';
import {useFetch, useFormState} from '../../../hooks';

import {Alert} from '../../common';
import Cookies from 'js-cookie';
import {UserSession} from '../../../interfaces';
import {userSessionContext} from '../../../contexts';

/**
 * Component for render a login modal
 * @return React component
 */
export function LoginModal() {
  const {formState, setFormValue, reset} = useFormState();
  const {error, fetchData} = useFetch({
    method: 'POST',
    url: '/api/auth',
    data: formState,
  }, false, () => {
    setUserSession(Cookies.getJSON('session') as UserSession);
    document.getElementById('login-modal-close-button')?.click();
    reset();
  });
  const {setUserSession} = useContext(userSessionContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await fetchData();
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
                  id="login-modal-email-input"
                  type="email"
                  name="email"
                  placeholder="Skriv in din e-postadress"
                  required
                  value={formState.email}
                  onChange={setFormValue}
                />
                <label
                  className="form-label"
                  htmlFor="login-modal-email-input"
                >
                  E-postadress
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
                  onChange={setFormValue}
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
