import {Link, useRouteMatch} from 'react-router-dom';
import {MasonryGrid, Thumbnail} from '../../common';
import React, {useContext} from 'react';

import {Album} from '../../../interfaces';
import {join} from 'path';
import {sessionContext} from '../../../contexts';

/**
 * Component for rendering the album view that displays details and
 * images of an album
 * @return React component
 */
export const ViewAlbum: React.VFC<Album> = ({
  name,
  date,
  authors,
  description,
  images,
}) => {
  const {url} = useRouteMatch();
  const {session} = useContext(sessionContext);

  return (
    <>
      <h1 className="text-break">{name}</h1>
      <p className="text-break">
        {date.substring(0, 10)}
        {authors.length > 0 && ` | ${authors.join(', ')}`}
      </p>
      {description && <p className="text-break">{description}</p>}
      {session && (
        <Link className="btn btn-outline-secondary mb-3" to={join(url, 'edit')}>
          Hantera
        </Link>
      )}

      <MasonryGrid>
        {images.map((image) => (
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
};
