import {Alert, BackButton, Spinner} from '../../common';

import {Album} from '../../../interfaces';
import {DeleteAlbumModal} from './DeleteAlbumModal';
import {EditAlbumForm} from './EditAlbumForm';
import React from 'react';
import {UploadImagesModal} from './UploadImagesModal';
import {useGetData} from '../../../hooks';
import {useParams} from 'react-router-dom';

/**
 * View component for displaying edit page of a specific album
 * @return React component
 */
export function EditAlbum() {
  const {year, month, day, slug} = useParams<{
    year: string,
    month: string,
    day: string,
    slug: string,
  }>();
  const {data: dataArray, error} = useGetData<Album[]>({
    url: '/api/album',
    params: {
      date: `${year}-${month}-${day}`,
      slug: slug,
    },
  });
  const data = dataArray ? dataArray[0] : undefined;

  if (error) {
    return (
      <Alert
        type="warning"
        message={'Det gick inte att ladda albumet. ' +
          'Kontrollera att sökvägen är korrekt och försök igen.'}
        heading="Något gick fel"
      />
    );
  }

  if (!data) {
    return <Spinner />;
  } else {
    return (
      <>
        <EditAlbumForm album={data} />
        <UploadImagesModal albumId={data._id} />
        <DeleteAlbumModal albumId={data._id} albumName={data.name} />
        <BackButton className="mt-3"/>
      </>
    );
  }
}
