import {Field, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import axios from 'axios';
import {toastContext} from '../../../contexts/toast';

/**
 * Component for rendering a form to create a new user
 * @return New user form-component
 */
const NewUser: React.VFC = () => {
  const newToast = useContext(toastContext);

  const initialValues: {
    username: string;
    password: string;
    role: 'user' | 'admin';
  } = {
    username: '',
    password: '',
    role: 'user',
  };

  return (
    <>
      <h2 className="visually-hidden">Skapa användare</h2>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            await axios.post('/api/users', values, {
              withCredentials: true,
            });
            newToast({
              title: 'Skapa användare',
              message: 'Användaren har skapats.',
              type: 'success',
            });
          } catch (error) {
            console.error(error);
            newToast({
              title: 'Skapa användare',
              message: 'Användaren kunde inte skapas. Är namnet upptaget?',
              type: 'danger',
            });
          }
        }}
      >
        <Form>
          <label className="form-label" htmlFor="username">
            Användarnamn
          </label>
          <Field
            className="form-control mb-3"
            id="username"
            name="username"
            type="text"
            required
          />
          <label className="form-label" htmlFor="password">
            Lösenord
          </label>
          <Field
            className="form-control mb-3"
            id="password"
            name="password"
            type="text"
            required
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
            Skapa
          </button>
        </Form>
      </Formik>
    </>
  );
};

export default NewUser;
