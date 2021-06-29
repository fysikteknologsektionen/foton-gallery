import axios from 'axios';
import React, {FormEvent, useContext, useState} from 'react';
import {userSessionContext} from '../contexts';
import {UserSession} from '../interfaces';
import Cookies from 'js-cookie';

/**
 * Component for displaying a confirmation modal when deleting an album
 * @param albumId ID of the album
 * @param albumName Name of the album
 * @return React component
 */
export function LoginModal() {
  const [formState, setFormState] = useState<{email?:string, password?: string}>({});
  const [submitError, setSubmitError] = useState<boolean>(false);
  const {setUserSession} = useContext(userSessionContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent for onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(false);
    try {
      await axios.post<UserSession>('/api/auth', formState);
      setUserSession(Cookies.getJSON('session') as UserSession);
      // This is a hacky way to solve the issue of closing the modal after successful login,
      // should probably be fixed by using bootstrap as esm module instead and invoking .hide()
      const closeModalButton = document.getElementById('login-modal-close-button');
      closeModalButton?.click();
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    }
  }

  /**
   * Handles changes to form inputs
   * @param event Event issued by origin
   */
  function handleChange(event: FormEvent<HTMLInputElement>) {
    const newState = {...formState};
    newState[event.currentTarget.name as keyof typeof formState] = event.currentTarget.value;
    setFormState(newState);
  }

  // Alert to display on failed login
  const responseAlert = (
    <div className="alert alert-danger">
      Det gick inte att logga in. Kontrollera att du har skrivit in rätt användaruppgifter och försök igen.
    </div>
  );

  return (
    <div className="modal fade" id="login-modal" aria-labelledby="login-modal-label" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="login-modal-label">Logga in</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {submitError ? responseAlert : <></>}
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="login-modal-email-input"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
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
                  type="password"
                  id="login-modal-password-input"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
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
              <button className="btn btn-primary" type="submit">Logga in</button>
              <button className="btn btn-secondary" id="login-modal-close-button" type="button" data-bs-dismiss="modal">Stäng</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
