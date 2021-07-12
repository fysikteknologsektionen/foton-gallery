import React, {useContext, useState} from 'react';

import {User} from '../../../interfaces';
import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useFormState} from '../../../hooks';

/**
 * Component for rendering a form for editing a user
 * @param user User data
 * @return EditUserForm component
 */
export const EditUserForm: React.VFC<{updateData: () => Promise<void>} & User> =
  ({_id, username, role, updateData}) => {
    const {formState, handleFormChange} = useFormState({
      username: username,
    });
    const [adminInputChecked, setAdminInputChecked] = useState(
      role === 'admin' ? true : false,
    );
    const newToast = useContext(toastContext);

    /**
     * Handles submitting of the form
     * @param event FormEvent passed by onSubmit
     */
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      const data: Record<string, string | boolean> = {
        ...formState,
        role: adminInputChecked ? 'admin' : 'user',
      };
      try {
        await axios.put(`/api/users/${_id}`, data, {
          withCredentials: true,
        });
        newToast({
          title: 'Redigera användare',
          message: 'Ändringarna har sparats.',
          type: 'success',
        });
        updateData();
      } catch (error) {
        console.error(error);
        newToast({
          title: 'Redigera användare',
          message: 'Det gick inte att spara ändringarna. Är namnet upptaget?',
          type: 'danger',
        });
      }
    }

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="edit-user-form-username-input"
            type="text"
            name="username"
            placeholder="Användarnamn"
            required
            value={formState.username}
            onChange={handleFormChange}
          />
          <label htmlFor="edit-user-form-username-input">Användarnamn</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="edit-user-form-password-input"
            type="text"
            name="password"
            placeholder="Lösenord"
            autoComplete="new-password"
            value={formState.password}
            onChange={handleFormChange}
          />
          <label htmlFor="edit-user-form-password-input">Nytt lösenord</label>
        </div>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            id="edit-user-form-admin-input"
            type="checkbox"
            checked={adminInputChecked}
            onChange={() =>
              setAdminInputChecked((adminInputChecked) => !adminInputChecked)
            }
          />
          <label
            className="form-check-label"
            htmlFor="edit-user-form-admin-input"
          >
            Administratör (kan redigera användare)
          </label>
        </div>
        <button className="btn btn-primary" type="submit">
          Spara
        </button>
      </form>
    );
  };
