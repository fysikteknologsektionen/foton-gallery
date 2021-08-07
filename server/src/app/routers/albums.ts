import {
  addImageToAlbum,
  createAlbum,
  deleteAlbum,
  getAlbum,
  getAlbumCount,
  getAlbums,
  updateAlbumImages,
  updateAlbumMeta,
} from '../controllers';
/* eslint-disable new-cap */
import {albumValidators, validate} from '../validation';

import {Router} from 'express';
import {upload} from '../utils';

// Public endpoints
const publicRouter = Router();

publicRouter.get(
    '/:date/:slug',
    validate(albumValidators, ['date', 'slug']),
    getAlbum,
);

publicRouter.get('/', validate(albumValidators, ['page', 'count']), getAlbums);

publicRouter.get('/count', getAlbumCount);

// Private endpoints
const privateRouter = Router();
// privateRouter.use(restrictToUsers);

privateRouter.post(
    '/',
    validate(albumValidators, [
      'name',
      'date',
      'authors',
      'authors.*',
      'description',
    ]),
    createAlbum,
);

privateRouter.patch(
    '/:id',
    validate(albumValidators, [
      'id',
      'name',
      'date',
      'authors',
      'authors.*',
      'description',
    ]),
    updateAlbumMeta,
);

privateRouter.delete('/:id', validate(albumValidators, ['id']), deleteAlbum);

privateRouter.post(
    '/:id/images',
    validate(albumValidators, ['id']),
    upload.single('image'),
    addImageToAlbum,
);

privateRouter.patch(
    '/:id/images',
    validate(albumValidators, ['id', 'images', 'thumbnail']),
    updateAlbumImages,
);

publicRouter.use('/', privateRouter);
export {publicRouter as albumsRouter};
