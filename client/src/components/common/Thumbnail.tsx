import React, {SyntheticEvent} from 'react';

/**
 * Component for rendering an image thumbnail.
 * Falls back to scaled and fullsize version if thumbnail does not exist
 * @param fileName Filename of the image to display
 * @param className className property to pass to image element
 * @return React component
 */
export function Thumbnail({fileName, alt, className}: {
  fileName: string,
  alt: string,
  className?: string
}) {
  const thumbnailImage = `/images/thumbnail/${fileName}`;
  const scaledImage = `/images/scaled/${fileName}`;
  const fullsizeImage = `/images/fullsize/${fileName}`;

  /**
   * Handles onError events when loading image
   * @param event Event fired by onError
   */
  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.src = (() => {
      switch (event.currentTarget.src) {
        case thumbnailImage:
          return scaledImage;
        case scaledImage:
          return fullsizeImage;
        default:
          return '';
      }
    })();
  }

  return (
    <img
      className={className}
      src={thumbnailImage}
      alt={alt}
      onError={handleError}
    />
  );
}
