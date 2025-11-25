import React, {useLayoutEffect, useState} from 'react';
import {useLocation, useParams} from 'react-router-dom';

import {Album} from '../../../interfaces';
import {AlbumPreview} from './components/album-preview';
import {MasonryGrid} from '../../components/common/masonry-grid';
import {Pagination} from './components/pagination';
import {Spinner} from '../../components/common/spinner';
import {useFetch} from '../../hooks';

const ORDER_NAMES = {
  '-date': 'Datum: Nyast först',
  'date': 'Datum: Äldst först',
};

const getDefaultOrderBy = (params: URLSearchParams): 'date' | '-date' => {
  const query = params.get('order');
  if (query !== 'date' && query !== '-date') {
    return '-date';
  }

  return query;
};

/**
 * Component for rendering the home (gallery) view
 * @returns Home view-component
 */
const HomePage: React.VFC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const q = searchParams.get('q') ?? '';

  const [previewQ, setPreviewQ] = useState(q);
  const [orderBy, setOrderBy] = useState(getDefaultOrderBy(searchParams));

  const {page} = useParams<{page: string}>();
  const currentPage = page ? Number(page) : 1;

  const albums = useFetch<Album[]>({
    url: '/api/albums',
    config: {params: {
      page: currentPage,
      count: 32,
      q: q,
      order: orderBy,
    }},
  });
  const albumCount = useFetch<number>({
    url: '/api/albums/count',
    config: {params: {q: q}},
  });

  // Scroll to top when switching pages
  useLayoutEffect(() => {
    // setTimeout is used as a hack to make sure the layout is more or less done
    // adjusting before scrolling to the top. This is necessary in some browsers
    // since the scroll can otherwise be interupted.
    const timeout = setTimeout(() => window.scrollTo(0, 0), 300);
    return () => clearTimeout(timeout);
  }, [page]);

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const urlParams = new URLSearchParams(window.location.search);
    if (previewQ) {
      urlParams.set('q', previewQ);
    } else {
      urlParams.delete('q');
    }

    if (orderBy !== '-date') {
      urlParams.set('order', orderBy);
    } else {
      urlParams.delete('order');
    }

    window.location.search = urlParams.toString();
    e.preventDefault();
  };

  if (albums && albumCount !== undefined) {
    return (
      <>
        <h1 className="visually-hidden">Galleri</h1>
        <form onSubmit={submit}>
          <div className='d-flex flex-column flex-md-row gap-3 mb-3'>
            <div className='d-flex flex-grow-1 gap-3'>
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder={
                  'Sök efter arr, album från en läsperiod, mottagningen, ...'
                }
                aria-label="Sök"
                value={previewQ}
                onChange={(e) => setPreviewQ(e.target.value)}
              />
              <button
                className="btn btn-outline-primary my-2 my-sm-0 px-md-5"
                type="submit"
              >Sök</button>
            </div>

            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {ORDER_NAMES[orderBy]}
              </button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                {Object.entries(ORDER_NAMES).map(([order, label]) => (
                  <button
                    key={order}
                    className={
                      `dropdown-item ${order === orderBy ? 'active' : ''}`
                    }
                    onClick={() => setOrderBy(order as ('-date' | 'date'))}
                  >{label}</button>
                ))}
              </div>
            </div>
          </div>
        </form>
        {albums.length > 0 ? (
          <MasonryGrid>
            {albums.map((album) => (
              <AlbumPreview key={album._id} album={album} />
            ))}
          </MasonryGrid>
        ) : (
          <>
            <h2>Det finns inget här. 🙁</h2>
            {q !== undefined && q.trim() !== '' ? (
              <p>Din sökning gav inga resultat. För att få bättre resultat,
                se till att sökningen är rättstavad och ange den fullständiga
                taggen om du söker efter taggar.</p>
            ) : currentPage === 0 ? (
              <p>Skapa ett nytt album och lägg till bilder.</p>
            ) : (
              <p>Prova att välja en av flikarna nedan.</p>
            )}
          </>
        )}
        {albumCount !== 0 && (
          <Pagination albumCount={albumCount} currentPage={currentPage} />
        )}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default HomePage;
