import React, {FormEvent, useState} from 'react';

import {Alert} from '../../common';
import axios from 'axios';
import {useFormState} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for displaying a confirmation modal when deleting an album
 * @param albumId ID of the album
 * @param albumName Name of the album
 * @return React component
 */
export function DeleteAlbumModal({albumId, albumName}: {
  albumId: string,
  albumName: string
}) {
  const history = useHistory();
  const [error, setError] = useState<Error>();
  const {formState, handleFormChange} = useFormState();
  const [validationError, setValidationError] = useState(false);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState.name !== albumName) {
      setValidationError(true);
      return;
    }
    try {
      await axios.delete(`/api/album/${albumId}`);
      document.getElementById('delete-modal-close-button')?.click();
      history.push('/');
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }

  return (
    <div
      className="modal fade"
      id="delete-modal"
      aria-labelledby="delete-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="delete-modal-label">
              Radera album
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {
                error &&
                <Alert
                  type="danger"
                  message="Det gick inte att ta bort albumet."
                />
              }
              {
                validationError &&
                <Alert
                  type="warning"
                  message="Det angivna namnet är felaktigt."
                />
              }
              <div>
                <p className="text-danger fw-bolder">
                  OBS: Du håller på att permanent radera ett album
                  (inklusive alla dess bilder). Skriv in namnet på albumet
                  nedan för att bekräfta att du vill ta bort det.
                </p>
                <label
                  className="form-label"
                  htmlFor="delete-modal-name-input">
                    Namn
                </label>
                <input
                  className="form-control"
                  id="delete-modal-name-input"
                  type="text"
                  name="name"
                  required
                  autoCorrect="off"
                  autoComplete="off"
                  autoCapitalize="off"
                  value={formState.name}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger"
                type="submit"
              >
                Radera
              </button>
              <button
                className="btn btn-secondary"
                id="delete-modal-close-button"
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
