import 'react-image-lightbox/style.css';

import {Link, useRouteMatch} from 'react-router-dom';
import React, {useContext, useEffect, useState} from 'react';

import Lightbox from 'react-image-lightbox';
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

  // Hide scrollbar when opening lightbox
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [showLightbox]);

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
        <MasonryGrid>
          {album.images.map((image, index) => (
            <div
              className="scale-on-hover"
              key={image}
              onClick={() => {
                setActiveImage(index);
                setShowLightbox(true);
              }}
            >
              <Thumbnail fileName={image} alt="Albumbild" />
            </div>
          ))}
        </MasonryGrid>
        {showLightbox && (
          <Lightbox
            mainSrc={`/images/scaled/${album.images[activeImage]}`}
            nextSrc={`/images/scaled/${
              album.images[(activeImage + 1) % album.images.length]
            }`}
            prevSrc={`/images/scaled/${
              album.images[
                  (activeImage + album.images.length - 1) % album.images.length
              ]
            }`}
            mainSrcThumbnail={`/images/thumbnail/${album.images[activeImage]}`}
            nextSrcThumbnail={`/images/thumbnail/${
              album.images[(activeImage + 1) % album.images.length]
            }`}
            prevSrcThumbnail={`/images/thumbnail/${
              album.images[
                  (activeImage + album.images.length - 1) % album.images.length
              ]
            }`}
            onCloseRequest={() => setShowLightbox(false)}
            onMoveNextRequest={() =>
              setActiveImage((prev) => (prev + 1) % album.images.length)
            }
            onMovePrevRequest={() =>
              setActiveImage(
                  (prev) => (
                    (prev + album.images.length - 1) % album.images.length
                  ),
              )
            }
            imageLoadErrorMessage="Det gick inte att ladda bilden."
            imageTitle={`Bild ${activeImage + 1}/${album.images.length}`}
            nextLabel="Nästa bild"
            prevLabel="Föregående bild"
            zoomInLabel="Förstora"
            zoomOutLabel="Förminska"
            closeLabel="Stäng fönster"
          />
        )}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default ViewAlbum;
