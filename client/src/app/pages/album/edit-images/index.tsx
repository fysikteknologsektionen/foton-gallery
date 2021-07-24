import {AddImagesModal} from './components/add-images-modal';
import {EditImagesGrid} from './components/edit-images-grid';
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
        <h3 className="mb-3">Lägg till bilder</h3>
        <AddImagesModal {...album} />
        <h3 className="mt-3">Redigera bilder</h3>
        <p className="text-muted">
          Du kan flytta om bilder med pilarna, ta bort bilder med krysset och
          välja en bild som albumets omslagsbild med stjärnan.
        </p>
        <EditImagesGrid {...album} />
      </>
    );
  } else {
    return <Spinner />;
  }
};

export default EditImages;
