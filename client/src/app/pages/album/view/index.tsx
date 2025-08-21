import 'react-image-lightbox/style.css';
import '../../../styles/lightbox-override.scss';

import {Link, useRouteMatch} from 'react-router-dom';
import React, {useContext, useEffect, useState} from 'react';

import Lightbox from 'react-image-lightbox';
import {MasonryGrid} from '../../../components/common/masonry-grid';
import Metadata from '../components/metadata';
import {Spinner} from '../../../components/common/spinner';
import {Thumbnail} from '../../../components/common/thumbnail';
import {join} from 'path';
import {parse} from 'exifr';
import {sessionContext} from '../../../contexts/session';
import {useGetAlbum} from '../../../hooks';

/**
 * Download the original version of an image
 * @param fileName File name and extension without full path
 */
const downloadFullsize = async (fileName: string) => {
  const url = `/images/fullsize/${fileName}`;

  const blob = await fetch(url).then((res) => res.blob());
  const dataUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

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
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadata, setMetadata] = useState<
    Record<string, unknown> | undefined
  >();

  // Hide scrollbar when opening lightbox
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
      setMetadata(undefined);
      setShowMetadata(false);
    }
  }, [showLightbox]);

  // Fetch metadata
  useEffect(() => {
    (async () => {
      if (album && metadata === undefined && showMetadata) {
        const fileName = album.images[activeImage].filename;
        const url = `/images/fullsize/${fileName}`;
        const blob = await fetch(url).then((res) => res.blob());
        const dataUrl = URL.createObjectURL(blob);
        const metadata = await parse(dataUrl).catch(console.error);
        console.log(metadata);
        setMetadata(metadata);
      }
    })();
  }, [activeImage, album, metadata, showMetadata]);

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
        {showLightbox && (
          <Lightbox
            mainSrc={`/images/scaled/${album.images[activeImage].filename}`}
            nextSrc={`/images/scaled/${
              album.images[(activeImage + 1) % album.images.length].filename
            }`}
            prevSrc={`/images/scaled/${
              album.images[
                  (activeImage + album.images.length - 1) % album.images.length
              ].filename
            }`}
            mainSrcThumbnail={`/images/thumbnail/${
              album.images[activeImage].filename
            }`}
            nextSrcThumbnail={`/images/thumbnail/${
              album.images[(activeImage + 1) % album.images.length].filename
            }`}
            prevSrcThumbnail={`/images/thumbnail/${
              album.images[
                  (activeImage + album.images.length - 1) % album.images.length
              ].filename
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
            imageCaption={showMetadata ?
              <>
                <h5>Metadata</h5>
                <Metadata metadata={metadata} />
              </> :
              undefined
            }
            nextLabel="Nästa bild"
            prevLabel="Föregående bild"
            zoomInLabel="Förstora"
            zoomOutLabel="Förminska"
            closeLabel="Stäng fönster"
            toolbarButtons={[
              <button
                className="btn btn-secondary p-1 m-1"
                onClick={() => {
                  downloadFullsize(album.images[activeImage].filename);
                }}
              >Ladda ner original</button>,
              <button
                className="btn btn-secondary p-1 m-1"
                onClick={() => setShowMetadata(!showMetadata)}
              >Metadata</button>,
            ]}
          />
        )}
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default ViewAlbum;
