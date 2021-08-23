import {Field, FieldArray, Form, Formik} from 'formik';
import React, {useContext} from 'react';

import {Album} from '../../../../../../interfaces';
import {Thumbnail} from '../../../../../components/common/thumbnail';
import axios from 'axios';
import {toastContext} from '../../../../../contexts/toast';

/**
 * Component for rendering a grid of an album's images that allows editing
 * order, thumbnail and removing images
 * @param _id Album id
 * @param images Album images
 * @param thumbnail Album thumbnail
 * @return Edit images grid component
 */
export const EditImagesGrid: React.VFC<Album> = ({_id, images, thumbnail}) => {
  const newToast = useContext(toastContext);

  const initialValues: {images: string[]; thumbnail?: string} = {
    images: images.map((image) => image._id),
    thumbnail: thumbnail?._id,
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values) => {
        // If the user has selected an invalid thumbnail, set it to undefined
        // (Can happen e.g. if an image is set as thumbnail and then removed)
        if (values.thumbnail && !values.images.includes(values.thumbnail)) {
          values.thumbnail = undefined;
        }
        try {
          await axios.patch(`/api/albums/${_id}/images`, values, {
            withCredentials: true,
          });
          newToast({
            title: 'Redigera bilder',
            message: 'Ändringarna har sparats.',
            type: 'success',
          });
        } catch (error) {
          console.error(error);
          newToast({
            title: 'Redigera bilder',
            message: 'Det gick inte att spara ändringarna.',
            type: 'danger',
          });
        }
      }}
    >
      {({values, setFieldValue}) => (
        <Form>
          <FieldArray name="images">
            {(arrayHelpers) => (
              <div
                className={`d-grid gap-3 justify-content-center
                  align-items-center`}
                style={{
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(180px, max-content))',
                }}
              >
                {values.images.map((image, index) => (
                  <div key={image}>
                    <div
                      className="position-relative rounded"
                      style={{
                        boxShadow:
                          image === values.thumbnail ?
                            '0 0 0 0.50rem var(--bs-teal)' :
                            'none',
                        transition: 'box-shadow 0.15s ease-in-out',
                      }}
                    >
                      <Field
                        className="visually-hidden"
                        name={`images.${index}`}
                      />
                      <Thumbnail
                        filename={
                          images.find((element) => element._id === image)
                              ?.filename
                        }
                        alt="Albumbild"
                      />
                      <button
                        className="position-absolute btn btn-secondary"
                        style={{left: 0, top: '50%'}}
                        type="button"
                        onClick={() => arrayHelpers.move(index, index - 1)}
                        aria-label="Flytta bakåt"
                      >
                        <i className="bi-arrow-left" aria-hidden="true" />
                      </button>
                      <button
                        className="position-absolute btn btn-secondary"
                        style={{right: 0, top: '50%'}}
                        type="button"
                        onClick={() => arrayHelpers.move(index, index + 1)}
                        aria-label="Flytta framåt"
                      >
                        <i className="bi-arrow-right" aria-hidden="true" />
                      </button>
                      <button
                        className="position-absolute btn btn-danger"
                        style={{right: 0, top: 0}}
                        type="button"
                        onClick={() => arrayHelpers.remove(index)}
                        aria-label="Ta bort"
                      >
                        <i className="bi-x" aria-hidden="true" />
                      </button>
                      <button
                        className="position-absolute btn btn-success"
                        style={{left: 0, top: 0}}
                        type="button"
                        onClick={() => setFieldValue('thumbnail', image)}
                        aria-label="Markera som omslagsbild"
                      >
                        <i className="bi-star" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </FieldArray>
          <button className="btn btn-primary mt-3" type="submit">
            Spara
          </button>
        </Form>
      )}
    </Formik>
  );
};
