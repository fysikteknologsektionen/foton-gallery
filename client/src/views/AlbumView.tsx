import {GoBackButton, LoadData} from '../components';
import React, {useContext, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import {Album} from '../interfaces';
import {userSessionContext} from '../contexts';

interface AlbumIdentifier {
  year: string,
  month: string,
  day: string,
  slug: string
}

/**
 * View component for displaying a specific album
 * @return React component
 */
export function AlbumView() {
  const [album, setAlbum] = useState<Album>();
  const {year, month, day, slug} = useParams<AlbumIdentifier>();
  const {userSession} = useContext(userSessionContext);
  const history = useHistory();

  const imageThumbnails = album?.images?.map((image) => (
    <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
  ));

  return (
    <LoadData<Album>
      query="/api/album"
      params={{
        date: `${year}-${month}-${day}`,
        slug: slug,
      }}
      errorMessage="Albumet gick inte att hitta."
      callback={(data) => setAlbum(data[0])}
    >
      <div className="row">
        <div className="col">
          <h1 className="text-break">
            {album?.name}
          </h1>
          <p className="text-break">
            {`${album?.date.substring(0, 10)} | ${album?.authors?.join(', ')}`}
          </p>
          <p className="text-break">
            {album?.description}
          </p>
        </div>
        <div className="col-12 col-lg-auto">
          {
            userSession && (
              <button
                className="btn btn-outline-secondary mb-3"
                type="button"
                onClick={() => history.push(`/album/${year}/${month}/${day}/${slug}/edit`)}
              >
                Redigera
              </button>
            )
          }
        </div>
      </div>
      <div
        className="d-grid gap-3 justify-content-sm-center"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))',
        }}
      >
        {imageThumbnails}
      </div>
      <GoBackButton className="mt-3" />
    </LoadData>
  );
}
