import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Album} from '../types';

/**
 *  View component for displaying album gallery
 * @return {JSX.Element}
 */
export function GalleryView() {
  const [albums, setAlbums] = useState<Album[]>();
  const [offset] = useState<number>(0);

  useEffect(() => {
    (async function() {
      const res = await axios.get<Album[]>('/api/album', {
        params: {
          offset: offset,
          limit: 12,
        },
      });
      setAlbums(res.data);
    })();
  }, []);

  return (
    <>
      {albums?.map((album) => <p key={album.slug}>{`${album.name} ${new Date(album.date).toISOString()}`}</p>)}
    </>
  );
}
