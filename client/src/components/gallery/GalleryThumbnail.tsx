import {Album} from '../../interfaces';
import {Link} from 'react-router-dom';
import React from 'react';
import {Thumbnail} from '../common';

/**
 * Component that renders an album thumbnail with overlayed album information
 * @param album Album data
 * @return React component
 */
export function GalleryThumbnail({album}: {album: Album}) {
  const albumDate = album.date.substring(0, 10);
  const thumbnailImage = album.thumbnail ??
    (album.images?.length ? album.images[0] : '');

  return (
    <Link
      key={`${album.date}-${album.slug}`}
      to={`/album/${albumDate.replaceAll('-', '/')}/${album.slug}`}
    >
      <div className="card">
        <Thumbnail
          className="card-img w-100"
          fileName={thumbnailImage}
          alt={album.name}
        />
        <div
          className={'card-img-overlay d-inline-flex ' +
            'flex-column justify-content-end p-0'}
        >
          <div
            className="bg-dark text-white rounded-bottom p-3"
            style={{opacity: 0.75}}>
            <h2 className="card-title h5">
              {album.name}
            </h2>
            <p className="card-text mb-1">
              {
                `${albumDate}
                ${album.authors && ' | ' + album.authors.join(', ') }`
              }
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
