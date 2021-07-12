import React, {useContext} from 'react';

import {Album} from '../../../interfaces';
import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useFormState} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to delete an album
 * @param album Album data
 * @return DeletAlbum view-component
 */
export const DeleteAlbum: React.VFC<Album> = ({_id, name}) => {
  const {formState, handleFormChange} = useFormState();
  const history = useHistory();
  const newToast = useContext(toastContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (formState.name !== name) {
      newToast({
        title: 'Ta bort album',
        message: 'Det angivna namnet stämmer inte.',
        type: 'warning',
      });
      return;
    }
    try {
      await axios.delete(`/api/albums/${_id}`, {
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
  }

  return (
    <>
      <h2 className="visually-hidden">Ta bort album</h2>
      <form onSubmit={handleSubmit}>
        <p className="text-danger">
          OBS: Du håller på att permanent radera ett album (inklusive alla dess
          bilder). Skriv in namnet på albumet nedan för att bekräfta att du vill
          ta bort det.
        </p>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="delete-album-form-name-input"
            type="text"
            name="name"
            placeholder="Name"
            required
            value={formState.name}
            onChange={handleFormChange}
          />
          <label htmlFor="delete-album-form-name-input">Namn</label>
        </div>
        <button className="btn btn-primary" type="submit">
          Ta bort
        </button>
      </form>
    </>
  );
};
