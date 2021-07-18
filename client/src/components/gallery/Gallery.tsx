import React, {useLayoutEffect} from 'react';

import {Album} from '../../interfaces';
import {GalleryPagination} from './GalleryPagination';
import {GalleryThumbnail} from './GalleryThumbnail';
import {MasonryGrid} from '../common';
import {useFetch} from '../../hooks';
import {useParams} from 'react-router-dom';

/**
 * Component for rendering the gallery (home) view
 * @returns Gallery view-component
 */
export const Gallery: React.VFC = () => {
  const {page} = useParams<{page: string}>();
  const currentPage = page ? Number(page) : 1;
  const albums = useFetch<Album[]>({
    url: '/api/albums',
    config: {params: {page: currentPage, count: 32}},
    errorMessage: 'Det gick inte att hitta några album. Försök igen senare.',
  });
  const albumCount = useFetch<number>({
    url: '/api/albums/count',
  });

  // Scroll to top when switching pages
  useLayoutEffect(() => {
    // setTimeout is used as a hack to make sure the layout is more or less done
    // adjusting before scrolling to the top. This is necessary in some browsers
    // since the scroll can otherwise be interupted.
    const timeout = setTimeout(() => window.scrollTo(0, 0), 300);
    return () => clearTimeout(timeout);
  }, [page]);

  if (albums && albumCount) {
    return (
      <>
        <h1 className="visually-hidden">Galleri</h1>
        {albums.length > 0 ? (
          <MasonryGrid>
            {albums.map((album) => (
              <GalleryThumbnail key={album._id} album={album} />
            ))}
          </MasonryGrid>
        ) : (
          <>
            <h2>Det finns inget här. 🙁</h2>
            <p>Prova att klicka på en av länkarna nedan.</p>
          </>
        )}
        <GalleryPagination count={albumCount} currentPage={currentPage} />
      </>
    );
  } else {
    return null;
  }
};
