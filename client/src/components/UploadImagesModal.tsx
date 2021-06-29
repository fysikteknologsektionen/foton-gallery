import axios from 'axios';
import React, {FormEvent, useState} from 'react';

/**
 * Component for displaying modal that allows uploading images
 * @param {string | undefined} albumId - ID of the album to add images to
 * @return {JSX.Element}
 */
export function UploadImagesModal({albumId, callback}: {albumId?: string, callback: Function}) {
  const [submitError, setSubmitError] = useState<boolean>(false);

  /**
   * Handles submitting of the form
   * @param {React.FormEvent<HTMLFormElement>} event - FormEvent for onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(false);
    const formData = new FormData(event.currentTarget);
    try {
      const res = await axios.post<string[]>(`/api/album/${albumId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      callback(res.data);
      // This is a hacky way to solve the issue of closing the modal after successful upload,
      // should probably be fixed by using bootstrap as esm module instead and invoking .hide()
      const modalElement = document.getElementById('modal-button-close');
      modalElement?.click();
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    }
  }

  // Alert to display on failed form submit
  const responseAlert = (
    <div className="alert alert-danger">
      Det gick inte att ladda upp bilderna, försök igen.
    </div>
  );

  return (
    <div className="modal fade" id="modal-upload" aria-labelledby="modal-label-upload" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title" id="modal-label-upload">Ladda upp bilder</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {submitError ? responseAlert : <></>}
              <div>
                <label className="form-label" htmlFor="form-control">Välj bilder</label>
                <input
                  className="form-control"
                  type="file"
                  id="input-file"
                  name="images"
                  placeholder="Images"
                  accept="image/*"
                  multiple
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" type="submit">Ladda upp</button>
              <button className="btn btn-secondary" id="modal-button-close" type="button" data-bs-dismiss="modal">Stäng</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
