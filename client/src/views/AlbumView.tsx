import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
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
  const albumDate = new Date(Number(year), Number(month), Number(day));

  useEffect(() => {
    (async function fetchAlbumData() {
      const res = await axios.get<Album>('/api/album', {
        params: {
          date: albumDate,
          slug: slug,
        },
      });
      setAlbum(res.data);
    })();
  });

  return (
    <>
      {JSON.stringify(album)}
    </>
  );
}
