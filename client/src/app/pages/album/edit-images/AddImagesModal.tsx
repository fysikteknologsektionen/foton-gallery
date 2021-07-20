import {Form, Formik} from 'formik';
import React, {useContext, useEffect, useRef} from 'react';

import {Album} from '../../../../interfaces';
import {Modal} from 'bootstrap';
import axios from 'axios';
import {toastContext} from '../../../contexts/toast';
import {useHistory} from 'react-router-dom';

/**
 * Component for displaying modal that allows uploading images
 * @param _id Album id
 * @return Add images modal component
 */
export const AddImagesModal: React.VFC<Album> = ({_id}) => {
  const history = useHistory();
  const newToast = useContext(toastContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      new Modal(modalRef.current);
    }
  }, [modalRef]);

  /**
   * Toggles the modal
   */
  function toggleModal() {
    if (modalRef.current) {
      Modal.getInstance(modalRef.current)?.toggle();
    }
  }

  const initialValues: {images: FileList} = {images: {} as FileList};

  return (
    <>
      <button className="btn btn-primary" type="button" onClick={toggleModal}>
        Välj bilder
      </button>
      <div
        className="modal fade"
        id="upload-modal"
        aria-labelledby="upload-modal-label"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="upload-modal-label">
                Lägg till bilder
              </h2>
            </div>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {
                const formData = new FormData();
                Array.from(values.images).forEach((image) =>
                  formData.append('images', image),
                );
                try {
                  await axios.post(`/api/albums/${_id}/images`, formData, {
                    withCredentials: true,
                  });
                  newToast({
                    title: 'Lägg till bilder',
                    message: 'Bilderna har lagts till i albumet.',
                    type: 'success',
                  });
                  toggleModal();
                  // Reload page
                  history.push(history.location.pathname);
                } catch (error) {
                  console.error(error);
                  newToast({
                    title: 'Lägg till bilder',
                    message: 'Det gick inte att lägga till bilderna.',
                    type: 'danger',
                  });
                }
              }}
            >
              {({setFieldValue}) => (
                <Form>
                  <div className="modal-body">
                    <label className="form-label" htmlFor="upload-modal-images">
                      Välj bilder
                    </label>
                    <input
                      className="form-control"
                      id="upload-modal-images"
                      type="file"
                      accept="image/*"
                      multiple
                      required
                      onChange={(event) =>
                        setFieldValue('images', event.currentTarget.files)
                      }
                    />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" type="submit">
                      Lägg till
                    </button>
                    <button
                      className="btn btn-secondary"
                      id="upload-modal-close-button"
                      type="button"
                      onClick={toggleModal}
                    >
                      Stäng
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};
