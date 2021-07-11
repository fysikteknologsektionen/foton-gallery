import React, {useContext} from 'react';

import {Album} from '../../../interfaces';
import axios from 'axios';
import slug from 'slug';
import {toastContext} from '../../../contexts';
import {useFormState} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to edit album information
 * @return EditAlbum view-component
 */
export function EditAlbum({album}: {album: Album}): JSX.Element {
  const {formState, handleFormChange} = useFormState({
    name: album.name,
    date: album.date.substring(0, 10),
    authors: album.authors.join(', '),
    description: album.description ?? '',
  });
  const history = useHistory();
  const newToast = useContext(toastContext);

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Set empty values to undefined
    const data: Record<string, string | string[] | undefined> = {};
    for (const [key, value] of Object.entries(formState)) {
      if (!value) {
        data[key] = undefined;
      } else {
        if (key === 'authors') {
          // Split authors string into array
          data[key] = value.split(',');
          continue;
        } else {
          data[key] = value;
        }
      }
    }
    try {
      await axios.put<Album>(`/api/albums/${album._id}`, data, {
        withCredentials: true,
      });
      newToast({
        title: 'Redigera album',
        message: 'Ändringarna har sparats.',
        type: 'success',
      });
      history.push(
          `/album/${formState.date}/${slug(formState.name)}/edit`,
      );
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Redigera album',
        message: `Det gick inte att spara ändringarna.
          Är namn/datum kombinationen redan upptagen?`,
        type: 'danger',
      });
    }
  }

  return (
    <>
      <h2 className="visually-hidden">Redigera album</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="edit-album-form-name-input"
            type="text"
            name="name"
            placeholder="Namn"
            required
            value={formState.name}
            onChange={handleFormChange}
          />
          <label htmlFor="edit-album-form-name-input">Namn</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="edit-album-form-date-input"
            type="date"
            name="date"
            placeholder="Datum"
            required
            value={formState.date}
            onChange={handleFormChange}
          />
          <label htmlFor="edit-album-form-date-input">Datum</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="edit-album-form-authors-input"
            type="text"
            name="authors"
            placeholder="Fotograferare"
            value={formState.authors}
            onChange={handleFormChange}
          />
          <label htmlFor="edit-album-form-authors-input">Fotograferare</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            id="edit-album-form-description-input"
            name="description"
            placeholder="Beskrivning"
            value={formState.description}
            onChange={handleFormChange}
            style={{height: '100px'}}
          />
          <label htmlFor="edit-album-form-description-input">Beskrivning</label>
        </div>
        <button className="btn btn-primary" type="submit">
          Spara
        </button>
      </form>
    </>
  );
}
