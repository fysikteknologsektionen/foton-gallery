import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GoBackButton, Loading} from '../components';
import {Album} from '../interfaces';

interface AlbumIdentifier {
  year: string,
  month: string,
  day: string,
  slug: string
}

/**
 * View component for displaying a specific album
 * @return {JSX.Element}
 */
export function AlbumView() {
  const [album, setAlbum] = useState<Album>();
  const [error, setError] = useState<Error>();
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
        setError(new Error('Albumet gick inte att hitta. Det kan bero på att sökvägen är felaktig eller att albumet har flyttats.'));
      }
      setAlbum(res.data[0]);
    })();
  }, []);

  return (
    <Loading loading={album ? false : true} error={error}>
      <h1>{album?.name}</h1>
      <p>{`${album?.date.substring(0, 10)} | ${album?.authors?.join(', ')}`}</p>
      <p>{album?.description}</p>
      <div className="d-grid gap-3 justify-content-sm-center" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))'}}>
        {album?.images?.map((image) => (
          <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
        ))}
      </div>
      <GoBackButton className="mt-3" />
    </Loading>
  );
}
