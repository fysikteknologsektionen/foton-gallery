import React, {useContext} from 'react';

import {Album} from '../../../interfaces';
import axios from 'axios';
import {toastContext} from '../../../contexts';
import {useFormState} from '../../../hooks';
import {useHistory} from 'react-router-dom';

/**
 * Component for rendering a form to create an album
 * @return CreateAlbum view-component
 */
export const CreateAlbum: React.VFC = () => {
  const {formState, handleFormChange} = useFormState();
  const newToast = useContext(toastContext);
  const history = useHistory();

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
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
      // Create album
      const res = await axios.post<Album>('/api/albums', data, {
        withCredentials: true,
      });
      // Upload images
      if (formElement['images'].files.length > 0) {
        const formData = new FormData(formElement);
        await axios.post(`/api/albums/${res.data._id}/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      }

      newToast({
        title: 'Skapa album',
        message: 'Albumet har skapats.',
        type: 'success',
      });
      // Redirect
      history.push(`/album/${res.data.date.substring(0, 10)}/${res.data.slug}`);
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Skapa album',
        message: `Det gick inte att skapa albumet.
          Är namn/datum kombinationen redan upptagen?`,
        type: 'danger',
      });
    }
  }

  return (
    <>
      <h1>Skapa album</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="create-album-form-name-input"
            type="text"
            name="name"
            placeholder="Namn"
            required
            value={formState.name}
            onChange={handleFormChange}
          />
          <label htmlFor="create-album-form-name-input">Namn</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="create-album-form-date-input"
            type="date"
            name="date"
            placeholder="Datum"
            required
            value={formState.date}
            onChange={handleFormChange}
          />
          <label htmlFor="create-album-form-date-input">Datum</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="create-album-form-authors-input"
            type="text"
            name="authors"
            placeholder="Fotograferare"
            value={formState.authors}
            onChange={handleFormChange}
          />
          <label htmlFor="create-album-form-authors-input">Fotograferare</label>
        </div>
        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            id="create-album-form-description-input"
            name="description"
            placeholder="Beskrivning"
            value={formState.description}
            onChange={handleFormChange}
            style={{height: '100px'}}
          />
          <label htmlFor="create-album-form-description-input">
            Beskrivning
          </label>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="create-album-form-file-input">
            Välj bilder
          </label>
          <input
            className="form-control"
            id="create-album-form-file-input"
            name="images"
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Skapa
        </button>
      </form>
    </>
  );
};
