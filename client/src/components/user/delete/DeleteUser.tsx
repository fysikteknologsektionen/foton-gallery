import React, {FormEvent, useContext, useState} from 'react';
import {SubmitStatus, useSubmitStatus} from '../../../hooks';

import {Alert} from '../../common';
import {User} from '../../../interfaces';
import axios from 'axios';
import {usersContext} from '../../../contexts';

/**
 * Component for rendering a form to delete a user
 * @param users Array of user data
 * @return React component
 */
export function DeleteUser() {
  const {users, setUsers} = useContext(usersContext);
  const [selectedUser, setSelectedUser] = useState(0);
  const {submitStatus, setSubmitStatus} = useSubmitStatus();

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitStatus(SubmitStatus.PENDING);
    try {
      await axios.delete<User>(`/api/user/${users[selectedUser]._id}`, {
        withCredentials: true,
      });
      // Update context
      const newUsers = users.slice();
      newUsers.splice(selectedUser, 1);
      setUsers(newUsers);
      setSubmitStatus(SubmitStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setSubmitStatus(SubmitStatus.ERROR);
    }
  }

  return (
    <>
      <h2 className="visually-hidden">Ta bort användare</h2>
      <form onSubmit={handleSubmit}>
        {
          {
            [SubmitStatus.PENDING]: null,
            [SubmitStatus.SUCCESS]:
            <Alert
              type="success"
              message="Användaren har tagits bort."
            />,
            [SubmitStatus.ERROR]:
              <Alert
                type="danger"
                message="Det gick inte att ta bort användaren."
              />,
          }[submitStatus]
        }
        <div className="mb-3">
          <label className="form-label" htmlFor="delete-user-user-selecf">
            Välj användare
          </label>
          <select
            className="form-select"
            id="delete-user-user-select"
            value={selectedUser}
            onChange={(event) => (
              setSelectedUser(Number(event.currentTarget.value))
            )}
          >
            {
              users.map((user, index) => (
                <option key={user._id} value={index}>{user.username}</option>
              ))
            }
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Ta bort</button>
      </form>
    </>
  );
}
