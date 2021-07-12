import {LoadData, MasonryGrid} from '../common';
import React, {useState} from 'react';

import {Album} from '../../interfaces';
import {GalleryThumbnail} from './GalleryThumbnail';

/**
 * Component for rendering the gallery (home) view
 * @returns Gallery view-component
 */
export const Gallery: React.VFC = () => {
  const [page] = useState(0);

  return (
    <LoadData<Album[]>
      url="/api/albums"
      config={{params: {page: page, count: 24}}}
    >
      {(albums) => (
        <>
          <h1 className="visually-hidden">Galleri</h1>
          <MasonryGrid>
            {albums.map((album) => (
              <GalleryThumbnail key={album._id} album={album} />
            ))}
          </MasonryGrid>
        </>
      )}
    </LoadData>
  );
};
