import {Link, useRouteMatch} from 'react-router-dom';
import React, {useContext} from 'react';

import {Album} from '../../../interfaces';
import {Thumbnail} from '../../common';
import {sessionContext} from '../../../contexts';

/**
 * Component for rendering the album view that displays details and
 * images of an album
 * @return React component
 */
export function ViewAlbum({album}: {album: Album}): JSX.Element {
  const {url} = useRouteMatch();
  const {session} = useContext(sessionContext);

  return (
    <>
      <h1 className="text-break">{album.name}</h1>
      <p className="text-break">
        {album.date.substring(0, 10)}
        {album.authors.length > 0 && ` | ${album.authors.join(', ')}`}
      </p>
      {album.description && <p className="text-break">{album.description}</p>}
      {session && (
        <Link className="btn btn-outline-secondary mb-3" to={`${url}/edit`}>
          Hantera
        </Link>
      )}

      <div
        className="d-grid gap-3 justify-content-sm-center"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))',
        }}
      >
        {album.images.map((image) => (
          <Thumbnail
            className="w-100 rounded"
            key={image}
            fileName={image}
            alt="Albumbild"
          />
        ))}
      </div>
    </>
  );
}
