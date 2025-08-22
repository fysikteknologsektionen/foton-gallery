import 'react-image-lightbox/style.css';
import '../../../../../styles/lightbox-override.scss';

import {Album, Image} from '../../../../../../interfaces';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {Field, FieldArray, FieldArrayRenderProps, Form, Formik} from 'formik';
import React, {useContext, useState} from 'react';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ImageFullscreenView from '../../../components/image-fullscreen-view';
import {Thumbnail} from '../../../../../components/common/thumbnail';
import axios from 'axios';
import {toastContext} from '../../../../../contexts/toast';
import {useSortable} from '@dnd-kit/sortable';

/**
 * Component for rendering a grid of an album's images that allows editing
 * order, thumbnail and removing images
 * @param album Album
 * @return Edit images grid component
 */
export const EditImagesGrid: React.VFC<Album> = (album) => {
  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 10,
        },
      }),
  );

  const newToast = useContext(toastContext);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const {_id, images, thumbnail} = album;

  const initialValues: {images: string[]; thumbnail?: string} = {
    images: images.map((image) => image._id),
    thumbnail: thumbnail?._id,
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          // If the user has selected an invalid thumbnail, set it to undefined
          // (Can happen e.g. if an image is set as thumbnail and then removed)
          if (values.thumbnail && !values.images.includes(values.thumbnail)) {
            values.thumbnail = undefined;
          }
          try {
            await axios.patch(`/api/albums/${_id}/images`, values, {
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
        }}
      >
        {({values, setFieldValue}) => (
          <Form>
            {values.images.length > 0 && (
              <button className="btn btn-primary mb-3" type="submit">
                Spara
              </button>
            )}
            <FieldArray name="images">
              {(arrayHelpers) => (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => {
                    const {active, over} = event;

                    if (over && active.id !== over.id) {
                      const oldIndex =
                        values.images.indexOf(active.id as string);
                      const newIndex =
                        values.images.indexOf(over.id as string);

                      arrayHelpers.move(oldIndex, newIndex);
                    }
                  }}
                >
                  <SortableContext
                    items={values.images}
                    strategy={rectSortingStrategy}
                  >
                    <div
                      className={`d-grid gap-3 justify-content-center
                        align-items-center`}
                      style={{
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, max-content))',
                      }}
                    >
                      {values.images.map((image, index) => (
                        <SortableImage
                          key={image}
                          id={image}
                          image={image}
                          index={index}
                          images={images}
                          values={values}
                          arrayHelpers={arrayHelpers}
                          setFieldValue={setFieldValue}
                          setActiveImage={setActiveImage}
                          setShowLightbox={setShowLightbox}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </FieldArray>
            <button className="btn btn-primary mt-3" type="submit">
              Spara
            </button>
          </Form>
        )}
      </Formik>

      <ImageFullscreenView
        show={showLightbox}
        setShow={setShowLightbox}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        album={album}
      />
    </>
  );
};

const SortableImage: React.VFC<{
  id: string;
  image: string;
  index: number;
  images: Image[];
  values: {
    images: string[];
    thumbnail?: string | undefined;
  };
  arrayHelpers: FieldArrayRenderProps;
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  setActiveImage: React.Dispatch<React.SetStateAction<number>>;
  setShowLightbox: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  id,
  image,
  index,
  images,
  values,
  arrayHelpers,
  setFieldValue,
  setActiveImage,
  setShowLightbox,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({id: id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    height: '100%',
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        className="position-relative rounded"
        style={{
          boxShadow:
            image === values.thumbnail ?
              '0 0 0 0.50rem var(--bs-teal)' :
              'none',
          transition: 'box-shadow 0.15s ease-in-out',
          cursor: 'move',
        }}
      >
        <Field
          className="visually-hidden"
          name={`images.${index}`}
        />
        <Thumbnail
          filename={
            images.find((element) => element._id === image)?.filename
          }
          alt="Albumbild"
        />
        <div
          className="position-absolute d-flex end-0 top-0 gap-1 p-1"
          // style={{right: 0, top: 0}}
        >
          <button
            className="btn btn-secondary"
            type="button"
            onClick={(e) => {
              setShowLightbox(true);
              setActiveImage(images
                  .findIndex(
                      (element) => element._id === image,
                  ),
              );
              e.preventDefault();
            }}
            aria-label="Visa i fullskärm"
            title="Visa i fullskärm"
          >
            <i className="bi-arrows-fullscreen" aria-hidden="true" />
          </button>
          <button
            className="btn btn-success"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setFieldValue('thumbnail', image);
            }}
            aria-label="Markera som omslagsbild"
            title="Markera som omslagsbild"
          >
            {values.thumbnail === image ? (
              <i className="bi-star-fill" aria-hidden="true" />
            ) : (
              <i className="bi-star" aria-hidden="true" />
            )}
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              arrayHelpers.remove(index);
            }}
            aria-label="Ta bort"
            title="Ta bort"
          >
            <i className="bi-x" aria-hidden="true" />
          </button>
        </div>
        {/* <button
          className="position-absolute btn btn-danger"
          style={{right: 0, top: 0}}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            arrayHelpers.remove(index);
          }}
          aria-label="Ta bort"
        >
          <i className="bi-x" aria-hidden="true" />
        </button>
        <button
          className="position-absolute btn btn-success"
          style={{left: 0, top: 0}}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setFieldValue('thumbnail', image);
          }}
          aria-label="Markera som omslagsbild"
        >
          {values.thumbnail === image ? (
            <i className="bi-star-fill" aria-hidden="true" />
          ) : (
            <i className="bi-star" aria-hidden="true" />
          )}
        </button>
        <button
          className="position-absolute btn btn-secondary"
          style={{right: 0, bottom: 0}}
          type="button"
          onClick={(e) => {
            setShowLightbox(true);
            setActiveImage(images
                .findIndex(
                    (element) => element._id === image,
                ),
            );
            e.preventDefault();
          }}
          aria-label="Visa i fullskärm"
        >
          <i className="bi-arrows-fullscreen" aria-hidden="true" />
        </button> */}
      </div>
    </div>
  );
};
