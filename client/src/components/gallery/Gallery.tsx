import {Alert, Spinner} from '../common';

import {Album} from '../../interfaces';
import {GalleryThumbnail} from './GalleryThumbnail';
import React from 'react';
import {useGetData} from '../../hooks';
import {useParams} from 'react-router-dom';

/**
 * View component for rendering a gallery of albums
 * @return React component
 */
export function Gallery() {
  const {page = '0'} = useParams<{page: string}>();
  const {data, error} = useGetData<Album[]>({
    url: '/api/album',
    params: {
      limit: 24,
      offset: Number(page) * 24,
    },
  });

  if (error) {
    return (
      <Alert
        type="danger"
        message="Det gick inte att ladda sidinnehållet. Försök igen senare."
        heading="Något gick fel"
      />
    );
  }

  if (!data) {
    return <Spinner />;
  } else {
    return (
      <>
        <h1 className="visually-hidden">Galleri</h1>
        <div
          className="d-grid gap-3 justify-content-sm-center"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, max-content))',
          }}
        >
          {
            data.map((album) => (
              <GalleryThumbnail key={album._id} album={album} />
            ))
          }
        </div>
      </>
    );
  }
}
