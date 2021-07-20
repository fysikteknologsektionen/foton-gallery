import {Field, FieldArray, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import {Album} from '../../../../interfaces';
import {Spinner} from '../../../components/common/spinner';
import axios from 'axios';
import {toastContext} from '../../../contexts/toast';
import {useGetAlbum} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to edit album information
 * @return Edit album form-component
 */
const EditAlbum: React.VFC = () => {
  const album = useGetAlbum();
  const newToast = useContext(toastContext);
  const history = useHistory();

  if (album) {
    const initialValues: {
      name: string;
      date: string;
      authors: string[];
      description: string;
    } = {
      name: album.name,
      date: album.date.substring(0, 10),
      authors: album.authors,
      description: album.description ?? '',
    };
    return (
      <>
        <h2 className="visually-hidden">Redigera albuminformation</h2>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              const res = await axios.patch<Album>(
                  `/api/albums/${album._id}`,
                  values,
                  {withCredentials: true},
              );
              newToast({
                title: 'Redigera albuminformation',
                message: 'Ändringarna har sparats.',
                type: 'success',
              });
              // Redirect
              history.push(
                  `/album/${res.data.date.substring(0, 10)}/
                    ${res.data.slug}/edit-album`,
              );
            } catch (error) {
              console.error(error);
              newToast({
                title: 'Redigera albuminformation',
                message: `Det gick inte att spara ändringarna.
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
                Spara
              </button>
            </Form>
          )}
        </Formik>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default EditAlbum;
