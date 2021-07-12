import React, {useContext, useEffect, useRef} from 'react';

import {Album} from '../../../interfaces';
import {Modal} from 'bootstrap';
import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useHistory} from 'react-router-dom';

/**
 * Component for displaying modal that allows uploading images
 * @param _id ID of the album to add images to
 * @return React component
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

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await axios.post(`/api/albums/${_id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      newToast({
        title: 'Lägg till bilder',
        message: 'Bilderna har lagts till i albumet.',
        type: 'success',
      });
      toggleModal();
      // Reload page
      history.go(0);
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Lägg till bilder',
        message: 'Det gick inte att lägga till bilderna.',
        type: 'danger',
      });
    }
  }

  return (
    <>
      <button className="btn btn-primary" type="button" onClick={toggleModal}>
        Lägg till bilder
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
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div>
                  <label
                    className="form-label"
                    htmlFor="upload-modal-form-file-input"
                  >
                    Välj bilder
                  </label>
                  <input
                    className="form-control"
                    id="upload-modal-form-file-input"
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" type="submit">
                  Ladda upp
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
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
