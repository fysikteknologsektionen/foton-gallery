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
  filename?: string;
  alt?: string;
  className?: string;
}> = ({filename, alt, className}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        // This intentionally does not have an alt attribute
        // since it's just a visual placeholder
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          className="w-100 rounded"
          style={{minHeight: '300px'}}
          src={placeholderImage}
        />
      )}
      <img
        className={`w-100 rounded ${className ?? ''}`}
        src={filename ? `/images/thumbnail/${filename}` : placeholderImage}
        alt={alt}
        onError={(event) => {
          event.currentTarget.src = placeholderImage;
        }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
