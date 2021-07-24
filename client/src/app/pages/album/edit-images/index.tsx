import {EditImagesGrid} from './components/edit-images-grid';
import {ImagesDropzone} from './components/images-dropzone';
import React from 'react';
import {Spinner} from '../../../components/common/spinner';
import {useGetAlbum} from '../../../hooks';

/**
 * Component for rendering a view for editing album images
 * @returns Edit images view-component
 */
const EditImages: React.VFC = () => {
  const album = useGetAlbum();

  if (album) {
    return (
      <>
        <h2 className="visually-hidden">Hantera albumbilder</h2>
        <section>
          <h3 className="mb-3">Lägg till bilder</h3>
          <ImagesDropzone {...album} />
        </section>
        <section>
          <h3 className="mt-3">Redigera bilder</h3>
          <p className="text-muted">
            Du kan flytta om bilder med pilarna, ta bort bilder med krysset och
            välja en bild som albumets omslagsbild med stjärnan.
          </p>
          <EditImagesGrid {...album} />
        </section>
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default EditImages;
