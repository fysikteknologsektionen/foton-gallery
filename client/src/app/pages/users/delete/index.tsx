import {Field, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import {Spinner} from '../../../components/common/spinner';
import axios from 'axios';
import {toastContext} from '../../../contexts/toast';
import {useGetUsers} from '../../../hooks';

/**
 * Component for rendering a form to delete a user
 * @returns Delete user form-component
 */
const DeleteUser: React.VFC = () => {
  const users = useGetUsers();
  const newToast = useContext(toastContext);

  if (users) {
    const initialValues: {userId: string} = {userId: users[0]._id};

    return (
      <>
        <h2 className="visually-hidden">Ta bort användare</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              await axios.delete(`/api/users/${values.userId}`, {
                withCredentials: true,
              });
              newToast({
                title: 'Ta bort användare',
                message: 'Användaren har tagits bort.',
                type: 'success',
              });
            } catch (error) {
              console.error(error);
              newToast({
                title: 'Ta bort användare',
                message: 'Det gick inte att ta bort användaren.',
                type: 'danger',
              });
            }
          }}
        >
          <Form>
            <div className="mb-3">
              <label className="form-label" htmlFor="userId">
                Välj användare
              </label>
              <Field
                className="form-select"
                id="userId"
                name="userId"
                as="select"
                required
              >
                {users.map((user, index) => (
                  <option key={index} value={user._id}>
                    {user.username}
                  </option>
                ))}
              </Field>
            </div>
            <button className="btn btn-primary" type="submit">
              Ta bort
            </button>
          </Form>
        </Formik>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default DeleteUser;
