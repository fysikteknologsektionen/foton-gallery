import {Link, useRouteMatch} from 'react-router-dom';
import {MasonryGrid, Thumbnail} from '../../common';
import React, {useContext} from 'react';

import {join} from 'path';
import {sessionContext} from '../../../contexts';
import {useGetAlbum} from '../../../hooks';

/**
 * Component for rendering the album view that displays details and
 * images of an album
 * @return React component
 */
export const ViewAlbum: React.VFC = () => {
  const album = useGetAlbum();
  const {url} = useRouteMatch();
  const {session} = useContext(sessionContext);
  if (album) {
    return (
      <>
        <h1 className="text-break">{album.name}</h1>
        <p className="text-break">
          {album.date.substring(0, 10)}
          {album.authors.length > 0 && ` | ${album.authors.join(', ')}`}
        </p>
        {album.description && <p className="text-break">{album.description}</p>}
        {session && (
          <Link
            className="btn btn-outline-secondary mb-3"
            to={join(url, 'edit-album')}
          >
            Hantera
          </Link>
        )}

        <MasonryGrid>
          {album.images.map((image) => (
            <Thumbnail
              className="scale-on-hover"
              key={image}
              fileName={image}
              alt="Albumbild"
            />
          ))}
        </MasonryGrid>
      </>
    );
  } else {
    return null;
  }
};
