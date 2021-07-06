import React, {useContext, useState} from 'react';

import {EditUserForm} from './EditUserForm';
import {usersContext} from '../../../contexts';

/**
 * Component for rendering a page for editing an existing user
 * @param users Array of user data
 * @return React component
 */
export function EditUser() {
  const {users} = useContext(usersContext);
  const [selectedUser, setSelectedUser] = useState(0);
  return (
    <>
      <h2 className="visually-hidden">Redigera användare</h2>
      <form>
        <div>
          <label className="form-label" htmlFor="edit-user-select-input">
            Välj användare
          </label>
          <select
            className="form-select"
            id="edit-user-user-select"
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
      </form>
      <hr />
      <EditUserForm key={users[selectedUser]._id} userIndex={selectedUser} />
    </>
  );
}
