import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {GoBack, Loading} from '../components';
import {Album} from '../types';

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
  const {year, month, day, slug} = useParams<AlbumIdentifier>();

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

  return (
    <Loading loading={album ? false : true}>
      <h1>{album?.name}</h1>
      <p>{`${album?.date?.substring(0, 10)} | ${album?.authors?.join(', ')}`}</p>
      <p>{album?.description}</p>
      <div className="d-grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))'}}>
        {album?.images?.map((image) => (
          <img key={image} className="w-100 rounded" src={`/images/thumbnail/${image}`} />
        ))}
      </div>
      <GoBack className="mt-3" />
    </Loading>
  );
}
