import React, {useContext, useState} from 'react';

import {User} from '../../../interfaces';
import axios from 'axios';
import {toastContext} from '../../../contexts';

/**
 * Component for rendering a form to delete a user
 * @param users Array of user data
 * @return DeleteUser view-component
 */
export const DeleteUser: React.VFC<{
  users: User[];
  updateData: () => Promise<void>;
}> = ({users, updateData}) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const newToast = useContext(toastContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await axios.delete(`/api/users/${users[selectedUser]._id}`, {
        withCredentials: true,
      });
      newToast({
        title: 'Ta bort användare',
        message: 'Användaren har tagits bort.',
        type: 'success',
      });
      updateData();
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Ta bort användare',
        message: 'Det gick inte att ta bort användaren.',
        type: 'danger',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label" htmlFor="delete-user-form-user-select">
          Välj användare
        </label>
        <select
          className="form-select"
          id="delete-user-form-user-select"
          value={selectedUser}
          onChange={(event) =>
            setSelectedUser(Number(event.currentTarget.value))
          }
        >
          {users.map((user, index) => (
            <option key={user._id} value={index}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" type="submit">
        Ta bort
      </button>
    </form>
  );
};
