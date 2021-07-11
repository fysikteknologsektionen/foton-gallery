import React, {useState} from 'react';

import {Album} from '../../interfaces';
import {GalleryThumbnail} from './GalleryThumbnail';
import {LoadData} from '../common';

/**
 * Component for rendering the gallery (home) view
 * @returns Gallery view-component
 */
export function Gallery(): JSX.Element {
  const [page] = useState(0);

  return (
    <LoadData<Album[]>
      url="/api/albums"
      config={{params: {page: page, count: 24}}}
    >
      {(albums) => (
        <>
          <h1 className="visually-hidden">Galleri</h1>
          <div
            className="d-grid gap-3 justify-content-center"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(340px, max-content))',
            }}
          >
            {albums.map((album) => (
              <GalleryThumbnail key={album._id} album={album} />
            ))}
          </div>
        </>
      )}
    </LoadData>
  );
}
