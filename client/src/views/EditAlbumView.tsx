import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Loading, SortableWrapper} from '../components';
import {Album} from '../types';

interface AlbumIdentifier {
  year: string,
  month: string,
  day: string,
  slug: string
}

/**
 * View component for displaying edit page of a specific album
 * @return {JSX.Element}
 */
export function EditAlbumView() {
  const [album, setAlbum] = useState<Album>();
  const [imageOrder, setImageOrder] = useState<string[]>([]);
  const {year, month, day, slug} = useParams<AlbumIdentifier>();
  const history = useHistory();

  // Fetch album
  useEffect(() => {
    (async function fetchAlbumData() {
      const res = await axios.get<Album>('/api/album', {
        params: {
          date: `${year}-${month}-${day}`,
          slug: slug,
        },
      });
      setAlbum(res.data);
    })();
  }, []);

  /**
   * Handles submitting of the form
   * @param {React.FormEvent<HTMLFormElement>} event - FormEvent for onSubmit
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries()) as {[key: string]: string | string[]};
    jsonData.images = imageOrder;
    await axios.put('/api/album', jsonData, {
      params: {
        id: album?._id,
      },
    });
  }

  return (
    <Loading loading={album ? false : true}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12 col-lg-6 mb-3">
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="text"
                id="input-name"
                name="name"
                placeholder="Name"
                defaultValue={album?.name}
              />
              <label className="form-label" htmlFor="input-name">Namn</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="date"
                id="input-date"
                name="date"
                placeholder="Date"
                defaultValue={album?.date.substring(0, 10)}
              />
              <label className="form-label" htmlFor="input-date">Datum</label>
            </div>
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="text"
                id="input-authors"
                name="authors"
                placeholder="Authors"
                defaultValue={album?.authors?.join(', ')}
              />
              <label className="form-label" htmlFor="input-authors">Fotograferare</label>
            </div>
            <div className="form-floating">
              <textarea
                className="form-control"
                style={{height: '100px'}}
                id="input-description"
                name="description"
                placeholder="Description"
                defaultValue={album?.description}
              />
              <label className="form-label" htmlFor="input-description">Beskrivning</label>
            </div>
          </div>
          <div className="col-md-12 col-lg-6 mb-3">
            <div className="d-flex justify-content-lg-end">
              <button
                className="btn btn-primary me-2"
                type="submit"
              >
                Spara
              </button>
              <button
                className="btn btn-danger me-2"
                type="button"
                onClick={() => history.push(`/album/${year}/${month}/${day}/${slug}`)}
              >
                Avbryt
              </button>
              <button
                className="btn btn-secondary"
                type="button"
              >
                Ladda upp bilder
              </button>
            </div>
          </div>
        </div>
        <SortableWrapper
          className="d-grid gap-3 justify-content-sm-center"
          style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, max-content))'}}
          callback={setImageOrder}
        >
          {album?.images?.map((image) => (
            <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
          )) as JSX.Element[]}
        </SortableWrapper>
      </form>
    </Loading>
  );
}
