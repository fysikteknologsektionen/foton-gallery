import {ErrorMessage, Field, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useGetAlbum} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to delete an album
 * @return Delete album view-component
 */
export const DeleteAlbum: React.VFC = () => {
  const album = useGetAlbum();
  const history = useHistory();
  const newToast = useContext(toastContext);

  if (album) {
    const initialValues: {name: string} = {name: ''};
    return (
      <>
        <h2 className="visually-hidden">Ta bort album</h2>
        <p className="text-muted">{`Namn: ${album.name}`}</p>
        <Formik
          initialValues={initialValues}
          onSubmit={async () => {
            try {
              await axios.delete(`/api/albums/${album._id}`, {
                withCredentials: true,
              });
              newToast({
                title: 'Ta bort album',
                message: 'Albumet har tagits bort.',
                type: 'success',
              });
              // Redirect
              history.push('/');
            } catch (error) {
              console.error(error);
              newToast({
                title: 'Ta bort album',
                message: 'Det gick inte att ta bort albumet.',
                type: 'danger',
              });
            }
          }}
        >
          <Form>
            <p className="text-danger">
              OBS: Du håller på att permanent radera ett album (inklusive alla
              dess bilder). Skriv in namnet på albumet nedan för att bekräfta
              att du vill ta bort det.
            </p>
            <label className="form-label" htmlFor="name">
              Namn
            </label>
            <Field
              className="form-control mb-3"
              id="name"
              name="name"
              type="text"
              required
              validate={(value: string) => {
                let error;
                if (value !== album.name) {
                  error = 'Felaktigt namn';
                }
                return error;
              }}
            />
            <ErrorMessage name="name">
              {(msg) => <div className="alert alert-warning">{msg}</div>}
            </ErrorMessage>
            <button className="btn btn-primary" type="submit">
              Ta bort
            </button>
          </Form>
        </Formik>
      </>
    );
  } else {
    return null;
  }
};
