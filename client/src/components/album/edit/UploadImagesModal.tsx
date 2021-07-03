import React, {FormEvent, useState} from 'react';

import {Alert} from '../../common';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

/**
 * Component for displaying modal that allows uploading images
 * @param albumId ID of the album to add images to
 * @return React component
 */
export function UploadImagesModal({albumId}: {albumId?: string}) {
  const [error, setError] = useState(false);
  const history = useHistory();

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await axios.post<string[]>(`/api/album/${albumId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reload page
      history.go(0);
      const closeButton = document.getElementById('upload-modal-close-button');
      closeButton?.click();
    } catch (error) {
      console.error(error);
      setError(true);
    }
  }

  return (
    <div
      className="modal fade"
      id="upload-modal"
      aria-labelledby="upload-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="upload-modal-label">
              Ladda upp bilder
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {
                error &&
                <Alert
                  type="danger"
                  message="Det gick inte att ladda upp filerna. Försök igen."
                />
              }
              <div>
                <label
                  className="form-label"
                  htmlFor="upload-modal-file-input"
                >
                    Välj bilder
                </label>
                <input
                  className="form-control"
                  id="upload-modal-file-input"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                type="submit"
              >
                Ladda upp
              </button>
              <button
                className="btn btn-secondary"
                id="upload-modal-close-button"
                type="button"
                data-bs-dismiss="modal"
              >
                  Stäng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
