import React, {useContext, useState} from 'react';

import {Album} from '../../../interfaces';
import {Thumbnail} from '../../common';
import axios from 'axios';
import {toastContext} from '../../../contexts';

/**
 * Component for rendering a grid of an album's images that allows editing
 * order, thumbnail and removing images
 * @param album Album data
 * @return React component
 */
export const EditAlbumImages: React.VFC<Album> = ({_id, images, thumbnail}) => {
  const [imageOrder, setImageOrder] = useState<string[]>(images);
  const [selectedThumbnail, setSelectedThumbnail] = useState<
    string | undefined
  >(thumbnail);
  const newToast = useContext(toastContext);

  /**
   * Handles submit of the "form"
   */
  async function handleSubmit() {
    const data = {
      images: imageOrder,
      thumbnail:
        // If the user has selected an invalid thumbnail, set it to undefined
        selectedThumbnail && imageOrder.includes(selectedThumbnail) ?
          selectedThumbnail :
          undefined,
    };
    try {
      await axios.put(`/api/albums/${_id}/images`, data, {
        withCredentials: true,
      });
      newToast({
        title: 'Redigera bilder',
        message: 'Ändringarna har sparats.',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      newToast({
        title: 'Redigera bilder',
        message: 'Det gick inte att spara ändringarna.',
        type: 'danger',
      });
    }
  }

  /**
   * Removes a child
   * @param index Index of element to remove
   */
  function removeChild(index: number) {
    setImageOrder((imageOrder) => {
      const newImageOrder = imageOrder.slice();
      newImageOrder.splice(index, 1);
      return newImageOrder;
    });
  }

  /**
   * Moves a child to a new index
   * @param fromIndex Index of child to move
   * @param toIndex New index for child
   */
  function moveChild(fromIndex: number, toIndex: number) {
    // Do nothing if attempting to move to an invalid index
    if (toIndex < 0 || toIndex > imageOrder.length - 1) {
      return;
    }
    setImageOrder((imageOrder) => {
      const newImageOrder = imageOrder.slice();
      const fromElement = newImageOrder[fromIndex];
      const toElement = newImageOrder[toIndex];
      newImageOrder.splice(fromIndex, 1, toElement);
      newImageOrder.splice(toIndex, 1, fromElement);
      return newImageOrder;
    });
  }

  return (
    <>
      <button
        className="btn btn-primary mb-3"
        type="button"
        onClick={handleSubmit}
      >
        Spara ändringar
      </button>
      <div
        className="d-grid gap-3 justify-content-center align-items-center"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, max-content))',
        }}
      >
        {imageOrder.map((image, index) => (
          <div key={image}>
            <div
              className="position-relative rounded"
              style={{
                boxShadow:
                  image === selectedThumbnail ?
                    '0 0 0 0.50rem var(--bs-teal)' :
                    'none',
                transition: 'box-shadow 0.15s ease-in-out',
              }}
            >
              <Thumbnail fileName={image} alt="Albumbild" className="rounded" />
              <button
                className="position-absolute btn btn-primary"
                style={{left: 0, top: '50%'}}
                type="button"
                onClick={() => moveChild(index, index - 1)}
              >
                <i className="bi-arrow-left" />
              </button>
              <button
                className="position-absolute btn btn-primary"
                style={{right: 0, top: '50%'}}
                type="button"
                onClick={() => moveChild(index, index + 1)}
              >
                <i className="bi-arrow-right" />
              </button>
              <button
                className="position-absolute btn btn-danger"
                style={{right: 0, top: 0}}
                type="button"
                onClick={() => removeChild(index)}
              >
                <i className="bi-x" />
              </button>
              <button
                className="position-absolute btn btn-success"
                style={{left: 0, top: 0}}
                type="button"
                onClick={() => setSelectedThumbnail(image)}
              >
                <i className="bi-star" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary mt-3"
        type="button"
        onClick={handleSubmit}
      >
        Spara ändringar
      </button>
    </>
  );
};
