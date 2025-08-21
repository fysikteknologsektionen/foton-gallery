import React, {useEffect, useState} from 'react';
import {Album} from '../../../../../interfaces';
import Lightbox from 'react-image-lightbox';
import Metadata from '../metadata';
import {parse} from 'exifr';

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

const ImageFullscreenView: React.VFC<{
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  activeImage: number;
  setActiveImage: React.Dispatch<React.SetStateAction<number>>;
  album: Album;
}> = ({show, setShow, activeImage, setActiveImage, album}) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadata, setMetadata] = useState<
    Record<string, unknown> | undefined
  >();

  // Hide scrollbar when opening lightbox
  useEffect(() => {
    if (show) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
      setMetadata(undefined);
      setShowMetadata(false);
    }
  }, [show]);

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

  if (!show) {
    return <></>;
  }

  return (
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
      onCloseRequest={() => setShow(false)}
      onMoveNextRequest={() => {
        setActiveImage((prev) => (prev + 1) % album.images.length);
        setMetadata(undefined);
      }}
      onMovePrevRequest={() => {
        setActiveImage(
            (prev) => (
              (prev + album.images.length - 1) % album.images.length
            ),
        );
        setMetadata(undefined);
      }}
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
  );
};

export default ImageFullscreenView;
