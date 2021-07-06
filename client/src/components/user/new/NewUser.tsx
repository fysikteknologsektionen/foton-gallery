import React, {FormEvent, useContext} from 'react';
import {SubmitStatus, useFormState, useSubmitStatus} from '../../../hooks';

import {Alert} from '../../common';
import {User} from '../../../interfaces';
import axios from 'axios';
import {usersContext} from '../../../contexts';

/**
 * Component for rendering a form to create a new user
 * @return React component
 */
export function NewUser() {
  const {users, setUsers} = useContext(usersContext);
  const {formState, handleFormChange} = useFormState();
  const {submitStatus, setSubmitStatus} = useSubmitStatus();

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus(SubmitStatus.PENDING);
    const data = {
      ...formState,
      isAdmin: (
        (document.getElementById('new-user-admin-input') as HTMLInputElement)
            .checked
      ),
    };
    try {
      const res = await axios.post<User>('/api/user', data, {
        withCredentials: true,
      });
      // Update context
      const newUsers = users.slice();
      newUsers.push(res.data);
      setUsers(newUsers);
      setSubmitStatus(SubmitStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setSubmitStatus(SubmitStatus.ERROR);
    }
  }

  return (
    <>
      <h2 className="visually-hidden">Skapa användare</h2>
      <form onSubmit={handleSubmit}>
        {
          {
            [SubmitStatus.PENDING]: null,
            [SubmitStatus.SUCCESS]:
              <Alert
                type="success"
                message="Användaren har skapats."
              />,
            [SubmitStatus.ERROR]:
              <Alert
                type="danger"
                message={'Det gick inte att skapa användaren. Kontrollera ' +
                  'att användarnamnet inte är upptaget och försök igen.'}
              />,
          }[submitStatus]
        }
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="new-user-username-input"
            type="text"
            name="username"
            placeholder="Skriv in ett användarnamn"
            required
            value={formState.username}
            onChange={handleFormChange}
          />
          <label htmlFor="new-user-username-input">
          Användarnamn
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="new-user-password-input"
            type="text"
            name="password"
            placeholder="Skriv in ett lösenord"
            required
            autoComplete="new-password"
            value={formState.password}
            onChange={handleFormChange}
          />
          <label htmlFor="new-user-password-input">
          Lösenord
          </label>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            id="new-user-admin-input"
            type="checkbox"
          />
          <label className="form-check-label" htmlFor="new-user-admin-input">
            Administratör (kan redigera användare)
          </label>
        </div>
        <button className="btn btn-primary" type="submit">Skapa</button>
      </form>
    </>
  );
}
