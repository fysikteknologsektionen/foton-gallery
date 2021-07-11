import React, {useState} from 'react';

import {EditUserForm} from './EditUserForm';
import {User} from '../../../interfaces';

/**
 * Component for rendering a view for editing a user
 * @param users Array of user data
 * @returns EditUser view-component
 */
export const EditUser: React.VFC<{users: User[]}> = ({users}) => {
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  return (
    <>
      <h2 className="visually-hidden">Redigera användare</h2>
      <form>
        <div>
          <label className="form-label" htmlFor="dit-user-form-user-select">
            Välj användare
          </label>
          <select
            className="form-select"
            id="edit-user-form-user-select"
            onChange={(event) =>
              setSelectedUserIndex(Number(event.currentTarget.value))
            }
          >
            {users.map((user, index) => (
              <option key={user._id} value={index}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </form>
      <hr />
      <EditUserForm
        key={users[selectedUserIndex]._id}
        user={users[selectedUserIndex]}
      />
    </>
  );
};
