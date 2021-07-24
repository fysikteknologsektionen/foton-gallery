import {Field, FieldArray, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import {Album} from '../../../../interfaces';
import axios from 'axios';
import {getNonEmptyFields} from '../../../utils';
import {toastContext} from '../../../contexts/toast';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to create an album
 * @return Create album form-component
 */
const NewAlbum: React.VFC = () => {
  const newToast = useContext(toastContext);
  const history = useHistory();

  const initialValues: {
    name: string;
    date: string;
    authors: string[];
    description: string;
  } = {
    name: '',
    date: '',
    authors: [],
    description: '',
  };

  return (
    <>
      <h1>Skapa album</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const data = getNonEmptyFields(values);
          try {
            const res = await axios.post<Album>('/api/albums', data, {
              withCredentials: true,
            });
            newToast({
              title: 'Skapa album',
              message: 'Albumet har skapats.',
              type: 'success',
            });
            // Redirect
            history.push(
                `/album/${res.data.date.substring(0, 10)}/${
                  res.data.slug
                }/edit-images`,
            );
          } catch (error) {
            console.error(error);
            newToast({
              title: 'Skapa album',
              message: `Det gick inte att skapa albumet.
                Är namn/datum kombinationen redan upptagen?`,
              type: 'danger',
            });
          }
        }}
      >
        {({values}) => (
          <Form>
            <label className="form-label" htmlFor="name">
              Namn
            </label>
            <Field
              className="form-control mb-3"
              id="name"
              name="name"
              type="text"
              required
            />
            <label className="form-label" htmlFor="date">
              Datum
            </label>
            <Field
              className="form-control mb-3"
              id="date"
              name="date"
              type="date"
              required
            />
            <label className="form-label" htmlFor="authors">
              Fotograferare
            </label>
            <FieldArray name="authors">
              {(arrayHelpers) => (
                <div className="mb-3">
                  {values.authors && values.authors.length > 0 ? (
                    values.authors.map((author, index) => (
                      <div className="input-group mb-3" key={index}>
                        <Field
                          className="form-control"
                          name={`authors.${index}`}
                          type="text"
                          required
                        />
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <i className="bi-dash" aria-label="Ta bort" />
                        </button>
                        <button
                          className="btn btn-outline-success"
                          type="button"
                          onClick={() => arrayHelpers.insert(index + 1, '')}
                        >
                          <i className="bi-plus" aria-label="Lägg till" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => arrayHelpers.push('')}
                    >
                      Lägg till en fotograferare
                    </button>
                  )}
                </div>
              )}
            </FieldArray>
            <label className="form-label" htmlFor="description">
              Beskrivning
            </label>
            <Field
              className="form-control mb-3"
              id="description"
              name="description"
              as="textarea"
              style={{height: '100px'}}
            />
            <button className="btn btn-primary" type="submit">
              Skapa
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default NewAlbum;
