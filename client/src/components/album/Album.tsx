import {Alert, Spinner, Thumbnail} from '../common';
import React, {useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import {Album as AlbumInterface} from '../../interfaces';
import {BackButton} from '../common/BackButton';
import {useFetch} from '../../hooks';
import {userSessionContext} from '../../contexts';

/**
 * View component for rendering a specific album
 * @return React component
 */
export function Album() {
  const {year, month, day, slug} = useParams<{
    year: string,
    month: string,
    day: string,
    slug: string,
  }>();
  const {data, error} = useFetch<AlbumInterface>({
    method: 'GET',
    url: '/api/album',
    params: {
      date: `${year}-${month}-${day}`,
      slug: slug,
    },
  }, true);
  const {userSession} = useContext(userSessionContext);
  const history = useHistory();

  if (error) {
    return (
      <Alert
        type="warning"
        message={'Det gick inte att hitta albumet. ' +
          'Kontrollera att sökvägen är korrekt och försök igen.'}
        heading="Något gick fel"
        showBackButton
      />
    );
  }

  if (!data) {
    return <Spinner />;
  } else {
    return (
      <>
        <div className="row">
          <div className="col">
            <h1 className="text-break">
              {data.name}
            </h1>
            <p className="text-break">
              {
                `${data.date.substring(0, 10)}
                  ${data.authors && ' | ' + data.authors.join(', ') }`
              }
            </p>
            {
              data.description &&
              <p className="text-break">
                {data.description}
              </p>
            }
          </div>
          <div className="col-12 col-lg-auto">
            {
              userSession && (
                <button
                  className="btn btn-outline-secondary mb-3"
                  type="button"
                  onClick={() => (
                    history.push(history.location.pathname + '/edit')
                  )}
                >
                  Redigera
                </button>
              )
            }
          </div>
        </div>
        <div
          className="d-grid gap-3 justify-content-sm-center"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, max-content))',
          }}
        >
          {
            data.images?.map((image) => (
              <Thumbnail
                className="w-100 rounded"
                key={image}
                fileName={image}
                alt={'Bild: ' + image}
              />
            ))
          }
        </div>
        <BackButton className="mt-3" />
      </>
    );
  }
}
