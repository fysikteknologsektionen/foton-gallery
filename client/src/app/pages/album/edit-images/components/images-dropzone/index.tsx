import '../../../../../styles/dropzone.scss';

import React, {useContext, useEffect, useState} from 'react';

import {Album} from '../../../../../../interfaces';
import axios from 'axios';
import {toastContext} from '../../../../../contexts/toast';
import {useDropzone} from 'react-dropzone';
import {useHistory} from 'react-router-dom';

/**
 * Component that renders a dropzone for uploading images to an album
 * @param _id Album id
 * @returns Dropzone component
 */
export const ImagesDropzone: React.VFC<Album> = ({_id}) => {
  const [fileStatus, setFileStatus] = useState<
    Record<string, 'pending' | 'error' | 'success'>
  >({});
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({accept: 'image/*'});
  const newToast = useContext(toastContext);
  const history = useHistory();

  useEffect(() => {
    /**
     * Uploads a file to the api
     * @param file File to upload
     */
    async function uploadFile(file: File) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        await axios.post(`/api/albums/${_id}/images`, formData);
        setFileStatus((prev) => ({...prev, [file.name]: 'success'}));
      } catch (error) {
        console.error(error);
        setFileStatus((prev) => ({...prev, [file.name]: 'error'}));
        newToast({
          title: 'Lägg till bilder',
          message: `Det gick inte att lägga till bilden '${file.name}'`,
          type: 'danger',
        });
      }
    }
    if (acceptedFiles.length) {
      const promises: Promise<void>[] = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setFileStatus((prev) => ({...prev, [file.name]: 'pending'}));
        promises.push(uploadFile(file));
      }
      Promise.all(promises).then(() => {
        newToast({
          title: 'Lägg till bilder',
          message: 'Bilderna har lagts till i albumet.',
          type: 'success',
        });
        // Set location state to force route update
        history.push(history.location.pathname, {update: true});
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedFiles]);

  return (
    <div>
      <div
        {...getRootProps({
          className: `dropzone ${
            isDragActive ?
              'dropzone-active' :
              isDragAccept ?
              'dropzone-accept' :
              isDragReject ?
              'dropzone-reject' :
              ''
          }`,
        })}
      >
        <input {...getInputProps()} />
        <p>Dra och släpp bilder här, eller klicka för att välja bilder.</p>
        <em>(Endast bildfiler, t.ex. *.jpg, *.png, är tillåtna.)</em>
      </div>
      {Object.keys(fileStatus).length > 0 && (
        <>
          <h4>Laddar upp bilder:</h4>
          <ul className="list-unstyled">
            {Object.entries(fileStatus).map(([name, status]) => (
              <li key={name}>
                {name}
                {(() => {
                  switch (status) {
                    case 'pending':
                      return (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">
                            Laddar upp bild...
                          </span>
                        </div>
                      );
                    case 'error':
                      return <i className="bi-x text-danger" />;
                    default:
                    case 'success':
                      return <i className="bi-check text-success" />;
                  }
                })()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
