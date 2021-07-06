import React, {FormEvent, useContext} from 'react';
import {SubmitStatus, useFormState, useSubmitStatus} from '../../../hooks';

import {Alert} from '../../common';
import {User} from '../../../interfaces';
import axios from 'axios';
import {usersContext} from '../../../contexts';

/**
 * Component for rendering a form for editing a user
 * @param user User data
 * @return React component
 */
export function EditUserForm({userIndex}: {userIndex: number}) {
  const {users, setUsers} = useContext(usersContext);
  const {formState, handleFormChange} = useFormState({
    username: users[userIndex].username,
  });
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
        (document.getElementById('edit-user-admin-input') as HTMLInputElement)
            .checked
      ),
    };
    try {
      const res = await axios.put<User>(
          `/api/user/${users[userIndex]._id}`, data, {
            withCredentials: true,
          });
      // Update context
      const newUsers = users.slice();
      newUsers.splice(userIndex, 1, res.data);
      setUsers(newUsers);
      setSubmitStatus(SubmitStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setSubmitStatus(SubmitStatus.ERROR);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {
        {
          [SubmitStatus.PENDING]: null,
          [SubmitStatus.SUCCESS]:
            <Alert
              type="success"
              message="Ändringarna har sparats."
            />,
          [SubmitStatus.ERROR]:
            <Alert
              type="danger"
              message={'Det gick inte att spara ändringarna. Kontrollera ' +
                'att användarnamnet inte är upptaget och försök igen.'}
            />,
        }[submitStatus]
      }
      <div className="form-floating mb-3">
        <input
          className="form-control"
          id="edit-user-username-input"
          type="text"
          name="username"
          placeholder="Skriv in ett användarnamn"
          required
          value={formState.username}
          onChange={handleFormChange}
        />
        <label htmlFor="edit-user-username-input">
          Användarnamn
        </label>
      </div>
      <div className="form-floating mb-3">
        <input
          className="form-control"
          id="edit-user-password-input"
          type="text"
          name="password"
          placeholder="Skriv in ett nytt lösenord"
          autoComplete="new-password"
          value={formState.password}
          onChange={handleFormChange}
        />
        <label htmlFor="edit-user-password-input">
          Nytt lösenord
        </label>
      </div>
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          id="edit-user-admin-input"
          type="checkbox"
          defaultChecked={users[userIndex].isAdmin}
        />
        <label className="form-check-label" htmlFor="edit-user-admin-input">
          Administratör (kan redigera användare)
        </label>
      </div>
      <button className="btn btn-primary" type="submit">Spara</button>
    </form>
  );
}
