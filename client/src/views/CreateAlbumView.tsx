import axios from 'axios';
import React from 'react';

/**
 * View component for creating a new album
 * @return React component
 */
export function CreateAlbumView() {
  /**
   * Handles submitting of the form
   * @param event FormEvent for onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await axios.post('/api/album', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  return (
    <>
      <h1 className="display-5">Skapa nytt album</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input className="form-control" id="input-name" type="text" required name="name" placeholder="Namn" />
          <label htmlFor="input-name">Namn</label>
        </div>
        <div className="form-floating mb-3">
          <textarea className="form-control h-100" id="input-description" name="description" placeholder="Beskrivning" />
          <label htmlFor="input-description">Beskrivning</label>
        </div>
        <div className="form-floating mb-3">
          <input className="form-control" id="input-authors" type="text" name="authors" placeholder="Fotograferare" />
          <label htmlFor="input-authors">Fotograferare</label>
        </div>
        <div className="form-floating mb-3">
          <input className="form-control" id="input-date" type="date" required name="date" placeholder="Datum" />
          <label htmlFor="input-date">Datum</label>
        </div>
        <div className="form-floating">
          <input className="form-control" id="input-file" type="file" accept="image/*" multiple name="images" placeholder="Bildfiler" />
          <label htmlFor="input-file">Bildfiler*</label>
          <p className="text-muted">*Du kan välja förhandsgranskningsbild efter att albumet har skapats.</p>
        </div>
        <button className="btn btn-outline-primary" type="submit">Skapa</button>
      </form>
    </>
  );
}
