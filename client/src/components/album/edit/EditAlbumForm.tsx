import {Alert, BackButton, Thumbnail} from '../../common';
import React, {FormEvent, useState} from 'react';
import {useFetch, useFormState} from '../../../hooks';

import {Album} from '../../../interfaces';
import {SortableWrapper} from './SortableWrapper';

/**
 * Component for rending a form for editing an album
 * @param album Data for album to edit
 * @return React component
 */
export function EditAlbumForm({album}: {album: Album}) {
  const {formState, setFormValue} = useFormState({
    name: album.name,
    date: album.date.substring(0, 10),
    authors: album.authors?.join(', ') ?? '',
    description: album.description ?? '',
  });
  const [imageOrder, setImageOrder] = useState<string[]>();
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const {error, fetchData} = useFetch<Album>({
    method: 'PUT',
    url: `/api/album/${album._id}`,
    data: {
      ...formState,
      authors: formState.authors.split(','),
      images: imageOrder,
    },
  }, false, () => setFetchSuccess(true));

  /**
   * Handles submitting of the form
   * @param event FormEvent passed by onSubmit
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetchData();
  }

  return (
    <>
      <BackButton className="mb-3"/>
      <h1>Redigera album</h1>
      <form onSubmit={handleSubmit}>
        {
          error &&
          <Alert
            type="danger"
            message={'Det gick inte att spara ändringarna.'}
          />
        }
        {
          fetchSuccess &&
          <Alert
            type="success"
            message={'Ändringarna har sparats'}
          />
        }
        <div className="row">
          <div className="col-12 col-lg-6 mb-3">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="name-input"
                type="text"
                name="name"
                placeholder="Skriv in ett namn"
                required
                value={formState.name}
                onChange={setFormValue}
              />
              <label
                className="form-label"
                htmlFor="name-input"
              >
                Namn
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="date-input"
                type="date"
                name="date"
                placeholder="Välj ett datum"
                required
                value={formState.date}
                onChange={setFormValue}
              />
              <label
                className="form-label"
                htmlFor="date-input"
              >
                Datum
              </label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                id="authors-input"
                type="text"
                name="authors"
                placeholder="Skriv in ett fotograferare"
                value={formState.authors}
                onChange={setFormValue}
              />
              <label
                className="form-label"
                htmlFor="authors-input"
              >
                Fotograferare
              </label>
            </div>
            <div className="form-floating">
              <textarea
                className="form-control"
                id="description-input"
                style={{height: '100px'}}
                name="description"
                placeholder="Skriv in en beskrivning"
                value={formState.description}
                onChange={setFormValue}
              />
              <label
                className="form-label"
                htmlFor="description-input"
              >
                Beskrivning
              </label>
            </div>
          </div>
          <div className="col-12 col-lg-6 mb-3">
            <div className="d-flex justify-content-lg-end">
              <button className="btn btn-primary me-2" type="submit">
                Spara
              </button>
              <button
                className="btn btn-secondary me-2"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#upload-modal"
              >
                Ladda upp bilder
              </button>
              <button
                className="btn btn-danger"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
              >
                Radera album
              </button>
            </div>
          </div>
        </div>
        {
          album.images?.length &&
          <SortableWrapper
            className="d-grid gap-3 justify-content-sm-center"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, ' +
                'minmax(200px, max-content))',
            }}
            callback={setImageOrder}
          >
            {
              album.images?.map((image) => (
                <Thumbnail
                  className="w-100 rounded"
                  key={image}
                  fileName={image}
                  alt={'Bild: ' + image}
                />
              ))

            }
          </SortableWrapper>
        }
      </form>
    </>
  );
}
