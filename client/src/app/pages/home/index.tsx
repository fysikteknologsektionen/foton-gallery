import React, {useLayoutEffect} from 'react';

import {Album} from '../../../interfaces';
import {AlbumPreview} from './AlbumPreview';
import {MasonryGrid} from '../../components/common/masonry-grid';
import {Pagination} from './Pagination';
import {Spinner} from '../../components/common/spinner';
import {useFetch} from '../../hooks';
import {useParams} from 'react-router-dom';

/**
 * Component for rendering the home (gallery) view
 * @returns Home view-component
 */
const HomePage: React.VFC = () => {
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
              <AlbumPreview key={album._id} album={album} />
            ))}
          </MasonryGrid>
        ) : (
          <>
            <h2>Det finns inget här. 🙁</h2>
            <p>Prova att klicka på en av länkarna nedan.</p>
          </>
        )}
        <Pagination albumCount={albumCount} currentPage={currentPage} />
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default HomePage;
