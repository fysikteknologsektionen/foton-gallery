import axios from 'axios';
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {DeleteAlbumModal, GoBackButton, Loading, SortableWrapper, UploadImagesModal} from '../components';
import {Album} from '../interfaces';

interface AlbumIdentifier {
  year: string,
  month: string,
  day: string,
  slug: string
}

/**
 * View component for displaying edit page of a specific album
 * @return React component
 */
export function EditAlbumView() {
  const [album, setAlbum] = useState<Album>();
  const [loadingError, setLoadingError] = useState<Error>();
  const [formState, setFormState] = useState<Partial<Album> & {authorsString?: string}>({});
  const [submitSuccess, setSubmitSuccess] = useState<boolean>();
  const {year, month, day, slug} = useParams<AlbumIdentifier>();

  // Fetch album
  useEffect(() => {
    (async function() {
      const res = await axios.get<Album[]>('/api/album', {
        params: {
          date: `${year}-${month}-${day}`,
          slug: slug,
        },
      });
      if (!res.data.length) {
        setLoadingError(new Error('Albumet gick inte att hitta. Det kan bero på att sökvägen är felaktig eller att albumet har flyttats.'));
      }
      setAlbum(res.data[0]);
    })();
  }, []);

  /**
   * Updates album if new images are uploaded
   * @param images Array of new images
   */
  function updateImages(images: string[]) {
    if (album) {
      const newAlbum = {...album};
      newAlbum.images = images;
      setAlbum(newAlbum);
    }
  }

  /**
   * Handles changes to the order of images
   * @param images New array of images
   */
  function handleImageReorder(images: string[]) {
    const newState = {...formState};
    newState.images = images;
    setFormState(newState);
  }

  /**
   * Handles changes to form inputs
   * @param event Event issued by origin
   */
  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const newState = {...formState};
    newState[event.currentTarget.name] = event.currentTarget.value;
    setFormState(newState);
  };

  /**
   * Handles submitting of the form
   * @param event FormEvent for onSubmit
   */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitSuccess(undefined);
    // Submit only if there has been any changes to the state
    if (Object.keys(formState).length) {
      formState.authors = formState.authorsString?.split(',');
      try {
        const res = await axios.put<Album>(`/api/album/${album?._id}`, formState);
        setAlbum(res.data);
        setSubmitSuccess(true);
      } catch (error) {
        console.error(error);
        setSubmitSuccess(false);
      }
    }
  }

  // Alert to display after submitting form
  const responseAlert = (
    <div className={`alert ${submitSuccess ? 'alert-success' : 'alert-danger'}`}>
      {submitSuccess ? 'Ändringarna har sparats.' : 'Det gick inte att spara ändringarna, försök igen.'}
    </div>
  );

  return (
    <Loading loading={album ? false : true} error={loadingError}>
      <GoBackButton className="mb-3"/>
      <h1>Redigera album</h1>
      {typeof submitSuccess !== 'undefined' ? responseAlert : <></>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-6 mb-3">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="text"
                id="name-input"
                name="name"
                placeholder="Name"
                defaultValue={album?.name}
                required
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="name-input">Namn</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="date"
                id="date-input"
                name="date"
                placeholder="Date"
                defaultValue={album?.date.substring(0, 10)}
                required
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="date-input">Datum</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="text"
                id="authors-input"
                name="authorsString"
                placeholder="Authors"
                defaultValue={album?.authors?.join(', ')}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="authors-input">Fotograferare</label>
            </div>
            <div className="form-floating">
              <textarea
                className="form-control"
                style={{height: '100px'}}
                id="description-input"
                name="description"
                placeholder="Description"
                defaultValue={album?.description}
                onChange={handleChange}
              />
              <label className="form-label" htmlFor="description-input">Beskrivning</label>
            </div>
          </div>
          <div className="col-12 col-lg-6 mb-3">
            <div className="d-flex justify-content-lg-end">
              <button className="btn btn-primary me-2" type="submit">
                Spara
              </button>
              <button className="btn btn-secondary me-2" type="button" data-bs-toggle="modal" data-bs-target="#upload-modal">
                Ladda upp bilder
              </button>
              <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#delete-modal">
                Radera album
              </button>
            </div>
          </div>
        </div>
        <SortableWrapper
          className="d-grid gap-3 justify-content-sm-center"
          style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, max-content))'}}
          callback={handleImageReorder}
        >
          {album?.images?.map((image) => (
            <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
          )) as JSX.Element[]}
        </SortableWrapper>
      </form>
      <UploadImagesModal albumId={album?._id} callback={updateImages} />
      <DeleteAlbumModal albumId={album?._id} albumName={album?.name} />
      <GoBackButton className="mt-3"/>
    </Loading>
  );
}
