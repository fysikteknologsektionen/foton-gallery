import React, {FormEvent, useContext, useState} from 'react';

import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useFormState} from '../../../hooks';

/**
 * Component for rendering a form to create a new user
 * @return CreateUser view-component
 */
export const NewUser: React.VFC<{updateData: () => Promise<void>}> = ({
  updateData,
}) => {
  const {formState, handleFormChange} = useFormState();
  const [adminInputChecked, setAdminInputChecked] = useState(false);
  const newToast = useContext(toastContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data: Record<string, string | boolean> = {
      ...formState,
      role: adminInputChecked ? 'admin' : 'user',
    };
    try {
      await axios.post('/api/users', data, {
        withCredentials: true,
      });
      newToast({
        title: 'Skapa användare',
        message: 'Användaren har skapats.',
        type: 'success',
      });
      updateData();
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Skapa användare',
        message: 'Användaren kunde inte skapas. Är namnet upptaget?',
        type: 'danger',
      });
    }
  }

  return (
    <>
      <h2 className="visually-hidden">Skapa användare</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="new-user-form-username-input"
            type="text"
            name="username"
            placeholder="Skriv in ett användarnamn"
            required
            value={formState.username}
            onChange={handleFormChange}
          />
          <label htmlFor="new-user-form-username-input">Användarnamn</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="new-user-form-password-input"
            type="text"
            name="password"
            placeholder="Skriv in ett lösenord"
            required
            autoComplete="new-password"
            value={formState.password}
            onChange={handleFormChange}
          />
          <label htmlFor="new-user-form-password-input">Lösenord</label>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            id="new-user-form-admin-input"
            type="checkbox"
            checked={adminInputChecked}
            onChange={() =>
              setAdminInputChecked((adminInputChecked) => !adminInputChecked)
            }
          />
          <label
            className="form-check-label"
            htmlFor="new-user-form-admin-input"
          >
            Administratör (kan redigera användare)
          </label>
        </div>
        <button className="btn btn-primary" type="submit">
          Skapa
        </button>
      </form>
    </>
  );
};
