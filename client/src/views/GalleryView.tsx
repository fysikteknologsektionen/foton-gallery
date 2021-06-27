import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Loading} from '../components';
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
          limit: 24,
        },
      });
      setAlbums(res.data);
    })();
  }, []);

  const albumThumbnails = albums?.map((album) => {
    const albumDate = new Date(album.date);
    const dateURIString = albumDate.toISOString().substring(0, 10).replaceAll('-', '/');
    const thumbnail = album.thumbnail ? album.thumbnail : album.images ? album.images[0] : undefined;

    return (
      <div key={`${album.date}-${album.slug}`} className="card">
        <img className="card-img-top w-100" src={`/images/thumbnail/${thumbnail}`} alt={album.name} />
        <div className="card-body">
          <p className="h5">{album.name}</p>
          <p className="card-text mb-1">{`${albumDate.toISOString().substring(0, 10)} | ${album.authors?.join(', ')}`}</p>
          <p className="card-text">{album.description}</p>
          <Link className="btn btn-primary" to={`/album/${dateURIString}/${album.slug}`}>Visa album</Link>
        </div>
      </div>
    );
  });

  return (
    <Loading loading={albums ? false : true}>
      <div className="d-grid gap-3" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(400px, max-content))'}}>
        {albumThumbnails}
      </div>
    </Loading>
  );
}
