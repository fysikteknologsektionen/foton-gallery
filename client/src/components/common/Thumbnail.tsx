import React, {SyntheticEvent, useState} from 'react';

import placeholderImage from './placeholder.jpg';

/**
 * Component for rendering an image thumbnail. Prioritizes thumbnail first, then
 * scaled and finally fullsize version. Falls back to placeholder if neither
 * can be loaded.
 * @param fileName Filename of the image to display
 * @param alt alt propert to pass to image element
 * @param className Additional classes to pass to image element
 * @return Thumbnail component
 */
export const Thumbnail: React.VFC<{
  fileName: string;
  alt: string;
  className?: string;
}> = ({fileName, alt, className}) => {
  const [loaded, setLoaded] = useState(false);
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
    <>
      {!loaded && (
        <img
          className="w-100 rounded"
          style={{minHeight: '300px'}}
          src={placeholderImage}
        />
      )}
      <img
        className={`w-100 rounded ${className ?? ''}`}
        src={fileName ? thumbnailImage : placeholderImage}
        alt={alt}
        onError={handleError}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
