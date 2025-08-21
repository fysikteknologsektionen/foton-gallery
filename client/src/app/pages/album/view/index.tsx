import 'react-image-lightbox/style.css';
import '../../../styles/lightbox-override.scss';

import {Link, useRouteMatch} from 'react-router-dom';
import React, {useContext, useState} from 'react';

import ImageFullscreenView from '../components/image-fullscreen-view';
import {MasonryGrid} from '../../../components/common/masonry-grid';
import {Spinner} from '../../../components/common/spinner';
import {Thumbnail} from '../../../components/common/thumbnail';
import {join} from 'path';
import {sessionContext} from '../../../contexts/session';
import {useGetAlbum} from '../../../hooks';

/**
 * Component for displaying album details
 * @return React component
 */
const ViewAlbum: React.VFC = () => {
  const album = useGetAlbum();
  const {url} = useRouteMatch();
  const {session} = useContext(sessionContext);
  const [showLightbox, setShowLightbox] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (album) {
    return (
      <>
        <h1 className="text-break">{album.name}</h1>
        <p className="text-break">
          {album.date.substring(0, 10)}
          {album.authors.length > 0 && ` | ${album.authors.join(', ')}`}
        </p>
        {album.description && <p className="text-break">{album.description}</p>}
        {session && (
          <Link
            className="btn btn-outline-secondary mb-3"
            to={join(url, 'edit-album')}
          >
            Hantera
          </Link>
        )}
        {album.images.length > 0 ? (
          <MasonryGrid>
            {album.images.map((image, index) => (
              <div
                className="scale-on-hover"
                key={image._id}
                onClick={() => {
                  setActiveImage(index);
                  setShowLightbox(true);
                }}
              >
                <Thumbnail filename={image.filename} alt="Albumbild" />
              </div>
            ))}
          </MasonryGrid>
        ) : (
          <p className="text-muted">Det här albumet innehåller inga bilder.</p>
        )}
        <ImageFullscreenView
          show={showLightbox}
          setShow={setShowLightbox}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
          album={album}
        />
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default ViewAlbum;
