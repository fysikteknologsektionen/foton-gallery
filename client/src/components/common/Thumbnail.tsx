import React, {SyntheticEvent} from 'react';

import placeholderImage from './placeholder.jpg';

/**
 * Component for rendering an image thumbnail. Prioritizes thumbnail first, then
 * scaled and finally fullsize version. Falls back to placeholder if neither
 * can be loaded.
 * @param fileName Filename of the image to display
 * @param alt alt propert to pass to image element
 * @param className className property to pass to image element
 * @return Thumbnail component
 */
export function Thumbnail({
  fileName,
  alt,
  className,
}: {
  fileName: string;
  alt: string;
  className?: string;
}): JSX.Element {
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
          return placeholderImage;
      }
    })();
  }

  return (
    <img
      className={`w-100 ${className}`}
      src={fileName ? thumbnailImage : placeholderImage}
      alt={alt}
      onError={handleError}
    />
  );
}
