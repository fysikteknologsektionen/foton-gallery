import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {GoBackButton, Loading} from '../components';
import {userSessionContext} from '../contexts';
import {Album} from '../interfaces';

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
  const [loadingError, setLoadingError] = useState<Error>();
  const {year, month, day, slug} = useParams<AlbumIdentifier>();
  const {userSession} = useContext(userSessionContext);
  const history = useHistory();

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

  return (
    <Loading loading={album ? false : true} error={loadingError}>
      <div className="row">
        <div className="col">
          <h1 className="text-break">{album?.name}</h1>
          <p className="text-break">{`${album?.date.substring(0, 10)} | ${album?.authors?.join(', ')}`}</p>
          <p className="text-break">{album?.description}</p>
        </div>
        <div className="col-12 col-lg-auto">
          {userSession ? (
            <button
              className="btn btn-outline-secondary mb-3"
              type="button"
              onClick={() => history.push(`/album/${year}/${month}/${day}/${slug}/edit`)}
            >
              Redigera
            </button>
            ) : <></>}
        </div>
      </div>
      <div className="d-grid gap-3 justify-content-sm-center" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))'}}>
        {album?.images?.map((image) => (
          <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
        ))}
      </div>
      <GoBackButton className="mt-3" />
    </Loading>
  );
}
