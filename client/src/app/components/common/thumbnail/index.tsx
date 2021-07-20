import React, {useState} from 'react';

import placeholderImage from './assets/placeholder.jpg';

/**
 * Component for rendering an image thumbnail. Falls back to placeholder
 * if thumbnail cannot be loaded.
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
        src={fileName ? `/images/thumbnail/${fileName}` : placeholderImage}
        alt={alt}
        onError={(event) => {
          event.currentTarget.src = placeholderImage;
        }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
