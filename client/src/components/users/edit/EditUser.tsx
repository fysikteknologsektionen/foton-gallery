import {Field, Form, Formik} from 'formik';
import React, {useContext, useState} from 'react';

import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useGetUsers} from '../../../hooks';

/**
 * Component for rendering a view for editing a user
 * @returns Edit user view-component
 */
export const EditUser: React.VFC = () => {
  const users = useGetUsers();
  const [selectedUser, setSelectedUser] = useState(0);
  const newToast = useContext(toastContext);

  if (users) {
    const initialValues: {
      username: string;
      password: string;
      role: 'user' | 'admin';
    } = {
      username: users[selectedUser].username,
      password: '',
      role: users[selectedUser].role,
    };

    return (
      <>
        <h2 className="visually-hidden">Redigera användare</h2>
        <div>
          <label className="form-label" htmlFor="select-user">
            Välj användare
          </label>
          <select
            className="form-select"
            id="select-user"
            onChange={(event) =>
              setSelectedUser(Number(event.currentTarget.value))
            }
          >
            {users.map((user, index) => (
              <option key={index} value={index}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <hr />
        <Formik
          initialValues={initialValues}
          enableReinitialize
          onSubmit={async (values) => {
            // Unset password if empty string
            const data = {
              ...values,
              password: values.password || undefined,
            };
            try {
              await axios.patch(`/api/users/${users[selectedUser]._id}`, data, {
                withCredentials: true,
              });
              newToast({
                title: 'Redigera användare',
                message: 'Ändringarna har sparats.',
                type: 'success',
              });
            } catch (error) {
              console.error(error);
              newToast({
                title: 'Redigera användare',
                message:
                  'Det gick inte att spara ändringarna. Är namnet upptaget?',
                type: 'danger',
              });
            }
          }}
        >
          <Form>
            <label htmlFor="username">Användarnamn</label>
            <Field
              className="form-control mb-3"
              id="username"
              name="username"
              type="text"
              required
            />
            <label htmlFor="password">Lösenord</label>
            <Field
              className="form-control mb-3"
              id="password"
              name="password"
              type="text"
              autoComplete="new-password"
            />
            <label className="form-label" htmlFor="role">
              Användarroll
            </label>
            <Field
              className="form-select mb-3"
              id="role"
              name="role"
              as="select"
              required
            >
              <option value="user">Användare</option>
              <option value="admin">Administratör</option>
            </Field>
            <button className="btn btn-primary" type="submit">
              Spara
            </button>
          </Form>
        </Formik>
      </>
    );
  } else {
    return null;
  }
};
