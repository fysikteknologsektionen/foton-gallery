import axios from 'axios';
import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useHistory} from 'react-router-dom';

/**
 * Component for displaying a confirmation modal when deleting an album
 * @param albumId ID of the album
 * @param albumName Name of the album
 * @return React component
 */
export function DeleteAlbumModal({albumId, albumName}: {albumId?: string, albumName?: string}) {
  const [submitError, setSubmitError] = useState<boolean>(false);
  const [inputName, setInputName] = useState<string>();
  const history = useHistory();

  /**
   * Handles submitting of the form
   * @param event FormEvent for onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(false);
    if (inputName !== albumName) {
      setSubmitError(true);
      return;
    }
    try {
      await axios.delete(`/api/album/${albumId}`);
      // This is a hacky way to solve the issue of closing the modal after successful deletion,
      // should probably be fixed by using bootstrap as esm module instead and invoking .hide()
      const closeModalButton = document.getElementById('delete-modal-close-button');
      closeModalButton?.click();
      // Delay redirect to allow modal to hide properly
      setTimeout(() => history.push('/'), 300);
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    }
  }

  // Alert to display on failed request
  const responseAlert = (
    <div className="alert alert-danger">
      Det gick inte att radera albumet, kontrollera att du har skrivit in rätt namn och försök igen.
    </div>
  );

  return (
    <div className="modal fade" id="delete-modal" aria-labelledby="delete-modal-label" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="delete-modal-label">Radera album</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {submitError && responseAlert}
              <div>
                <p className="text-danger fw-bolder">OBS: Du håller på att permanent radera ett album (inklusive alla dess bilder). Skriv in namnet på albumet nedan för att bekräfta att du vill ta bort det.</p>
                <label className="form-label" htmlFor="delete-modal-name-input">Namn</label>
                <input
                  className="form-control"
                  type="text"
                  id="delete-modal-name-input"
                  name="name"
                  required
                  autoCorrect="off"
                  autoComplete="off"
                  autoCapitalize="off"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setInputName(event.currentTarget.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-danger" type="submit">Radera</button>
              <button className="btn btn-secondary" id="delete-modal-close-button" type="button" data-bs-dismiss="modal">Stäng</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
